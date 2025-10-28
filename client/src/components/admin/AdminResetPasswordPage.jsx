import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminSidebar } from "@/components/AdminWebSection";
import { useState } from "react";
import { X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import axios from "axios";

export default function AdminResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [valid, setValid] = useState({
    password: true,
    newPassword: true,
    confirmNewPassword: true,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValidPassword = password.trim() !== "";
    const isValidNewPassword = newPassword.trim() !== "";
    const isValidConfirmPassword =
      confirmNewPassword.trim() !== "" && confirmNewPassword === newPassword;

    setValid({
      password: isValidPassword,
      newPassword: isValidNewPassword,
      confirmNewPassword: isValidConfirmPassword,
    });

    if (isValidPassword && isValidNewPassword && isValidConfirmPassword) {
      setIsDialogOpen(true);
    }
  };

  const handleResetPassword = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please log in again.");
      }

      const response = await axios.put(
        "http://localhost:4000/api/auth/reset-password",
        {
          oldPassword: password,
          newPassword: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.message === "Password updated successfully") {
        toast.custom((t) => (
          <div className="bg-green-500 text-white p-4 rounded-sm flex justify-between items-start">
            <div>
              <h2 className="font-bold text-lg mb-1">Reset!</h2>
              <p className="text-sm">
                Password reset successful. You can now log in with your new
                password.
              </p>
            </div>
            <button
              onClick={() => toast.dismiss(t)}
              className="text-white hover:text-gray-200"
            >
              <X size={20} />
            </button>
          </div>
        ));
        
        // Reset form
        setPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error("Reset password error:", error);
      const errorMessage = error.response?.data?.error || error.message || "Failed to reset password";
      toast.custom((t) => (
        <div className="bg-red-500 text-white p-4 rounded-sm flex justify-between items-start">
          <div>
            <h2 className="font-bold text-lg mb-1">Error!</h2>
            <p className="text-sm">{errorMessage}</p>
          </div>
          <button
            onClick={() => toast.dismiss(t)}
            className="text-white hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>
      ));
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar />
      {/* Main content */}
      <main className="flex-1 p-8 bg-gray-50 overflow-auto">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Reset Password</h2>
            <Button 
              type="submit"
              className="cursor-pointer px-8 py-2 rounded-full bg-[#26231E] text-white hover:scale-102 duration-200" 
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </div>

          <div className="space-y-7 max-w-md">
          <div className="relative">
            <label
              htmlFor="current-password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Current password
            </label>
            <Input
              id="current-password"
              type="password"
              placeholder="Current password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`mt-1 py-3 rounded-sm placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-muted-foreground ${
                !valid.password ? "border-red-500" : ""
              }`}
            />
            {!valid.password && (
              <p className="text-red-500 text-xs absolute mt-1">
                This field is required
              </p>
            )}
          </div>
          <div className="relative">
            <label
              htmlFor="new-password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              New password
            </label>
            <Input
              id="new-password"
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`mt-1 py-3 rounded-sm placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-muted-foreground ${
                !valid.newPassword ? "border-red-500" : ""
              }`}
            />
            {!valid.newPassword && (
              <p className="text-red-500 text-xs absolute mt-1">
                Password must be at least 8 characters
              </p>
            )}
          </div>
          <div className="relative">
            <label
              htmlFor="confirm-new-password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm new password
            </label>
            <Input
              id="confirm-new-password"
              type="password"
              placeholder="Confirm new password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className={`mt-1 py-3 rounded-sm placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-muted-foreground ${
                !valid.confirmNewPassword ? "border-red-500" : ""
              }`}
            />
            {!valid.confirmNewPassword && (
              <p className="text-red-500 text-xs absolute mt-1">
                Passwords do not match
              </p>
            )}
          </div>
          </div>
        </form>
      </main>
      <ResetPasswordModal
        dialogState={isDialogOpen}
        setDialogState={setIsDialogOpen}
        resetFunction={handleResetPassword}
        isLoading={isLoading}
      />
    </div>
  );
}

function ResetPasswordModal({ dialogState, setDialogState, resetFunction, isLoading }) {
  return (
    <AlertDialog open={dialogState} onOpenChange={setDialogState}>
      <AlertDialogContent className="bg-white rounded-md pt-16 pb-6 max-w-[22rem] sm:max-w-md flex flex-col items-center">
        <AlertDialogTitle className="text-3xl font-semibold pb-2 text-center">
          Reset password
        </AlertDialogTitle>
        <AlertDialogDescription className="flex flex-row mb-2 justify-center font-medium text-center text-muted-foreground">
          Do you want to reset your password?
        </AlertDialogDescription>
        <div className="flex flex-row gap-4">
          <button
            onClick={() => setDialogState(false)}
            disabled={isLoading}
            className="px-10 py-4 rounded-full text-gray-700 bg-gray-100 hover:bg-gray-200 border-2 border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={resetFunction}
            disabled={isLoading}
            className="rounded-full text-white bg-[#26231E] hover:bg-[#3a3530] transition-colors py-4 text-lg px-10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Resetting..." : "Reset"}
          </button>
        </div>
        <AlertDialogCancel disabled={isLoading} className="absolute right-4 top-2 sm:top-4 p-1 border-none">
          <X className="h-6 w-6" />
        </AlertDialogCancel>
      </AlertDialogContent>
    </AlertDialog>
  );
}