import { Linkedin } from 'lucide-react';
import { Github } from 'lucide-react';
import { AtSign } from 'lucide-react';

function Footer () {
    return (
        <footer className="w-auto h-38 bg-[#EFEEEB] -z-20 lg:flex lg:items-center lg:justify-between">
            <div className='flex gap-4 justify-center pt-10 lg:pt-0 lg:gap-6 lg:ml-35'>
                <p className='font-medium'>Get in touch</p>
                <div className='flex gap-4'>
                    <div className='w-6 h-6 rounded-3xl bg-[#43403B] relative flex items-center justify-center'>
                    <a href="#" >
                        <Linkedin className='z-50' color = "#fff" size={14} strokeWidth={1} fill='white'/>
                    </a> 
                    </div>
                    <div className='w-6 h-6 rounded-3xl bg-[#43403B] relative flex items-end justify-center '>
                    <a href="#" >
                     <Github className='z-50' color = "#fff" size={20} strokeWidth={1} fill='white'/>
                    </a> 
                    </div>
                    <div className='w-6 h-6 rounded-3xl bg-[#43403B] relative flex items-center justify-center'>
                    <a href="#" >
                     <AtSign className='z-50' color = "#fff" size={14} strokeWidth={2.5} />
                    </a> 
                </div>
                </div>
            </div>
            <div className='flex justify-center lg:mr-35'>
                <a href="#" className='underline font-medium pt-5 lg:pt-0'>Home Page</a>
            </div>
        </footer>
    )
}

export default Footer