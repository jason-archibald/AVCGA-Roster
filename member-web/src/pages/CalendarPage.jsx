import React,{useState,useEffect} from 'react'; import memberService from '../services/memberService';
const CalendarPage=()=>{const [rosters,setRosters]=useState([]);useEffect(()=>{memberService.getRosters().then(setRosters)},[]);
return (<div><h2>Upcoming Rosters</h2>{rosters.map(r=>(<div className="card" key={r.id}><h3>{new Date(r.roster_date).toDateString()} - {r.shift_name}</h3><p><strong>Flotilla:</strong> {r.flotilla_name||'N/A'}</p></div>))}</div>);};
export default CalendarPage;
