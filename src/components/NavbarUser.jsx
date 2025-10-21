import { Button } from '@/components/ui/button.tsx'
import { AlignJustify } from 'lucide-react';
import { Bell } from 'lucide-react';
import Moodeng from './img/moodeng.webp'
import Catimage from './img/cat_img.jpg'
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserRound, RotateCw, LogOut } from 'lucide-react';

function NavbarUser() {
    return (
      <nav className='bg-[#F9F8F6] w-full h-12 lg:h-20 flex justify-between items-center px-4 border-b-1 border-[#DAD6D1]'>
        <p className='text-base lg:ml-30'>hh.</p>
        <AlignJustify className='lg:hidden'/>
        <div className='hidden lg:flex lg:gap-4 lg:visible lg:mr-50'>
        <Bell className='my-auto'/>
        <img className='w-[4vh] h-[4vh] my-auto rounded-4xl'
        src={Catimage} alt="" />
        <p className='my-auto'>Moodeng</p>
        <button className='cursor-pointer'>
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>
          <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-white border-white rounded-2xl mr-[23vh] mt-[1.5vh]" align="start">
          <DropdownMenuGroup>
            <DropdownMenuItem>
            <UserRound />Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
            <RotateCw />Reset password
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator className="border-gray-300 border-1"/>
          <DropdownMenuItem>
          <LogOut />Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
          </button>
        </div>
      </nav>
    )
  }

  export default NavbarUser;