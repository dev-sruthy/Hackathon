
import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import { useAuth } from '../hooks/useAuth';
import { calculateCarbonFootprint, generateHistoricalData } from '../utils/carbonCalculator';
import { Activities, Emissions, WeeklyData } from '../types';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const InsightsPage: React.FC = () => {
    const { user } = useAuth();
    const [activities, setActivities] = useState<Activities>(() => {
        const saved = localStorage.getItem(`ecotrace_activities_${user?.uid}`);
        return saved ? JSON.parse(saved) : {};
    });

    const [emissions, setEmissions] = useState<Emissions>(calculateCarbonFootprint(activities));
    const [weeklyData, setWeeklyData] = useState<WeeklyData[]>(generateHistoricalData(emissions));

    useEffect(() => {
        const newEmissions = calculateCarbonFootprint(activities);
        setEmissions(newEmissions);
        setWeeklyData(generateHistoricalData(newEmissions));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activities, user?.uid]);

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
                        Emission Insights
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">Visualize your carbon footprint trends and breakdown.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <ChartCard title="Weekly Trend">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={weeklyData}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                                <XAxis dataKey="day" className="text-xs" />
                                <YAxis className="text-xs" />
                                <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(2px)' }}/>
                                <Legend />
                                <Line type="monotone" dataKey="total" stroke="#8884d8" activeDot={{ r: 8 }} name="Total (kg)" />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    <ChartCard title="Today's Breakdown">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    <ChartCard title="Weekly Category Breakdown" className="lg:col-span-2">
                         <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={weeklyData}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                                <XAxis dataKey="day" className="text-xs" />
                                <YAxis className="text-xs" />
                                <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(2px)' }} />
                                <Legend />
                                <Bar dataKey="transport" stackId="a" fill={COLORS[0]} name="Transport" />
                                <Bar dataKey="energy" stackId="a" fill={COLORS[1]} name="Energy" />
                                <Bar dataKey="food" stackId="a" fill={COLORS[2]} name="Food" />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </div>
            </main>
        </div>
    );
};

interface ChartCardProps {
    title: string;
    children: React.ReactNode;
    className?: string;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, children, className = "" }) => (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 ${className}`}>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">{title}</h3>
        {children}
    </div>
);

export default InsightsPage;
