import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { UserType } from '../types';

const LoginPage: React.FC = () => {
  const { login, register } = useContext(AuthContext);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<UserType>(UserType.Tenant);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (mode === 'register' && !name.trim()) {
      setError('Please enter your full name.');
      return false;
    }
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validate()) {
      return;
    }
    
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password, userType);
      }
    } catch (err: any) {
      console.error("Authentication Error:", err.message);
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isLogin = mode === 'login';

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-800">
            {isLogin ? 'Welcome Back!' : 'Create an Account'}
          </h2>
          <p className="text-slate-500 mt-2">
            {isLogin ? 'Sign in to continue to To-Let Finder.' : 'Get started by creating your account.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
             <div>
              <div className="flex gap-2 rounded-lg bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => setUserType(UserType.Tenant)}
                  className={`w-full py-2 rounded-md font-semibold text-sm transition ${userType === UserType.Tenant ? 'bg-white text-primary shadow' : 'text-slate-600 hover:bg-slate-200'}`}
                >
                  I'm a Renter
                </button>
                <button
                  type="button"
                  onClick={() => setUserType(UserType.Owner)}
                  className={`w-full py-2 rounded-md font-semibold text-sm transition ${userType === UserType.Owner ? 'bg-white text-primary shadow' : 'text-slate-600 hover:bg-slate-200'}`}
                >
                  I'm a House Owner
                </button>
              </div>
            </div>
          )}
          
          {!isLogin && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-600 mb-1">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="John Doe"
                disabled={loading}
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-600 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="you@example.com"
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-600 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Min. 6 characters"
              disabled={loading}
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center bg-red-100 p-3 rounded-lg">{error}</p>}
          
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-300 disabled:bg-slate-400"
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-slate-500 mt-8">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button
            onClick={() => {
              setMode(isLogin ? 'register' : 'login');
              setError('');
            }}
            className="font-semibold text-primary hover:underline ml-2"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;