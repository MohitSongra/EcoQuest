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

// Types
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

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
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
  reportedAt: Date;
  status: 'pending' | 'collected' | 'processed';
  estimatedValue?: number;
  description?: string;
}

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
  async createChallenge(challengeData: Omit<Challenge, 'id' | 'createdAt'>): Promise<string> {
    try {
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
  async createQuiz(quizData: Omit<Quiz, 'id' | 'createdAt'>): Promise<string> {
    try {
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
