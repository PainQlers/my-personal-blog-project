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
import { useAuth } from '../context/Authentication';
import { Link } from 'react-router-dom';

function NavbarUser() {
    const { state, logout } = useAuth();
    const user = state.user;


    
    return (
      <nav className='bg-[#F9F8F6] w-full h-12 lg:h-20 flex justify-between items-center px-4 border-b-1 border-[#DAD6D1]'>
        <p className='cursor-pointer select-none text-base lg:ml-30'>
          <Link to="/">Bright</Link>
        </p>
        <AlignJustify className='lg:hidden'/>
        <div className='hidden lg:flex lg:gap-4 lg:visible lg:mr-50'>
        <Bell className='my-auto'/>
        <img className='w-[4vh] h-[4vh] my-auto rounded-4xl'
        src={user?.profilePic || Catimage} alt="" />
        <p className='my-auto'>{user?.name || 'User'}</p>
        <DropdownMenu>
        <DropdownMenuTrigger asChild className="cursor-pointer border-0">
          <Button>
          <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-white border-white rounded-2xl mr-[23vh] mt-[1.5vh]" align="start">
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link className='cursor-pointer'
              to="/profile">
                <UserRound />Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link className='cursor-pointer'
              to="/resetpassword">
                <RotateCw />Reset password
              </Link>
            </DropdownMenuItem>
            {user?.role === 'admin' && (
            <DropdownMenuItem asChild>
                    <Link className='cursor-pointer'
                    to="/admin/article-management">
                      <RotateCw />Admin panel
                    </Link>
                  </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
          <DropdownMenuSeparator className="border-gray-300 border-1"/>
          <DropdownMenuItem className="cursor-pointer"
          onClick={logout}>
          <LogOut />Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
        </div>
      </nav>
    )
  }

  export default NavbarUser;