// Centralized type definitions for the gamified e-waste management system

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  status: 'active' | 'pending' | 'inactive';
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  requirements: string[];
  estimatedTime: number;
  creator: string;
  createdAt: Date;
  imageUrl?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  status: 'active' | 'draft' | 'inactive';
  category: string;
  points: number;
  timeLimit: number;
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  displayName?: string;
  role: 'admin' | 'customer';
  points: number;
  status: 'active' | 'suspended';
  createdAt: Date;
}

export interface UserRole {
  uid: string;
  email: string;
  role: 'admin' | 'customer';
  displayName?: string;
  createdAt: Date;
}

export interface ChallengeParticipation {
  id: string;
  challengeId: string;
  userId: string;
  userEmail: string;
  description: string;
  evidence: string;
  location: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  points: number;
}

export interface EWasteReport {
  id: string;
  deviceType: string;
  brand: string;
  model: string;
  condition: 'working' | 'broken' | 'partially-working';
  location: string;
  reportedBy: string;
  userId: string;
  reportedAt: Date;
  status: 'pending' | 'collected' | 'processed';
  estimatedValue?: number;
  description?: string;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  type: 'coupon' | 'discount' | 'cashback' | 'voucher';
  pointsCost: number;
  value: number; // In rupees or percentage
  valueType: 'fixed' | 'percentage';
  stock: number;
  status: 'active' | 'inactive';
  expiryDate?: Date;
  termsAndConditions?: string;
  imageUrl?: string;
  createdAt: Date;
}

export interface RewardRedemption {
  id: string;
  rewardId: string;
  rewardTitle: string;
  userId: string;
  userEmail: string;
  pointsSpent: number;
  rewardValue: number;
  couponCode?: string;
  status: 'pending' | 'approved' | 'used' | 'expired';
  redeemedAt: Date;
  usedAt?: Date;
}

export interface LeaderboardEntry {
  id: string;
  userId: string;
  userEmail: string;
  displayName: string;
  weeklyPoints: number;
  devicesReported: number;
  weekStartDate: Date;
  weekEndDate: Date;
  rank: number;
  prize?: number; // Cash prize in rupees
}

export interface QuizSubmission {
  id: string;
  quizId: string;
  userId: string;
  userEmail: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  submittedAt: Date;
}

export interface UserStats {
  id: string;
  userId: string;
  totalPoints: number;
  weeklyPoints: number;
  devicesReported: number;
  quizzesCompleted: number;
  challengesCompleted: number;
  lastUpdated: Date;
}

// Form types for creating/updating entities
export interface CreateChallengeData {
  title: string;
  description: string;
  points: number;
  status: 'active' | 'pending' | 'inactive';
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  requirements: string[];
  estimatedTime: number;
  creator: string;
  imageUrl?: string;
}

export interface CreateQuizData {
  title: string;
  description: string;
  questions: Question[];
  status: 'active' | 'draft' | 'inactive';
  category: string;
  points: number;
  timeLimit: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface CreateRewardData {
  title: string;
  description: string;
  type: 'coupon' | 'discount' | 'cashback' | 'voucher';
  pointsCost: number;
  value: number;
  valueType: 'fixed' | 'percentage';
  stock: number;
  status: 'active' | 'inactive';
  expiryDate?: Date;
  termsAndConditions?: string;
  imageUrl?: string;
}

export interface CreateUserData {
  email: string;
  displayName?: string;
  role: 'admin' | 'customer';
  password: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Validation types
export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}
