import Navbar from "./Navbar";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { UserRound, RotateCw } from "lucide-react";
import Catimage from './img/cat_img.jpg'
import NavbarUser from "./NavbarUser";
import { useAuth } from "../context/Authentication";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";
import axios from "axios";
import { CheckCircle, X } from "lucide-react";


function ResetPassword() {
    const { isAuthenticated, state } = useAuth();
    const user = state.user;

    // เก็บค่าจากฟอร์ม
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ตรวจสอบว่ารหัสใหม่กับยืนยันตรงกันไหม
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match!", {
        description: "Please make sure both new passwords are the same.",
      });
      return;
    }

    try {
      const res = await axios.put("http://localhost:4000/api/auth/reset-password", {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });

      console.log(res.data);

      // ✅ Toast แจ้งเตือนเมื่อสำเร็จ
      toast.success("Password updated successfully!", {
        description: "Your password information has been saved.",
        duration: 3000, // 3 วินาที
      });

      // เคลียร์ input หลังอัปเดตสำเร็จ
      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to update password", {
        description:
          err.response?.data?.error ||
          "Something went wrong. Please try again later.",
      });
    }
  };

    return (
        <>
        {isAuthenticated ? <NavbarUser /> : <Navbar />}
        <div className="flex justify-start mt-[2vh] mx-[3vh] lg:absolute lg:flex-col lg:top-[25vh] lg:gap-8 lg:left-[15vh]">
        <div className="flex justify-around w-[13vh] mr-[10vh] lg:justify-start lg:ml-[2vh] lg:gap-3">
        <Link className="flex gap-3 text-[#75716B] hover:text-black"
        to="/profile">
                <UserRound />Profile
              </Link>
        </div>
        <div className="flex justify-around w-[25vh] lg:justify-start lg:ml-[2vh] gap-3">
        <RotateCw />Reset password
        </div>
        </div>
        <div className="flex justify-start mt-[5vh] mx-[3vh] lg:absolute lg:w-[60vh] lg:left-[13vh]">
        <div className="flex justify-around w-full ">
        <img className="self-center w-[6vh] h-[6vh] rounded-full lg:w-[8vh] lg:h-[8vh]"
            src={Catimage} alt="" />
            <p className="my-auto text-[#75716B] text-lg">{user?.name || "User"}</p>
        </div>
        <p className="my-auto text-3xl font-thin mx-[2vh]">|</p>
        <div className="flex justify-start w-full my-auto font-semibold text-lg">
        Profile
        </div>
        </div>
        <form onSubmit={handleSubmit}
        className="flex flex-col items-start bg-[#EFEEEB] justify-center px-[2vh] lg:mx-[50vh] lg:px-[20vh] lg:mt-[18vh] lg:w-[80vh]">
            <label className="mt-[3vh] text-[#75716B]"
            htmlFor="email">Current password</label>
            <Input 
            onChange={handleChange}
            className="bg-white h-[6vh] border-[#DAD6D1] lg:h-[5vh]"
            type="password"
            name="oldPassword"
            placeholder="Current password"
            required 
            />
            <label className="mt-[3vh] text-[#75716B]"
            htmlFor="password">New password</label>
            <Input 
            onChange={handleChange}
            className="bg-white h-[6vh] border-[#DAD6D1] lg:h-[5vh]"
            type="password" 
            name="newPassword"
            placeholder="New password"
            required  
            />
            <label className="mt-[3vh] text-[#75716B]"
            htmlFor="password">Confirm new password</label>
            <Input 
            onChange={handleChange}
            className="bg-white h-[6vh] border-[#DAD6D1] lg:h-[5vh]"
            type="password"
            name="confirmPassword" 
            placeholder="Confirm new password"
            required  
            />
            <Button 
            className="cursor-pointer mt-[3vh] bg-[#26231E] text-white text-md rounded-3xl w-[25vh] h-[6vh] mb-[5vh] lg:h-[5vh] lg:w-[20vh]"
            type="submit">Reset password</Button>
        </form>
        </>
    )
}

export default ResetPassword;