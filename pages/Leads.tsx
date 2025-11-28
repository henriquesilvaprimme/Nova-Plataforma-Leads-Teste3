import React from 'react';
import { 
  Trash2, 
  Edit2, 
  MoreVertical, 
  Search,
  Filter
} from 'lucide-react';
import { Lead, LeadStatus } from '../types';

interface LeadsProps {
  leads: Lead[];
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: LeadStatus) => void;
  onEdit: (lead: Lead) => void; // Placeholder for future full edit implementation
}

export const Leads: React.FC<LeadsProps> = ({ leads, onDelete, onUpdateStatus }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header Controls */}
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nome, email ou empresa..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-2 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter size={16} />
            <span>Filtros</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
              <th className="px-6 py-4">Nome / Empresa</th>
              <th className="px-6 py-4">Contato</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Data</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredLeads.length === 0 ? (
               <tr>
                 <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                   Nenhum lead encontrado.
                 </td>
               </tr>
            ) : (
              filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm mr-3">
                        {lead.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{lead.name}</div>
                        {lead.company && <div className="text-xs text-slate-500">{lead.company}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-600">{lead.email}</div>
                    <div className="text-xs text-slate-400">{lead.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      value={lead.status}
                      onChange={(e) => lead.id && onUpdateStatus(lead.id, e.target.value as LeadStatus)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full border-0 cursor-pointer outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 appearance-none text-center
                        ${getStatusBadgeClasses(lead.status)}`}
                    >
                      {Object.values(LeadStatus).map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => lead.id && onDelete(lead.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                        title="Excluir"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const getStatusBadgeClasses = (status: LeadStatus) => {
  switch (status) {
    case LeadStatus.NEW: return 'bg-blue-100 text-blue-700 hover:bg-blue-200';
    case LeadStatus.CONTACTED: return 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200';
    case LeadStatus.PROPOSAL: return 'bg-amber-100 text-amber-700 hover:bg-amber-200';
    case LeadStatus.WON: return 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200';
    case LeadStatus.LOST: return 'bg-red-100 text-red-700 hover:bg-red-200';
    default: return 'bg-slate-100 text-slate-600';
  }
};