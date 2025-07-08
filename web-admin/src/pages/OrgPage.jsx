import React, { useState, useEffect, useCallback } from 'react';
import adminService from '../services/adminService';

// A simple, reusable form component for this page
const OrgForm = ({ title, fields, onSubmit, error }) => (
    <div className="card">
        <h3>{title}</h3>
        <form onSubmit={onSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end' }}>
            {fields}
            <button type="submit" style={{ flexShrink: 0 }}>+ Add</button>
            {error && <p className="error" style={{ width: '100%', margin: '0.5rem 0 0 0' }}>{error}</p>}
        </form>
    </div>
);

const OrgPage = () => {
    const [squadrons, setSquadrons] = useState([]);
    const [flotillas, setFlotillas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [squadronError, setSquadronError] = useState('');
    const [flotillaError, setFlotillaError] = useState('');

    // useCallback ensures this function isn't recreated on every render
    const fetchData = useCallback(() => {
        setLoading(true);
        Promise.all([
            adminService.getSquadrons(),
            adminService.getFlotillas()
        ]).then(([squadData, flotData]) => {
            setSquadrons(squadData);
            setFlotillas(flotData);
        }).catch(err => {
            alert(err.message || 'Failed to fetch initial organization data.');
        }).finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAddSquadron = async (e) => {
        e.preventDefault();
        setSquadronError('');
        const name = e.target.elements.squadronName.value;
        try {
            await adminService.createSquadron({ name });
            e.target.reset();
            fetchData(); // Refresh list after adding
        } catch (err) {
            setSquadronError(err.message);
        }
    };

    const handleAddFlotilla = async (e) => {
        e.preventDefault();
        setFlotillaError('');
        const name = e.target.elements.flotillaName.value;
        const squadron_id = e.target.elements.squadron_id.value;
        if (!squadron_id) {
            setFlotillaError("You must assign a squadron.");
            return;
        }
        try {
            await adminService.createFlotilla({ name, squadron_id });
            e.target.reset();
            fetchData(); // Refresh list after adding
        } catch (err) {
            setFlotillaError(err.message);
        }
    };

    if (loading) return <div>Loading Organization Data...</div>;

    return (
        <div>
            <h2>Organization Management</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                    <OrgForm
                        title="Add New Squadron"
                        onSubmit={handleAddSquadron}
                        error={squadronError}
                        fields={<input name="squadronName" placeholder="New Squadron Name (e.g., QF2)" required style={{flexGrow: 1}} />}
                    />
                    <div className="card">
                        <h3>Existing Squadrons</h3>
                        <table><thead><tr><th>Name</th></tr></thead><tbody>
                            {squadrons.map(s => <tr key={s.id}><td>{s.name}</td></tr>)}
                        </tbody></table>
                    </div>
                </div>
                <div>
                    <OrgForm
                        title="Add New Flotilla"
                        onSubmit={handleAddFlotilla}
                        error={flotillaError}
                        fields={<>
                            <input name="flotillaName" placeholder="New Flotilla Name" required style={{flexGrow: 1}} />
                            <select name="squadron_id" required>
                                <option value="">-- Assign Squadron --</option>
                                {squadrons.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </>}
                    />
                    <div className="card">
                        <h3>Existing Flotillas</h3>
                        <table><thead><tr><th>Name</th><th>Squadron</th></tr></thead><tbody>
                            {flotillas.map(f => <tr key={f.id}><td>{f.name}</td><td>{f.squadron_name || 'N/A'}</td></tr>)}
                        </tbody></table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrgPage;
