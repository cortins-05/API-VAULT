'use server'
import { Provider } from '@/interfaces/prisma.interface'
import { prisma } from '@/lib/prisma'

export async function getProviders() {
    return await prisma.provider.findMany();
}

export async function createProvider(data: Provider) {
    try {

        const provider = {
            name: data.name,
            website: data.website || null,
            docsUrl: data.docsUrl,
            supportLevel: data.supportLevel === "" ? null : data.supportLevel,
            notes: data.notes || null,
        };

        await prisma.provider.create({
            data: provider,
        });

        return true;

    } catch {
        return false;
    }
}