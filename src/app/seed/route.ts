import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";

export const runtime = 'nodejs';

export async function GET() {

  // 🧹 Limpieza (hijos → padres)
  await prisma.apiContext.deleteMany();
  await prisma.apiFlag.deleteMany();
  await prisma.apiEvaluation.deleteMany();
  await prisma.apiMemory.deleteMany();
  await prisma.api.deleteMany();
  await prisma.provider.deleteMany();

  // =====================
  // 1️⃣ Providers
  // =====================
  const openAI = await prisma.provider.create({
    data: {
      name: 'OpenAI',
      website: 'https://openai.com',
      supportLevel: 'GOOD',
      notes: 'Cambios frecuentes en modelos y versiones'
    }
  });

  const google = await prisma.provider.create({
    data: {
      name: 'Google Cloud',
      website: 'https://cloud.google.com',
      supportLevel: 'GOOD',
      notes: 'Documentación extensa, configuración compleja'
    }
  });

  const aws = await prisma.provider.create({
    data: {
      name: 'AWS',
      website: 'https://aws.amazon.com',
      supportLevel: 'GOOD',
      notes: 'Muy potente, IAM complejo'
    }
  });

  const azure = await prisma.provider.create({
    data: {
      name: 'Azure Cognitive Services',
      website: 'https://azure.microsoft.com',
      supportLevel: 'AVERAGE'
    }
  });

  const rapidApi = await prisma.provider.create({
    data: {
      name: 'RapidAPI',
      website: 'https://rapidapi.com',
      supportLevel: 'AVERAGE',
      notes: 'Marketplace, calidad variable según proveedor'
    }
  });

  // =====================
  // 2️⃣ APIs
  // =====================
  const apis = await prisma.api.createMany({
    data: [
      // OpenAI
      {
        name: 'Chat Completions',
        description: 'Generación de texto conversacional',
        docsUrl: 'https://platform.openai.com/docs',
        providerId: openAI.id
      },
      {
        name: 'Embeddings',
        description: 'Vectores semánticos para búsqueda y clustering',
        docsUrl: 'https://platform.openai.com/docs',
        providerId: openAI.id
      },

      // Google
      {
        name: 'Vision API',
        description: 'OCR y análisis de imágenes',
        docsUrl: 'https://cloud.google.com/vision',
        providerId: google.id
      },
      {
        name: 'Translation API',
        description: 'Traducción automática de texto',
        docsUrl: 'https://cloud.google.com/translate',
        providerId: google.id
      },

      // AWS
      {
        name: 'Rekognition',
        description: 'Reconocimiento facial y de objetos',
        docsUrl: 'https://aws.amazon.com/rekognition',
        providerId: aws.id
      },
      {
        name: 'Textract',
        description: 'Extracción de texto y formularios',
        docsUrl: 'https://aws.amazon.com/textract',
        providerId: aws.id
      },

      // Azure
      {
        name: 'Text Analytics',
        description: 'Análisis de sentimiento y entidades',
        docsUrl: 'https://learn.microsoft.com/azure/cognitive-services',
        providerId: azure.id
      },
      {
        name: 'Translator',
        description: 'Traducción de texto multilenguaje',
        docsUrl: 'https://learn.microsoft.com/azure/ai-services/translator',
        providerId: azure.id
      },

      // RapidAPI
      {
        name: 'Email Validator API',
        description: 'Validación de emails',
        providerId: rapidApi.id
      },
      {
        name: 'Weather API',
        description: 'Datos meteorológicos',
        providerId: rapidApi.id
      }
    ]
  });

  // =====================
  // 3️⃣ Memorias técnicas
  // =====================
  const chatApi = await prisma.api.findFirst({ where: { name: 'Chat Completions' } });
  const rekognition = await prisma.api.findFirst({ where: { name: 'Rekognition' } });

  await prisma.apiMemory.createMany({
    data: [
      {
        apiId: chatApi!.id,
        type: 'SILENT_CHANGE',
        content: 'Cambios de modelo sin versionado explícito',
        project: 'API Vault'
      },
      {
        apiId: rekognition!.id,
        type: 'UNDOCUMENTED_BEHAVIOR',
        content: 'Resultados inconsistentes en imágenes similares',
        project: 'Security Scan'
      }
    ]
  });

  // =====================
  // 4️⃣ Evaluaciones
  // =====================
  await prisma.apiEvaluation.createMany({
    data: [
      {
        apiId: chatApi!.id,
        stability: 3,
        costValue: 3,
        performance: 4,
        support: 4,
        notes: 'Potente pero impredecible'
      },
      {
        apiId: rekognition!.id,
        stability: 5,
        costValue: 2,
        performance: 5,
        support: 4,
        notes: 'Muy estable, coste elevado'
      }
    ]
  });

  // =====================
  // 5️⃣ Flags
  // =====================
  await prisma.apiFlag.create({
    data: {
      apiId: chatApi!.id,
      level: 'WARNING',
      reason: 'Cambios silenciosos de comportamiento'
    }
  });

  // =====================
  // 6️⃣ Contextos
  // =====================
  await prisma.apiContext.createMany({
    data: [
      {
        apiId: chatApi!.id,
        type: 'RECOMMENDED',
        context: 'Prototipos y herramientas internas'
      },
      {
        apiId: chatApi!.id,
        type: 'AVOID',
        context: 'Sistemas críticos sin control de versión'
      },
      {
        apiId: rekognition!.id,
        type: 'RECOMMENDED',
        context: 'Sistemas de seguridad y análisis visual'
      }
    ]
  });

  return NextResponse.json({ message: 'Seed executed correctly' });
}