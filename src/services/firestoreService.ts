import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { ValidationService } from './validationService';
import {
  Challenge,
  Quiz,
  User,
  ChallengeParticipation,
  EWasteReport,
  Reward,
  RewardRedemption,
  LeaderboardEntry,
  QuizSubmission,
  CreateChallengeData,
  CreateQuizData,
  CreateRewardData
} from '../types';


// Helper function to convert Firestore timestamps
const convertTimestamp = (timestamp: any): Date => {
  if (timestamp && typeof timestamp === 'object' && 'toDate' in timestamp) {
    return timestamp.toDate();
  }
  return timestamp instanceof Date ? timestamp : new Date(timestamp);
};

// Challenges Service
export const challengesService = {
  // Get all challenges
  async getAllChallenges(): Promise<Challenge[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'challenges'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: convertTimestamp(doc.data().createdAt)
      })) as Challenge[];
    } catch (error) {
      console.error('Error fetching challenges:', error);
      throw new Error('Failed to fetch challenges');
    }
  },

  // Get active challenges only
  async getActiveChallenges(): Promise<Challenge[]> {
    try {
      const q = query(collection(db, 'challenges'), where('status', '==', 'active'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: convertTimestamp(doc.data().createdAt)
      })) as Challenge[];
    } catch (error) {
      console.error('Error fetching active challenges:', error);
      throw new Error('Failed to fetch active challenges');
    }
  },

  // Listen to challenges changes
  listenToChallenges(callback: (challenges: Challenge[]) => void): () => void {
    const q = query(collection(db, 'challenges'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (querySnapshot) => {
      const challenges = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: convertTimestamp(doc.data().createdAt)
      })) as Challenge[];
      callback(challenges);
    });
  },

  // Create a new challenge
  async createChallenge(challengeData: CreateChallengeData): Promise<string> {
    try {
      // Validate challenge data
      const fullChallenge: Challenge = {
        ...challengeData,
        id: '', // Will be set by Firestore
        createdAt: new Date()
      };
      
      const validation = ValidationService.validateChallenge(fullChallenge);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.map(e => e.message).join(', ')}`);
      }

      const docRef = await addDoc(collection(db, 'challenges'), {
        ...challengeData,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating challenge:', error);
      throw new Error('Failed to create challenge');
    }
  },

  // Update a challenge
  async updateChallenge(challengeId: string, updates: Partial<Challenge>): Promise<void> {
    try {
      await updateDoc(doc(db, 'challenges', challengeId), updates);
    } catch (error) {
      console.error('Error updating challenge:', error);
      throw new Error('Failed to update challenge');
    }
  },

  // Delete a challenge
  async deleteChallenge(challengeId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'challenges', challengeId));
    } catch (error) {
      console.error('Error deleting challenge:', error);
      throw new Error('Failed to delete challenge');
    }
  }
};

// Quizzes Service
export const quizzesService = {
  // Get all quizzes
  async getAllQuizzes(): Promise<Quiz[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'quizzes'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: convertTimestamp(doc.data().createdAt)
      })) as Quiz[];
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      throw new Error('Failed to fetch quizzes');
    }
  },

  // Get active quizzes only
  async getActiveQuizzes(): Promise<Quiz[]> {
    try {
      const q = query(collection(db, 'quizzes'), where('status', '==', 'active'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: convertTimestamp(doc.data().createdAt)
      })) as Quiz[];
    } catch (error) {
      console.error('Error fetching active quizzes:', error);
      throw new Error('Failed to fetch active quizzes');
    }
  },

  // Listen to quizzes changes
  listenToQuizzes(callback: (quizzes: Quiz[]) => void): () => void {
    const q = query(collection(db, 'quizzes'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (querySnapshot) => {
      const quizzes = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: convertTimestamp(doc.data().createdAt)
      })) as Quiz[];
      callback(quizzes);
    });
  },

  // Create a new quiz
  async createQuiz(quizData: CreateQuizData): Promise<string> {
    try {
      // Validate quiz data
      const fullQuiz: Quiz = {
        ...quizData,
        id: '', // Will be set by Firestore
        createdAt: new Date()
      };
      
      const validation = ValidationService.validateQuiz(fullQuiz);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.map(e => e.message).join(', ')}`);
      }

      const docRef = await addDoc(collection(db, 'quizzes'), {
        ...quizData,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating quiz:', error);
      throw new Error('Failed to create quiz');
    }
  },

  // Update a quiz
  async updateQuiz(quizId: string, updates: Partial<Quiz>): Promise<void> {
    try {
      await updateDoc(doc(db, 'quizzes', quizId), updates);
    } catch (error) {
      console.error('Error updating quiz:', error);
      throw new Error('Failed to update quiz');
    }
  },

  // Delete a quiz
  async deleteQuiz(quizId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'quizzes', quizId));
    } catch (error) {
      console.error('Error deleting quiz:', error);
      throw new Error('Failed to delete quiz');
    }
  }
};

// Users Service
export const usersService = {
  // Get all users
  async getAllUsers(): Promise<User[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'userRoles'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: convertTimestamp(doc.data().createdAt),
        points: doc.data().points || 0,
        status: doc.data().status || 'active'
      })) as User[];
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users');
    }
  },

  // Listen to users changes
  listenToUsers(callback: (users: User[]) => void): () => void {
    const q = query(collection(db, 'userRoles'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (querySnapshot) => {
      const users = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: convertTimestamp(doc.data().createdAt),
        points: doc.data().points || 0,
        status: doc.data().status || 'active'
      })) as User[];
      callback(users);
    });
  },

  // Update user status
  async updateUserStatus(userId: string, status: 'active' | 'suspended'): Promise<void> {
    try {
      await updateDoc(doc(db, 'userRoles', userId), { status });
    } catch (error) {
      console.error('Error updating user status:', error);
      throw new Error('Failed to update user status');
    }
  },

  // Update user points
  async updateUserPoints(userId: string, points: number): Promise<void> {
    try {
      await updateDoc(doc(db, 'userRoles', userId), { points });
    } catch (error) {
      console.error('Error updating user points:', error);
      throw new Error('Failed to update user points');
    }
  }
};

// Challenge Participations Service
export const challengeParticipationsService = {
  // Create a participation
  async createParticipation(participationData: Omit<ChallengeParticipation, 'id' | 'submittedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'challengeParticipations'), {
        ...participationData,
        submittedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating participation:', error);
      throw new Error('Failed to create participation');
    }
  },

  // Get participations by user
  async getUserParticipations(userId: string): Promise<ChallengeParticipation[]> {
    try {
      const q = query(collection(db, 'challengeParticipations'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        submittedAt: convertTimestamp(doc.data().submittedAt)
      })) as ChallengeParticipation[];
    } catch (error) {
      console.error('Error fetching user participations:', error);
      throw new Error('Failed to fetch user participations');
    }
  },

  // Update participation status
  async updateParticipationStatus(participationId: string, status: 'pending' | 'approved' | 'rejected'): Promise<void> {
    try {
      await updateDoc(doc(db, 'challengeParticipations', participationId), { status });
    } catch (error) {
      console.error('Error updating participation status:', error);
      throw new Error('Failed to update participation status');
    }
  }
};

// E-Waste Reports Service
export const ewasteReportsService = {
  // Create a report
  async createReport(reportData: Omit<EWasteReport, 'id' | 'reportedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'ewasteReports'), {
        ...reportData,
        reportedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating e-waste report:', error);
      throw new Error('Failed to create e-waste report');
    }
  },

  // Get all reports
  async getAllReports(): Promise<EWasteReport[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'ewasteReports'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        reportedAt: convertTimestamp(doc.data().reportedAt)
      })) as EWasteReport[];
    } catch (error) {
      console.error('Error fetching e-waste reports:', error);
      throw new Error('Failed to fetch e-waste reports');
    }
  },

  // Listen to reports changes
  listenToReports(callback: (reports: EWasteReport[]) => void): () => void {
    const q = query(collection(db, 'ewasteReports'), orderBy('reportedAt', 'desc'));
    return onSnapshot(q, (querySnapshot) => {
      const reports = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        reportedAt: convertTimestamp(doc.data().reportedAt)
      })) as EWasteReport[];
      callback(reports);
    });
  },

  // Update report status
  async updateReportStatus(reportId: string, status: 'pending' | 'collected' | 'processed'): Promise<void> {
    try {
      await updateDoc(doc(db, 'ewasteReports', reportId), { status });
    } catch (error) {
      console.error('Error updating report status:', error);
      throw new Error('Failed to update report status');
    }
  }
};

// Rewards Service
export const rewardsService = {
  // Get all rewards
  async getAllRewards(): Promise<Reward[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'rewards'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: convertTimestamp(doc.data().createdAt),
        expiryDate: doc.data().expiryDate ? convertTimestamp(doc.data().expiryDate) : undefined
      })) as Reward[];
    } catch (error) {
      console.error('Error fetching rewards:', error);
      throw new Error('Failed to fetch rewards');
    }
  },

  // Listen to rewards changes
  listenToRewards(callback: (rewards: Reward[]) => void): () => void {
    const q = query(collection(db, 'rewards'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (querySnapshot) => {
      const rewards = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: convertTimestamp(doc.data().createdAt),
        expiryDate: doc.data().expiryDate ? convertTimestamp(doc.data().expiryDate) : undefined
      })) as Reward[];
      callback(rewards);
    });
  },

  // Create a reward
  async createReward(rewardData: CreateRewardData): Promise<string> {
    try {
      // Validate reward data
      const fullReward: Reward = {
        ...rewardData,
        id: '', // Will be set by Firestore
        createdAt: new Date()
      };
      
      const validation = ValidationService.validateReward(fullReward);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.map(e => e.message).join(', ')}`);
      }

      const docRef = await addDoc(collection(db, 'rewards'), {
        ...rewardData,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating reward:', error);
      throw new Error('Failed to create reward');
    }
  },

  // Update a reward
  async updateReward(rewardId: string, updates: Partial<Reward>): Promise<void> {
    try {
      await updateDoc(doc(db, 'rewards', rewardId), updates);
    } catch (error) {
      console.error('Error updating reward:', error);
      throw new Error('Failed to update reward');
    }
  },

  // Delete a reward
  async deleteReward(rewardId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'rewards', rewardId));
    } catch (error) {
      console.error('Error deleting reward:', error);
      throw new Error('Failed to delete reward');
    }
  }
};

// Reward Redemptions Service
export const rewardRedemptionsService = {
  // Create a redemption
  async createRedemption(redemptionData: Omit<RewardRedemption, 'id' | 'redeemedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'rewardRedemptions'), {
        ...redemptionData,
        redeemedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating redemption:', error);
      throw new Error('Failed to create redemption');
    }
  },

  // Get user redemptions
  async getUserRedemptions(userId: string): Promise<RewardRedemption[]> {
    try {
      const q = query(collection(db, 'rewardRedemptions'), where('userId', '==', userId), orderBy('redeemedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        redeemedAt: convertTimestamp(doc.data().redeemedAt),
        usedAt: doc.data().usedAt ? convertTimestamp(doc.data().usedAt) : undefined
      })) as RewardRedemption[];
    } catch (error) {
      console.error('Error fetching user redemptions:', error);
      throw new Error('Failed to fetch user redemptions');
    }
  },

  // Listen to all redemptions (admin)
  listenToRedemptions(callback: (redemptions: RewardRedemption[]) => void): () => void {
    const q = query(collection(db, 'rewardRedemptions'), orderBy('redeemedAt', 'desc'));
    return onSnapshot(q, (querySnapshot) => {
      const redemptions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        redeemedAt: convertTimestamp(doc.data().redeemedAt),
        usedAt: doc.data().usedAt ? convertTimestamp(doc.data().usedAt) : undefined
      })) as RewardRedemption[];
      callback(redemptions);
    });
  },

  // Update redemption status
  async updateRedemptionStatus(redemptionId: string, status: 'pending' | 'approved' | 'used' | 'expired'): Promise<void> {
    try {
      const updates: any = { status };
      if (status === 'used') {
        updates.usedAt = serverTimestamp();
      }
      await updateDoc(doc(db, 'rewardRedemptions', redemptionId), updates);
    } catch (error) {
      console.error('Error updating redemption status:', error);
      throw new Error('Failed to update redemption status');
    }
  }
};

// Leaderboard Service
export const leaderboardService = {
  // Get current week leaderboard
  async getWeeklyLeaderboard(): Promise<LeaderboardEntry[]> {
    try {
      const now = new Date();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
      weekStart.setHours(0, 0, 0, 0);

      const q = query(
        collection(db, 'leaderboard'),
        where('weekStartDate', '>=', weekStart),
        orderBy('weekStartDate', 'desc'),
        orderBy('rank', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        weekStartDate: convertTimestamp(doc.data().weekStartDate),
        weekEndDate: convertTimestamp(doc.data().weekEndDate)
      })) as LeaderboardEntry[];
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      throw new Error('Failed to fetch leaderboard');
    }
  },

  // Listen to leaderboard changes
  listenToLeaderboard(callback: (entries: LeaderboardEntry[]) => void): () => void {
    // Get current week start date for filtering
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);

    // Use compound query for better performance
    const q = query(
      collection(db, 'leaderboard'),
      where('weekStartDate', '>=', weekStart),
      orderBy('weekStartDate', 'desc'),
      orderBy('rank', 'asc')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const entries = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        weekStartDate: convertTimestamp(doc.data().weekStartDate),
        weekEndDate: convertTimestamp(doc.data().weekEndDate)
      })) as LeaderboardEntry[];

      callback(entries);
    });
  },

  // Update leaderboard entry
  async updateLeaderboardEntry(entryId: string, updates: Partial<LeaderboardEntry>): Promise<void> {
    try {
      await updateDoc(doc(db, 'leaderboard', entryId), updates);
    } catch (error) {
      console.error('Error updating leaderboard entry:', error);
      throw new Error('Failed to update leaderboard entry');
    }
  }
};

// Data Seeding Service
export const dataSeedingService = {
  // Seed sample data
  async seedSampleData(): Promise<void> {
    try {
      // Import sample data
      const { sampleQuizzes, sampleChallenges } = await import('../utils/sampleData');
      
      // Seed quizzes
      for (const quiz of sampleQuizzes) {
        await addDoc(collection(db, 'quizzes'), {
          ...quiz,
          createdAt: serverTimestamp()
        });
      }

      // Seed challenges
      for (const challenge of sampleChallenges) {
        await addDoc(collection(db, 'challenges'), {
          ...challenge,
          createdAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Error seeding sample data:', error);
      throw new Error('Failed to seed sample data');
    }
  }
};
