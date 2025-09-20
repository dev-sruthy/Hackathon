
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart3, Target, Award, TrendingUp, Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 text-gray-800 dark:text-gray-200">
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-pink-500 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">EcoTrace</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </button>
              <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 font-medium hidden sm:block">Sign In</Link>
              <Link to="/register" className="bg-gradient-to-r from-blue-500 to-pink-500 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-200">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <section className="pt-32 pb-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent mb-6 leading-tight">
              Track Your Carbon Footprint
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10">
              Understand, reduce, and offset your environmental impact with our comprehensive carbon tracking platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/register')}
                className="bg-gradient-to-r from-blue-500 to-pink-500 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                Get Started Free
              </button>
              <button
                onClick={() => navigate('/login')}
                className="border-2 border-blue-500 text-blue-500 dark:border-blue-400 dark:text-blue-400 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
              >
                Sign In
              </button>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white dark:bg-gray-900/50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-16">Why Choose EcoTrace?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard icon={BarChart3} title="Detailed Analytics" description="Get comprehensive insights into your carbon emissions across all categories." color="blue" />
              <FeatureCard icon={Target} title="Personalized Goals" description="Set and track achievable targets to reduce your environmental impact." color="pink" />
              <FeatureCard icon={Award} title="Community Challenges" description="Join others in collective efforts to make a bigger impact together." color="purple" />
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-r from-blue-500 to-pink-500 text-white">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-3xl font-bold mb-6">Ready to Reduce Your Carbon Footprint?</h2>
            <p className="text-xl mb-10 opacity-90">Join thousands of users already making a difference with EcoTrace.</p>
            <button
              onClick={() => navigate('/register')}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              Start Your Journey Today
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

interface FeatureCardProps {
    icon: React.ElementType;
    title: string;
    description: string;
    color: 'blue' | 'pink' | 'purple';
}
const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, color }) => {
    const colorClasses = {
        blue: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' },
        pink: { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-600 dark:text-pink-400' },
        purple: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400' },
    }
    return (
        <div className="text-center p-6">
            <div className={`w-16 h-16 ${colorClasses[color].bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <Icon className={`h-8 w-8 ${colorClasses[color].text}`} />
            </div>
            <h3 className="text-xl font-semibold mb-2 dark:text-white">{title}</h3>
            <p className="text-gray-600 dark:text-gray-300">{description}</p>
        </div>
    );
};

export default LandingPage;
