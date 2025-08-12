import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from './useAuthStore'

export const useChatStore = create((set, get) => ({
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    messagesByUser: {},

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/messages/users");
            set({ users: res.data })

        } catch (error) {
            toast.error(error.response.data.message);

        } finally {
            set({ isUsersLoading: false });
        }
    },

   getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
        const res = await axiosInstance.get(`/messages/${userId}`);
        set((state) => ({
            messagesByUser: { ...state.messagesByUser, [userId]: res.data }
        }));
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load messages");
    } finally {
        set({ isMessagesLoading: false });
    }
},


    sendMessage: async (messageData) => {
    const { selectedUser, messagesByUser } = get();
    try {
        const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
        set({
            messagesByUser: {
                ...messagesByUser,
                [selectedUser._id]: [
                    ...(messagesByUser[selectedUser._id] || []),
                    res.data
                ]
            }
        });
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to send");
    }
},

    subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
        if (
            newMessage.senderID === selectedUser._id ||
            newMessage.receiverID === selectedUser._id
        ) {
            set((state) => ({
                messagesByUser: {
                    ...state.messagesByUser,
                    [selectedUser._id]: [
                        ...(state.messagesByUser[selectedUser._id] || []),
                        newMessage
                    ]
                }
            }));
        }
    });
},

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },

   
    setSelectedUser: (selectedUser) => set({ selectedUser })


}))

