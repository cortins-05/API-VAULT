'use server'
import { FormData } from '@/interfaces/gemini.interface'
import { prisma } from '@/lib/prisma'

export async function createApiAction(data: FormData) {
    try {
        const api = {
            name: data.name,
            description: data.description,
            deprecated: data.deprecated,
        };

        const provider = {
            name: data.provider,
            website: data.website || null,
            docsUrl: data.docsUrl,
            supportLevel: data.supportLevel === "" ? null : data.supportLevel,
            notes: data.notes || null,
            apis: {
                create: api,
            },
        };

        await prisma.provider.create({
            data: provider,
        });

        return true;

    } catch (error) {
        console.error("Error creating provider + api", error);
        throw error;
    }
}