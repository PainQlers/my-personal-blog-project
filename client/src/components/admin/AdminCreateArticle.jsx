import { ImageIcon } from "lucide-react";
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
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminCreateArticlePage() {
  const navigate = useNavigate();

  const [post, setPost] = useState({
    title: "",
    description: "",
    content: "",
    category_id: null,
    status_id: null,
  });
  const [imageFile, setImageFile] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/category/category");
        setCategories(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    // ตรวจสอบประเภทของไฟล์
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

    if (!file) {
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a valid image file (JPEG, PNG, GIF, WebP).");
      return;
    }

    // ตรวจสอบขนาดของไฟล์ (เช่น ขนาดไม่เกิน 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert("The file is too large. Please upload an image smaller than 5MB.");
      return;
    }

    // เก็บข้อมูลไฟล์
    setImageFile({ file });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPost((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // ฟังก์ชันสำหรับการบันทึกข้อมูลโพสต์
  const handleSave = async (statusId) => {
    if (!imageFile) {
      alert("Please select an image file.");
      return;
    }

    // สร้าง FormData สำหรับการส่งข้อมูลแบบ multipart/form-data
    const formData = new FormData();

    // เพิ่มข้อมูลทั้งหมดลงใน FormData
    formData.append("title", post.title);
    formData.append("category_id", post.category_id);
    formData.append("description", post.description);
    formData.append("content", post.content);
    formData.append("status_id", statusId);
    formData.append("imageFile", imageFile.file); // เพิ่มไฟล์รูปภาพ

    try {
      // ส่งข้อมูลไปยัง Backend
      const response = await axios.post(
        "http://localhost:4000/api/posts",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${localStorage.getItem("token")}` // ถ้ามีการใช้ token สำหรับการยืนยันตัวตน
          },
        }
      );
      console.log(response.data);
      alert("Post created successfully!");
      navigate("/admin/article-management"); // นำทางไปยังหน้ารายการโพสต์
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content */}
      <main className="flex-1 p-8 bg-gray-50 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Create article</h2>
          <div className="space-x-2">
            <Button
            type="button" 
            onClick={() => handleSave(1)}
            className="cursor-pointer px-8 py-2 rounded-full hover:scale-102 duration-200" 
            variant="outline">
              Save as draft
            </Button>
            <Button
            type="button" 
            onClick={() => handleSave(2)}
            className="cursor-pointer px-8 py-2 rounded-full bg-[#26231E] text-white hover:scale-102 duration-200">
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
                {imageFile ? (
              <img
                src={URL.createObjectURL(imageFile.file)}
                alt="Preview"
                    className="w-full h-full object-cover"
              />
            ) : (
              <div>No image selected</div>
            )}
                </div>
              </div>
              <label
                htmlFor="file-upload"
                className="px-8 py-2 bg-background rounded-full text-foreground border border-foreground cursor-pointer hover:scale-102 duration-200"
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
            onValueChange={(value) =>
              setPost((prev) => ({ ...prev, category_id: value }))
            }
            >
              <SelectTrigger className="max-w-lg mt-1 py-3 rounded-sm text-muted-foreground focus:ring-0 focus:ring-offset-0 focus:border-muted-foreground">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-xl shadow-lg border border-gray-200 mt-1">
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
              defaultValue="Bright"
              className="mt-1 max-w-lg"
              disabled
            />
          </div>

          <div>
            <label htmlFor="title">Title</label>
            <Input
              id="title"
              name="title"
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
              placeholder="Content"
              rows={20}
              onChange={handleInputChange}
              className="mt-1 py-3 rounded-sm placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-muted-foreground"
            />
          </div>
        </form>
      </main>
    </div>
  );
}