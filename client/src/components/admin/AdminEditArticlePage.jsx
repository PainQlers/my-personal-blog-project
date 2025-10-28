import { ImageIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminSidebar } from "@/components/AdminWebSection";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

export default function AdminEditArticlePage() {
  const navigate = useNavigate();
  const { postId } = useParams();

  const [post, setPost] = useState({
    title: "",
    description: "",
    content: "",
    category_id: null,
    status_id: null,
    image: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);

  // Fetch current post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/api/posts/${postId}`);
        const postData = response.data.data;
        setPost({
          title: postData.title || "",
          description: postData.description || "",
          content: postData.content || "",
          category_id: postData.category_id || null,
          status_id: postData.status_id || null,
          image: postData.image || "",
        });
        setImagePreview(postData.image);
      } catch (error) {
        console.error("Error fetching post:", error);
        toast.error("Failed to load article");
      }
    };
    fetchPost();
  }, [postId]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/category/category");
        setCategories(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch statuses
  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const response = await axios.get("/api/posts/status");
        setStatuses(response.data.data);
      } catch (error) {
        console.error("Error fetching statuses:", error);
      }
    };
    fetchStatuses();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

    if (!file) {
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a valid image file (JPEG, PNG, GIF, WebP).");
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("The file is too large. Please upload an image smaller than 5MB.");
      return;
    }

    setImageFile({ file });
    setImagePreview(URL.createObjectURL(file));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPost((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Function to update post
  const handleSave = async (statusId) => {
    try {
      // Validate required fields
      if (!post.title || !post.description || !post.content || !post.category_id) {
        toast.error("Please fill in all required fields");
        return;
      }

      const updateData = {
        title: post.title,
        category_id: parseInt(post.category_id),
        description: post.description,
        content: post.content,
        status_id: statusId,
        image: post.image,
      };

      const response = await axios.put(
        `/api/posts/${postId}`,
        updateData,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          },
        }
      );
      
      console.log(response.data);
      toast.success("Post updated successfully!");
      navigate("/admin/article-management");
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error(error.response?.data?.error || "Failed to update post. Please try again.");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content */}
      <main className="flex-1 p-8 bg-gray-50 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Edit article</h2>
          <div className="space-x-2">
            <Button
              type="button"
              onClick={() => handleSave(1)}
              className="px-8 py-2 rounded-full"
              variant="outline"
            >
              Save as draft
            </Button>
            <Button
              type="button"
              onClick={() => handleSave(2)}
              className="px-8 py-2 rounded-full"
            >
              Save and publish
            </Button>
          </div>
        </div>

        <form className="space-y-7 max-w-4xl">
          <div>
            <label
              htmlFor="thumbnail"
              className="block text-gray-700 font-medium mb-2"
            >
              Thumbnail image
            </label>
            <div className="flex items-end space-x-4">
              <div className="flex justify-center items-center w-full max-w-lg h-64 px-6 py-20 border-2 border-gray-300 border-dashed rounded-md bg-gray-50 overflow-hidden">
                <div className="text-center space-y-2">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="mx-auto h-8 w-8 text-gray-400" />
                  )}
                </div>
              </div>
              <label
                htmlFor="file-upload"
                className="px-8 py-2 bg-background rounded-full text-foreground border border-foreground hover:border-muted-foreground hover:text-muted-foreground transition-colors cursor-pointer"
              >
                <span>Upload thumbnail image</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="category">Category</label>
            <Select
              value={post.category_id?.toString() || ""}
              onValueChange={(value) =>
                setPost((prev) => ({ ...prev, category_id: value }))
              }
            >
              <SelectTrigger className="max-w-lg mt-1 py-3 rounded-sm text-muted-foreground focus:ring-0 focus:ring-offset-0 focus:border-muted-foreground">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="author">Author name</label>
            <Input
              id="author"
              defaultValue="Thompson P."
              className="mt-1 max-w-lg"
              disabled
            />
          </div>

          <div>
            <label htmlFor="title">Title</label>
            <Input
              id="title"
              name="title"
              value={post.title}
              placeholder="Article title"
              onChange={handleInputChange}
              className="mt-1 py-3 rounded-sm placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-muted-foreground"
            />
          </div>

          <div>
            <label htmlFor="introduction">Introduction (max 120 letters)</label>
            <Textarea
              id="description"
              name="description"
              value={post.description}
              placeholder="Introduction"
              rows={3}
              className="mt-1 py-3 rounded-sm placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-muted-foreground"
              maxLength={120}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="content">Content</label>
            <Textarea
              id="content"
              name="content"
              value={post.content}
              placeholder="Content"
              rows={20}
              onChange={handleInputChange}
              className="mt-1 py-3 rounded-sm placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-muted-foreground"
            />
          </div>
        </form>
        <button className="underline underline-offset-2 hover:text-muted-foreground text-sm font-medium flex items-center gap-1 mt-4">
          <Trash2 className="h-5 w-5" />
          Delete article
        </button>
      </main>
    </div>
  );
}