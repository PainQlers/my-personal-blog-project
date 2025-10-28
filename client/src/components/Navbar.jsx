import { Button } from '@/components/ui/button.tsx'
import { AlignJustify } from 'lucide-react';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
      <nav className='bg-[#F9F8F6] w-full h-12 lg:h-20 flex justify-between items-center px-4 border-b-1 border-[#DAD6D1]'>
        <p className='cursor-pointer text-base lg:ml-30'>
        <Link to={`/`}>
        Bright
        </Link>
          </p>
        <AlignJustify className='lg:hidden'/>
        <div className='cursor-pointer hidden lg:flex lg:gap-2 lg:visible lg:mr-30'>
          <Button variant='outline' className='rounded-3xl w-31 h-12 hover:scale-102 duration-200'>
            <Link to={`/login`}>
            Log in
          </Link>
            </Button>
        <Button className='cursor-pointer rounded-3xl w-31 h-12 bg-black text-white hover:scale-102 duration-200'>
          <Link to={`/signup`}>
          Sign Up
          </Link>
          </Button>
        </div>
      </nav>
    )
  }

  export default Navbar