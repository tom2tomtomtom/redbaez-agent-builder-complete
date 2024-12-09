export interface AgentConfig {
  id?: string;
  name: string;
  description: string;
  model: string;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  personality: string;
  capabilities: string[];
  goals: string[];
}

export interface DeploymentConfig {
  id: string;
  agentId: string;
  status: string;
  endpoint: string;
  metrics: MetricData[];
}

export interface MetricData {
  requestCount: number;
  avgLatency: number;
  timestamp: string;
}
