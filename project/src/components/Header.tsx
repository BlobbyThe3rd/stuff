import React from 'react';
import { HandPlatter as Translate } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 shadow-lg">
      <div className="container mx-auto p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Translate className="h-8 w-8 text-cyan-400" />
          <h1 className="text-xl md:text-2xl font-bold">Derisian Translator</h1>
        </div>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                GitHub
              </a>
            </li>
            <li>
              <a 
                href="#about" 
                className="text-gray-300 hover:text-white transition-colors"
              >
                About
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;