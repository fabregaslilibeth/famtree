import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser 
} from 'firebase/auth';
import { auth } from './firebase';
import { FirebaseService } from './firebase-service';
import { User } from '../types/user';

export class AuthService {
  static async register(email: string, password: string, userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ user: FirebaseUser; userDocId: string }> {
    try {
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save additional user data to Firestore
      const userDocId = await FirebaseService.createUser({
        ...userData,
        email: email
      });

      return { user, userDocId };
    } catch (error) {
      console.error('Error in registration:', error);
      throw error;
    }
  }

  static async login(email: string, password: string): Promise<FirebaseUser> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Error in login:', error);
      throw error;
    }
  }

  static async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error in logout:', error);
      throw error;
    }
  }

  static getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  static onAuthStateChange(callback: (user: FirebaseUser | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  }
} 