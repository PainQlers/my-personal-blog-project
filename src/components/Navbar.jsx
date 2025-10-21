import { Button } from '@/components/ui/button.tsx'
import { AlignJustify } from 'lucide-react';

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

  export default Navbar