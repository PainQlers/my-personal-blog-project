import Navbar from "./Navbar";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { UserRound, RotateCw } from "lucide-react";
import Catimage from './img/cat_img.jpg'

function ProfileManagement() {
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
        <div className="bg-[#EFEEEB] pt-[5vh] flex flex-col justify-center lg:flex-row lg:mt-[18vh] lg:mx-[50vh] lg:px-[20vh] lg:mb-[4vh] lg:w-[80vh] lg:gap-8">
        <img className="self-center w-[16vh] h-[16vh] rounded-full lg:w-[15vh] lg:h-[15vh] lg:aspect-square"
            src={Catimage} alt="" />
            <Button className="bg-white mx-auto my-[3vh] rounded-3xl lg:self-center lg:h-[5.5vh] lg:w-[30vh]"
            variant="outline">Upload profile picture</Button>
        </div>
        <hr className="w-[50vh] mx-auto border-gray-300 lg:w-[70vh] lg:mr-[73vh]"/>
        <form className="flex flex-col items-start bg-[#EFEEEB] justify-center px-[2vh] lg:mx-[50vh] lg:px-[20vh] lg:w-[80vh]">
            <label className="mt-[3vh] text-[#75716B]"
            htmlFor="email">Name</label>
            <Input className="bg-white h-[6vh] border-[#DAD6D1] lg:h-[5vh]"
            type="name" placeholder="Name" />
            <label className="mt-[3vh] text-[#75716B]"
            htmlFor="username">Username</label>
            <Input className="bg-white h-[6vh] border-[#DAD6D1] lg:h-[5vh]"
            type="username" placeholder="Username" />
            <label className="mt-[3vh] text-[#75716B]"
            htmlFor="email">Email</label>
            <Input className="bg-white h-[6vh] border-[#DAD6D1] lg:h-[5vh]"
            type="email" placeholder="moodeng.cute@gmail.com" disabled />
            <Button 
            className="cursor-pointer mt-[3vh] bg-[#26231E] text-white text-md rounded-3xl w-[15vh] h-[6vh] mb-[5vh] lg:w-[15vh] lg:h-[5vh]"
            type="submit">Save</Button>
        </form>
        </>
    )
}

export default ProfileManagement;