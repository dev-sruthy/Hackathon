
import React from 'react';
import Navigation from '../components/Navigation';
import { useAuth } from '../hooks/useAuth';
import { User as UserIcon, Mail, Calendar, Edit3 } from 'lucide-react';

const ProfilePage: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navigation />
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent mb-2">
                        My Profile
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">Manage your account settings and personal information.</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col md:flex-row items-center md:space-x-8">
                        <div className="relative mb-6 md:mb-0">
                            <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-pink-400 rounded-full flex items-center justify-center text-white">
                                <UserIcon size={64} />
                            </div>
                            <button className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 p-2 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-600">
                                <Edit3 size={16} className="text-gray-600 dark:text-gray-300" />
                            </button>
                        </div>
                        <div className="flex-grow text-center md:text-left">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{user?.name}</h2>
                            <p className="text-gray-500 dark:text-gray-400">Eco-Enthusiast</p>
                            <div className="mt-6 space-y-4">
                                <InfoItem icon={Mail} text={user?.email || ''} />
                                <InfoItem icon={Calendar} text={`Joined on ${new Date(user?.createdAt || Date.now()).toLocaleDateString()}`} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

interface InfoItemProps {
    icon: React.ElementType;
    text: string;
}
const InfoItem: React.FC<InfoItemProps> = ({ icon: Icon, text }) => (
    <div className="flex items-center justify-center md:justify-start space-x-3 text-gray-600 dark:text-gray-300">
        <Icon className="h-5 w-5 text-blue-500" />
        <span>{text}</span>
    </div>
);


export default ProfilePage;
