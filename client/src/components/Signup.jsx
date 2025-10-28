import Navbar from "./Navbar";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
      });

      const handleChange = (e) => {
        
        setFormData({
          ...formData,
          [e.target.name]: e.target.value,
        });
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
          const res = await axios.post("http://localhost:4000/api/auth/register", formData);
          setTimeout(() => navigate("/login"), 1500);
          console.log(res.data);
        } catch (err) {
          console.error(err);
        }
      };
    
    return (
        <>
        <Navbar />
        <form onSubmit={handleSubmit}
        className="flex flex-col items-start bg-[#EFEEEB] mt-[5vh] justify-center mx-[2vh] px-[2vh] lg:mx-[50vh] lg:px-[20vh]">
            <p className="text-4xl font-semibold my-[5vh] self-center">Sign up</p>
            <label className="text-[#75716B]"
            htmlFor="fullname">Name</label>
            <Input 
            onChange={handleChange}
            className="bg-white h-[6vh] border-[#DAD6D1] lg:h-[5vh]"
            type="text"
            name="name" 
            placeholder="Full Name"
            value={formData.name} 
            required
            />
            <label className="mt-[3vh] text-[#75716B]"
            htmlFor="username">Username</label>
            <Input onChange={handleChange}
            className="bg-white h-[6vh] border-[#DAD6D1] lg:h-[5vh]"
            type="text"
            name="username" 
            placeholder="Username"
            value={formData.username}
            required
             />
            <label className="mt-[3vh] text-[#75716B]"
            htmlFor="email">Email</label>
            <Input onChange={handleChange}
            className="bg-white h-[6vh] border-[#DAD6D1] lg:h-[5vh]"
            type="email"
            name="email" 
            placeholder="Email" 
            value={formData.email}
            required
            />
            <label className="mt-[3vh] text-[#75716B]"
            htmlFor="password">Password</label>
            <Input 
            onChange={handleChange}
            className="bg-white h-[6vh] border-[#DAD6D1] lg:h-[5vh]"
            type="password"
            name="password" 
            placeholder="Password" 
            value={formData.password}
            required
            />
            <Button 
            className="cursor-pointer self-center mt-[3vh] bg-[#26231E] text-white text-md rounded-3xl w-[15vh] h-[6vh] lg:w-[15vh] lg:h-[5vh]"
            type="submit">Sign up</Button>
            <p className="self-center my-[3vh] text-[#75716B]">
                Already have an account? <a href="/login" className="text-[#26231E]">Log in</a></p>
        </form>
        </>
    )
}

export default Signup;