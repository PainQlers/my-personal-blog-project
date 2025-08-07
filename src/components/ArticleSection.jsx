import { Search, ChevronDown } from 'lucide-react';
import { Input } from "@/components/ui/input.tsx"
import { Button } from '@/components/ui/button.tsx'

function ArticleSection () {
    return (
        <section>
            <p className="ml-4 font-semibold text-xl mb-6 mt-8 lg:ml-89">Latest articles</p>
            <div className="lg:flex lg:items-center lg:justify-center">
            <form className="bg-[#EFEEEB] rounded-xl px-4 flex flex-col gap-2 mt-3 lg:w-300 lg:h-20 lg:px-5 lg:flex-row lg:justify-between">
                <div className='invisible lg:visible lg:gap-5 lg:flex lg:items-center'>
                <Button className="text-[#75716B] hover:bg-[#DAD6D1] shadow-none">Highlight</Button>
                <Button className="text-[#75716B] hover:bg-[#DAD6D1] shadow-none">Cat</Button>
                <Button className="text-[#75716B] hover:bg-[#DAD6D1] shadow-none">Inspiration</Button>
                <Button className="text-[#75716B] hover:bg-[#DAD6D1] shadow-none">Genaral</Button>
                </div>
                <div>
                <Input type="text" placeholder="Search" 
                className="absolute bg-white w-86 h-12 rounded-xl border-1 border-[#DAD6D1] shadow-none -mt-15 mb-5 pl-4 flex lg:mt-5 lg:items-center" />
                <Search className='relative left-77 bottom-11 lg:mt-8 lg:top-1' strokeWidth={1} size={20} />
                <label for="lname" className="text-[#75716B] -mb-1.5 lg:invisible">Category</label>
                <Input type="text" placeholder="Highlight"
                className="bg-white w-86 h-12 rounded-xl border-1 border-[#DAD6D1] shadow-none mt-2 pl-4 flex lg:invisible"/>
                <ChevronDown className='relative left-77 bottom-9 lg:invisible' strokeWidth={1}/>
                </div>
            </form>
            </div>
        </section>
    )
}

export default ArticleSection