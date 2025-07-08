import React,{useState} from 'react'; import {useNavigate} from 'react-router-dom'; import {useAuth} from '../hooks/useAuth';
const LoginPage=()=>{ const [email,setEmail]=useState('jason.archibald@archis-marine.online'); const [password,setPassword]=useState('Password123'); const [error,setError]=useState(''); const n=useNavigate(); const a=useAuth();
const h=async(e)=>{e.preventDefault();setError('');try{await a.login(email,password);n("/dashboard");}catch(err){setError(err.message);}};
return(<div><h2>Member Login</h2><form onSubmit={h}><div><input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></div><div><input type="password" value={password} onChange={e=>setPassword(e.target.value)} required/></div>{error&&<p className="error">{error}</p>}<button type="submit">Log In</button></form></div>);};
export default LoginPage;
