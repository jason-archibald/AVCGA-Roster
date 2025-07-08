import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import adminService from '../services/adminService';

const RosterDetailPage = () => {
    const { rosterId } = useParams();
    const navigate = useNavigate();
    
    const [roster, setRoster] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [availableMembers, setAvailableMembers] = useState([]);
    const [shiftRoles, setShiftRoles] = useState([]);
    const [shiftOffers, setShiftOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [showAssignmentForm, setShowAssignmentForm] = useState(false);
    const [showOfferForm, setShowOfferForm] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    
    const [assignmentForm, setAssignmentForm] = useState({
        member_id: '',
        shift_role_id: '',
        notes: '',
        status: 'Assigned'
    });
    
    const [offerForm, setOfferForm] = useState({
        offered_to: '',
        reason: '',
        expires_at: ''
    });

    useEffect(() => {
        if (rosterId) {
            fetchRosterData();
        }
    }, [rosterId]);

    const fetchRosterData = async () => {
        try {
            const [rosterData, assignmentData, memberData, roleData, offerData] = await Promise.all([
                adminService.getRosterById(rosterId),
                adminService.getRosterAssignments(rosterId),
                adminService.getAvailableMembers(rosterId),
                adminService.getShiftRoles(),
                adminService.getShiftOffers(rosterId)
            ]);
            
            setRoster(rosterData);
            setAssignments(assignmentData);
            setAvailableMembers(memberData);
            setShiftRoles(roleData);
            setShiftOffers(offerData);
        } catch (err) {
            setError('Failed to load roster data');
            console.error('Error fetching roster data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAssignMember = async (e) => {
        e.preventDefault();
        try {
            await adminService.assignMemberToRoster(rosterId, assignmentForm);
            setAssignmentForm({ member_id: '', shift_role_id: '', notes: '', status: 'Assigned' });
            setShowAssignmentForm(false);
            fetchRosterData();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleRemoveAssignment = async (assignmentId) => {
        if (window.confirm('Are you sure you want to remove this assignment?')) {
            try {
                await adminService.removeRosterAssignment(rosterId, assignmentId);
                fetchRosterData();
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const handleUpdateAssignmentStatus = async (assignmentId, newStatus) => {
        try {
            const updateData = { 
                status: newStatus,
                confirmed_at: newStatus === 'Confirmed' ? new Date().toISOString() : null
            };
            await adminService.updateRosterAssignment(rosterId, assignmentId, updateData);
            fetchRosterData();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleCreateOffer = async (e) => {
        e.preventDefault();
        try {
            await adminService.createShiftOffer(selectedAssignment.id, offerForm);
            setOfferForm({ offered_to: '', reason: '', expires_at: '' });
            setShowOfferForm(false);
            setSelectedAssignment(null);
            fetchRosterData();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleAcceptOffer = async (offerId) => {
        try {
            await adminService.acceptShiftOffer(rosterId, offerId);
            fetchRosterData();
        } catch (err) {
            setError(err.message);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Confirmed': return { bg: '#d4edda', color: '#155724' };
            case 'Assigned': return { bg: '#d1ecf1', color: '#0c5460' };
            case 'Unavailable': return { bg: '#fff3cd', color: '#856404' };
            case 'Cancelled': return { bg: '#f8d7da', color: '#721c24' };
            default: return { bg: '#f8f9fa', color: '#6c757d' };
        }
    };

    if (loading) return <div>Loading roster details...</div>;
    if (!roster) return <div>Roster not found</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2>{roster.title}</h2>
                    <p style={{ color: '#666', margin: '0.5rem 0' }}>
                        {new Date(roster.roster_date).toLocaleDateString()} • {roster.start_time} - {roster.end_time}
                    </p>
                    {roster.flotilla_name && (
                        <p style={{ color: '#666', margin: '0.5rem 0' }}>
                            Flotilla: {roster.flotilla_name}
                        </p>
                    )}
                </div>
                <div>
                    <button onClick={() => navigate('/rosters')} style={{ marginRight: '1rem' }}>
                        Back to Rosters
                    </button>
                    <button 
                        onClick={() => setShowAssignmentForm(true)}
                        style={{ 
                            padding: '0.5rem 1rem', 
                            background: '#3498db', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Assign Member
                    </button>
                </div>
            </div>

            {error && (
                <div style={{ 
                    color: 'red', 
                    marginBottom: '1rem', 
                    padding: '0.5rem', 
                    background: '#fee', 
                    borderRadius: '4px' 
                }}>
                    {error}
                </div>
            )}

            {roster.description && (
                <div style={{ 
                    background: 'white', 
                    padding: '1rem', 
                    borderRadius: '8px', 
                    marginBottom: '2rem',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    <h4>Description</h4>
                    <p>{roster.description}</p>
                    {roster.notes && (
                        <div style={{ marginTop: '1rem' }}>
                            <h5>Notes</h5>
                            <p>{roster.notes}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Assignment Form */}
            {showAssignmentForm && (
                <form onSubmit={handleAssignMember} style={{ 
                    background: '#f8f9fa', 
                    padding: '1.5rem', 
                    borderRadius: '8px', 
                    marginBottom: '2rem' 
                }}>
                    <h3>Assign Member to Roster</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <select
                            value={assignmentForm.member_id}
                            onChange={(e) => setAssignmentForm({...assignmentForm, member_id: e.target.value})}
                            required
                        >
                            <option value="">Select Member</option>
                            {availableMembers.map(member => (
                                <option key={member.id} value={member.id}>
                                    {member.first_name} {member.last_name} ({member.avcga_member_id})
                                    {!member.is_available ? ' - Unavailable' : ''}
                                </option>
                            ))}
                        </select>
                        <select
                            value={assignmentForm.shift_role_id}
                            onChange={(e) => setAssignmentForm({...assignmentForm, shift_role_id: e.target.value})}
                            required
                        >
                            <option value="">Select Role</option>
                            {shiftRoles.map(role => (
                                <option key={role.id} value={role.id}>{role.name}</option>
                            ))}
                        </select>
                    </div>
                    <textarea
                        placeholder="Assignment Notes"
                        value={assignmentForm.notes}
                        onChange={(e) => setAssignmentForm({...assignmentForm, notes: e.target.value})}
                        rows="3"
                        style={{ marginBottom: '1rem', resize: 'vertical' }}
                    />
                    <div>
                        <button type="submit" style={{ marginRight: '0.5rem' }}>Assign Member</button>
                        <button type="button" onClick={() => setShowAssignmentForm(false)}>Cancel</button>
                    </div>
                </form>
            )}

            {/* Offer Form */}
            {showOfferForm && selectedAssignment && (
                <form onSubmit={handleCreateOffer} style={{ 
                    background: '#f0f8ff', 
                    padding: '1.5rem', 
                    borderRadius: '8px', 
                    marginBottom: '2rem' 
                }}>
                    <h3>Offer Shift: {selectedAssignment.role_name}</h3>
                    <p>Current assignee: {selectedAssignment.member_name}</p>
                    
                    <select
                        value={offerForm.offered_to}
                        onChange={(e) => setOfferForm({...offerForm, offered_to: e.target.value})}
                        style={{ marginBottom: '1rem' }}
                    >
                        <option value="">Offer to anyone</option>
                        {availableMembers
                            .filter(member => member.id !== selectedAssignment.member_id)
                            .map(member => (
                            <option key={member.id} value={member.id}>
                                {member.first_name} {member.last_name}
                            </option>
                        ))}
                    </select>
                    
                    <textarea
                        placeholder="Reason for offering shift"
                        value={offerForm.reason}
                        onChange={(e) => setOfferForm({...offerForm, reason: e.target.value})}
                        rows="3"
                        style={{ marginBottom: '1rem', resize: 'vertical' }}
                    />
                    
                    <input
                        type="datetime-local"
                        placeholder="Offer expires at"
                        value={offerForm.expires_at}
                        onChange={(e) => setOfferForm({...offerForm, expires_at: e.target.value})}
                        style={{ marginBottom: '1rem' }}
                    />
                    
                    <div>
                        <button type="submit" style={{ marginRight: '0.5rem' }}>Create Offer</button>
                        <button type="button" onClick={() => {
                            setShowOfferForm(false);
                            setSelectedAssignment(null);
                        }}>Cancel</button>
                    </div>
                </form>
            )}

            {/* Current Assignments */}
            <div style={{ marginBottom: '2rem' }}>
                <h3>Roster Assignments ({assignments.length})</h3>
                <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    {assignments.length === 0 ? (
                        <p style={{ padding: '2rem', textAlign: 'center' }}>No assignments yet</p>
                    ) : (
                        <table style={{ width: '100%' }}>
                            <thead>
                                <tr style={{ background: '#f8f9fa' }}>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Member</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Role</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Status</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Contact</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Offers</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {assignments.map(assignment => {
                                    const statusStyle = getStatusColor(assignment.status);
                                    return (
                                        <tr key={assignment.id}>
                                            <td style={{ padding: '1rem' }}>
                                                <div>
                                                    <strong>{assignment.member_name}</strong>
                                                    <br />
                                                    <small>{assignment.avcga_member_id}</small>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <div>
                                                    <strong>{assignment.role_name}</strong>
                                                    {assignment.role_description && (
                                                        <br />
                                                    )}
                                                    <small>{assignment.role_description}</small>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <span style={{ 
                                                    padding: '0.25rem 0.5rem', 
                                                    borderRadius: '12px', 
                                                    fontSize: '0.875rem',
                                                    background: statusStyle.bg,
                                                    color: statusStyle.color
                                                }}>
                                                    {assignment.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ fontSize: '0.875rem' }}>
                                                    {assignment.email && <div>{assignment.email}</div>}
                                                    {assignment.phone_primary && <div>{assignment.phone_primary}</div>}
                                                </div>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                {assignment.open_offers_count > 0 && (
                                                    <span style={{ 
                                                        padding: '0.25rem 0.5rem', 
                                                        background: '#fff3cd', 
                                                        color: '#856404',
                                                        borderRadius: '12px',
                                                        fontSize: '0.875rem'
                                                    }}>
                                                        {assignment.open_offers_count} open offer{assignment.open_offers_count > 1 ? 's' : ''}
                                                    </span>
                                                )}
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                    {assignment.status === 'Assigned' && (
                                                        <button 
                                                            onClick={() => handleUpdateAssignmentStatus(assignment.id, 'Confirmed')}
                                                            style={{ 
                                                                padding: '0.25rem 0.5rem',
                                                                background: '#27ae60',
                                                                color: 'white',
                                                                border: 'none',
                                                                borderRadius: '3px',
                                                                cursor: 'pointer',
                                                                fontSize: '0.875rem'
                                                            }}
                                                        >
                                                            Confirm
                                                        </button>
                                                    )}
                                                    <button 
                                                        onClick={() => {
                                                            setSelectedAssignment(assignment);
                                                            setShowOfferForm(true);
                                                        }}
                                                        style={{ 
                                                            padding: '0.25rem 0.5rem',
                                                            background: '#f39c12',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '3px',
                                                            cursor: 'pointer',
                                                            fontSize: '0.875rem'
                                                        }}
                                                    >
                                                        Offer
                                                    </button>
                                                    <button 
                                                        onClick={() => handleRemoveAssignment(assignment.id)}
                                                        style={{ 
                                                            padding: '0.25rem 0.5rem',
                                                            background: '#e74c3c',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '3px',
                                                            cursor: 'pointer',
                                                            fontSize: '0.875rem'
                                                        }}
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Shift Offers */}
            {shiftOffers.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                    <h3>Shift Offers ({shiftOffers.length})</h3>
                    <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <table style={{ width: '100%' }}>
                            <thead>
                                <tr style={{ background: '#f8f9fa' }}>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Role</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Offered By</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Offered To</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Status</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Reason</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {shiftOffers.map(offer => (
                                    <tr key={offer.id}>
                                        <td style={{ padding: '1rem' }}>{offer.role_name}</td>
                                        <td style={{ padding: '1rem' }}>{offer.offered_by_name}</td>
                                        <td style={{ padding: '1rem' }}>{offer.offered_to_name || 'Anyone'}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{ 
                                                padding: '0.25rem 0.5rem', 
                                                borderRadius: '12px', 
                                                fontSize: '0.875rem',
                                                background: offer.status === 'Open' ? '#d1ecf1' : '#f8d7da',
                                                color: offer.status === 'Open' ? '#0c5460' : '#721c24'
                                            }}>
                                                {offer.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem' }}>{offer.reason || 'No reason provided'}</td>
                                        <td style={{ padding: '1rem' }}>
                                            {offer.status === 'Open' && (
                                                <button 
                                                    onClick={() => handleAcceptOffer(offer.id)}
                                                    style={{ 
                                                        padding: '0.25rem 0.5rem',
                                                        background: '#27ae60',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '3px',
                                                        cursor: 'pointer',
                                                        fontSize: '0.875rem'
                                                    }}
                                                >
                                                    Accept Offer
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RosterDetailPage;
