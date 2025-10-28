import Navbar from "./Navbar";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import { useAuth } from "../context/Authentication";

function Login() {
    const { login, state } = useAuth();

    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
      });

    const [error, setError] = useState("");

      const handleChange = (e) => {
        setCredentials({
          ...credentials,
          [e.target.name]: e.target.value,
        });
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        const result = await login(credentials);
        
        if (result?.error) {
          setError(result.error);
        }
      };

    return (
        <>
        <Navbar />
        <form onSubmit={handleSubmit}
        className="flex flex-col items-start bg-[#EFEEEB] mt-[5vh] justify-center mx-[2vh] px-[2vh] lg:mx-[50vh] lg:px-[20vh]">
            <p className="text-4xl font-semibold my-[5vh] self-center">Login</p>
            
            {error && (
              <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            <label className="mt-[3vh] text-[#75716B]"
            htmlFor="email">Email</label>
            <Input 
            className="bg-white h-[6vh] border-[#DAD6D1] lg:h-[5vh]"
            type="email"
            name="email"
            value={credentials.email}
            onChange={handleChange} 
            placeholder="Email"
            required 
            />
            <label className="mt-[3vh] text-[#75716B]"
            htmlFor="password">Password</label>
            <Input 
            className="bg-white h-[6vh] border-[#DAD6D1] lg:h-[5vh]"
            value={credentials.password}
            onChange={handleChange}
            type="password"
            name="password"
            placeholder="Password" 
            required
            />
            <Button 
            className="cursor-pointer self-center mt-[3vh] bg-[#26231E] text-white text-md rounded-3xl w-[15vh] h-[6vh] lg:w-[15vh] lg:h-[5vh]"
            type="submit"
            disabled={state.loading}>
            {state.loading ? "Logging in..." : "Log in"}
            </Button>
            <p className="self-center mt-[3vh] mb-[6vh] text-[#75716B]">
                Don't have any account? <a href="/login" className="text-[#26231E] hover:font-bold duration-100 underline cursor-pointer">Sign up</a></p>
        </form>
        </>
    )
}

export default Login;