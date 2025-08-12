// src/pages/LoginPage.jsx
import { useState, useEffect } from 'react';
import { Mail, Eye, EyeOff, Loader2, Lock } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();
  const { login, isLoggingIn, authUser } = useAuthStore();

  useEffect(() => {
    if (authUser) {
      toast.success("Logged in successfully!");
      navigate('/');
    }
  }, [authUser, navigate]);

  const validateForm = () => {
    const { email, password } = formData;
    if (!email || !password) {
      toast.error('All fields are required!');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Invalid email format');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await login(formData);
    } catch (err) {
      toast.error("Login failed. Check your credentials.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-indigo-600 mb-6 text-center">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <div className="relative">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-black"
                placeholder="you@example.com"
              />
              <Mail className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-black"
                placeholder="•••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="animate-spin size-5" />
                Logging In...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-indigo-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
