import { useDispatch} from "react-redux";
import { register,login,getMe } from "../services/auth.api";
import { setUser,setLoading,setError } from "../services/auth.slice";



export function useAuth(){

    const dispatch = useDispatch()

    async function handleRegister({email,username,password}){
    try{
        dispatch(setLoading(true))
        const data = await register({email,username,password})
    } catch(error){
        dispatch(setError(error.response.data.message || "Registration failed")
    ) }finally{
        dispatch(setLoading(false))
    }
 }
   async function handleLogin({ email, password }) {
    try {
        dispatch(setLoading(true));

        const data = await login({ email, password });

        console.log("API RESPONSE:", data);

        dispatch(setUser(data.user));

        console.log("USER DISPATCHED:", data.user);

        return true;

    } catch (error) {
        console.log("LOGIN ERROR:", error.response?.data || error.message);
        dispatch(setError(error.response?.data?.message || "Login failed"));
        return false;

    } finally {
        dispatch(setLoading(false));
    }
}

    async function handleGetMe(){
        try{
            dispatch(setLoading(true))
            const data = await getMe()
            dispatch(setUser(data.user))
        } catch(error){
            dispatch(setError(error.response.data.message || "Get me failed"))
        }finally{
            dispatch(setLoading(false))
        }
}

  return{
    handleGetMe,
    handleLogin,
    handleRegister,
  }
}