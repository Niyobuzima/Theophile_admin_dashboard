import { useEffect, useState } from 'react';
import { fetchDailyUserStats, fetchUsers } from '../lib/api';
import { type DailyStats, type User} from '@/types/user.types';
import UsersChart from '../components/UsersChart';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export default function Analytics() {
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, usersData] = await Promise.all([
          fetchDailyUserStats(),
          fetchUsers(),
        ]);
        setDailyStats(statsData);
        setUsers(usersData);
      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  // Calculate role distribution
  const roleDistribution = [
    { name: 'Admin', value: users.filter((u) => u.role === 'admin').length, color: '#f59e0b' },
    { name: 'User', value: users.filter((u) => u.role === 'user').length, color: '#3b82f6' },
  ];

  // Calculate status distribution
  const statusDistribution = [
    { name: 'Active', value: users.filter((u) => u.status === 'active').length, color: '#22c55e' },
    { name: 'Inactive', value: users.filter((u) => u.status === 'inactive').length, color: '#ef4444' },
  ];

  return (
    <div className="space-y-6">
      {/* Main Chart */}
      <Card>
        <CardContent className="pt-6">
          <UsersChart />
        </CardContent>
      </Card>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Role Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>User Roles Distribution</CardTitle>
            <CardDescription>Distribution of users by role type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={roleDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {roleDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>User Status Distribution</CardTitle>
            <CardDescription>Distribution of users by account status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Stats Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Summary Statistics</CardTitle>
          <CardDescription>Key metrics for the last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border bg-card p-4 text-center">
              <p className="mb-1 text-3xl font-bold text-primary">
                {dailyStats.reduce((sum, stat) => sum + stat.count, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Total Registrations (7 days)</p>
            </div>

            <div className="rounded-lg border bg-card p-4 text-center">
              <p className="mb-1 text-3xl font-bold text-primary">
                {(dailyStats.reduce((sum, stat) => sum + stat.count, 0) / 7).toFixed(1)}
              </p>
              <p className="text-sm text-muted-foreground">Average Per Day</p>
            </div>

            <div className="rounded-lg border bg-card p-4 text-center">
              <p className="mb-1 text-3xl font-bold text-primary">
                {Math.max(...dailyStats.map((s) => s.count))}
              </p>
              <p className="text-sm text-muted-foreground">Peak Day</p>
            </div>

            <div className="rounded-lg border bg-card p-4 text-center">
              <p className="mb-1 text-3xl font-bold text-primary">
                {((users.filter((u) => u.status === 'active').length / users.length) * 100).toFixed(0)}%
              </p>
              <p className="text-sm text-muted-foreground">Active Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
