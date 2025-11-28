import React, { useMemo } from 'react';
import { 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle,
  Clock
} from 'lucide-react';
import { Lead, LeadStatus, KPIStats } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface DashboardProps {
  leads: Lead[];
}

export const Dashboard: React.FC<DashboardProps> = ({ leads }) => {
  const stats: KPIStats = useMemo(() => {
    const now = Date.now();
    const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);
    
    return {
      total: leads.length,
      newLeads: leads.filter(l => l.createdAt > sevenDaysAgo).length,
      negotiation: leads.filter(l => l.status === LeadStatus.PROPOSAL || l.status === LeadStatus.CONTACTED).length,
      closed: leads.filter(l => l.status === LeadStatus.WON).length
    };
  }, [leads]);

  const chartData = useMemo(() => {
    const counts = leads.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(counts).map(key => ({
      name: key,
      value: counts[key]
    }));
  }, [leads]);

  const recentLeads = leads.slice(0, 5);

  const COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Total de Leads" 
          value={stats.total} 
          icon={Users} 
          trend="+12%" 
          color="bg-blue-500"
        />
        <KPICard 
          title="Novos (7 dias)" 
          value={stats.newLeads} 
          icon={TrendingUp} 
          trend="+5%" 
          color="bg-indigo-500"
        />
        <KPICard 
          title="Em Negociação" 
          value={stats.negotiation} 
          icon={Clock} 
          trend="Estável" 
          color="bg-amber-500"
        />
        <KPICard 
          title="Fechados" 
          value={stats.closed} 
          icon={CheckCircle2} 
          trend="+18%" 
          color="bg-emerald-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts Section */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Distribuição de Status</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Leads Recentes</h3>
          <div className="space-y-4">
            {recentLeads.length === 0 ? (
               <p className="text-slate-400 text-sm text-center py-4">Nenhum lead recente.</p>
            ) : (
              recentLeads.map((lead, idx) => (
                <div key={lead.id || idx} className="flex items-center space-x-3 p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
                  <div className={`w-2 h-2 rounded-full ${getStatusColorDot(lead.status)}`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{lead.name}</p>
                    <p className="text-xs text-slate-500 truncate">{lead.company || lead.email}</p>
                  </div>
                  <span className="text-xs text-slate-400 whitespace-nowrap">
                    {new Date(lead.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const KPICard = ({ title, value, icon: Icon, trend, color }: any) => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-start justify-between hover:shadow-md transition-shadow">
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
      <p className="text-xs text-emerald-600 font-medium mt-2 flex items-center">
        <TrendingUp size={12} className="mr-1" />
        {trend} <span className="text-slate-400 font-normal ml-1">vs mês anterior</span>
      </p>
    </div>
    <div className={`${color} p-3 rounded-lg text-white shadow-lg shadow-indigo-100`}>
      <Icon size={24} />
    </div>
  </div>
);

const getStatusColorDot = (status: LeadStatus) => {
  switch (status) {
    case LeadStatus.NEW: return 'bg-blue-500';
    case LeadStatus.WON: return 'bg-emerald-500';
    case LeadStatus.LOST: return 'bg-red-500';
    default: return 'bg-amber-500';
  }
};