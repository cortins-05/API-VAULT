'use server'
import { FormData } from '@/interfaces/gemini.interface'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache';

export async function createApiAction(data: FormData) {
    try {
        const api = {
            name: data.name,
            key: data.key || null,
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

export async function createMemoryCard(apiId:number,content:string,proyect:string){
    try{
        await prisma.apiMemory.create(
            {
                data:{content,project:proyect,type:"OTHER",apiId:Number(apiId)}
            }
        );        
        revalidatePath(`/my-api/${apiId}`);
        return true;
    }catch (err){
        throw err;
    }
}