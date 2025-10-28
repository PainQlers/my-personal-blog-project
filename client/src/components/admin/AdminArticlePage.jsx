import { PenSquare, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminSidebar } from "@/components/AdminWebSection";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

export default function AdminArticleManagementPage() {
  const navigate = useNavigate();

  const [ allPosts, setAllPosts ] = useState([]);
  const [ allCategory, setAllCategory ] = useState([]);
  const [ allStatus, setAllStatus ] = useState([]);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const fetchAllPosts = async () => {
        try {
            const response = await axios.get(
                "http://localhost:4000/api/posts",
                {
                    params: {
                        page: 1,
                        limit: 100 // ดึงข้อมูลจำนวนมากสำหรับค้นหา
                    }
                }
            );
            console.log(response.data.data);
            setAllPosts(response.data.data);
        } catch (error) {
            console.error("Error fetching all posts:", error);
        }
    };
  
    fetchAllPosts();
  }, []);
  
  // Filter logic
  const filteredPosts = allPosts.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || article.statuses?.status === selectedStatus;
    const matchesCategory = selectedCategory === "all" || article.categories?.name === selectedCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  useEffect(() => {
    const fetchAllCategory = async () => {
        try {
            const response = await axios.get(
                "http://localhost:4000/api/category/category"
            );
            console.log(response.data.data);
            setAllCategory(response.data.data);
        } catch (error) {
            console.error("Error fetching all posts:", error);
        }
    };
  
    fetchAllCategory();
  }, []);

  useEffect(() => {
    const fetchsetAllStatus = async () => {
        try {
            const response = await axios.get(
                "http://localhost:4000/api/posts/status"
            );
            console.log(response.data.data);
            setAllStatus(response.data.data);
        } catch (error) {
            console.error("Error fetching all posts:", error);
        }
    };
  
    fetchsetAllStatus();
  }, []);
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Article management</h2>
          <Button
            className="cursor-pointer px-8 py-2 rounded-full bg-[#26231E] text-white hover:scale-102 duration-200"
            onClick={() => navigate("/admin/article-management/create")}
          >
            <PenSquare color="white" className="mr-2 h-4 w-4" /> Create article
          </Button>
        </div>

        <div className="flex space-x-4 mb-6">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3 rounded-sm placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-muted-foreground"
            />
          </div>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[180px] py-3 rounded-sm text-muted-foreground focus:ring-0 focus:ring-offset-0 focus:border-muted-foreground">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-white rounded-xl shadow-lg border border-gray-200 mt-1">
              <SelectItem
              value="all">All Status</SelectItem>
              {allStatus.map((status) => (
                <SelectItem key={status.id} value={status.status}>
                  {status.status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px] py-3 rounded-sm text-muted-foreground focus:ring-0 focus:ring-offset-0 focus:border-muted-foreground">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-white rounded-xl shadow-lg border border-gray-200 mt-1">
              <SelectItem value="all">All Category</SelectItem>
              {allCategory.map((category) => (
                <SelectItem key={category.id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50%]">Article title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPosts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  No articles found matching your filters
                </TableCell>
              </TableRow>
            ) : (
              filteredPosts.map((article, index) => (
                <TableRow key={article.id || index}>
                  <TableCell className="font-medium">{article.title}</TableCell>
                  <TableCell>{article.categories?.name}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      {article.statuses?.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/article-management/edit/${article.id}`)}>
                      <PenSquare className="h-4 w-4 hover:text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4 hover:text-muted-foreground" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </main>
    </div>
  );
}