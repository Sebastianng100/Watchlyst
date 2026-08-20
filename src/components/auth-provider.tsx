"use client";
import {createContext,useContext,useEffect,useState} from "react"; import type {User} from "@supabase/supabase-js"; import {getSupabase} from "@/lib/supabase";
const AuthContext=createContext<{user:User|null;loading:boolean}>({user:null,loading:true});
export function AuthProvider({children}:{children:React.ReactNode}){const [user,setUser]=useState<User|null>(null);const [loading,setLoading]=useState(true);useEffect(()=>{try{const supabase=getSupabase();supabase.auth.getUser().then(({data})=>{setUser(data.user);setLoading(false)});const {data}=supabase.auth.onAuthStateChange((_e,s)=>{setUser(s?.user??null);setLoading(false)});return()=>data.subscription.unsubscribe()}catch{setLoading(false)}},[]);return <AuthContext.Provider value={{user,loading}}>{children}</AuthContext.Provider>}
export const useAuth=()=>useContext(AuthContext);
