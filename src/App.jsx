import './App.css'
import { Button } from '@/components/ui/button'
import { AlignJustify } from 'lucide-react';
import Heroimage from './components/img/hero-img.png'



function Navbar() {
  return (
    <nav className='bg-[#F9F8F6] w-full h-12 lg:h-20 flex justify-between items-center px-4 border-b-1 border-[#DAD6D1]'>
      <p className='text-base lg:ml-30'>hh.</p>
      <AlignJustify className='lg:hidden'/>
      <div className='hidden lg:flex lg:gap-2 lg:visible lg:mr-30'>
      <Button variant='outline' className='rounded-3xl w-31 h-12'>Log in</Button>
      <Button className='rounded-3xl w-31 h-12 bg-black text-white'>Sign Up</Button>
      </div>
    </nav>
  )
}

function HeroSelection() {
  return (
    <section>
      <div className='flex flex-col lg:flex-row items-center justify-center lg:w-300 lg:mx-auto mt-10'>
        <div className='text-center lg:text-end lg:w-87'>
          <h1 className='text-4xl lg:text-5xl lg:leading-14 font-semibold'>Stay<br className='invisible lg:visible'/> Informed,</h1>
          <h1 className='text-4xl lg:text-5xl lg:leading-14 lg:mb-7 font-semibold'>Stay Inspired</h1>
          <p className='text-base mt-5 text-[#75716B]'>Discover a World of Knowledge at Your Fingertips.
             Your Daily Dose of Inspiration and Information.</p>
        </div>
         <img src= {Heroimage} alt="" className='w-86 mx-auto my-8'/>
        <div className='mx-5 my-5 lg:w-87'>
          <p className='text-sm text-[#75716B]'>-Author</p>
          <h1 className='my-2 text-lg font-semibold lg:text-2xl'>Thompson P.</h1>
          <p className='mt-2 text-base text-[#75716B]'>I am a pet enthusiast and freelance writer 
          who specializes in animal behavior and care. With a deep love for cats, I enjoy sharing
          insights on feline companionship and wellness.</p>
          <p className='mt-2 text-base text-[#75716B]'>When i’m not writing, I spends time volunteering
          at my local animal shelter, helping cats find loving homes.</p>
        </div>
      </div>
    </section>
  )
}

function App() {
  return (
    <>
    <Navbar />
    <HeroSelection />
    </>
  )
}

export default App
