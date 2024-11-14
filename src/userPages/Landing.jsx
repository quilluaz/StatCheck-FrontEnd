import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import polygridBg from '../assets/polygridBg.svg';

export default function LandingPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (isLogin) {
      console.log('Login submitted:', { email, password });
      setTimeout(() => {
        setIsLoading(false);
        navigate('/home');
      }, 1000);
    } else {
      console.log('Signup submitted:', { name, email, password, phone });
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  return (
    <div
      className="w-full min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${polygridBg})`
      }}
    >
      <div className="container mx-auto min-h-screen flex items-center justify-center px-4">
        <div className="bg-black bg-opacity-70 rounded-lg shadow-xl p-8 w-full max-w-md">
          <h2 className="text-3xl font-bold text-center text-white mb-4">
            {isLogin ? 'Welcome Back!' : 'Create an Account'}
          </h2>
          <p className="text-center text-gray-300 mb-8">
            {isLogin ? 'Login to your account' : 'Sign up to get started'}
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                  Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    required
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3" // Added py-3 for height
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3" // Added py-3 for height
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3" // Added py-3 for height
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash className="h-5 w-5 text-gray-400" /> : <FaEye className="h-5 w-5 text-gray-400" />}
                </div>
              </div>
            </div>
            {!isLogin && (
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
                  Phone Number
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    required
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3" // Added py-3 for height
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
            )}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-black rounded-md shadow-sm text-sm font-medium text-white bg-[#8a333b] hover:bg-opacity-90 focus:outline-none"
              >
                {isLoading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
              </button>
            </div>
          </form>
          <div className="mt-6">
            <p className="text-center text-sm text-gray-300">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                className="ml-1 font-medium text-[#8a333b] hover:text-opacity-90" // Updated color to #8a333b
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
