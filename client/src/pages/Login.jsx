import { useState } from 'react';
import { Chrome, Github, Facebook } from 'lucide-react';

export default function Login() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const oauth = [
    {
      label: 'Google',
      url: 'http://localhost:4081/auth/google',
      icon: Chrome,
      gradient: 'from-red-500 via-yellow-500 to-green-500'
    },
    {
      label: 'GitHub',
      url: 'http://localhost:4081/auth/github',
      icon: Github,
      gradient: 'from-gray-700 via-gray-800 to-black'
    },
    {
      label: 'Facebook',
      url: 'http://localhost:4081/auth/facebook',
      icon: Facebook,
      gradient: 'from-blue-500 via-blue-600 to-blue-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 -top-48 -left-48 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute w-96 h-96 -top-48 -right-48 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute w-96 h-96 -bottom-48 left-1/2 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-block mb-4 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 blur-2xl opacity-50 animate-pulse-slow"></div>
            <h1 className="relative text-7xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-gradient">
              Image Search Pro
            </h1>
          </div>
          <p className="text-slate-300 text-lg mt-4 animate-slide-up">
            Discover stunning images with powerful AI search
          </p>
        </div>

        <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 shadow-2xl border border-white/20 animate-scale-in">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Sign in to continue
          </h2>

          <div className="space-y-4">
            {oauth.map((provider, index) => {
              const Icon = provider.icon;
              return (
                <a
                  key={provider.label}
                  href={provider.url}
                  className="block relative group"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{
                    animationDelay: `${index * 150}ms`
                  }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${provider.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-all duration-500 transform group-hover:scale-110`}></div>

                  <div className={`relative flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r ${provider.gradient} text-white font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border-2 border-white/30 hover:border-white/50`}>
                    <div className={`transform transition-all duration-300 ${hoveredIndex === index ? 'rotate-[360deg] scale-110' : ''}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="relative">
                      Continue with {provider.label}
                    </span>
                    <div className={`absolute inset-0 bg-white/20 rounded-2xl transform transition-all duration-300 ${hoveredIndex === index ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}></div>
                  </div>
                </a>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <p className="text-slate-400 text-sm">
              By signing in, you agree to our Terms & Privacy Policy
            </p>
          </div>
        </div>

        <div className="mt-8 text-center animate-bounce-slow">
          <div className="inline-flex items-center gap-2 text-slate-400 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
            <span>Secure authentication powered by OAuth 2.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
