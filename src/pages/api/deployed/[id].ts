import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { generateResponse } from '@/services/ai';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const startTime = Date.now();
  const { id } = req.query;

  try {
    const agent = await prisma.agent.findUnique({
      where: { id: String(id) },
      include: { deployments: true }
    });

    if (!agent || !agent.deployments.some(d => d.status === 'active')) {
      return res.status(404).json({ error: 'Agent not found or not deployed' });
    }

    const response = await generateResponse(req.body.prompt, agent);
    const latency = Date.now() - startTime;

    // Update metrics
    await prisma.metric.create({
      data: {
        deploymentId: agent.deployments[0].id,
        requestCount: 1,
        avgLatency: latency
      }
    });

    res.status(200).json({ response });
  } catch (error) {
    res.status(500).json({ error: 'Error processing request' });
  }
}
