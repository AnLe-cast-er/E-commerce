import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Title from "../components/Title";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        
        console.log("🔐 Fetching profile with token:", !!token);
        
        if (!token) {
          toast.error("Please login first");
          return;
        }

        const { data } = await axios.get(`${backendUrl}/api/user/profile`, {
          headers: { 
            Authorization: `Bearer ${token}`, 
            Accept: "application/json" 
          },
        });

        console.log("✅ Profile data:", data);

        if (data.success) {
          setUser(data.user);
          setFormData({
            name: data.user.name,
            email: data.user.email,
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        }
      } catch (error) {
        console.error("❌ Error fetching profile:", error);
        console.error("Error response:", error.response?.data);
        
        if (error.response?.status === 401) {
          toast.error("Session expired. Please login again");
          localStorage.removeItem("token");
        } else {
          toast.error("Failed to load profile data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        toast.error("Please login first");
        return;
      }

      const { data } = await axios.put(
        `${backendUrl}/api/user/profile`,
        {
          name: formData.name,
          email: formData.email,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`, 
            Accept: "application/json", 
            "Content-Type": "application/json"
          },
        }
      );

      console.log("✅ Update response:", data);

      if (data.success) {
        setUser(data.user);
        setIsEditing(false);
        setFormData({
          ...formData,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      console.error("Error response:", error.response?.data);
      
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again");
        localStorage.removeItem("token");
      } else if (error.response?.status === 422) {

        const errors = error.response.data.errors;
        if (errors) {
          Object.values(errors).flat().forEach(err => toast.error(err));
        } else {
          toast.error(error.response.data.message || "Validation failed");
        }
      } else {
        toast.error(error.response?.data?.message || "Failed to update profile");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <Title text1="MY" text2="PROFILE" />
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        {!isEditing ? (
          <div className="space-y-6">
            <div className="flex items-center justify-center mb-8">
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-4xl text-gray-600">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-gray-600">Name</label>
                <p className="text-lg font-medium">{user.name}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-600">Email</label>
                <p className="text-lg font-medium">{user.email}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-600">Member Since</label>
                <p className="text-lg font-medium">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(true)}
              className="mt-8 w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>
            </div>

            <div className="border-t pt-6 mt-6">
              <h3 className="text-lg font-medium mb-4">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
