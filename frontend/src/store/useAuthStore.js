import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "react-hot-toast";
import {io} from "socket.io-client"

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000":"/app"
    ;
export const useAuthStore = create((set,get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers:[],
  socket:null,

  // Check if user is already logged in (used on app load)
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data.user });
       get().connectSocket();
    } catch (error) {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // Sign up a new user
  signup: async (data) => {
    try {
      set({ isSigningUp: true });
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data.user });
      get().connectSocket();
    } catch (error) {
      set({ authUser: null });
      throw error; // Let the component handle toast
    } finally {
      set({ isSigningUp: false });
    }
  },
  login: async (data) => {
    try {
      set({ isLoggingIn: true });
      const res = await axiosInstance.post("/auth/login", data);
      console.log("✅ Login Success:", res.data);
      set({ authUser: res.data.user }); // 👈 Make sure this matches what your backend sends
      get().connectSocket();
    } catch (error) {
      console.error("❌ Login Error:", error.response?.data || error.message);
      set({ authUser: null });
      toast.error(error?.response?.data?.message || "Login failed. Try again.");
      throw error;
    } finally {
      set({ isLoggingIn: false });
    }
  },


  //logout
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully!");
      get().disconnectSocket();
    } catch (error) {
      toast.error("Logout failed. Please try again.")

    }

  },

  //updateProfile
  updateProfile: async ({profilePic}) => {
  try {
    set({ isUpdatingProfile: true });

    const token = localStorage.getItem("token");
    const res = await axiosInstance.put("/auth/update-profile", { profilePic }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    set((state) => ({
      authUser: { ...state.authUser, profilePic: res.data.profilePic },
      isUpdatingProfile: false,
    }));
  } catch (err) {
    console.error("Update error:", err.message);
    toast.error("Failed to update profile.");
    set({ isUpdatingProfile: false });
  }
},

connectSocket:()=>{
  const {authUser}=get()
  if(!authUser || get().socket?.connected) return;
  const socket = io(BASE_URL,{
    query:{
      userId:authUser._id
    }
  });
  socket.connect();
  set({socket:socket})
  socket.on("getOnlineUsers",(userIds)=>{
    set({onlineUsers:userIds})
  })
},
disconnectSocket:()=>{
  if(get().socket?.connected) get().socket.disconnect();
},

}));
