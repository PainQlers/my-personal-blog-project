import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { AdminSidebar } from "@/components/AdminWebSection";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

export default function AdminEditCategoryPage() {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/category/category/${categoryId}`
        );
        setCategoryName(response.data.data.name);
      } catch (error) {
        console.error("Error fetching category:", error);
        toast.error("Failed to load category");
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId]);

  const handleSave = async () => {
    if (!categoryName.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      await axios.put(
        `http://localhost:4000/api/category/category/${categoryId}`,
        { name: categoryName },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      
      toast.success("Category updated successfully");
      navigate("/admin/category-management");
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error(error.response?.data?.error || "Failed to update category");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:4000/api/category/category/${categoryId}`,
        {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      
      toast.success("Category deleted successfully");
      navigate("/admin/category-management");
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error(error.response?.data?.error || "Failed to delete category");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <AdminSidebar />
        <main className="flex-1 p-8 bg-gray-50 overflow-auto">
          <p>Loading...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar />
      {/* Main content */}
      <main className="flex-1 p-8 bg-gray-50 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Edit Category</h2>
          <Button 
            className="px-8 py-2 rounded-full"
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
        <div className="space-y-7 max-w-md">
          <div className="relative">
            <label
              htmlFor="category-name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category Name
            </label>
            <Input
              id="category-name"
              type="text"
              placeholder="Category name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="mt-1 py-3 rounded-sm placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-muted-foreground"
            />
          </div>
        </div>
        <button 
          onClick={handleDelete}
          className="underline underline-offset-2 hover:text-muted-foreground text-sm font-medium flex items-center gap-1 mt-6"
        >
          <Trash2 className="h-5 w-5" />
          Delete Category
        </button>
      </main>
    </div>
  );
}