import { Link } from 'react-router-dom';
import { FaLinkedin, FaGithub, FaInstagram, FaFacebook } from "react-icons/fa";

const Footer = () => (
    <footer className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 border-t border-white/10">
        <div className="container mx-auto px-4 py-8">
           
            <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="text-center md:text-left mb-4 md:mb-0">
                    <p className="text-gray-400 text-sm">
                        &copy; 2025 MovieReviewSystem. All rights reserved.
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                        Designed by Hanumant Pisal for movie lover's !!!
                    </p>
                </div>
                
                <div className="flex items-center space-x-4">
                    <a 
                        href="https://www.linkedin.com/in/hanumant-pisal-5111a2236/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-pink-400 transition-colors duration-300 text-xl"
                    >
                        <FaLinkedin />
                    </a>
                    <a 
                        href="https://github.com/Hanumant-Pisal" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-pink-400 transition-colors duration-300 text-xl"
                    >
                        <FaGithub />
                    </a>
                    <a 
                        href="https://www.instagram.com/software_engg96/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-pink-400 transition-colors duration-300 text-xl"
                    >
                        <FaInstagram />
                    </a>
                    <a 
                        href="https://www.facebook.com/hanumant.pisal.79?locale=hi_IN" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-pink-400 transition-colors duration-300 text-xl"
                    >
                        <FaFacebook />
                    </a>
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;
