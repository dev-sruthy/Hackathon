
export interface User {
  uid: string;
  email: string;
  name: string;
  emailVerified: boolean;
  createdAt: string;
  password?: string; // Should not be stored in client-side state long-term
}

export interface Activities {
  transport_method?: 'car_gas' | 'car_hybrid' | 'car_electric' | 'public_transit' | 'walking' | 'cycling';
  commute_distance?: string;
  flights_month?: string;
  home_type?: 'apartment' | 'small_house' | 'large_house';
  heating_type?: 'gas' | 'electric' | 'heat_pump';
  electricity_source?: 'grid' | 'some_renewable' | 'mostly_renewable';
  diet_type?: 'meat_heavy' | 'moderate_meat' | 'vegetarian' | 'vegan';
  food_waste?: 'high' | 'medium' | 'low';
  meal_ratio?: 'mostly_out' | 'half_half' | 'mostly_home';
}

export interface Emissions {
  transport: number;
  energy: number;
  food: number;
}

export interface Tip {
  category: string;
  tip: string;
  impact: string;
  difficulty: string;
}

export interface WeeklyData {
  day: string;
  transport: number;
  energy: number;
  food: number;
  total: number;
}
