import { useState, useEffect } from 'react';
import Heroimage from './img/hero-img.png'
import axios from 'axios';
import Bright from './img/Bright-pic.png';

function HeroSelection() {
  const [authorInfo, setAuthorInfo] = useState({
    name: "Bright",
    bio: "I am a pet enthusiast and freelance writer who specializes in animal behavior and care. With a deep love for cats, I enjoy sharing insights on feline companionship and wellness.\n\nWhen I'm not writing, I spends time volunteering at my local animal shelter, helping cats find loving homes.",
    profilePic: Bright,
  });

  useEffect(() => {
    fetchAuthorInfo();
  }, []);

  const fetchAuthorInfo = async () => {
    try {
      // Find the first admin user
      const response = await axios.get('/api/auth/get-site-author');
      if (response.data) {
        setAuthorInfo({
          name: response.data.name || "Author",
          // ใช้ bio จากฐานข้อมูล (authors table) โดยตรง
          bio: response.data.bio || "",
          // ดึงรูปจาก API เป็นหลัก
          profilePic: response.data.profile_pic || response.data.profilePic || Bright,
        });
      }
    } catch (error) {
      console.error("Error fetching author info:", error);
      // เก็บ bio จาก localStorage ถ้ามี แม้ว่า fetch จะ fail
      const savedBio = localStorage.getItem('author_bio') || "";
      if (savedBio) {
        setAuthorInfo((prev) => ({
          ...prev,
          bio: savedBio,
        }));
      }
    }
  };

  return (
      <section>
        <div className='flex flex-col lg:flex-row items-center justify-center lg:w-300 lg:mx-auto mt-10'>
          <div className='text-center lg:text-end lg:w-87'>
            <h1 className='text-4xl lg:text-5xl lg:leading-14 font-semibold'>Stay<br className='invisible lg:visible'/> Informed,</h1>
            <h1 className='text-4xl lg:text-5xl lg:leading-14 lg:mb-7 font-semibold'>Stay Inspired</h1>
            <p className='text-base mt-5 text-[#75716B]'>Discover a World of Knowledge at Your Fingertips.
               Your Daily Dose of Inspiration and Information.</p>
          </div>
           <img src= {Bright} alt="" className='w-86 mx-auto my-8'/>
          <div className='mx-5 my-5 lg:w-87'>
            <p className='text-sm text-[#75716B]'>-Author</p>
          <div className='flex items-center gap-3 my-2'>
            <img src={authorInfo.profilePic} alt={authorInfo.name} className='w-10 h-10 rounded-full object-cover'/>
            <h1 className='text-lg font-semibold lg:text-2xl'>{authorInfo.name}</h1>
          </div>
            {authorInfo.bio && (
              <div className='mt-2 text-base text-[#75716B]'>
                {authorInfo.bio.split('\n').map((paragraph, index) => (
                  <p key={index} className='mt-2'>{paragraph}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    )
  }

  export default HeroSelection