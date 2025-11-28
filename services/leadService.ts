import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Lead, LeadStatus } from '../types';

const LEADS_COLLECTION = 'leads';

export const leadService = {
  async getAllLeads(): Promise<Lead[]> {
    try {
      const q = query(collection(db, LEADS_COLLECTION), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Lead[];
    } catch (error) {
      console.error("Error fetching leads:", error);
      throw error;
    }
  },

  async addLead(lead: Omit<Lead, 'id' | 'createdAt'>): Promise<Lead> {
    try {
      const newLead = {
        ...lead,
        createdAt: Date.now()
      };
      const docRef = await addDoc(collection(db, LEADS_COLLECTION), newLead);
      return { id: docRef.id, ...newLead };
    } catch (error) {
      console.error("Error adding lead:", error);
      throw error;
    }
  },

  async updateLeadStatus(id: string, status: LeadStatus): Promise<void> {
    try {
      const leadRef = doc(db, LEADS_COLLECTION, id);
      await updateDoc(leadRef, { status });
    } catch (error) {
      console.error("Error updating lead status:", error);
      throw error;
    }
  },

  async deleteLead(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, LEADS_COLLECTION, id));
    } catch (error) {
      console.error("Error deleting lead:", error);
      throw error;
    }
  }
};