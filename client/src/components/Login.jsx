import Navbar from "./Navbar";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

function Login() {
    return (
        <>
        <Navbar />
        <form className="flex flex-col items-start bg-[#EFEEEB] mt-[5vh] justify-center mx-[2vh] px-[2vh] lg:mx-[50vh] lg:px-[20vh]">
            <p className="text-4xl font-semibold my-[5vh] self-center">Login</p>
            <label className="mt-[3vh] text-[#75716B]"
            htmlFor="email">Email</label>
            <Input className="bg-white h-[6vh] border-[#DAD6D1] lg:h-[5vh]"
            type="email" placeholder="Email" />
            <label className="mt-[3vh] text-[#75716B]"
            htmlFor="password">Password</label>
            <Input className="bg-white h-[6vh] border-[#DAD6D1] lg:h-[5vh]"
            type="password" placeholder="Password" />
            <Button 
            className="cursor-pointer self-center mt-[3vh] bg-[#26231E] text-white text-md rounded-3xl w-[15vh] h-[6vh] lg:w-[15vh] lg:h-[5vh]"
            type="submit">Log in</Button>
            <p className="self-center mt-[3vh] mb-[6vh] text-[#75716B]">
                Don't have any account? <a href="/login" className="text-[#26231E]">Sign up</a></p>
        </form>
        </>
    )
}

export default Login;