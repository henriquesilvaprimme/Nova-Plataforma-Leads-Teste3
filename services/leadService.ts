import { Lead, LeadStatus } from '../types';

const STORAGE_KEY = 'nexus_leads';

// Dados iniciais para o dashboard não ficar vazio na primeira execução
const INITIAL_DATA: Lead[] = [
  {
    id: '1',
    name: 'Ana Souza',
    email: 'ana.souza@techcorp.com',
    phone: '(11) 98765-4321',
    company: 'TechCorp Solutions',
    status: LeadStatus.NEW,
    createdAt: Date.now() - 1000 * 60 * 60 * 2, // 2 horas atrás
  },
  {
    id: '2',
    name: 'Carlos Mendes',
    email: 'carlos@varejoexpress.com',
    phone: '(21) 99888-7766',
    company: 'Varejo Express',
    status: LeadStatus.CONTACTED,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 dias atrás
  },
  {
    id: '3',
    name: 'Marina Costa',
    email: 'marina@startuphub.io',
    phone: '(31) 97777-6655',
    company: 'Startup Hub',
    status: LeadStatus.PROPOSAL,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5, // 5 dias atrás
  },
  {
    id: '4',
    name: 'Roberto Almeida',
    email: 'roberto@construtech.com',
    phone: '(41) 96666-5544',
    company: 'ConstruTech',
    status: LeadStatus.WON,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10, // 10 dias atrás
  }
];

export const leadService = {
  async getAllLeads(): Promise<Lead[]> {
    return new Promise((resolve) => {
      // Simula um pequeno delay de rede
      setTimeout(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
          // Se não tiver nada, salva os dados iniciais e retorna
          localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
          resolve(INITIAL_DATA);
        } else {
          resolve(JSON.parse(stored));
        }
      }, 300);
    });
  },

  async addLead(lead: Omit<Lead, 'id' | 'createdAt'>): Promise<Lead> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        const leads: Lead[] = stored ? JSON.parse(stored) : [];
        
        const newLead: Lead = {
          ...lead,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: Date.now()
        };

        const updatedLeads = [newLead, ...leads];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLeads));
        resolve(newLead);
      }, 300);
    });
  },

  async updateLeadStatus(id: string, status: LeadStatus): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const leads: Lead[] = JSON.parse(stored);
          const updatedLeads = leads.map(l => l.id === id ? { ...l, status } : l);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLeads));
        }
        resolve();
      }, 200);
    });
  },

  async deleteLead(id: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const leads: Lead[] = JSON.parse(stored);
          const updatedLeads = leads.filter(l => l.id !== id);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLeads));
        }
        resolve();
      }, 200);
    });
  }
};
