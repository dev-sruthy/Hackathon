
import { Activities, Emissions, Tip, WeeklyData } from '../types';

export const calculateCarbonFootprint = (activities: Activities): Emissions => {
  const emissions: Emissions = {
    transport: 0,
    energy: 0,
    food: 0
  };

  const transportMethods: Record<string, number> = {
    car_gas: 0.411,
    car_hybrid: 0.25,
    car_electric: 0.189,
    public_transit: 0.089,
    walking: 0,
    cycling: 0
  };

  const commuteMethod = activities.transport_method || 'car_gas';
  const commuteDistance = parseFloat(activities.commute_distance || '0') || 0;
  emissions.transport = (transportMethods[commuteMethod] || 0.411) * commuteDistance * 2;

  const flights = parseInt(activities.flights_month || '0') || 0;
  emissions.transport += (flights * 500);

  const homeTypes: Record<string, number> = { apartment: 15, small_house: 25, large_house: 40 };
  const heatingTypes: Record<string, number> = { gas: 1.2, electric: 1.0, heat_pump: 0.7 };
  const electricityTypes: Record<string, number> = { grid: 1.0, some_renewable: 0.7, mostly_renewable: 0.4 };

  const homeBase = homeTypes[activities.home_type || 'small_house'] || 25;
  const heatingMultiplier = heatingTypes[activities.heating_type || 'gas'] || 1.0;
  const electricityMultiplier = electricityTypes[activities.electricity_source || 'grid'] || 1.0;
  emissions.energy = homeBase * heatingMultiplier * electricityMultiplier;

  const dietTypes: Record<string, number> = { meat_heavy: 7.2, moderate_meat: 5.6, vegetarian: 3.8, vegan: 2.9 };
  const wasteMultipliers: Record<string, number> = { high: 1.3, medium: 1.0, low: 0.8 };
  const mealRatios: Record<string, number> = { mostly_out: 1.4, half_half: 1.2, mostly_home: 1.0 };

  const dietBase = dietTypes[activities.diet_type || 'moderate_meat'] || 5.6;
  const wasteMultiplier = wasteMultipliers[activities.food_waste || 'medium'] || 1.0;
  const mealMultiplier = mealRatios[activities.meal_ratio || 'half_half'] || 1.0;
  emissions.food = dietBase * wasteMultiplier * mealMultiplier;

  return emissions;
};

export const generateHistoricalData = (currentEmissions: Emissions): WeeklyData[] => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const total = currentEmissions.transport + currentEmissions.energy + currentEmissions.food;
  
  return days.map((day) => ({
    day,
    transport: Math.max(0, currentEmissions.transport + (Math.random() - 0.5) * 10),
    energy: Math.max(0, currentEmissions.energy + (Math.random() - 0.5) * 8),
    food: Math.max(0, currentEmissions.food + (Math.random() - 0.5) * 6),
    total: Math.max(5, total + (Math.random() - 0.5) * 15)
  }));
};

export const generateTips = (emissions: Emissions): Tip[] => {
  const allTips: Tip[] = [];
  const total = emissions.transport + emissions.energy + emissions.food;
  if(total === 0) return [];
  
  if (emissions.transport > total * 0.3) {
    allTips.push({
      category: 'Transport',
      tip: 'Try carpooling or using public transit once a week to significantly cut down on commute emissions.',
      impact: 'High',
      difficulty: 'Easy'
    });
  }
  
  if (emissions.energy > total * 0.3) {
    allTips.push({
      category: 'Energy',
      tip: 'Lower your thermostat by 2°F in winter and raise it by 2°F in summer. You\'ll barely notice the difference!',
      impact: 'Medium',
      difficulty: 'Easy'
    });
  }
  
  if (emissions.food > total * 0.25) {
    allTips.push({
      category: 'Food',
      tip: 'Incorporate one "meatless Monday" (or any other day) into your week to reduce dietary carbon impact.',
      impact: 'High',
      difficulty: 'Medium'
    });
  }

  allTips.push(
    {
      category: 'Energy',
      tip: 'Unplug electronics when not in use. "Phantom load" can account for 10% of your electricity bill.',
      impact: 'Low',
      difficulty: 'Easy'
    },
    {
      category: 'Food',
      tip: 'Plan your meals for the week to reduce food waste. About one-third of all food produced is wasted!',
      impact: 'Medium',
      difficulty: 'Medium'
    },
    {
      category: 'Transport',
      tip: 'Combine your errands into a single trip to save fuel and time.',
      impact: 'Medium',
      difficulty: 'Easy'
    }
  );

  return [...new Set(allTips)].sort(() => 0.5 - Math.random()).slice(0, 3);
};
