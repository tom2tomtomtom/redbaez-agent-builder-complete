import React, { useEffect, useState } from 'react';
import { Activity, Server, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAgentStore } from '@/services/store';

const MonitoringDashboard = ({ deploymentId }: { deploymentId: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { metrics, updateMetrics } = useAgentStore();

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch(`/api/metrics/${deploymentId}`);
        const data = await response.json();
        updateMetrics(deploymentId, data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, [deploymentId]);

  if (isLoading) {
    return <div>Loading metrics...</div>;
  }

  const deploymentMetrics = metrics[deploymentId] || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-2 mb-2">
            <Server className="w-5 h-5 text-blue-500" />
            <h3 className="font-medium">Total Requests</h3>
          </div>
          <p className="text-2xl font-bold">
            {deploymentMetrics.reduce((sum, m) => sum + m.requestCount, 0)}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-green-500" />
            <h3 className="font-medium">Avg Response Time</h3>
          </div>
          <p className="text-2xl font-bold">
            {(deploymentMetrics.reduce((sum, m) => sum + m.avgLatency, 0) / deploymentMetrics.length || 0).toFixed(2)}ms
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-yellow-500" />
            <h3 className="font-medium">Error Rate</h3>
          </div>
          <p className="text-2xl font-bold">0%</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-medium mb-4">Response Time Trend</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={deploymentMetrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(time) => new Date(time).toLocaleTimeString()}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(time) => new Date(time).toLocaleString()}
              />
              <Line
                type="monotone"
                dataKey="avgLatency"
                stroke="#3b82f6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default MonitoringDashboard;
