import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import { useAuth } from '../hooks/useAuth';
import { Target, CheckCircle, PlusCircle, Trash2 } from 'lucide-react';

interface Goal {
    id: number;
    text: string;
    category: 'Transport' | 'Energy' | 'Food';
    completed: boolean;
}

const suggestedGoals: Omit<Goal, 'id' | 'completed'>[] = [
    { text: 'Use public transport or carpool twice a week', category: 'Transport' },
    { text: 'Reduce thermostat by 2°F for a week', category: 'Energy' },
    { text: 'Have a meatless day once a week', category: 'Food' },
    { text: 'Combine errands into one trip this week', category: 'Transport' },
    { text: 'Unplug phantom-load electronics for a week', category: 'Energy' },
    { text: 'Plan meals to reduce food waste this week', category: 'Food' },
];

const GoalsPage: React.FC = () => {
    const { user } = useAuth();
    const [goals, setGoals] = useState<Goal[]>(() => {
        if (!user) return [];
        const savedGoals = localStorage.getItem(`ecotrace_goals_${user.uid}`);
        return savedGoals ? JSON.parse(savedGoals) : [];
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem(`ecotrace_goals_${user.uid}`, JSON.stringify(goals));
        }
    }, [goals, user]);

    const addGoal = (goalToAdd: Omit<Goal, 'id' | 'completed'>) => {
        const newGoal: Goal = {
            id: Date.now(),
            ...goalToAdd,
            completed: false,
        };
        if (!goals.some(g => g.text === newGoal.text)) {
            setGoals(prev => [...prev, newGoal]);
        }
    };

    const toggleGoal = (id: number) => {
        setGoals(goals.map(goal =>
            goal.id === id ? { ...goal, completed: !goal.completed } : goal
        ));
    };

    const removeGoal = (id: number) => {
        setGoals(goals.filter(goal => goal.id !== id));
    };

    const inProgressGoals = goals.filter(g => !g.completed);
    const completedGoals = goals.filter(g => g.completed);

    const categoryColors: Record<Goal['category'], 'blue' | 'pink' | 'purple'> = {
        Transport: 'blue',
        Energy: 'pink',
        Food: 'purple',
    };

    const colorClasses = {
        blue: { text: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30', border: 'border-blue-500' },
        pink: { text: 'text-pink-600 dark:text-pink-400', bg: 'bg-pink-100 dark:bg-pink-900/30', border: 'border-pink-500' },
        purple: { text: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/30', border: 'border-purple-500' },
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navigation />
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent mb-2">
                        My Goals
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">Set and track your weekly eco-friendly goals.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Active Goals Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                            <Target className="mr-3 text-blue-500" />
                            In Progress ({inProgressGoals.length})
                        </h2>
                        <div className="space-y-4">
                            {inProgressGoals.length > 0 ? (
                                inProgressGoals.map(goal => (
                                    <GoalItem key={goal.id} goal={goal} onToggle={toggleGoal} onRemove={removeGoal} colors={colorClasses[categoryColors[goal.category]]} />
                                ))
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400">Add some goals from the suggestions to get started!</p>
                            )}
                        </div>
                    </div>
                    
                    {/* Suggested Goals Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                         <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Goal Suggestions</h2>
                         <div className="space-y-3">
                             {suggestedGoals.map((sGoal, index) => (
                                 <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                     <div>
                                         <p className="font-medium text-gray-800 dark:text-gray-200">{sGoal.text}</p>
                                         <span className={`text-xs font-semibold ${colorClasses[categoryColors[sGoal.category]].text}`}>{sGoal.category}</span>
                                     </div>
                                     <button onClick={() => addGoal(sGoal)} className="p-2 text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 disabled:opacity-50" disabled={goals.some(g => g.text === sGoal.text)}>
                                         <PlusCircle size={20} />
                                     </button>
                                 </div>
                             ))}
                         </div>
                    </div>

                    {/* Completed Goals Section */}
                    <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                            <CheckCircle className="mr-3 text-green-500" />
                            Completed ({completedGoals.length})
                        </h2>
                        <div className="space-y-4">
                             {completedGoals.length > 0 ? (
                                completedGoals.map(goal => (
                                    <GoalItem key={goal.id} goal={goal} onToggle={toggleGoal} onRemove={removeGoal} colors={colorClasses[categoryColors[goal.category]]} />
                                ))
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400">Complete a goal to see it here.</p>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

interface GoalItemProps {
    goal: Goal;
    onToggle: (id: number) => void;
    onRemove: (id: number) => void;
    colors: { text: string; bg: string; border: string; };
}

const GoalItem: React.FC<GoalItemProps> = ({ goal, onToggle, onRemove, colors }) => {
    return (
        <div className={`flex items-center justify-between p-4 rounded-lg transition-colors ${goal.completed ? 'bg-green-50 dark:bg-green-900/20' : colors.bg}`}>
            <div className="flex items-center">
                <button onClick={() => onToggle(goal.id)} className="mr-4">
                    <div className={`w-6 h-6 rounded-full border-2 ${goal.completed ? 'border-green-500 bg-green-500' : colors.border} flex items-center justify-center`}>
                       {goal.completed && <CheckCircle size={16} className="text-white" />}
                    </div>
                </button>
                <div>
                   <p className={`font-semibold ${goal.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-gray-200'}`}>{goal.text}</p>
                   <span className={`text-xs font-semibold ${colors.text}`}>{goal.category}</span>
                </div>
            </div>
            <button onClick={() => onRemove(goal.id)} className="p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400">
                <Trash2 size={18} />
            </button>
        </div>
    );
}

export default GoalsPage;
