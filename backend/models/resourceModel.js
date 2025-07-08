const pool = require('../config/db');

// FACILITIES MANAGEMENT
const findAllFacilities = async () => {
    const query = `
        SELECT f.*, u.first_name || ' ' || u.last_name as contact_person_name
        FROM facilities f
        LEFT JOIN users u ON f.contact_person_id = u.id
        WHERE f.is_active = true
        ORDER BY f.facility_type, f.name
    `;
    const result = await pool.query(query);
    return result.rows;
};

const createFacility = async (facilityData) => {
    const { name, facility_type, capacity, location, equipment_available, booking_rules, contact_person_id, notes } = facilityData;
    const query = `
        INSERT INTO facilities (name, facility_type, capacity, location, equipment_available, booking_rules, contact_person_id, notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
    `;
    const result = await pool.query(query, [name, facility_type, capacity, location, equipment_available, booking_rules, contact_person_id, notes]);
    return result.rows[0];
};

const updateFacility = async (id, facilityData) => {
    const { name, facility_type, capacity, location, equipment_available, booking_rules, contact_person_id, notes, is_active } = facilityData;
    const query = `
        UPDATE facilities SET
            name = $1, facility_type = $2, capacity = $3, location = $4,
            equipment_available = $5, booking_rules = $6, contact_person_id = $7,
            notes = $8, is_active = $9, updated_at = NOW()
        WHERE id = $10
        RETURNING *
    `;
    const result = await pool.query(query, [name, facility_type, capacity, location, equipment_available, booking_rules, contact_person_id, notes, is_active, id]);
    return result.rows[0];
};

// EQUIPMENT MANAGEMENT
const findAllEquipment = async () => {
    const query = `
        SELECT e.*, u.first_name || ' ' || u.last_name as responsible_person_name
        FROM equipment e
        LEFT JOIN users u ON e.responsible_person_id = u.id
        ORDER BY e.equipment_type, e.name
    `;
    const result = await pool.query(query);
    return result.rows;
};

const createEquipment = async (equipmentData) => {
    const { name, equipment_type, model, serial_number, status, location, last_service_date, next_service_date, responsible_person_id, notes } = equipmentData;
    const query = `
        INSERT INTO equipment (name, equipment_type, model, serial_number, status, location, last_service_date, next_service_date, responsible_person_id, notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
    `;
    const result = await pool.query(query, [name, equipment_type, model, serial_number, status, location, last_service_date, next_service_date, responsible_person_id, notes]);
    return result.rows[0];
};

const updateEquipment = async (id, equipmentData) => {
    const { name, equipment_type, model, serial_number, status, location, last_service_date, next_service_date, responsible_person_id, notes } = equipmentData;
    const query = `
        UPDATE equipment SET
            name = $1, equipment_type = $2, model = $3, serial_number = $4,
            status = $5, location = $6, last_service_date = $7, next_service_date = $8,
            responsible_person_id = $9, notes = $10, updated_at = NOW()
        WHERE id = $11
        RETURNING *
    `;
    const result = await pool.query(query, [name, equipment_type, model, serial_number, status, location, last_service_date, next_service_date, responsible_person_id, notes, id]);
    return result.rows[0];
};

// RESOURCE ASSIGNMENTS
const assignResourceToRoster = async (rosterId, resourceType, resourceId, assignmentRole, assignedBy, notes = null) => {
    const query = `
        INSERT INTO roster_resource_assignments (roster_id, resource_type, resource_id, assignment_role, assigned_by, notes)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (roster_id, resource_type, resource_id, assignment_role)
        DO UPDATE SET assigned_by = $5, assigned_at = NOW(), notes = $6
        RETURNING *
    `;
    const result = await pool.query(query, [rosterId, resourceType, resourceId, assignmentRole, assignedBy, notes]);
    return result.rows[0];
};

const getRosterResourceAssignments = async (rosterId) => {
    const query = `
        SELECT 
            rra.*,
            CASE rra.resource_type
                WHEN 'vessel' THEN v.name
                WHEN 'vehicle' THEN vh.name
                WHEN 'facility' THEN f.name
                WHEN 'equipment' THEN e.name
            END as resource_name,
            CASE rra.resource_type
                WHEN 'vessel' THEN v.status::text
                WHEN 'vehicle' THEN vh.status::text
                WHEN 'facility' THEN CASE WHEN f.is_active THEN 'Available' ELSE 'Unavailable' END
                WHEN 'equipment' THEN e.status
            END as resource_status,
            u.first_name || ' ' || u.last_name as assigned_by_name
        FROM roster_resource_assignments rra
        LEFT JOIN vessels v ON rra.resource_type = 'vessel' AND rra.resource_id = v.id
        LEFT JOIN vehicles vh ON rra.resource_type = 'vehicle' AND rra.resource_id = vh.id
        LEFT JOIN facilities f ON rra.resource_type = 'facility' AND rra.resource_id = f.id
        LEFT JOIN equipment e ON rra.resource_type = 'equipment' AND rra.resource_id = e.id
        JOIN users u ON rra.assigned_by = u.id
        WHERE rra.roster_id = $1
        ORDER BY rra.resource_type, rra.assignment_role
    `;
    const result = await pool.query(query, [rosterId]);
    return result.rows;
};

const removeResourceAssignment = async (rosterId, resourceType, resourceId, assignmentRole) => {
    const query = `
        DELETE FROM roster_resource_assignments 
        WHERE roster_id = $1 AND resource_type = $2 AND resource_id = $3 AND assignment_role = $4
    `;
    await pool.query(query, [rosterId, resourceType, resourceId, assignmentRole]);
};

// AVAILABILITY AND CONFLICTS
const checkResourceAvailability = async (resourceType, resourceId, startDatetime, endDatetime) => {
    const query = `
        SELECT * FROM resource_availability
        WHERE resource_type = $1 AND resource_id = $2
        AND tstzrange($3, $4) && tstzrange(start_datetime, end_datetime)
        AND availability_type != 'Available'
        ORDER BY start_datetime
    `;
    const result = await pool.query(query, [resourceType, resourceId, startDatetime, endDatetime]);
    return result.rows;
};

const setResourceAvailability = async (resourceType, resourceId, startDatetime, endDatetime, availabilityType, reason, updatedBy) => {
    const query = `
        INSERT INTO resource_availability (resource_type, resource_id, start_datetime, end_datetime, availability_type, reason, updated_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
    `;
    const result = await pool.query(query, [resourceType, resourceId, startDatetime, endDatetime, availabilityType, reason, updatedBy]);
    return result.rows[0];
};

const detectResourceConflicts = async (rosterId) => {
    const query = `
        WITH roster_info AS (
            SELECT roster_date, start_time, end_time,
                   (roster_date + start_time)::timestamptz as start_datetime,
                   (roster_date + end_time)::timestamptz as end_datetime
            FROM rosters WHERE id = $1
        ),
        roster_resources AS (
            SELECT resource_type, resource_id
            FROM roster_resource_assignments
            WHERE roster_id = $1
        )
        SELECT 
            rr.resource_type,
            rr.resource_id,
            ra.availability_type,
            ra.reason,
            ra.start_datetime,
            ra.end_datetime
        FROM roster_resources rr
        CROSS JOIN roster_info ri
        JOIN resource_availability ra ON rr.resource_type = ra.resource_type 
                                      AND rr.resource_id = ra.resource_id
        WHERE tstzrange(ri.start_datetime, ri.end_datetime) && tstzrange(ra.start_datetime, ra.end_datetime)
        AND ra.availability_type != 'Available'
    `;
    const result = await pool.query(query, [rosterId]);
    return result.rows;
};

const getAvailableResources = async (resourceType, startDatetime, endDatetime) => {
    let resourceTable, resourceQuery;
    
    switch (resourceType) {
        case 'vessel':
            resourceTable = 'vessels';
            resourceQuery = `SELECT id, name, status FROM vessels WHERE status = 'Operational'`;
            break;
        case 'vehicle':
            resourceTable = 'vehicles';
            resourceQuery = `SELECT id, name, status FROM vehicles WHERE status = 'Operational'`;
            break;
        case 'facility':
            resourceTable = 'facilities';
            resourceQuery = `SELECT id, name, 'Available' as status FROM facilities WHERE is_active = true`;
            break;
        case 'equipment':
            resourceTable = 'equipment';
            resourceQuery = `SELECT id, name, status FROM equipment WHERE status = 'Available'`;
            break;
        default:
            throw new Error('Invalid resource type');
    }
    
    const query = `
        ${resourceQuery}
        EXCEPT
        SELECT r.id, r.name, r.status
        FROM (${resourceQuery}) r
        JOIN resource_availability ra ON ra.resource_type = $1 AND ra.resource_id = r.id
        WHERE tstzrange($2, $3) && tstzrange(ra.start_datetime, ra.end_datetime)
        AND ra.availability_type != 'Available'
        ORDER BY name
    `;
    
    const result = await pool.query(query, [resourceType, startDatetime, endDatetime]);
    return result.rows;
};

module.exports = {
    // Facilities
    findAllFacilities,
    createFacility,
    updateFacility,
    
    // Equipment
    findAllEquipment,
    createEquipment,
    updateEquipment,
    
    // Resource assignments
    assignResourceToRoster,
    getRosterResourceAssignments,
    removeResourceAssignment,
    
    // Availability and conflicts
    checkResourceAvailability,
    setResourceAvailability,
    detectResourceConflicts,
    getAvailableResources
};
