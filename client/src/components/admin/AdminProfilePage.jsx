import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AdminSidebar } from "@/components/AdminWebSection";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "../../context/Authentication";
import anonymous from "../img/anonymous.webp";

export default function AdminProfilePage() {
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    username: "",
    email: "",
    bio: "",
    profilePic: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  const { fetchUser } = useAuth();

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/auth/get-user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // เก็บ bio จาก localStorage ถ้ามี (key: `user_bio_${userId}` หรือ `author_bio` ถ้าเป็น admin)
      const userId = response.data.id;
      const isAdmin = response.data.role === 'admin';
      const savedBio = localStorage.getItem(`user_bio_${userId}`) 
                      || (isAdmin ? localStorage.getItem('author_bio') : '')
                      || "";
      
      setProfileData({
        name: response.data.name || "",
        username: response.data.username || "",
        email: response.data.email || "",
        bio: response.data.bio || savedBio || "",
        profilePic: response.data.profilePic || anonymous,
      });
      setPreview(response.data.profilePic || anonymous);
    } catch (error) {
      console.error("Error fetching profile data:", error);
      toast.error("Failed to fetch profile data");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      
      // ดึง userId จาก auth state หรือ localStorage
      const authResponse = await axios.get("/api/auth/get-user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userId = authResponse.data.id;
      
      const formData = new FormData();
      formData.append("name", profileData.name);
      formData.append("username", profileData.username);
      
      // ไม่ส่ง bio ไปที่ API แต่เก็บใน localStorage แทน
      if (selectedFile) {
        formData.append("profilePicFile", selectedFile);
      }

      await axios.put(
        "/api/auth/update-profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // เก็บ bio ใน localStorage แยกตาม userId
      localStorage.setItem(`user_bio_${userId}`, profileData.bio);
      
      // ถ้า user เป็น admin ให้เก็บ bio ใน author_bio ด้วย (เพื่อแสดงในหน้า Home)
      if (authResponse.data.role === 'admin') {
        localStorage.setItem('author_bio', profileData.bio);
      }

      // refresh global auth state and cache author avatar for public areas
      try {
        const refreshed = await axios.get("/api/auth/get-user", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const pic = refreshed?.data?.profilePic || refreshed?.data?.profile_pic || null;
        if (pic) {
          localStorage.setItem('author_profile_pic', pic);
        }
        // update global auth context so NavbarUser and others re-render
        fetchUser?.();
      } catch { /* no-op */ }

      toast.success("Profile updated successfully!", {
        duration: 3000,
      });
      
      // Refresh profile data
      await fetchProfileData();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.error || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Get initials for avatar fallback
  const getInitials = () => {
    return profileData.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar />
      {/* Main content */}
      <main className="flex-1 p-8 bg-gray-50 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Profile</h2>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="cursor-pointer px-8 py-2 rounded-full bg-[#26231E] text-white disabled:opacity-50 hover:scale-102 duration-200"
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>

        <div>
          <div className="flex items-center mb-6">
            <Avatar className="w-24 h-24 mr-4">
              <AvatarImage src={preview || anonymous} alt="Profile picture" />
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <Button variant="outline" onClick={handleUploadClick}>
              Upload profile picture
            </Button>
          </div>

          <form className="space-y-7 max-w-2xl" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name">Name</label>
              <Input
                id="name"
                name="name"
                value={profileData.name}
                onChange={handleInputChange}
                className="mt-1 py-3 rounded-sm placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-muted-foreground"
              />
            </div>
            <div>
              <label htmlFor="username">Username</label>
              <Input
                id="username"
                name="username"
                value={profileData.username}
                onChange={handleInputChange}
                className="mt-1 py-3 rounded-sm placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-muted-foreground"
              />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <Input
                id="email"
                name="email"
                type="email"
                value={profileData.email}
                disabled
                className="mt-1 py-3 rounded-sm bg-gray-200 placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-muted-foreground"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Email cannot be changed
              </p>
            </div>
            <div>
              <label htmlFor="bio">Bio</label>
              <Textarea
                id="bio"
                name="bio"
                value={profileData.bio}
                onChange={handleInputChange}
                rows={10}
                className="mt-1 py-3 rounded-sm placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-muted-foreground"
                placeholder="Tell us about yourself..."
              />
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}