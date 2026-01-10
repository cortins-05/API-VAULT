'use server'
import { Provider } from '@/interfaces/prisma.interface'
import { prisma } from '@/lib/prisma'

export async function getProviders() {
    return await prisma.provider.findMany();
}

export async function createProvider({name,website,supportLevel,notes,userId}: Provider) {
    try {

        await prisma.provider.create({
            data: {
                name,
                website,
                supportLevel: supportLevel=='' ? null : supportLevel,
                notes,
                user: {
                    connect: {
                        id: userId
                    }
                }
            }
        });

        return true;

    } catch {
        return false;
    }
}