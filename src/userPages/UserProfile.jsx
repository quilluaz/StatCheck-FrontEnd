import React, { useState, useEffect } from 'react';
import Navbar from '../components/UserNavbar';
import profileImage from '../assets/lex.png';
import facebookImage from '../assets/fb.svg';
import twitterImage from '../assets/twitter.webp';
import instagramImage from '../assets/instagram.png';
import { fetchUserProfile, updateUserProfile } from '../services/userProfileApi';

function UserProfile() {
  const [userProfile, setUserProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Toggle for edit mode
  const [editableProfile, setEditableProfile] = useState({}); // Store editable data

  // Fetch user profile data on component mount
  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const response = await fetchUserProfile(1); // Example: Fetch user with ID 1
        setUserProfile(response.data);
        setEditableProfile(response.data); // Set initial editable state
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    getUserProfile();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditableProfile(userProfile); // Revert changes
  };

  const handleSaveClick = async () => {
    try {
      const response = await updateUserProfile(userProfile.userId, editableProfile);
      setUserProfile(response.data); // Update with saved data
      setIsEditing(false); // Exit edit mode
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableProfile((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  if (!userProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      <div
        className="min-h-screen flex flex-col items-center bg-cover bg-center"
        style={{ backgroundImage: `url('/images/wallpeps.png')` }}
      >
        <div className="w-full max-w-7xl bg-white rounded-lg shadow-md p-6 mt-8 flex flex-col md:flex-row items-center">
          {/* Left Side: Profile Picture and Basic Info */}
          <div className="md:w-1/3 text-center p-6 border-b md:border-b-0 md:border-r">
            <img
              src={profileImage}
              alt="User Profile"
              className="w-32 h-32 mx-auto rounded-full"
            />
            <h2 className="mt-4 text-xl font-semibold text-gray-800">{userProfile.fullName}</h2>
            <p className="text-gray-500">{userProfile.address}</p>

            {/* Social Media Links */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Social Media</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
                  <img src={facebookImage} alt="Facebook" className="w-6 h-6" />
                  <span className="text-gray-800 font-medium">Facebook</span>
                  <a href="https://facebook.com/username" className="text-blue-500 hover:underline ml-auto">
                    facebook.com/lexander
                  </a>
                </div>
                <div className="flex items-center justify-between bg-gray-100 p-2 rounded-lg">
                  <img src={twitterImage} alt="Twitter" className="w-8 h-6" />
                  <span className="text-gray-800 font-medium">Twitter</span>
                  <a href="https://twitter.com/username" className="text-blue-500 hover:underline ml-auto">
                    twitter.com/lexander
                  </a>
                </div>
                <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
                  <img src={instagramImage} alt="Instagram" className="w-6 h-6" />
                  <span className="text-gray-800 font-medium">Instagram</span>
                  <a href="https://instagram.com/username" className="text-blue-500 hover:underline ml-auto">
                    instagram.com/lexander
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Contact Info */}
          <div className="md:w-2/3 p-8">
            <h3 className="text-4xl font-semibold text-gray-700 mb-4">User Information</h3>
            <div className="space-y-8">
              {['fullName', 'email', 'phone', 'mobile', 'address'].map((field) => (
                <div className="flex items-center justify-between w-full">
                <span className="w-1/2 text-2xl text-gray-500 capitalize">{field.replace(/([A-Z])/g, ' $1')}</span>
                {isEditing ? (
                  <input
                    type="text"
                    name={field}
                    value={editableProfile[field]}
                    onChange={handleChange}
                    className="text-2xl text-gray-800 font-medium border border-gray-300 p-1 rounded w-full"
                  />
                ) : (
                  <span className="text-2xl text-gray-800 font-medium w-full">{userProfile[field]}</span>
                )}
              </div>
              ))}
              <div className="flex justify-center mt-6 space-x-4">
                {isEditing ? (
                  <>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      onClick={handleCancelClick}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      onClick={handleSaveClick}
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <button
                    className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600"
                    onClick={handleEditClick}
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
