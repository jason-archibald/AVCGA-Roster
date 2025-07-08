import React,{createContext,useState,useEffect} from 'react'; import authService from '../services/authService';
export const AuthContext=createContext(null);
export const AuthProvider=({children})=>{const [user,setUser]=useState(null);const [loading,setLoading]=useState(true);
useEffect(()=>{const t=localStorage.getItem('token');if(t){authService.getProfile().then(setUser).catch(()=>setUser(null)).finally(()=>setLoading(false));}else{setLoading(false);}},[]);
const login=async(e,p)=>{await authService.login(e,p);const u=await authService.getProfile();setUser(u);};
const logout=()=>{authService.logout();setUser(null);};
return <AuthContext.Provider value={{user,login,logout,loading}}>{children}</AuthContext.Provider>;};
