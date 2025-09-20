
import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center items-center space-x-3 mb-6">
                    <Link to="/" className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-pink-500 rounded-full flex items-center justify-center">
                            <TrendingUp className="h-7 w-7 text-white" />
                        </div>
                        <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">EcoTrace</span>
                    </Link>
                </div>
                <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">{title}</h2>
                <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-200 dark:border-gray-700">
                    {children}
                </div>
            </div>

            <div className="absolute top-4 right-4">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                </button>
            </div>
        </div>
    );
};

export default AuthLayout;
