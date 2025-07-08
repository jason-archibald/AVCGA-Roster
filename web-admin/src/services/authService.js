import axios from 'axios'; const api=axios.create(); api.interceptors.request.use(c=>{const t=localStorage.getItem('token');if(t)c.headers.Authorization=`Bearer ${t}`;return c;});
const login=async(e,p)=>{try{const r=await axios.post('/api/auth/login',{email:e,password:p});if(r.data.token)localStorage.setItem('token',r.data.token);return r.data;}catch(e){throw new Error(e.response?.data?.message||'Login failed');}};
const logout=()=>localStorage.removeItem('token');
const getProfile=async()=>{try{return(await api.get('/api/users/me/profile')).data;}catch(e){logout();throw new Error('Session expired');}};
export default {login,logout,getProfile};
