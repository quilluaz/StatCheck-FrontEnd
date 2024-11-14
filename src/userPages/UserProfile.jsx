import React from 'react';
import Navbar from '../components/UserNavbar';
import profileImage from '../assets/lex.png';
import facebookImage from '../assets/fb.svg';
import twitterImage from '../assets/twitter.webp';
import instagramImage from '../assets/lex.png';

function UserProfile() {
  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex flex-col items-center">
        
      <div className="w-full max-w-7xl bg-white rounded-lg shadow-md p-6 mt-8 flex flex-col md:flex-row items-center">
          
          {/* Left Side: Profile Picture and Basic Info */}
          <div className="md:w-1/3 text-center p-6 border-b md:border-b-0 md:border-r">
            <img
              src={profileImage} // Profile image path
              alt="User Profile"
              className="w-32 h-32 mx-auto rounded-full"
            />
            <h2 className="mt-4 text-xl font-semibold text-gray-800">LeXander</h2>
            <p className="text-gray-600">Full Stack Developer</p>
            <p className="text-gray-500">Tisa, Cebu City, Cebu, PH</p>
            <div className="flex justify-center mt-4 space-x-3">
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Follow</button>
              <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300">Message</button>
            </div>

            {/* Social Media Links */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Social Media</h3>
              <div className="space-y-2">
                {/* Each platform box */}
                <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
                  <img src={facebookImage} alt="Facebook" className="w-6 h-6" />
                  <span className="text-gray-800 font-medium">Facebook</span>
                  <a href="https://facebook.com/username" className="text-blue-500 hover:underline ml-auto">
                    facebook.com/lexander
                  </a>
                </div>
                <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
                  <img src={twitterImage} alt="Twitter" className="w-6 h-6" />
                  <span className="text-gray-800 font-medium">Twitter</span>
                  <a href="https://facebook.com/username" className="text-blue-500 hover:underline ml-auto">
                    twitter.com/lexander
                  </a>
                </div>
                <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
                  <img src="/path-to-icon/instagram.png" alt="Instagram" className="w-6 h-6" />
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
            <h3 className="text-lg font-semibold text-gray-700 mb-4">User Information</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Full Name</span>
                <span className="text-gray-800 font-medium">Kenneth Valdez</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Email</span>
                <span className="text-gray-800 font-medium">fip@jukmuh.al</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Phone</span>
                <span className="text-gray-800 font-medium">(239) 816-9029</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Mobile</span>
                <span className="text-gray-800 font-medium">(320) 380-4539</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Address</span>
                <span className="text-gray-800 font-medium">Bay Area, San Francisco, CA</span>
              </div>
              <div className="flex justify-center mt-6">
                <button className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600">
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
