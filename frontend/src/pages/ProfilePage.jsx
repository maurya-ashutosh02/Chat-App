import React, { useRef } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Camera, Mail, User } from 'lucide-react';

const ProfilePage = () => {


  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const fileInputRef = useRef();

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64Image = reader.result; // this is what you need
      await updateProfile({ profilePic: base64Image }); // send to backend
    };

    if (file) {
      reader.readAsDataURL(file); // IMPORTANT: must read as DataURL
    }
  };
  const formattedJoinDate = authUser?.createdAt
    ? new Date(authUser.createdAt).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    : "Unknown";
  return (
    <div className='h-screen pt-20'>
      <div className='max-w-2xl mx-auto p-4 py-8'>
        <div className='bg-base-300 rounded-xl p-6 space-y-8'>
          <div className='text-center'>
            <h1 className='text-2xl font-semibold'>Profile</h1>
            <p className='mt-2'>Your Profile Information</p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="relative w-24 h-24">
              <img
                src={authUser.profilePic || "/default-avatar.png"}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-indigo-500"
              />
              <label
                htmlFor="avatar-upload"
                className="absolute -bottom-2 -right-2 bg-indigo-600 p-1 rounded-full cursor-pointer hover:bg-indigo-700"
              >
                <Camera className="w-4 h-4 text-white" />
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                  className="hidden"
                  ref={fileInputRef}
                />
              </label>
            </div>
            <p className='text-sm text-zinc-400'>
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>

          {/* Profile Info */}
          <div className='space-y-6'>
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <User className='size-4' />
              <p className='px-4 py-2.5 bg-base-200 rounded-lg border text-white'>
                {authUser?.fullName}
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Mail className='size-4' />
              <p className='px-4 py-2.5 bg-base-200 rounded-lg border text-white'>
                {authUser?.email}
              </p>
            </div>
          </div>
          <div className='mt-6 bg-base-300 rounded-xl p-6'>
            <h2 className='text-lg font-medium mb-4' > Account Information</h2>
            <div className='space-y-3 text-sm'>
              <div className='flex items-center justify-between py-2 border-b border-zinc-700 '>
                <span>Member Since</span>
                <span className='text-green-500'>{formattedJoinDate}</span>

              </div>
              <div className='flex items-center justify-between py-2'>
                <span>  Account Status</span>
                <span className='text-green-500'>Active</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
