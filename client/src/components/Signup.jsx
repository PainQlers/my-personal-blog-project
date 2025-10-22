import Navbar from "./Navbar";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

function Signup() {
    return (
        <>
        <Navbar />
        <form className="flex flex-col items-start bg-[#EFEEEB] mt-[5vh] justify-center mx-[2vh] px-[2vh] lg:mx-[50vh] lg:px-[20vh]">
            <p className="text-4xl font-semibold my-[5vh] self-center">Sign up</p>
            <label className="text-[#75716B]"
            htmlFor="fullname">Name</label>
            <Input className="bg-white h-[6vh] border-[#DAD6D1] lg:h-[5vh]"
            type="text" placeholder="Full Name" />
            <label className="mt-[3vh] text-[#75716B]"
            htmlFor="username">Username</label>
            <Input className="bg-white h-[6vh] border-[#DAD6D1] lg:h-[5vh]"
            type="text" placeholder="Username" />
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
            type="submit">Sign up</Button>
            <p className="self-center my-[3vh] text-[#75716B]">
                Already have an account? <a href="/login" className="text-[#26231E]">Log in</a></p>
        </form>
        </>
    )
}

export default Signup;