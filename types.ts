export enum LeadStatus {
  NEW = 'Novo',
  CONTACTED = 'Contatado',
  PROPOSAL = 'Proposta',
  WON = 'Ganho',
  LOST = 'Perdido',
}

export interface Lead {
  id?: string;
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
  createdAt: number; // Timestamp
  value?: number;
  company?: string;
}

export interface KPIStats {
  total: number;
  newLeads: number;
  negotiation: number;
  closed: number;
}