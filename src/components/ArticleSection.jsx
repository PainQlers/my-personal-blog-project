import { Search, ChevronDown } from 'lucide-react';
import { Input } from "@/components/ui/input.tsx"
import { Button } from '@/components/ui/button.tsx'
import BlogCard from './BlogCard.jsx';
import { blogPosts } from '../data/blogPosts.js';

function ArticleSection () {
    return (
        <section>
            <p className="ml-4 font-semibold text-xl mb-6 mt-8 lg:ml-89">Latest articles</p>
            <div className="lg:flex lg:items-center lg:justify-center">
            <form className="bg-[#EFEEEB] rounded-xl px-4 flex flex-col mt-0 lg:w-300 lg:h-20 lg:px-5 lg:flex-row lg:items-center lg:justify-between">
                <div className='hidden lg:visible lg:gap-5 lg:flex lg:items-center'>
                <Button className="text-[#75716B] hover:bg-[#DAD6D1] shadow-none">Highlight</Button>
                <Button className="text-[#75716B] hover:bg-[#DAD6D1] shadow-none">Cat</Button>
                <Button className="text-[#75716B] hover:bg-[#DAD6D1] shadow-none">Inspiration</Button>
                <Button className="text-[#75716B] hover:bg-[#DAD6D1] shadow-none">Genaral</Button>
                </div>
                <div className="relative pt-3">
                <Input type="text" placeholder="Search" 
                className="bg-white w-86 h-12 rounded-xl border-1 border-[#DAD6D1] shadow-none pl-4 mb-2" />
                <Search className='pointer-events-none absolute left-77 top-9 -translate-y-1/2 text-[#75716B]' strokeWidth={1} size={20} />
                <label htmlFor="lname" className="text-[#75716B] -mb-1.5 lg:hidden">Category</label>
                <Input type="text" placeholder="Highlight"
                className="bg-white w-86 h-12 rounded-xl border-1 border-[#DAD6D1] shadow-none mt-2 pl-4 flex lg:hidden"/>
                <ChevronDown className='relative left-77 bottom-9 lg:hidden' strokeWidth={1}/>
                </div>
            </form>
            </div>
            <div className='grid grid-cols-1 mx-5 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10 lg:w-300 lg:mx-auto'>
            <BlogCard 
            image={blogPosts[0].image}
            category={blogPosts[0].category}
            title={blogPosts[0].title}
            description={blogPosts[0].description}
            author={blogPosts[0].author}
            date={blogPosts[0].date}
            />
            <BlogCard 
            image={blogPosts[1].image}
            category={blogPosts[1].category}
            title={blogPosts[1].title}
            description={blogPosts[1].description}
            author={blogPosts[1].author}
            date={blogPosts[1].date}
            />
            <BlogCard 
            image={blogPosts[2].image}
            category={blogPosts[2].category}
            title={blogPosts[2].title}
            description={blogPosts[2].description}
            author={blogPosts[2].author}
            date={blogPosts[2].date}
            />
            <BlogCard 
            image={blogPosts[3].image}
            category={blogPosts[3].category}
            title={blogPosts[3].title}
            description={blogPosts[3].description}
            author={blogPosts[3].author}
            date={blogPosts[3].date}
            />
            <BlogCard 
            image={blogPosts[4].image}
            category={blogPosts[4].category}
            title={blogPosts[4].title}
            description={blogPosts[4].description}
            author={blogPosts[4].author}
            date={blogPosts[4].date}
            />
            <BlogCard 
            image={blogPosts[5].image}
            category={blogPosts[5].category}
            title={blogPosts[5].title}
            description={blogPosts[5].description}
            author={blogPosts[5].author}
            date={blogPosts[5].date}
            />
            </div>
        </section>
        
    )
}

export default ArticleSection