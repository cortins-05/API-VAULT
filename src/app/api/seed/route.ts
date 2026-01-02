import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export const runtime = 'nodejs';

export async function GET() {

  // ⚠️ ORDEN CORRECTO: primero hijos, luego padres
  await prisma.apiContext.deleteMany();
  await prisma.apiFlag.deleteMany();
  await prisma.apiEvaluation.deleteMany();
  await prisma.apiMemory.deleteMany();
  await prisma.api.deleteMany();
  await prisma.provider.deleteMany();

  // 1️⃣ Providers
  const openAI = await prisma.provider.create({
    data: {
      name: 'OpenAI',
      website: 'https://openai.com',
      docsUrl: 'https://platform.openai.com/docs',
      supportLevel: 'GOOD',
      notes: 'Soporte rápido, pero cambios frecuentes'
    }
  });

  const stripe = await prisma.provider.create({
    data: {
      name: 'Stripe',
      website: 'https://stripe.com',
      docsUrl: 'https://docs.stripe.com',
      supportLevel: 'GOOD'
    }
  });

  // 2️⃣ APIs
  const chatApi = await prisma.api.create({
    data: {
      name: 'Chat Completions',
      description: 'Generación de texto conversacional',
      providerId: openAI.id
    }
  });

  const paymentsApi = await prisma.api.create({
    data: {
      name: 'Payments API',
      description: 'Procesamiento de pagos',
      providerId: stripe.id
    }
  });

  // 3️⃣ Memoria técnica
  await prisma.apiMemory.createMany({
    data: [
      {
        apiId: chatApi.id,
        type: 'SILENT_CHANGE',
        content: 'Cambió el comportamiento del streaming sin aviso previo',
        project: 'API Vault',
        occurredAt: new Date('2024-11-10')
      },
      {
        apiId: chatApi.id,
        type: 'INCONSISTENCY',
        content: 'Respuestas diferentes con el mismo prompt',
        project: 'Chat interno'
      },
      {
        apiId: paymentsApi.id,
        type: 'BUG',
        content: 'Timeouts esporádicos en webhooks',
        project: 'E-commerce'
      }
    ]
  });

  // 4️⃣ Evaluación objetiva
  await prisma.apiEvaluation.createMany({
    data: [
      {
        apiId: chatApi.id,
        stability: 3,
        costValue: 4,
        performance: 4,
        support: 4,
        notes: 'Muy potente, pero poco predecible a veces'
      },
      {
        apiId: paymentsApi.id,
        stability: 5,
        costValue: 3,
        performance: 5,
        support: 5,
        notes: 'Extremadamente fiable en producción'
      }
    ]
  });

  // 5️⃣ Flags (radar)
  await prisma.apiFlag.createMany({
    data: [
      {
        apiId: chatApi.id,
        level: 'WARNING',
        reason: 'Cambios silenciosos en versiones'
      }
    ]
  });

  // 6️⃣ Contexto recomendado / evitar
  await prisma.apiContext.createMany({
    data: [
      {
        apiId: chatApi.id,
        type: 'RECOMMENDED',
        context: 'Prototipos rápidos'
      },
      {
        apiId: chatApi.id,
        type: 'AVOID',
        context: 'Aplicaciones críticas sin control de versión'
      },
      {
        apiId: paymentsApi.id,
        type: 'RECOMMENDED',
        context: 'Aplicaciones financieras'
      }
    ]
  });

  return NextResponse.json({ message: 'Seed executed correctly' });
}