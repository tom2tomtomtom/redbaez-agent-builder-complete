import create from 'zustand';
import { AgentConfig, DeploymentConfig, MetricData } from '@/types';

interface AgentStore {
  agents: AgentConfig[];
  deployments: DeploymentConfig[];
  metrics: Record<string, MetricData[]>;
  setAgents: (agents: AgentConfig[]) => void;
  addAgent: (agent: AgentConfig) => void;
  updateAgent: (agent: AgentConfig) => void;
  setDeployments: (deployments: DeploymentConfig[]) => void;
  updateMetrics: (deploymentId: string, metrics: MetricData[]) => void;
}

export const useAgentStore = create<AgentStore>((set) => ({
  agents: [],
  deployments: [],
  metrics: {},
  setAgents: (agents) => set({ agents }),
  addAgent: (agent) => set((state) => ({ agents: [...state.agents, agent] })),
  updateAgent: (agent) => set((state) => ({
    agents: state.agents.map((a) => (a.id === agent.id ? agent : a))
  })),
  setDeployments: (deployments) => set({ deployments }),
  updateMetrics: (deploymentId, metrics) => set((state) => ({
    metrics: { ...state.metrics, [deploymentId]: metrics }
  }))
}));
