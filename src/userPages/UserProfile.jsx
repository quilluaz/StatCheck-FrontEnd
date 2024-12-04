import React, { useState, useEffect } from "react";
import Navbar from "../components/UserNavbar";
import profileImage from "../assets/lex.png";
import facebookImage from "../assets/fb.svg";
import instagramImage from "../assets/instagram.png";
import twitterImage from "../assets/twitter.webp";
import {
  fetchCurrentUserProfile,
  updateUserProfile,
  changePassword,
} from "../services/UserAPI/UserProfileAPI";
import { useAuth } from "../contexts/AuthContext";

function UserProfile() {
  const [userProfile, setUserProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableProfile, setEditableProfile] = useState({});
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [passwordFields, setPasswordFields] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const { user } = useAuth();

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        setIsLoading(true);
        console.log("Current user:", user);
        const profileData = await fetchCurrentUserProfile();
        console.log("Full profile response:", profileData);
        setUserProfile(profileData);
        setEditableProfile(profileData);
      } catch (error) {
        console.error("Full error details:", error.response || error);
        setError(
          error.response?.data?.message || "Failed to load user profile"
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      getUserProfile();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const handleEditClick = () => {
    setIsEditing(true);
    setIsEditingPassword(false);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditableProfile(userProfile); // Revert changes
    setIsEditingPassword(false);
    // Reset password fields
    setPasswordFields({
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
  };

  const handleSaveClick = async () => {
    try {
      const updateData = {
        name: editableProfile.name,
        email: editableProfile.email,
        phoneNumber: editableProfile.phoneNumber,
        socialMediaFacebook: editableProfile.socialMediaFacebook,
        socialMediaInstagram: editableProfile.socialMediaInstagram,
        socialMediaTwitter: editableProfile.socialMediaTwitter,
        role: userProfile.role, // Preserve the existing role
      };

      const response = await updateUserProfile(userProfile.userID, updateData);

      setUserProfile(response);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error);
      alert(error.response?.data?.error || "Failed to update profile.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableProfile((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordFields((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEditPasswordClick = () => {
    setIsEditingPassword(true);
  };

  const handlePasswordSaveClick = async () => {
    // Basic client-side validation
    if (passwordFields.newPassword !== passwordFields.confirmNewPassword) {
      alert("New passwords do not match");
      return;
    }

    try {
      await changePassword({
        oldPassword: passwordFields.oldPassword,
        newPassword: passwordFields.newPassword,
        confirmNewPassword: passwordFields.confirmNewPassword,
      });

      alert("Password changed successfully!");

      // Reset password fields and exit password edit mode
      setPasswordFields({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      setIsEditingPassword(false);
    } catch (error) {
      // Handle error from backend
      alert(error.response?.data?.error || "Failed to change password");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-500 text-xl">Loading profile...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  // No user profile state
  if (!userProfile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-500 text-xl">No user profile found</div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div
        className="min-h-screen flex flex-col items-center bg-cover bg-center"
        style={{ backgroundImage: `url('/images/wallpeps.png')` }}>
        <div className="w-full max-w-7xl bg-white rounded-lg shadow-md p-6 mt-8 flex flex-col md:flex-row items-center">
          {/* Left Side: Profile Picture and Basic Info */}
          <div className="md:w-1/3 text-center p-6 border-b md:border-b-0 md:border-r">
            <img
              src={profileImage}
              alt="User Profile"
              className="w-32 h-32 mx-auto rounded-full"
            />
            <h2 className="mt-4 text-xl font-semibold text-gray-800">
              {userProfile.name}
            </h2>
            {/* Divider */}
            <hr className="my-4 border-gray-300" />

            {/* Social Media Links */}
            <div className="space-y-2">
              {/* Facebook Link */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                  <img
                    src={facebookImage}
                    alt="Facebook icon"
                    className="w-8 h-8"
                  />
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    name="socialMediaFacebook"
                    value={editableProfile.socialMediaFacebook || ""}
                    onChange={handleChange}
                    className="text-sm text-gray-800 font-medium border border-gray-300 p-1 rounded w-full"
                    placeholder="Enter your Facebook link here"
                  />
                ) : (
                  <a
                    href={userProfile.socialMediaFacebook || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-600 hover:text-blue-500">
                    {userProfile.socialMediaFacebook ||
                      "Enter your Facebook link here"}
                  </a>
                )}
              </div>

              {/* Instagram Link */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                  <img
                    src={instagramImage}
                    alt="Instagram icon"
                    className="w-8 h-8"
                  />
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    name="socialMediaInstagram"
                    value={editableProfile.socialMediaInstagram || ""}
                    onChange={handleChange}
                    className="text-sm text-gray-800 font-medium border border-gray-300 p-1 rounded w-full"
                    placeholder="Enter your Instagram link here"
                  />
                ) : (
                  <a
                    href={userProfile.socialMediaInstagram || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-600 hover:text-pink-500">
                    {userProfile.socialMediaInstagram ||
                      "Enter your Instagram link here"}
                  </a>
                )}
              </div>

              {/* Twitter Link */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                  <img
                    src={twitterImage}
                    alt="Twitter icon"
                    className="w-8 h-8"
                  />
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    name="socialMediaTwitter"
                    value={editableProfile.socialMediaTwitter || ""}
                    onChange={handleChange}
                    className="text-sm text-gray-800 font-medium border border-gray-300 p-1 rounded w-full"
                    placeholder="Enter your Twitter link here"
                  />
                ) : (
                  <a
                    href={userProfile.socialMediaTwitter || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-600 hover:text-blue-400">
                    {userProfile.socialMediaTwitter ||
                      "Enter your Twitter link here"}
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Side: Contact Info */}
          <div className="md:w-2/3 p-8">
            <h3 className="text-4xl font-semibold text-gray-700 mb-4">
              User Information
            </h3>
            <div className="space-y-8">
              {[
                { key: "name", label: "Name" },
                { key: "email", label: "Email" },
                { key: "phoneNumber", label: "Phone Number" },
              ].map(({ key, label }) => (
                <div
                  key={key}
                  className="flex items-center justify-between w-full">
                  <span className="w-1/2 text-2xl text-gray-500">{label}</span>
                  {isEditing ? (
                    <input
                      type="text"
                      name={key}
                      value={editableProfile[key] || ""}
                      onChange={handleChange}
                      className="text-2xl text-gray-800 font-medium border border-gray-300 p-1 rounded w-full"
                    />
                  ) : (
                    <span className="text-2xl text-gray-800 font-medium w-full">
                      {userProfile[key] || "Not provided"}
                    </span>
                  )}
                </div>
              ))}

              {/* Password Editing Section */}
              {isEditing && (
                <div className="mt-6">
                  {!isEditingPassword ? (
                    <button
                      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                      onClick={handleEditPasswordClick}>
                      Edit Password
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between w-full">
                        <span className="w-1/2 text-2xl text-gray-500">
                          Old Password
                        </span>
                        <input
                          type="password"
                          name="oldPassword"
                          value={passwordFields.oldPassword}
                          onChange={handlePasswordChange}
                          className="text-2xl text-gray-800 font-medium border border-gray-300 p-1 rounded w-full"
                          placeholder="Enter old password"
                        />
                      </div>
                      <div className="flex items-center justify-between w-full">
                        <span className="w-1/2 text-2xl text-gray-500">
                          New Password
                        </span>
                        <input
                          type="password"
                          name="newPassword"
                          value={passwordFields.newPassword}
                          onChange={handlePasswordChange}
                          className="text-2xl text-gray-800 font-medium border border-gray-300 p-1 rounded w-full"
                          placeholder="Enter new password"
                        />
                      </div>
                      <div className="flex items-center justify-between w-full">
                        <span className="w-1/2 text-2xl text-gray-500">
                          Confirm New Password
                        </span>
                        <input
                          type="password"
                          name="confirmNewPassword"
                          value={passwordFields.confirmNewPassword}
                          onChange={handlePasswordChange}
                          className="text-2xl text-gray-800 font-medium border border-gray-300 p-1 rounded w-full"
                          placeholder="Confirm new password"
                        />
                      </div>
                      <div className="flex justify-center mt-4 space-x-4">
                        <button
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                          onClick={() => setIsEditingPassword(false)}>
                          Cancel
                        </button>
                        <button
                          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                          onClick={handlePasswordSaveClick}>
                          Save Password
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-center mt-6 space-x-4">
                {isEditing ? (
                  <>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      onClick={handleCancelClick}>
                      Cancel
                    </button>
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      onClick={handleSaveClick}>
                      Save
                    </button>
                  </>
                ) : (
                  <button
                    className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600"
                    onClick={handleEditClick}>
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
