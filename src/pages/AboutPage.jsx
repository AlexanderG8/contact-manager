import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Github, Linkedin, Globe, Code, Heart, Star, Users, Zap } from 'lucide-react';

export default function AboutPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Users,
      title: 'Contact Management',
      description: 'Complete CRUD operations with advanced search and filtering capabilities'
    },
    {
      icon: Heart,
      title: 'Favorites System',
      description: 'Mark and organize your most important contacts with ease'
    },
    {
      icon: Zap,
      title: 'Real-time Validation',
      description: 'Instant feedback with smart form validation and error handling'
    },
    {
      icon: Code,
      title: 'Modern Architecture',
      description: 'Built with React 19, Tailwind CSS, and modern development practices'
    }
  ];

  const technologies = [
    { name: 'React 19', color: 'text-blue-400' },
    { name: 'Tailwind CSS', color: 'text-cyan-400' },
    { name: 'Vite', color: 'text-purple-400' },
    { name: 'JavaScript ES6+', color: 'text-yellow-400' },
    { name: 'React Router', color: 'text-red-400' },
    { name: 'Lucide Icons', color: 'text-green-400' }
  ];

  return (
    <div className="min-h-screen w-full bg-[#020617] relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "#020617",
          backgroundImage: `
            linear-gradient(to right, rgba(71,85,105,0.15) 1px, transparent 1px), 
            linear-gradient(to bottom, rgba(71,85,105,0.15) 1px, transparent 1px), 
            radial-gradient(circle at 50% 60%, rgba(236,72,153,0.15) 0%, rgba(168,85,247,0.05) 40%, transparent 70%)
          `,
          backgroundSize: "40px 40px, 40px 40px, 100% 100%",
        }}
      />
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumbs */}
            <nav className="mb-6 text-sm">
              <ol className="flex items-center space-x-2 text-slate-400">
                <li>
                  <button 
                    onClick={() => navigate('/')}
                    className="hover:text-white transition-colors"
                  >
                    Home
                  </button>
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="text-white font-medium">About</span>
                </li>
              </ol>
            </nav>

            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Contact Manager
              </h1>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                A modern, intuitive contact management application built with cutting-edge technologies 
                to help you organize and manage your personal and professional contacts efficiently.
              </p>
            </div>

            {/* Features Grid */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-8 text-center">
                Key Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div 
                      key={index}
                      className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-200"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-2">
                            {feature.title}
                          </h3>
                          <p className="text-slate-400 leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Technologies */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-8 text-center">
                Built With
              </h2>
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                <div className="flex flex-wrap justify-center gap-4">
                  {technologies.map((tech, index) => (
                    <div 
                      key={index}
                      className="bg-slate-700/50 px-4 py-2 rounded-lg border border-slate-600/50 hover:bg-slate-700/70 transition-colors"
                    >
                      <span className={`font-medium ${tech.color}`}>
                        {tech.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Developer Info */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-8 text-center">
                Developer
              </h2>
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl font-bold text-white">AG</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Alexander Gomez
                  </h3>
                  <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
                    Full Stack Developer passionate about creating modern, user-friendly applications 
                    with clean code and exceptional user experiences.
                  </p>
                  
                  {/* Social Links */}
                  <div className="flex justify-center space-x-4">
                    <a 
                      href="https://github.com/AlexanderG8" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 rounded-lg flex items-center justify-center transition-colors group"
                    >
                      <Github className="w-5 h-5 text-slate-400 group-hover:text-white" />
                    </a>
                    <a 
                      href="https://www.linkedin.com/in/marcello-alexander-gomez-gomez-130587268/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 rounded-lg flex items-center justify-center transition-colors group"
                    >
                      <Linkedin className="w-5 h-5 text-slate-400 group-hover:text-blue-400" />
                    </a>
                    <a 
                      href="https://alexanderg8.github.io/my-portfolio-web/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 rounded-lg flex items-center justify-center transition-colors group"
                    >
                      <Globe className="w-5 h-5 text-slate-400 group-hover:text-green-400" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Stats */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-8 text-center">
                Project Highlights
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Code className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">React 19</h3>
                  <p className="text-slate-400">Latest React version with modern hooks</p>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Fast</h3>
                  <p className="text-slate-400">Optimized performance with Vite</p>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Star className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Modern</h3>
                  <p className="text-slate-400">Clean UI with Tailwind CSS</p>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-pink-500/20 to-purple-600/20 border border-pink-500/30 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Ready to Manage Your Contacts?
                </h2>
                <p className="text-slate-300 mb-6">
                  Start organizing your contacts with our intuitive and powerful contact management system.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => navigate('/contacts')}
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                  >
                    View Contacts
                  </button>
                  <button
                    onClick={() => navigate('/contacts/new')}
                    className="bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                  >
                    Add New Contact
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
}