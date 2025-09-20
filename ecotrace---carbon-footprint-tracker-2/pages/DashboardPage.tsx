
import React, { useState, useEffect, useCallback, ChangeEvent } from 'react';
import Navigation from '../components/Navigation';
import { useAuth } from '../hooks/useAuth';
import { calculateCarbonFootprint, generateTips } from '../utils/carbonCalculator';
import { Activities, Emissions } from '../types';
import { TrendingUp, Target, Award, Car, Home, Utensils } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { transportOptions, homeTypeOptions, heatingTypeOptions, electricitySourceOptions, dietTypeOptions, foodWasteOptions, mealRatioOptions } from '../constants';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activities>(() => {
    const saved = localStorage.getItem(`ecotrace_activities_${user?.uid}`);
    return saved ? JSON.parse(saved) : {};
  });

  const [emissions, setEmissions] = useState<Emissions>({ transport: 0, energy: 0, food: 0 });

  useEffect(() => {
    if (user?.uid) {
      const newEmissions = calculateCarbonFootprint(activities);
      setEmissions(newEmissions);
      localStorage.setItem(`ecotrace_activities_${user.uid}`, JSON.stringify(activities));
    }
  }, [activities, user?.uid]);

  const tips = generateTips(emissions);
  const total = emissions.transport + emissions.energy + emissions.food;

  const handleActivityChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setActivities(prev => ({ ...prev, [name]: value }));
  }, []);

  const pieData = [
    { name: 'Transport', value: emissions.transport },
    { name: 'Energy', value: emissions.energy },
    { name: 'Food', value: emissions.food },
  ].filter(item => item.value > 0);
  const COLORS = ['#3b82f6', '#ec4899', '#8b5cf6'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Carbon Footprint Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">Track and analyze your daily environmental impact.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard icon={TrendingUp} title="Today's Impact" value={`${total.toFixed(1)} kg`} color="blue" description="Daily carbon footprint" />
            <StatCard icon={Target} title="vs US Average" value={`${total < 44 ? '-' : '+'}${Math.abs(total - 44).toFixed(1)} kg`} color="pink" isGood={total < 44} description="Compared to US daily avg (44kg)" />
            <StatCard icon={Award} title="Impact Level" value={total < 20 ? 'Excellent' : total < 35 ? 'Good' : total < 50 ? 'Average' : 'High'} color="purple" description="Environmental rating" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Daily Activity Tracker</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ActivitySection icon={Car} title="Transport" color="blue">
                  <ActivitySelect name="transport_method" label="Commute Method" value={activities.transport_method || 'car_gas'} options={transportOptions} onChange={handleActivityChange} />
                  <ActivityInput name="commute_distance" label="Daily Commute (km)" type="number" placeholder="e.g., 20" value={activities.commute_distance || ''} onChange={handleActivityChange} />
                  <ActivityInput name="flights_month" label="Flights (per month)" type="number" placeholder="e.g., 1" value={activities.flights_month || ''} onChange={handleActivityChange} />
              </ActivitySection>
              <ActivitySection icon={Home} title="Home Energy" color="pink">
                  <ActivitySelect name="home_type" label="Home Type" value={activities.home_type || 'small_house'} options={homeTypeOptions} onChange={handleActivityChange} />
                  <ActivitySelect name="heating_type" label="Heating" value={activities.heating_type || 'gas'} options={heatingTypeOptions} onChange={handleActivityChange} />
                  <ActivitySelect name="electricity_source" label="Electricity" value={activities.electricity_source || 'grid'} options={electricitySourceOptions} onChange={handleActivityChange} />
              </ActivitySection>
              <ActivitySection icon={Utensils} title="Food & Diet" color="purple">
                  <ActivitySelect name="diet_type" label="Diet" value={activities.diet_type || 'moderate_meat'} options={dietTypeOptions} onChange={handleActivityChange} />
                  <ActivitySelect name="food_waste" label="Food Waste" value={activities.food_waste || 'medium'} options={foodWasteOptions} onChange={handleActivityChange} />
                  <ActivitySelect name="meal_ratio" label="Meal Source" value={activities.meal_ratio || 'half_half'} options={mealRatioOptions} onChange={handleActivityChange} />
              </ActivitySection>
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Daily Breakdown</h3>
              {total > 0 ? (
                <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                {pieData.map((_entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                            <Tooltip formatter={(value: number) => `${value.toFixed(1)} kg`} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-60 flex items-center justify-center text-gray-500 dark:text-gray-400">
                    <p>Enter activities to see your breakdown.</p>
                </div>
              )}
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Personalized Tips</h3>
              <div className="space-y-4">
                {tips.length > 0 ? tips.map((tip, index) => (
                  <div key={index} className="p-4 rounded-lg bg-gray-100 dark:bg-gray-700">
                    <p className="font-semibold text-gray-800 dark:text-gray-200">{tip.tip}</p>
                    <div className="flex justify-between text-xs mt-2 text-gray-500 dark:text-gray-400">
                        <span>Impact: <span className="font-bold">{tip.impact}</span></span>
                        <span>Difficulty: <span className="font-bold">{tip.difficulty}</span></span>
                    </div>
                  </div>
                )) : <p className="text-gray-500 dark:text-gray-400">Your tips will appear here once you add activities.</p>}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};


// Sub-components for DashboardPage
interface StatCardProps {
    icon: React.ElementType;
    title: string;
    value: string;
    color: 'blue' | 'pink' | 'purple';
    description: string;
    isGood?: boolean;
}
const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, color, description, isGood }) => {
    const colors = {
        blue: { bg: 'from-blue-400 to-blue-600', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-100 dark:border-blue-900/30' },
        pink: { bg: 'from-pink-400 to-pink-600', text: 'text-pink-600 dark:text-pink-400', border: 'border-pink-100 dark:border-pink-900/30' },
        purple: { bg: 'from-purple-400 to-purple-600', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-100 dark:border-purple-900/30' },
    };
    const valueColor = isGood !== undefined ? (isGood ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400') : 'text-gray-900 dark:text-white';

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border-2 ${colors[color].border}`}>
            <div className="flex items-center justify-between mb-2">
                <div className={`w-12 h-12 bg-gradient-to-br ${colors[color].bg} rounded-full flex items-center justify-center`}>
                    <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                    <p className={`text-sm font-semibold ${colors[color].text} uppercase tracking-wide`}>{title}</p>
                    <p className={`text-3xl font-bold ${valueColor}`}>{value}</p>
                </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
    );
};

interface ActivitySectionProps {
    icon: React.ElementType;
    title: string;
    color: 'blue' | 'pink' | 'purple';
    children: React.ReactNode;
}
const ActivitySection: React.FC<ActivitySectionProps> = ({ icon: Icon, title, color, children }) => {
    const colors = {
        blue: 'text-blue-500',
        pink: 'text-pink-500',
        purple: 'text-purple-500',
    };
    return (
        <div className="space-y-4">
            <div className={`flex items-center space-x-2 ${colors[color]}`}>
                <Icon className="h-6 w-6" />
                <h3 className="text-lg font-semibold">{title}</h3>
            </div>
            <div className="space-y-3">{children}</div>
        </div>
    );
};

interface ActivityInputProps {
    name: keyof Activities;
    label: string;
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const ActivityInput: React.FC<ActivityInputProps> = ({ name, label, ...props }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
        <input id={name} name={name} {...props} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white" />
    </div>
);

interface ActivitySelectProps {
    name: keyof Activities;
    label: string;
    value: string;
    options: { value: string; label: string }[];
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}
const ActivitySelect: React.FC<ActivitySelectProps> = ({ name, label, value, options, onChange }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
        <select id={name} name={name} value={value} onChange={onChange} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white">
            {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
    </div>
);

export default DashboardPage;
