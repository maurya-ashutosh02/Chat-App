import { useState, useEffect } from 'react';
import { Mail, Eye, EyeOff, User, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();
  const { signup, isSigningUp, authUser } = useAuthStore();

  // 🔥 Redirect if already authenticated (important for SignUp and Login pages)
  useEffect(() => {
    if (authUser) {
      toast.success("Account created successfully!");
      navigate('/');
    }
  }, [authUser, navigate]);

  const validateForm = () => {
    const { fullName, email, password } = formData;
    if (!fullName || !email || !password) {
      toast.error('All fields are required!');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Invalid email format');
      return false;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await signup({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      });
      // just sign up, redirect will happen via useEffect
    } catch (err) {
      toast.error("Signup failed. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-indigo-600 mb-6 text-center">Create Account</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-1">Full Name</label>
            <div className="relative">
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-black"
                placeholder="Ashutosh Maurya"
              />
              <User className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>

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
            disabled={isSigningUp}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSigningUp ? (
              <>
                <Loader2 className="animate-spin size-5" />
                Signing Up...
              </>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
