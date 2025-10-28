import Navbar from "./Navbar"
import Footer from "./Footer"
import Catimage from './img/cat_img.jpg'
import Heroimage from './img/hero-img.png'
import { Smile, Facebook, Linkedin, Twitter, Copy } from 'lucide-react';
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react";
import { toast } from "sonner"
import { useAuth } from "../context/Authentication"
import NavbarUser from "./NavbarUser"
import { Link } from "react-router-dom";

function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState("");
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const { isAuthenticated, state } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `/api/posts/${id}`
        );
          console.log(response.data);
          // local API returns { data: post }
          setPost(response.data?.data || {})
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    }
    fetchPosts();
    const fetchComments = async () => {
      try {
        const res = await axios.get('/api/comments', {
          params: { post_id: id }
        });
        setComments(res?.data?.data || []);
      } catch (err) {
        console.error('Error fetching comments:', err);
      }
    }
    fetchComments();
    // init liked state from localStorage
    const key = `liked_post_${id}`;
    const stored = localStorage.getItem(key);
    setLiked(stored === 'true');
  }, [id])

  function formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  const handleCopyLink = async () => {
    const currentUrl = window.location.href;
    await navigator.clipboard.writeText(currentUrl);
  };

  const facebookShare = () => {
    const currentUrl = window.location.href;
    const shareUrl = `https://www.facebook.com/share.php?u=${encodeURIComponent(currentUrl)}`;
    window.open(
      shareUrl,
      "_blank",
      "width=600,height=400,scrollbars=yes"
    );
  };

  const linkedinShare = () => {
    const currentUrl = window.location.href;
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
    window.open(
      shareUrl,
      "_blank",
      "width=600,height=400,scrollbars=yes"
    );
  };

  const twitterShare = () => {
    const currentUrl = window.location.href;
    const shareUrl = `https://www.twitter.com/share?&url=${encodeURIComponent(currentUrl)}`;
    window.open(
      shareUrl,
      "_blank",
      "width=600,height=400,scrollbars=yes"
    );
  };

  const displayLikes = (post && (post.likes_count ?? post.likes)) || 0;

  const toggleLike = async () => {
    try {
      const nextAction = liked ? 'unlike' : 'like';
      // optimistic update
      const optimistic = Math.max(0, Number(displayLikes) + (nextAction === 'like' ? 1 : -1));
      setPost(prev => ({ ...(prev || {}), likes_count: optimistic }));
      setLiked(!liked);
      localStorage.setItem(`liked_post_${id}`,'true' === localStorage.getItem(`liked_post_${id}`) ? (!liked).toString() : (!liked).toString());

      const res = await axios.patch(`/api/posts/${id}/likes`, { action: nextAction });
      if (res?.data?.data?.likes_count !== undefined) {
        setPost(prev => ({ ...(prev || {}), likes_count: res.data.data.likes_count }));
      }
    } catch (err) {
      console.error('Toggle like error:', err);
      // revert on error
      setLiked(prev => !prev);
      setPost(prev => ({ ...(prev || {}), likes_count: displayLikes }));
    }
  }

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (!isAuthenticated) {
      toast.error("Please log in to comment.");
      return;
    }

    const token = localStorage.getItem('token');
    const currentUser = state?.user || {};
    const optimistic = {
      id: `temp_${Date.now()}`,
      post_id: id,
      user_id: 'me',
      comment_text: commentText.trim(),
      created_at: new Date().toISOString(),
      user: {
        id: currentUser.id,
        username: currentUser.username || currentUser.name || 'Me',
        profile_pic: currentUser.profilePic || currentUser.profile_pic || null,
      },
      _optimistic: true,
    };

    setIsSubmittingComment(true);
    setComments((prev) => [...prev, optimistic]);
    setCommentText("");

    try {
      const res = await axios.post(
        '/api/comments',
        { post_id: id, comment_text: optimistic.comment_text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const saved = res?.data?.data;
      if (saved) {
        setComments((prev) => prev.map((c) => (c.id === optimistic.id ? saved : c)));
      }
    } catch (err) {
      console.error('Post comment error:', err);
      toast.error("Failed to post comment.");
      setComments((prev) => prev.filter((c) => c.id !== optimistic.id));
      setCommentText(optimistic.comment_text);
    } finally {
      setIsSubmittingComment(false);
    }
  }

    return (
      <>
        {isAuthenticated ? <NavbarUser /> : <Navbar />}
        <div className="lg:flex lg:flex-col">
          <img
            className="w-[100vh] h-[30vh] object-cover mx-auto lg:max-h-[70vh] lg:h-auto lg:w-[165vh] lg:rounded-2xl lg:object-center lg:mt-[6vh]"
            src={post.image}
            alt=""
          />
          <div className="lg:flex lg:flex-row">
            <div>
            <div className="flex gap-10 p-[2.5vh] lg:px-[16vh] lg:mt-[1vh] lg:pt-10">
            <p className="text-[#12B279] bg-[#D7F2E9]">{post.category}</p>
            <p className="text-[#75716B]">{formatDate(post.date)}</p>
          </div>
          <p className="text-2xl px-[2.5vh] font-semibold lg:px-[16vh] lg:text-6xl lg:leading-17">
          {post.title}
          </p>
          <p className="p-[2.5vh] lg:px-[16vh] text-[#43403B]">
            <div className="markdown">
            <ReactMarkdown>
              {post.content}
          </ReactMarkdown>
            </div>
          </p>
            </div>
          <div className="flex flex-col m-[2.5vh] bg-[#EFEEEB] lg:mr-[16vh] lg:mt-[10vh] lg:h-fit lg:w-[40vh]">
            <div className="flex flex-row gap-[2vh] p-[2.5vh]">
              <img
                className="object-cover w-[7vh] h-[7vh] rounded-4xl"
                src={Heroimage}
                alt=""
              />
              <div>
                <p className="text-xs text-[#75716B]">Author</p>
                <p className="text-lg font-semibold text-[#43403B]">Bright</p>
              </div>
            </div>
            <div className="flex justify-center lg:w-[40vh]">
                <hr className="border-t border-gray-300 my-1 mx-auto w-[45vh] lg:w-[35vh]" />
            </div>
            <p className="p-[2.5vh] text-[#75716B]">
                I am a pet enthusiast and freelance writer who specializes in
                animal behavior and care. With a deep love for cats, I enjoy
                sharing insights on feline companionship and wellness. When i’m
                not writing, I spends time volunteering at my local animal
                shelter, helping cats find loving homes.
              </p>
          </div>
        </div>
          </div>
        {/* ปุ่ม like & link */}
        <div className="bg-[#EFEEEB] my-[8vh] pt-1 lg:ml-[16vh] lg:mr-[74vh] lg:flex lg:justify-between lg:px-[2vh]" >
          {isAuthenticated ? (
            <Button
              onClick={toggleLike}
              className={`cursor-pointer flex mx-auto h-[8vh] w-[48vh] rounded-4xl m-[2.5vh] hover:bg-gray-300 hover:scale-101 duration-200 bg-white items-center justify-center gap-2 text-md lg:w-[16vh] lg:h-[5.5vh] lg:mx-0 ${liked ? 'border-gray-400' : ''}`}
              variant="outline"
            >
              <Smile absoluteStrokeWidth={true} strokeWidth={1.5}/>{displayLikes}
            </Button>
          ) : (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="cursor-pointer flex mx-auto h-[8vh] w-[48vh] rounded-4xl m-[2.5vh] bg-white items-center justify-center gap-2 text-md lg:w-[16vh] lg:h-[5.5vh] lg:mx-0 hover:bg-gray-300 hover:scale-101 duration-200"
                variant="outline">
                  <Smile absoluteStrokeWidth={true} strokeWidth={1.5}/>{displayLikes}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white max-w-md mx-auto">
                <AlertDialogHeader>
                <AlertDialogCancel className="border-0 self-end cursor-pointer"><X size={52} /></AlertDialogCancel>
                  <AlertDialogTitle className="text-center text-4xl font-semibold">Create an account to continue</AlertDialogTitle>
                  <Button variant="outline" className="cursor-pointer mx-auto bg-black text-white rounded-3xl text-lg my-[1vh] h-[6.5vh] lg:h-[5vh]">
                  <Link to="/signup">
                    Create account
                    </Link>
                    </Button>
                  <AlertDialogDescription className="text-center mt-[1vh]">
                    Already have an account? <Link to="/login" className="font-semibold underline cursor-pointer">Log in</Link>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
            <div className="flex justify-center gap-1">
                <Button 
                className="cursor-pointer flex bg-white border-2 border-gray-400 hover:bg-gray-300 hover:scale-101 duration-200 h-[8vh] w-[22vh] mt-4 rounded-4xl items-center justify-center gap-2 text-md lg:w-[25vh] lg:h-[6vh] lg:mt-6.5"
                onClick={() => {
                  handleCopyLink(); // คัดลอกลิงก์ก่อน
                  toast.success("Your post link has been copied to clipboard.", {
                    variant: "success",   // ใช้สี success จาก theme
                    actionLabel: "X",     // ปุ่ม close
                    onAction: () => {},   // callback เมื่อกด X
                  });
                }}
                >
                    <Copy strokeWidth={1.5}/><p>Copy Link</p>
                </Button>
                <div className="flex w-[25vh] lg:w-[21vh]">
                <button onClick={facebookShare}
                className="cursor-pointer flex bg-[#1877F2] mx-auto h-[7.5vh] w-[7.5vh] rounded-4xl m-[2.5vh] items-center justify-center gap-2 lg:h-[6vh] lg:w-[6vh] hover:scale-102 duration-200">
                    <Facebook stroke={1} size={35} fill="white"/>
                </button>
                <button onClick={linkedinShare}
                className="cursor-pointer flex bg-[#0077B5] mx-auto h-[7.5vh] w-[7.5vh] rounded-4xl m-[2.5vh] items-center justify-center gap-2 lg:h-[6vh] lg:w-[6vh] hover:scale-102 duration-200">
                    <Linkedin stroke={1} size={32} fill="white"/>
                </button>
                <button onClick={twitterShare}
                className="cursor-pointer flex bg-[#55ACEE] mx-auto h-[7.5vh] w-[7.5vh] rounded-4xl m-[2.5vh] items-center justify-center gap-2 lg:h-[6vh] lg:w-[6vh] hover:scale-102 duration-200">
                    <Twitter stroke={1} size={35} fill="white"/>
                </button>
                </div>
            </div>
        </div>
        <form className="flex flex-col mx-[2.5vh] items-start lg:px-[16vh] lg:pr-[71vh]" onSubmit={handleSubmitComment}>
            <p className="mb-[1vh]">Comment</p>
            <textarea className="border-1 border-gray-300 rounded-xl h-[15vh] w-[50vh] mx-auto items-start align-top text-left placeholder:text-left p-2 lg:mx-0 lg:w-[105vh]"
             name="comment" id="comment" placeholder="What are your thoughts?" value={commentText} onChange={(e) => setCommentText(e.target.value)}>

             </textarea>
            <Button disabled={isSubmittingComment} className="cursor-pointer bg-[#26231E] text-md text-semibold text-white w-[15vh] h-[7vh] rounded-3xl mt-[2vh] lg:h-[5.5vh] lg:self-end hover:scale-102 duration-200">{isSubmittingComment ? 'Sending...' : 'Send'}</Button>
        </form>
        <div className="flex flex-col m-[2.5vh] lg:px-[16vh] lg:pr-[71vh]">
          {comments.map((c) => (
            <div key={c.id} className="mb-[2vh]">
              <div className="flex flex-row gap-[2vh] p-[1vh]">
                <img
                  className="object-cover w-[6vh] h-[6vh] rounded-4xl"
                  src={
                    (c?.user?.profile_pic || c?.user?.profilePic) ||
                    ((state?.user && c?.user?.id && state.user.id === c.user.id) ? (state.user.profilePic || state.user.profile_pic) : null) ||
                    Heroimage
                  }
                  alt=""
                />
                <div>
                  <p className="text-lg font-semibold text-[#43403B]">{c?.user?.username || 'Unknown'}</p>
                  <p className="text-xs text-[#75716B]">{new Date(c.created_at).toLocaleString()}</p>
                </div>
              </div>
              <p className="p-[2.5vh] text-[#75716B] whitespace-pre-wrap">{c.comment_text}</p>
              <div className="flex justify-center lg:w-[102vh]">
                <hr className="border-t border-gray-300 my-1 mx-auto w-[45vh] lg:w-[100vh]" />
              </div>
            </div>
          ))}
        </div>
        <Footer />
      </>
    );
}

export default PostPage
