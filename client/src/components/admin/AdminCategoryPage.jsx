import { PenSquare, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { toast } from "sonner";

export default function AdminCategoryManagementPage() {
  const navigate = useNavigate();

  const [ allCategory, setAllCategory ] = useState([]);
  const [ searchQuery, setSearchQuery ] = useState("");

  useEffect(() => {
    const fetchAllcategory = async () => {
        try {
             const response = await axios.get(
                 "/api/category/category"
             );
            console.log(response.data);
            setAllCategory(response.data.data);
        } catch (error) {
            console.error("Error fetching all category:", error);
        }
    };
  
    fetchAllcategory();
  }, []);

  // Function to handle delete category
  const handleDelete = async (categoryId, categoryName) => {
    if (!window.confirm(`Are you sure you want to delete "${categoryName}"?`)) {
      return;
    }

    try {
      await axios.delete(
        `/api/category/category/${categoryId}`,
        {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      
      toast.success("Category deleted successfully");
      // Refresh the category list
      const response = await axios.get("/api/category/category");
      setAllCategory(response.data.data);
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error(error.response?.data?.error || "Failed to delete category");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar />
      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Category management</h2>
          <Button
            className="cursor-pointer px-8 py-2 rounded-full bg-[#26231E] text-white hover:scale-102 duration-200"
            onClick={() => navigate("/admin/category-management/create")}
          >
            <PenSquare className="mr-2 h-4 w-4" /> Create category
          </Button>
        </div>

        <div className="mb-6">
          <Input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md py-3 rounded-sm placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-muted-foreground"
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-full">Category</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allCategory
              .filter((category) =>
                String(category?.name || "").toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((category, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell className="text-right flex">
                  <Button
                    className="cursor-pointer"
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/admin/category-management/edit/${category.id}`)}
                  >
                    <PenSquare className="h-4 w-4 hover:text-muted-foreground" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="cursor-pointer"
                    size="sm"
                    onClick={() => handleDelete(category.id, category.name)}
                  >
                    <Trash2 className="h-4 w-4 hover:text-muted-foreground" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </main>
    </div>
  );
}