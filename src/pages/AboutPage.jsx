import React from 'react';
import { FaLinkedin, FaGithub, FaInstagram, FaFacebook, FaCode, FaHeart, FaRocket, FaStar } from 'react-icons/fa';

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    {/* Hero Section */}
                    <div className="text-center mb-16">
                        <div className="w-32 h-32 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                            <span className="text-6xl text-white font-bold">H</span>
                        </div>
                        <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">
                            Hanumant Pisal
                        </h1>
                        <p className="text-2xl text-gray-300 mb-6">Software Engineer & Tech Enthusiast</p>
                        <div className="flex items-center justify-center space-x-6">
                            <a href="https://www.linkedin.com/in/hanumant-pisal-5111a2236/" target="_blank" rel="noopener noreferrer" 
                               className="text-gray-400 hover:text-pink-400 transition-colors duration-300 text-2xl">
                                <FaLinkedin />
                            </a>
                            <a href="https://github.com/Hanumant-Pisal" target="_blank" rel="noopener noreferrer"
                               className="text-gray-400 hover:text-pink-400 transition-colors duration-300 text-2xl">
                                <FaGithub />
                            </a>
                            <a href="https://www.instagram.com/software_engg96/" target="_blank" rel="noopener noreferrer"
                               className="text-gray-400 hover:text-pink-400 transition-colors duration-300 text-2xl">
                                <FaInstagram />
                            </a>
                            <a href="https://www.facebook.com/hanumant.pisal.79?locale=hi_IN" target="_blank" rel="noopener noreferrer"
                               className="text-gray-400 hover:text-pink-400 transition-colors duration-300 text-2xl">
                                <FaFacebook />
                            </a>
                        </div>
                    </div>

                    {/* About Section */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-xl mb-12">
                        <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                            <FaHeart className="text-pink-500 mr-3" />
                            About Me
                        </h2>
                        <div className="text-gray-300 leading-relaxed space-y-6">
                            <p className="text-lg">
                              Hi, I'm Hanumant Pisal, 
                                a passionate <span className="text-violet-400 font-semibold">Software Engineer </span> with a <span className="text-pink-400 font-semibold">B.Tech in Computer Science Engineering </span> 
                                who believes in the power of cinema to inspire, entertain, and bring people together.
                            </p>
                            <p>
                                As a <span className="text-green-400 font-semibold">Full Stack Developer specializing in MERN Stack</span> (MongoDB, Express.js, React, Node.js), 
                                I'm passionate about creating innovative solutions that solve real-world problems. My technical expertise spans across 
                                modern web technologies, and I have a deep love for <span className="text-blue-400 font-semibold">problem-solving</span> and 
                                <span className="text-yellow-400 font-semibold"> learning new technologies</span>.
                            </p>
                            <p>
                                Beyond this movie platform, I've developed several impactful projects including a comprehensive 
                                <span className="text-cyan-400 font-semibold"> Learning Management System (LMS)</span> for educational institutions 
                                and <span className="text-emerald-400 font-semibold">ConnectAI Healthcare</span> - an AI-powered healthcare solution 
                                that bridges the gap between patients and medical professionals. Each project reflects my commitment to 
                                leveraging technology for meaningful impact.
                            </p>
                            <p>
                                As a movie enthusiast myself, I understand the struggle of finding the perfect movie to watch or discovering 
                                what others think about a film before investing your time. That's why I created this platform - to build a 
                                community where movie lovers can share their thoughts, discover new films, and connect over their shared passion. 
                                Every feature has been carefully crafted with both technical excellence and user experience in mind.
                            </p>
                        </div>
                    </div>

                    {/* Platform Features */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-xl mb-12">
                        <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                            <FaRocket className="text-violet-500 mr-3" />
                            Platform Features
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-gradient-to-br from-pink-500/10 to-violet-500/10 rounded-xl p-6 border border-pink-500/20">
                                <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                                    <FaStar className="text-yellow-400 mr-2" />
                                    Movie Reviews & Ratings
                                </h3>
                                <p className="text-gray-300">
                                    Share your thoughts and rate movies with our intuitive review system. Help others discover great films!
                                </p>
                            </div>
                            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-6 border border-blue-500/20">
                                <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                                    <span className="text-blue-400 mr-2">📋</span>
                                    Personal Watchlist
                                </h3>
                                <p className="text-gray-300">
                                    Keep track of movies you want to watch with your personalized watchlist feature.
                                </p>
                            </div>
                            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-6 border border-green-500/20">
                                <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                                    <span className="text-green-400 mr-2">🔍</span>
                                    Advanced Search
                                </h3>
                                <p className="text-gray-300">
                                    Find movies easily with our powerful search functionality powered by OMDB API.
                                </p>
                            </div>
                            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20">
                                <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                                    <span className="text-purple-400 mr-2">👥</span>
                                    Community Driven
                                </h3>
                                <p className="text-gray-300">
                                    Join a community of movie lovers and discover films through shared experiences.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Tech Stack */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-xl mb-12">
                        <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                            <FaCode className="text-green-500 mr-3" />
                            Built With
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">⚛️</span>
                                </div>
                                <h3 className="text-white font-semibold mb-2">Frontend</h3>
                                <p className="text-gray-400 text-sm">React, Redux Toolkit, Tailwind CSS</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">🚀</span>
                                </div>
                                <h3 className="text-white font-semibold mb-2">Backend</h3>
                                <p className="text-gray-400 text-sm">Node.js, Express.js, MongoDB</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">🎬</span>
                                </div>
                                <h3 className="text-white font-semibold mb-2">API</h3>
                                <p className="text-gray-400 text-sm">OMDB API, RESTful Services</p>
                            </div>
                        </div>
                    </div>

                    {/* Mission Statement */}
                    <div className="bg-gradient-to-r from-pink-500/10 to-violet-500/10 rounded-2xl p-8 border border-pink-500/20 text-center">
                        <h2 className="text-3xl font-bold text-white mb-4">My Mission</h2>
                        <p className="text-xl text-gray-300 leading-relaxed">
                            "To create a platform where movie lovers can connect, share their passion, and discover amazing films together. 
                            Because every great movie deserves to be shared, and every movie lover deserves a community."
                        </p>
                        <div className="mt-6">
                            <span className="text-pink-400 font-semibold">- Hanumant Pisal</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
