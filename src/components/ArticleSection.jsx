import { Search, ChevronDown, X } from 'lucide-react';
import { Input } from "@/components/ui/input.tsx"
import { Button } from '@/components/ui/button.tsx'
import BlogCard from './BlogCard.jsx';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'lucide-react';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
  } from "@/components/ui/select"
import axios from 'axios';

function ArticleSection () {
    const [ category, setCategory ] = useState("Highlight");
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [allPosts, setAllPosts] = useState([]); // เก็บข้อมูลทั้งหมดสำหรับการค้นหา
    const searchRef = useRef(null);

    const handleLoadMore = () => {
        setPage((prevPage) => prevPage + 1);
    };

    // ปิด dropdown เมื่อคลิกข้างนอก
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch ข้อมูลทั้งหมดสำหรับการค้นหา
    useEffect(() => {
        const fetchAllPosts = async () => {
            try {
                const response = await axios.get(
                    "https://blog-post-project-api.vercel.app/posts",
                    {
                        params: {
                            page: 1,
                            limit: 100 // ดึงข้อมูลจำนวนมากสำหรับค้นหา
                        }
                    }
                );
                setAllPosts(response.data.posts);
            } catch (error) {
                console.error("Error fetching all posts:", error);
            }
        };

        fetchAllPosts();
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
              const categoryParam = category === "Highlight" ? "" : category;
              
              const response = await axios.get(
                "https://blog-post-project-api.vercel.app/posts", {
                  params: {
                    page: page,
                    limit: 6,
                    category: categoryParam
                  }
                }
              );
              
              if (page === 1) {
                setPosts(response.data.posts);
            } else {
                setPosts((prevPosts) => [...prevPosts, ...response.data.posts]);
            }
              
              if (response.data.currentPage >= response.data.totalPages) {
                setHasMore(false);
              }
            } catch (error) {
              console.error("Error fetching posts:", error);
            }
          };

        fetchPosts();
    },[page, category]);

    // ฟังก์ชันค้นหา
    const handleSearch = (query) => {
        setSearchQuery(query);
        
        if (query.trim() === "") {
            setSearchResults([]);
            setShowDropdown(false);
            return;
        }

        const lowercaseQuery = query.toLowerCase();
        const results = allPosts.filter(post => {
            const titleMatch = post.title?.toLowerCase().includes(lowercaseQuery);
            const descriptionMatch = post.description?.toLowerCase().includes(lowercaseQuery);
            const contentMatch = post.content?.toLowerCase().includes(lowercaseQuery);
            
            return titleMatch || descriptionMatch || contentMatch;
        });

        setSearchResults(results.slice(0, 5)); // แสดงแค่ 5 รายการแรก
        setShowDropdown(results.length > 0);
    };

    // เลือกบทความจาก dropdown
    const handleSelectPost = (post) => {
        setSearchQuery("");
        setShowDropdown(false);
        // เปลี่ยน category และกรองให้เห็นแค่บทความที่เลือก
        setPosts([post]);
        setHasMore(false);
    };

    // ล้างการค้นหา
    const handleClearSearch = () => {
        setSearchQuery("");
        setSearchResults([]);
        setShowDropdown(false);
        setPage(1);
        setHasMore(true);
    };

    // กรองข้อมูลตาม category
    const filteredData = posts.filter(post => {
        if (category === "" || category === "Highlight") {
          return true;
        }
        return post.category === category;
    });

    const handleCategoryChange = (newCategory) => {
        setCategory(newCategory);
        setPage(1);
        setHasMore(true);
        setSearchQuery("");
        setShowDropdown(false);
    };

    return (
        <section className='mb-10'>
            <p className="ml-4 font-semibold text-xl mb-6 mt-8 lg:ml-89">Latest articles</p>
            <div className="lg:flex lg:items-center lg:justify-center">
            <div className="bg-[#EFEEEB] rounded-xl px-4 flex flex-col mt-0 lg:w-300 lg:h-20 lg:px-5 lg:flex-row lg:items-center lg:justify-between">
                <div className='hidden lg:gap-5 lg:flex lg:items-center'>
                <Button onClick={() => handleCategoryChange("Highlight")}
                className={`text-[#75716B] hover:bg-[#DAD6D1] shadow-none ${
                    category === "Highlight" ? "bg-[#DAD6D1]" : ""
                  }`}>Highlight</Button>
                <Button onClick={() => handleCategoryChange("Cat")}
                className={`text-[#75716B] hover:bg-[#DAD6D1] shadow-none ${
                    category === "Cat" ? "bg-[#DAD6D1]" : ""
                  }`}>Cat</Button>
                <Button onClick={() => handleCategoryChange("Inspiration")}
                className={`text-[#75716B] hover:bg-[#DAD6D1] shadow-none ${
                    category === "Inspiration" ? "bg-[#DAD6D1]" : ""
                  }`}>Inspiration</Button>
                <Button onClick={() => handleCategoryChange("General")}
                className={`text-[#75716B] hover:bg-[#DAD6D1] shadow-none ${
                    category === "General" ? "bg-[#DAD6D1]" : ""
                  }`}>General</Button>
                </div>
                <div className="relative pt-3" ref={searchRef}>
                <div className="relative">
                <Input 
                    type="text" 
                    placeholder="Search by title, description, or content" 
                    value={searchQuery} 
                    onChange={(e) => handleSearch(e.target.value)}
                    className="bg-white w-86 h-12 rounded-xl border-1 border-[#DAD6D1] shadow-none pl-4 pr-20 mb-2" 
                />
                <Search className='pointer-events-none absolute right-10 top-1/2 -translate-y-1/2 text-[#75716B]' strokeWidth={1} size={20} />
                {searchQuery && (
                    <button
                        onClick={handleClearSearch}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#75716B] hover:text-gray-900 mb-2"
                    >
                        <X size={18} />
                    </button>
                )}
                </div>

                {/* Search Results Dropdown */}
                {showDropdown && searchResults.length > 0 && (
                    <div className="absolute z-50 w-86 bg-white rounded-xl shadow-lg border border-[#DAD6D1] mt-1 max-h-96 overflow-y-auto">
                        {searchResults.map((post) => (
                            <div
                                key={post.id}
                                onClick={() => handleSelectPost(post)}
                                className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                            >
                                <div className="flex gap-3">
                                    {post.image && (
                                        <img 
                                            src={post.image} 
                                            alt={post.title}
                                            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                                        />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm text-gray-900 truncate">{post.title}</p>
                                        <p className="text-xs text-[#75716B] mt-1 line-clamp-2">{post.description}</p>
                                        <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-gray-100 rounded-full text-[#75716B]">
                                            {post.category}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <label htmlFor="lname" className="text-[#75716B] -mb-1.5 lg:hidden">Category</label>

                <Select value={category} onValueChange={(value) => handleCategoryChange(value)}>
                    <SelectTrigger className="appearance-none bg-white w-86 h-12 rounded-xl border-1 border-[#DAD6D1] shadow-none mt-2 pl-4 flex lg:hidden">
                        <SelectValue placeholder={category} />
                    </SelectTrigger>

                    <SelectContent className="bg-white rounded-xl shadow-lg border border-gray-200 mt-1">
                        <SelectItem value="Highlight" className="cursor-pointer hover:bg-gray-100 py-2 px-3
                        data-[highlighted]:bg-gray-100 
                        data-[state=checked]:bg-gray-200
                        transition-colors">
                        Highlight
                        </SelectItem>
                        <SelectItem value="Cat" className="cursor-pointer hover:bg-gray-100 py-2 px-3
                        data-[highlighted]:bg-gray-100 
                        data-[state=checked]:bg-gray-200
                        transition-colors">
                        Cat
                        </SelectItem>
                        <SelectItem value="Inspiration" className="cursor-pointer hover:bg-gray-100 py-2 px-3
                        data-[highlighted]:bg-gray-100 
                        data-[state=checked]:bg-gray-200
                        transition-colors">
                        Inspiration
                        </SelectItem>
                        <SelectItem value="General" className="cursor-pointer hover:bg-gray-100 py-2 px-3
                        data-[highlighted]:bg-gray-100 
                        data-[state=checked]:bg-gray-200
                        transition-colors">
                        General
                        </SelectItem>
                    </SelectContent>
                    </Select>
                </div>
            </div>
            </div>
            <div className='grid grid-cols-1 mx-5 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10 lg:w-300 lg:mx-auto'>
            {filteredData.map((post) => {
                const formattedDate = new Date(post.date).toLocaleDateString("en-EN", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  });
            return (
                <BlogCard 
                key={post.id}
                id={post.id}
                image={post.image}
                category={post.category}
                title={post.title}
                description={post.description}
                author={post.author}
                date={formattedDate}
            />
            )
            })}
            </div>
            {hasMore && (
                <div className="text-center mt-8 lg:mt-15">
                <button
                    onClick={handleLoadMore}
                    className="hover:text-muted-foreground font-medium underline cursor-pointer"
                >
                    View more
                </button>
                </div>
            )}
        </section>
        
    )
}

export default ArticleSection