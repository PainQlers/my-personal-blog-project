import Navbar from "./Navbar";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { UserRound, RotateCw } from "lucide-react";
import Catimage from './img/cat_img.jpg'

function ResetPassword() {
    return (
        <>
        <Navbar />
        <div className="flex justify-start mt-[2vh] mx-[3vh] lg:absolute lg:flex-col lg:top-[25vh] lg:gap-8 lg:left-[15vh]">
        <div className="flex justify-around w-[13vh] mr-[10vh] lg:justify-start lg:ml-[2vh] lg:gap-3">
        <UserRound />Profile
        </div>
        <div className="flex justify-around w-[25vh] lg:justify-start lg:ml-[2vh] lg:gap-3">
        <RotateCw />Reset password
        </div>
        </div>
        <div className="flex justify-start mt-[5vh] mx-[3vh] lg:absolute lg:w-[60vh] lg:left-[13vh]">
        <div className="flex justify-around w-full ">
        <img className="self-center w-[6vh] h-[6vh] rounded-full lg:w-[8vh] lg:h-[8vh]"
            src={Catimage} alt="" />
            <p className="my-auto text-[#75716B] text-lg">Moodeng ja</p>
        </div>
        <p className="my-auto text-3xl font-thin mx-[2vh]">|</p>
        <div className="flex justify-start w-full my-auto font-semibold text-lg">
        Profile
        </div>
        </div>
        <form className="flex flex-col items-start bg-[#EFEEEB] justify-center px-[2vh] lg:mx-[50vh] lg:px-[20vh] lg:mt-[18vh] lg:w-[80vh]">
            <label className="mt-[3vh] text-[#75716B]"
            htmlFor="email">Current password</label>
            <Input className="bg-white h-[6vh] border-[#DAD6D1] lg:h-[5vh]"
            type="name" placeholder="Current password" />
            <label className="mt-[3vh] text-[#75716B]"
            htmlFor="username">New password</label>
            <Input className="bg-white h-[6vh] border-[#DAD6D1] lg:h-[5vh]"
            type="username" placeholder="New password" />
            <label className="mt-[3vh] text-[#75716B]"
            htmlFor="email">Confirm new password</label>
            <Input className="bg-white h-[6vh] border-[#DAD6D1] lg:h-[5vh]"
            type="email" placeholder="Confirm new password" />
            <Button 
            className="cursor-pointer mt-[3vh] bg-[#26231E] text-white text-md rounded-3xl w-[15vh] h-[6vh] mb-[5vh] lg:w-[15vh] lg:h-[5vh] lg:w-[20vh]"
            type="submit">Reset password</Button>
        </form>
        </>
    )
}

export default ResetPassword;