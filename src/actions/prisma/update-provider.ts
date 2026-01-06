'use server'
import { Provider } from '@/interfaces/prisma.interface';
import { prisma } from '@/lib/prisma'

export async function updateProvider(data: Partial<Provider>, id: number) {
    try {
        const providerID = Number(id);

        if (Number.isNaN(providerID)) {
            throw new Error('ID inválido');
        }

        // Primero obtenemos la API para saber el providerId
        const existingProvider = await prisma.provider.findUnique({
            where: { id: providerID }
        });

        if (!existingProvider) {
            throw new Error('API no encontrada');
        }

        // Actualizamos la API
        await prisma.provider.update({
            where: { id: existingProvider.id },
            data:{
                name:data.name,
                supportLevel:data.supportLevel||existingProvider.supportLevel,
                notes:data.notes,
            }
        });

        return true;

    } catch {
        return false
    }
}