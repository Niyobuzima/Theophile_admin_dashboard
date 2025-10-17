import { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Analytics from './pages/Analytics';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const pageConfig = {
    dashboard: {
      title: 'Dashboard',
      subtitle: 'Welcome to your admin panel overview',
      component: <Dashboard />,
    },
    users: {
      title: 'User Management',
      subtitle: 'Manage and monitor all user accounts',
      component: <Users />,
    },
    analytics: {
      title: 'Analytics',
      subtitle: 'View detailed statistics and insights',
      component: <Analytics />,
    },
  };

  const config = pageConfig[currentPage as keyof typeof pageConfig] || pageConfig.dashboard;

  return (
    <Layout
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      title={config.title}
      subtitle={config.subtitle}
    >
      {config.component}
    </Layout>
  );
}
