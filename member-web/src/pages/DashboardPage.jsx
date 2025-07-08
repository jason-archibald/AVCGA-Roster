import React from 'react'; import {useAuth} from '../hooks/useAuth';
const DashboardPage=()=>{const{user}=useAuth();return(<div><h2>Dashboard</h2><p>Welcome back, {user?.first_name}.</p><div className="card"><h3>Next Duty</h3><p><strong>Date:</strong> Saturday, 20 Jul 2025</p></div></div>);};
export default DashboardPage;
