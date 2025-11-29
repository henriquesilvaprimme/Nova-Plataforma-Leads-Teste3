import React, { useEffect, useState } from 'react';
import { HashRouter } from 'react-router-dom';
import { Plus } from 'lucide-react';

import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Leads } from './pages/Leads';
import { LeadModal } from './components/LeadModal';
import { leadService } from './services/leadService';
import { Lead, LeadStatus } from './types';

// Mock user interface since we removed firebase auth types
interface MockUser {
  email: string;
}

function App() {
  // Usuário "logado" automaticamente
  const [user, setUser] = useState<MockUser | null>({ email: 'admin@demo.com' });
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Initial Load
  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const data = await leadService.getAllLeads();
      setLeads(data);
    } catch (error) {
      console.error("Failed to fetch leads", error);
    }
  };

  const handleAddLead = async (leadData: Omit<Lead, 'id' | 'createdAt'>) => {
    try {
      const newLead = await leadService.addLead(leadData);
      setLeads(prev => [newLead, ...prev]);
    } catch (error) {
      console.error("Failed to add lead", error);
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este lead?')) {
      try {
        await leadService.deleteLead(id);
        setLeads(prev => prev.filter(lead => lead.id !== id));
      } catch (error) {
        console.error("Failed to delete lead", error);
      }
    }
  };

  const handleUpdateStatus = async (id: string, status: LeadStatus) => {
    try {
      await leadService.updateLeadStatus(id, status);
      setLeads(prev => prev.map(lead => 
        lead.id === id ? { ...lead, status } : lead
      ));
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const handleLogout = () => {
    if(window.confirm("Deseja resetar os dados de demonstração e recarregar?")) {
      localStorage.removeItem('nexus_leads');
      window.location.reload();
    }
  };

  return (
    <HashRouter>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar 
          currentPage={currentPage} 
          onNavigate={setCurrentPage} 
          onLogout={handleLogout}
        />

        <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto h-screen">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                {currentPage === 'dashboard' ? 'Visão Geral' : 
                 currentPage === 'leads' ? 'Gestão de Leads' : 
                 currentPage === 'reports' ? 'Relatórios' : 'Configurações'}
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Bem-vindo de volta, {user?.email.split('@')[0]} (Modo Demo)
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg shadow-lg shadow-indigo-500/30 transition-all active:scale-95"
            >
              <Plus size={20} />
              <span className="font-medium">Novo Lead</span>
            </button>
          </header>

          <div className="animate-fade-in">
            {currentPage === 'dashboard' && (
              <Dashboard leads={leads} />
            )}
            {currentPage === 'leads' && (
              <Leads 
                leads={leads} 
                onDelete={handleDeleteLead}
                onUpdateStatus={handleUpdateStatus}
                onEdit={() => {}} 
              />
            )}
            {(currentPage !== 'dashboard' && currentPage !== 'leads') && (
               <div className="flex flex-col items-center justify-center h-64 text-slate-400 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <div className="p-4 bg-slate-50 rounded-full mb-4">
                    <Plus size={32} className="text-slate-300" />
                  </div>
                  <p className="text-lg font-medium text-slate-600">Módulo em desenvolvimento</p>
                  <p className="text-sm mt-1">As funcionalidades de {currentPage} estarão disponíveis em breve.</p>
               </div>
            )}
          </div>
        </main>

        <LeadModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSubmit={handleAddLead}
        />
      </div>
    </HashRouter>
  );
}

export default App;
