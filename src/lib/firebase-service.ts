import { collection, addDoc, getDocs, doc, getDoc, query, where } from 'firebase/firestore';
import { db } from './firebase';
import { User, Family } from '../types/user';

export class FirebaseService {
  // Users operations
    static async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    console.log('FirebaseService.createUser called with:', userData);
    console.log('Firestore db instance:', db);
    console.log('Current project:', db.app.options.projectId);
    
    try {
      const usersCollection = collection(db, 'users');
      console.log('Users collection reference created:', usersCollection);
      
      const timestamp = new Date().toISOString();
      
      const userDataWithTimestamps = {
        ...userData,
        createdAt: timestamp,
        updatedAt: timestamp
      };
      
      console.log('User data prepared:', userDataWithTimestamps);
      console.log('About to call addDoc...');
      
      const docRef = await addDoc(usersCollection, userDataWithTimestamps);
      console.log('User saved to Firestore successfully with ID:', docRef.id);
      
      return docRef.id;
    } catch (error) {
      console.error('Error in FirebaseService.createUser:', error);
      if (error && typeof error === 'object' && 'code' in error) {
        console.error('Error code:', (error as { code: string }).code);
      }
      if (error && typeof error === 'object' && 'message' in error) {
        console.error('Error message:', (error as { message: string }).message);
      }
      console.error('Full error object:', error);
      throw error;
    }
  }

  static async getUserById(id: string): Promise<User | null> {
    try {
      const userDoc = doc(db, 'users', id);
      const snapshot = await getDoc(userDoc);
      
      if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() } as User;
      }
      return null;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return null;
    }
  }

  static async getUserByName(firstName: string, lastName: string): Promise<User | null> {
    try {
      const usersCollection = collection(db, 'users');
      const q = query(
        usersCollection,
        where('firstName', '==', firstName),
        where('lastName', '==', lastName)
      );
      
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() } as User;
      }
      return null;
    } catch (error) {
      console.error('Error getting user by name:', error);
      return null;
    }
  }

  static async getAllUsers(): Promise<User[]> {
    try {
      const usersCollection = collection(db, 'users');
      const snapshot = await getDocs(usersCollection);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];
    } catch (error) {
      console.error('Error getting all users:', error);
      return [];
    }
  }

  // Family operations
  static async createFamily(familyName: string): Promise<string> {
    console.log('FirebaseService.createFamily called with:', familyName);
    
    try {
      const familiesCollection = collection(db, 'families');
      console.log('Families collection reference created');
      
      const timestamp = new Date().toISOString();
      
      const familyData = {
        name: familyName,
        createdAt: timestamp,
        updatedAt: timestamp
      };
      
      console.log('Family data prepared:', familyData);
      
      const docRef = await addDoc(familiesCollection, familyData);
      console.log('Family saved to Firestore successfully with ID:', docRef.id);
      
      return docRef.id;
    } catch (error) {
      console.error('Error in FirebaseService.createFamily:', error);
      throw error;
    }
  }

  static async getFamilyById(id: string): Promise<Family | null> {
    try {
      const familyDoc = doc(db, 'families', id);
      const snapshot = await getDoc(familyDoc);
      
      if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() } as Family;
      }
      return null;
    } catch (error) {
      console.error('Error getting family by ID:', error);
      return null;
    }
  }

  static async getAllFamilies(): Promise<Family[]> {
    try {
      const familiesCollection = collection(db, 'families');
      const snapshot = await getDocs(familiesCollection);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Family[];
    } catch (error) {
      console.error('Error getting all families:', error);
      return [];
    }
  }
} 