import React, { useState, useEffect, useMemo } from 'react';
import { Users, UserPlus, Heart, Calendar } from 'lucide-react';
import StatCard from './StatCard';
import QuickActions from './QuickActions';
import RecentActivity from './RecentActivity';
import BarChart from './BarChart';
import PieChart from './PieChart';
import LineChart from './LineChart';
import { contactService } from '../../services/contactService';
import { useContactHistory } from '../../hooks/useContactHistory';

const Dashboard = () => {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { history } = useContactHistory();

  // Cargar contactos
  useEffect(() => {
    const loadContacts = async () => {
      try {
        setIsLoading(true);
        const { contacts: contactsData } = await contactService.fetchContacts();
        setContacts(contactsData || []);
      } catch (error) {
        console.error('Error loading contacts:', error);
        setContacts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadContacts();
  }, []);

  // Calcular estadísticas
  const stats = useMemo(() => {
    if (isLoading) return null;

    const total = contacts.length;
    const favorites = contacts.filter(contact => contact.isFavorite).length;
    
    // Contactos por categoría
    const byCategory = contacts.reduce((acc, contact) => {
      const category = contact.category || 'otros';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    // Contactos recientes (últimos 7 días)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recent = contacts.filter(contact => {
      if (!contact.createdAt) return false;
      const createdDate = new Date(contact.createdAt);
      return createdDate >= sevenDaysAgo;
    }).length;

    return {
      total,
      favorites,
      recent,
      byCategory
    };
  }, [contacts, isLoading]);

  // Datos para gráfico de barras (contactos por categoría)
  const barChartData = useMemo(() => {
    if (!stats) return [];
    
    return Object.entries(stats.byCategory).map(([category, count]) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      value: count
    }));
  }, [stats]);

  // Datos para gráfico circular (distribución por categoría)
  const pieChartData = useMemo(() => {
    if (!stats) return [];
    
    return Object.entries(stats.byCategory).map(([category, count]) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      value: count
    }));
  }, [stats]);

  // Datos para gráfico de líneas (contactos por mes)
  const lineChartData = useMemo(() => {
    if (!contacts.length) return [];

    // Agrupar contactos por mes
    const contactsByMonth = contacts.reduce((acc, contact) => {
      if (!contact.createdAt) return acc;
      
      const date = new Date(contact.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      
      if (!acc[monthKey]) {
        acc[monthKey] = { name: monthName, value: 0 };
      }
      acc[monthKey].value += 1;
      
      return acc;
    }, {});

    // Convertir a array y ordenar por fecha
    return Object.values(contactsByMonth).sort((a, b) => {
      const dateA = new Date(a.name);
      const dateB = new Date(b.name);
      return dateA - dateB;
    });
  }, [contacts]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-transparent relative p-6">
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-700/50 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-slate-800/50 rounded-xl border border-slate-700/50"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-80 bg-slate-800/50 rounded-xl border border-slate-700/50"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
      <div className="min-h-screen w-full bg-transparent relative p-6">
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white/90 mb-2">
            Dashboard
          </h1>
          <p className="text-slate-400">
            Overview of your contact management system
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Contacts"
            value={stats?.total || 0}
            icon={Users}
            color="blue"
            trend="up"
            trendValue="+12%"
          />
          <StatCard
            title="Recent Contacts"
            value={stats?.recent || 0}
            icon={UserPlus}
            color="green"
            trend="up"
            trendValue="Last 7 days"
          />
          <StatCard
            title="Favorites"
            value={stats?.favorites || 0}
            icon={Heart}
            color="purple"
            trend="neutral"
            trendValue={`${stats?.total > 0 ? Math.round((stats.favorites / stats.total) * 100) : 0}%`}
          />
          <StatCard
            title="Categories"
            value={Object.keys(stats?.byCategory || {}).length}
            icon={Calendar}
            color="orange"
            trend="neutral"
            trendValue="Active"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <QuickActions />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Bar Chart */}
          <BarChart
            data={barChartData}
            title="Contacts by Category"
            subtitle="Distribution of contacts across different categories"
          />

          {/* Pie Chart */}
          <PieChart
            data={pieChartData}
            title="Category Distribution"
            subtitle="Percentage breakdown of contact categories"
          />

          {/* Line Chart */}
          <LineChart
            data={lineChartData}
            title="Contact Growth"
            subtitle="Contacts added over time"
            type="area"
          />

          {/* Recent Activity */}
          <RecentActivity limit={5} />
        </div>

        {/* Additional Stats */}
        {stats && stats.total > 0 && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white/90 mb-4">
              Quick Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
                <p className="text-2xl font-bold text-blue-400">
                  {Math.round((stats.favorites / stats.total) * 100)}%
                </p>
                <p className="text-sm text-slate-400">Favorite Rate</p>
              </div>
              <div className="text-center p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
                <p className="text-2xl font-bold text-green-400">
                  {stats.recent}
                </p>
                <p className="text-sm text-slate-400">Added This Week</p>
              </div>
              <div className="text-center p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
                <p className="text-2xl font-bold text-purple-400">
                  {history.length}
                </p>
                <p className="text-sm text-slate-400">Total Activities</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;