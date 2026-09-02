export interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  isActive?: boolean;
  createdAt: string;
}

export interface Profile {
  id: string;
  userId: string;
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;
  fitnessGoal?: string;
  profilePicture?: string;
  bio?: string;
}

export interface Exercise {
  id: string;
  name: string;
  category: string;
  muscleGroup: string;
  description?: string;
  difficulty: string;
  isCustom: boolean;
}

export interface WorkoutSet {
  id: string;
  setNumber: number;
  reps?: number;
  weight?: number;
  duration?: number;
  distance?: number;
  caloriesBurned?: number;
  isCompleted: boolean;
  restTime?: number;
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  exercise: Exercise;
  order: number;
  sets: WorkoutSet[];
}

export interface Workout {
  id: string;
  name: string;
  date: string;
  duration?: number;
  totalCalories?: number;
  notes?: string;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED';
  exercises: WorkoutExercise[];
}

export interface WorkoutSchedule {
  id: string;
  dayOfWeek: number;
  name: string;
  description?: string;
  startTime?: string;
  duration?: number;
  isActive: boolean;
}

export interface Progress {
  id: string;
  type: string;
  value: number;
  unit?: string;
  notes?: string;
  date: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'REMINDER' | 'ACHIEVEMENT' | 'WARNING';
  isRead: boolean;
  createdAt: string;
}

export interface AuthResponse {
  data: {
    user: User;
    token: string;
  };
}

export interface WorkoutStats {
  totalWorkouts: number;
  weekWorkouts: number;
  monthWorkouts: number;
  totalCalories: number;
  totalDuration: number;
  recentWorkouts: Workout[];
}

export interface AdminDashboard {
  totalUsers: number;
  activeUsers: number;
  totalWorkouts: number;
  totalExercises: number;
  recentUsers: User[];
  recentWorkouts: Workout[];
}
