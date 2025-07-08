const pool = require('../config/db');

const findAll = async () => {
    const query = `
        SELECT r.*, u.first_name || ' ' || u.last_name as created_by_name, f.name as flotilla_name,
               COUNT(ra.id) as assignment_count
        FROM rosters r
        LEFT JOIN users u ON r.created_by = u.id
        LEFT JOIN flotillas f ON r.flotilla_id = f.id
        LEFT JOIN roster_assignments ra ON r.id = ra.roster_id AND ra.status IN ('Assigned', 'Confirmed')
        GROUP BY r.id, u.first_name, u.last_name, f.name
        ORDER BY r.roster_date DESC, r.start_time
    `;
    const result = await pool.query(query);
    return result.rows;
};

const findById = async (id) => {
    const query = `
        SELECT r.*, u.first_name || ' ' || u.last_name as created_by_name, f.name as flotilla_name
        FROM rosters r
        LEFT JOIN users u ON r.created_by = u.id
        LEFT JOIN flotillas f ON r.flotilla_id = f.id
        WHERE r.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

const create = async (rosterData) => {
    const { title, description, roster_date, start_time, end_time, status, created_by, flotilla_id, notes } = rosterData;
    const query = `
        INSERT INTO rosters (title, description, roster_date, start_time, end_time, status, created_by, flotilla_id, notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
    `;
    const result = await pool.query(query, [title, description, roster_date, start_time, end_time, status || 'Draft', created_by, flotilla_id, notes]);
    return result.rows[0];
};

const update = async (id, rosterData) => {
    const { title, description, roster_date, start_time, end_time, status, flotilla_id, notes } = rosterData;
    const query = `
        UPDATE rosters
        SET title = $1, description = $2, roster_date = $3, start_time = $4, 
            end_time = $5, status = $6, flotilla_id = $7, notes = $8, updated_at = NOW()
        WHERE id = $9
        RETURNING *
    `;
    const result = await pool.query(query, [title, description, roster_date, start_time, end_time, status, flotilla_id, notes, id]);
    return result.rows[0];
};

const remove = async (id) => {
    // All related records will cascade delete
    await pool.query('DELETE FROM rosters WHERE id = $1', [id]);
};

// ASSIGNMENT MANAGEMENT
const findAssignments = async (rosterId) => {
    const query = `
        SELECT ra.*, 
               u.first_name || ' ' || u.last_name as member_name, 
               u.avcga_member_id, u.email, u.phone_primary,
               sr.name as role_name, sr.description as role_description,
               ab.first_name || ' ' || ab.last_name as assigned_by_name,
               COUNT(so.id) as open_offers_count
        FROM roster_assignments ra
        JOIN users u ON ra.member_id = u.id
        JOIN shift_roles sr ON ra.shift_role_id = sr.id
        JOIN users ab ON ra.assigned_by = ab.id
        LEFT JOIN shift_offers so ON ra.id = so.roster_assignment_id AND so.status = 'Open'
        WHERE ra.roster_id = $1
        GROUP BY ra.id, u.first_name, u.last_name, u.avcga_member_id, u.email, u.phone_primary,
                 sr.name, sr.description, ab.first_name, ab.last_name
        ORDER BY sr.name, u.last_name
    `;
    const result = await pool.query(query, [rosterId]);
    return result.rows;
};

const createAssignment = async (rosterId, assignmentData) => {
    const { member_id, shift_role_id, assigned_by, notes, status } = assignmentData;
    const query = `
        INSERT INTO roster_assignments (roster_id, member_id, shift_role_id, assigned_by, notes, status)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
    `;
    const result = await pool.query(query, [rosterId, member_id, shift_role_id, assigned_by, notes, status || 'Assigned']);
    return result.rows[0];
};

const updateAssignment = async (assignmentId, updateData) => {
    const { status, notes, confirmed_at } = updateData;
    const query = `
        UPDATE roster_assignments
        SET status = $1, notes = $2, confirmed_at = $3, updated_at = NOW()
        WHERE id = $4
        RETURNING *
    `;
    const result = await pool.query(query, [status, notes, confirmed_at, assignmentId]);
    return result.rows[0];
};

const removeAssignment = async (assignmentId) => {
    await pool.query('DELETE FROM roster_assignments WHERE id = $1', [assignmentId]);
};

// SHIFT OFFERING SYSTEM
const createShiftOffer = async (assignmentId, offerData) => {
    const { offered_by, offered_to, reason, expires_at } = offerData;
    const query = `
        INSERT INTO shift_offers (roster_assignment_id, offered_by, offered_to, reason, expires_at)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `;
    const result = await pool.query(query, [assignmentId, offered_by, offered_to, reason, expires_at]);
    return result.rows[0];
};

const findShiftOffers = async (rosterId, userId = null) => {
    let query = `
        SELECT so.*, 
               ra.roster_id,
               ob.first_name || ' ' || ob.last_name as offered_by_name,
               ot.first_name || ' ' || ot.last_name as offered_to_name,
               sr.name as role_name,
               r.title as roster_title, r.roster_date, r.start_time, r.end_time
        FROM shift_offers so
        JOIN roster_assignments ra ON so.roster_assignment_id = ra.id
        JOIN users ob ON so.offered_by = ob.id
        LEFT JOIN users ot ON so.offered_to = ot.id
        JOIN shift_roles sr ON ra.shift_role_id = sr.id
        JOIN rosters r ON ra.roster_id = r.id
        WHERE ra.roster_id = $1
    `;
    
    const params = [rosterId];
    
    if (userId) {
        query += ` AND (so.offered_to = $2 OR so.offered_to IS NULL)`;
        params.push(userId);
    }
    
    query += ` ORDER BY so.created_at DESC`;
    
    const result = await pool.query(query, params);
    return result.rows;
};

const updateShiftOffer = async (offerId, updateData) => {
    const { status, response_notes, responded_at } = updateData;
    const query = `
        UPDATE shift_offers
        SET status = $1, response_notes = $2, responded_at = $3, updated_at = NOW()
        WHERE id = $4
        RETURNING *
    `;
    const result = await pool.query(query, [status, response_notes, responded_at, offerId]);
    return result.rows[0];
};

const acceptShiftOffer = async (offerId, acceptingUserId) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        // Get offer details
        const offerQuery = `
            SELECT so.*, ra.member_id, ra.shift_role_id, ra.roster_id, ra.assigned_by
            FROM shift_offers so
            JOIN roster_assignments ra ON so.roster_assignment_id = ra.id
            WHERE so.id = $1 AND so.status = 'Open'
        `;
        const offerResult = await client.query(offerQuery, [offerId]);
        
        if (offerResult.rows.length === 0) {
            throw new Error('Offer not found or no longer available');
        }
        
        const offer = offerResult.rows[0];
        
        // Update the roster assignment to the accepting user
        await client.query(`
            UPDATE roster_assignments
            SET member_id = $1, status = 'Assigned', updated_at = NOW()
            WHERE id = $2
        `, [acceptingUserId, offer.roster_assignment_id]);
        
        // Mark offer as accepted
        await client.query(`
            UPDATE shift_offers
            SET status = 'Accepted', responded_at = NOW(), updated_at = NOW()
            WHERE id = $1
        `, [offerId]);
        
        // Cancel any other open offers for this assignment
        await client.query(`
            UPDATE shift_offers
            SET status = 'Cancelled', updated_at = NOW()
            WHERE roster_assignment_id = $1 AND id != $2 AND status = 'Open'
        `, [offer.roster_assignment_id, offerId]);
        
        await client.query('COMMIT');
        return { success: true, message: 'Shift offer accepted successfully' };
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

// AVAILABILITY MANAGEMENT
const setMemberAvailability = async (memberId, rosterId, availabilityData) => {
    const { is_available, availability_notes, updated_by } = availabilityData;
    const query = `
        INSERT INTO member_availability (member_id, roster_id, is_available, availability_notes, updated_by)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (member_id, roster_id)
        DO UPDATE SET 
            is_available = EXCLUDED.is_available,
            availability_notes = EXCLUDED.availability_notes,
            updated_by = EXCLUDED.updated_by,
            updated_at = NOW()
        RETURNING *
    `;
    const result = await pool.query(query, [memberId, rosterId, is_available, availability_notes, updated_by]);
    return result.rows[0];
};

const getMemberAvailability = async (rosterId) => {
    const query = `
        SELECT ma.*, 
               u.first_name || ' ' || u.last_name as member_name,
               u.avcga_member_id,
               ub.first_name || ' ' || ub.last_name as updated_by_name
        FROM member_availability ma
        JOIN users u ON ma.member_id = u.id
        JOIN users ub ON ma.updated_by = ub.id
        WHERE ma.roster_id = $1
        ORDER BY u.last_name, u.first_name
    `;
    const result = await pool.query(query, [rosterId]);
    return result.rows;
};

// GET AVAILABLE MEMBERS FOR ASSIGNMENT
const getAvailableMembers = async (rosterId) => {
    const query = `
        SELECT u.id, u.first_name, u.last_name, u.avcga_member_id, u.email,
               u.role, u.status, f.name as flotilla_name,
               COALESCE(ma.is_available, true) as is_available,
               ma.availability_notes,
               COUNT(ra.id) as current_assignments
        FROM users u
        LEFT JOIN flotillas f ON u.flotilla_id = f.id
        LEFT JOIN member_availability ma ON u.id = ma.member_id AND ma.roster_id = $1
        LEFT JOIN roster_assignments ra ON u.id = ra.member_id AND ra.roster_id = $1 
                                         AND ra.status IN ('Assigned', 'Confirmed')
        WHERE u.status = 'Active' AND u.role != 'SuperAdmin'
        GROUP BY u.id, u.first_name, u.last_name, u.avcga_member_id, u.email,
                 u.role, u.status, f.name, ma.is_available, ma.availability_notes
        ORDER BY is_available DESC, u.last_name, u.first_name
    `;
    const result = await pool.query(query, [rosterId]);
    return result.rows;
};

module.exports = {
    findAll,
    findById,
    create,
    update,
    remove,
    // Assignment management
    findAssignments,
    createAssignment,
    updateAssignment,
    removeAssignment,
    // Shift offering
    createShiftOffer,
    findShiftOffers,
    updateShiftOffer,
    acceptShiftOffer,
    // Availability management
    setMemberAvailability,
    getMemberAvailability,
    getAvailableMembers
};
