import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  getDoc 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { PasswordEntry } from '../types';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

const COLLECTION_NAME = 'passwords';
const ENCRYPTION_KEY_NAME = 'password_encryption_key';
const USER_ID = 'girlfriend_user'; // Fixed user ID since it's for one person

// Simple encryption/decryption utilities
const getOrCreateEncryptionKey = async (): Promise<string> => {
  let key = await SecureStore.getItemAsync(ENCRYPTION_KEY_NAME);
  if (!key) {
    key = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    );
    await SecureStore.setItemAsync(ENCRYPTION_KEY_NAME, key);
  }
  return key;
};

// Simple XOR encryption (for demo purposes - use proper encryption in production)
const simpleEncrypt = (text: string, key: string): string => {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return btoa(result);
};

const simpleDecrypt = (encryptedText: string, key: string): string => {
  const text = atob(encryptedText);
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return result;
};

export const passwordService = {
  // Add new password
  addPassword: async (passwordData: Omit<PasswordEntry, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    try {
      const encryptionKey = await getOrCreateEncryptionKey();
      const encryptedPassword = simpleEncrypt(passwordData.password, encryptionKey);
      
      // Clean the data to remove undefined values (Firestore doesn't accept undefined)
      const cleanedData = {
        title: passwordData.title || '',
        username: passwordData.username || '',
        password: encryptedPassword,
        website: passwordData.website || '',
        notes: passwordData.notes || '',
        category: passwordData.category || '10', // Default to 'Other' category
        userId: USER_ID,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const docRef = await addDoc(collection(db, COLLECTION_NAME), cleanedData);
      return docRef.id;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  // Get all passwords
  getPasswords: async (): Promise<PasswordEntry[]> => {
    try {
      const encryptionKey = await getOrCreateEncryptionKey();
      // Simple query without any filters - we'll filter and sort in-memory
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      const passwords: PasswordEntry[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        
        // Only include passwords for our user
        if (data.userId === USER_ID) {
          const decryptedPassword = simpleDecrypt(data.password, encryptionKey);
          
          passwords.push({
            id: doc.id,
            ...data,
            password: decryptedPassword,
            createdAt: data.createdAt.toDate(),
            updatedAt: data.updatedAt.toDate(),
          } as PasswordEntry);
        }
      });
      
      // Sort by updatedAt in memory (since we removed orderBy from query)
      passwords.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
      
      return passwords;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  // Get single password
  getPassword: async (passwordId: string): Promise<PasswordEntry | null> => {
    try {
      const encryptionKey = await getOrCreateEncryptionKey();
      const docRef = doc(db, COLLECTION_NAME, passwordId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        const decryptedPassword = simpleDecrypt(data.password, encryptionKey);
        
        return {
          id: docSnap.id,
          ...data,
          password: decryptedPassword,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        } as PasswordEntry;
      }
      
      return null;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  // Update password
  updatePassword: async (passwordId: string, updates: Partial<Omit<PasswordEntry, 'id' | 'createdAt' | 'userId'>>) => {
    try {
      const encryptionKey = await getOrCreateEncryptionKey();
      const docRef = doc(db, COLLECTION_NAME, passwordId);
      
      // Clean the updates to remove undefined values
      const cleanedUpdates: any = {
        updatedAt: new Date(),
      };
      
      // Only add fields that are not undefined
      if (updates.title !== undefined) cleanedUpdates.title = updates.title || '';
      if (updates.username !== undefined) cleanedUpdates.username = updates.username || '';
      if (updates.website !== undefined) cleanedUpdates.website = updates.website || '';
      if (updates.notes !== undefined) cleanedUpdates.notes = updates.notes || '';
      if (updates.category !== undefined) cleanedUpdates.category = updates.category || '10';
      
      if (updates.password) {
        cleanedUpdates.password = simpleEncrypt(updates.password, encryptionKey);
      }
      
      await updateDoc(docRef, cleanedUpdates);
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  // Delete password
  deletePassword: async (passwordId: string) => {
    try {
      const docRef = doc(db, COLLECTION_NAME, passwordId);
      await deleteDoc(docRef);
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
};
