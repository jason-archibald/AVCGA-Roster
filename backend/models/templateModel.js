const pool = require('../config/db');

const findAll = async (rosterType = null) => {
    let query = `
        SELECT rt.*, u.first_name || ' ' || u.last_name as created_by_name
        FROM roster_templates rt
        JOIN users u ON rt.created_by = u.id
        WHERE rt.is_active = true
    `;
    const params = [];
    
    if (rosterType) {
        query += ' AND rt.roster_type = $1';
        params.push(rosterType);
    }
    
    query += ' ORDER BY rt.roster_type, rt.name';
    
    const result = await pool.query(query, params);
    return result.rows;
};

const findById = async (id) => {
    const query = `
        SELECT rt.*, u.first_name || ' ' || u.last_name as created_by_name
        FROM roster_templates rt
        JOIN users u ON rt.created_by = u.id
        WHERE rt.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

const create = async (templateData) => {
    const {
        name, description, roster_type, category, priority, duration_hours,
        min_participants, max_participants, required_roles, required_equipment,
        required_assets, default_location, weather_dependent, requires_certification,
        template_notes, created_by
    } = templateData;
    
    const query = `
        INSERT INTO roster_templates (
            name, description, roster_type, category, priority, duration_hours,
            min_participants, max_participants, required_roles, required_equipment,
            required_assets, default_location, weather_dependent, requires_certification,
            template_notes, created_by
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        RETURNING *
    `;
    
    const result = await pool.query(query, [
        name, description, roster_type, category, priority, duration_hours,
        min_participants, max_participants, JSON.stringify(required_roles), required_equipment,
        required_assets, default_location, weather_dependent, requires_certification,
        template_notes, created_by
    ]);
    
    return result.rows[0];
};

const update = async (id, templateData) => {
    const {
        name, description, roster_type, category, priority, duration_hours,
        min_participants, max_participants, required_roles, required_equipment,
        required_assets, default_location, weather_dependent, requires_certification,
        template_notes
    } = templateData;
    
    const query = `
        UPDATE roster_templates SET
            name = $1, description = $2, roster_type = $3, category = $4, priority = $5,
            duration_hours = $6, min_participants = $7, max_participants = $8,
            required_roles = $9, required_equipment = $10, required_assets = $11,
            default_location = $12, weather_dependent = $13, requires_certification = $14,
            template_notes = $15, updated_at = NOW()
        WHERE id = $16
        RETURNING *
    `;
    
    const result = await pool.query(query, [
        name, description, roster_type, category, priority, duration_hours,
        min_participants, max_participants, JSON.stringify(required_roles), required_equipment,
        required_assets, default_location, weather_dependent, requires_certification,
        template_notes, id
    ]);
    
    return result.rows[0];
};

const remove = async (id) => {
    // Soft delete by setting is_active to false
    const query = 'UPDATE roster_templates SET is_active = false, updated_at = NOW() WHERE id = $1';
    await pool.query(query, [id]);
};

const createRosterFromTemplate = async (templateId, rosterOverrides) => {
    const template = await findById(templateId);
    if (!template) {
        throw new Error('Template not found');
    }
    
    // Merge template data with overrides
    const rosterData = {
        title: rosterOverrides.title || template.name,
        description: rosterOverrides.description || template.description,
        roster_type: template.roster_type,
        category: template.category,
        priority: template.priority,
        roster_date: rosterOverrides.roster_date,
        start_time: rosterOverrides.start_time,
        end_time: rosterOverrides.end_time,
        location: rosterOverrides.location || template.default_location,
        max_participants: template.max_participants,
        min_participants: template.min_participants,
        weather_dependent: template.weather_dependent,
        requires_certification: template.requires_certification,
        equipment_required: template.required_equipment,
        notes: rosterOverrides.notes || template.template_notes,
        created_by: rosterOverrides.created_by,
        flotilla_id: rosterOverrides.flotilla_id
    };
    
    // Create the roster using the roster model
    const rosterModel = require('./rosterModel');
    return await rosterModel.create(rosterData);
};

module.exports = {
    findAll,
    findById,
    create,
    update,
    remove,
    createRosterFromTemplate
};
