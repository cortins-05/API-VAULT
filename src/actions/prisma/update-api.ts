'use server'
import { FormData } from '@/interfaces/gemini.interface';
import { prisma } from '@/lib/prisma'

interface PropsUpdateKey {
    id: number;
    key: string 
}

export async function updateApiKey({id,key}:PropsUpdateKey) {
    try {

        const apiId = Number(id);

        if (Number.isNaN(apiId)) {
            throw new Error('ID inválido')
        }

        await prisma.api.update({
            where: {id: apiId},
            data: {key: key}
        });

        return true;

    } catch (error) {
        console.error("Error creating provider + api", error);
        throw error;
    }
}

export async function updateApi(data: FormData, id: number) {
    try {
        const apiId = Number(id);

        if (Number.isNaN(apiId)) {
            throw new Error('ID inválido');
        }

        // Primero obtenemos la API para saber el providerId
        const existingApi = await prisma.api.findUnique({
            where: { id: apiId },
            select: { providerId: true }
        });

        if (!existingApi) {
            throw new Error('API no encontrada');
        }

        // Actualizamos el Provider
        await prisma.provider.update({
            where: { id: existingApi.providerId },
            data: {
                name: data.provider,
                website: data.website || null,
                docsUrl: data.docsUrl,
                supportLevel: data.supportLevel === "" ? null : data.supportLevel,
                notes: data.notes || null,
            },
        });

        // Actualizamos la API
        await prisma.api.update({
            where: { id: apiId },
            data: {
                name: data.name,
                key: data.key || null,
                description: data.description,
                deprecated: data.deprecated,
            },
        });

        return true;

    } catch (error) {
        console.error("Error updating api + provider", error);
        throw error;
    }
}