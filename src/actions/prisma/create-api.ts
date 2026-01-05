'use server'
import { FormData } from '@/interfaces/gemini.interface'
import { ContextType, Eval, FlagLevel } from '@/interfaces/prisma.interface';
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache';

export async function createApiAction(data: FormData) {
    try {
        await prisma.api.create({
            data: {
                name: data.name,
                key: data.key || null,
                docsUrl: data.docsUrl || "",
                description: data.description,
                deprecated: data.deprecated,
                provider: {
                connect: {
                    id: Number(data.providerId),
                },
                },
            },
        });

        return true;

    } catch {
        return false
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

export async function createEvaluation(evaluation:Eval,apiID:number){
    try{

        const existe = await prisma.apiEvaluation.findUnique({where:{apiId:Number(apiID)}});

        if(existe) return;

        await prisma.apiEvaluation.create(
            {
                data: {
                    costValue: evaluation.costValue,
                    performance: evaluation.performance,
                    stability: evaluation.stability,
                    support: evaluation.support,
                    notes: evaluation.notes,
                    apiId: evaluation.apiId
                }
            }
        )
    }catch (err){
        console.log("Se ha producido un error al crear la evaluacion.");
        throw err;
    }
}

export async function createContextCard(apiId:number,context:string,type:ContextType) {
    try{
        await prisma.apiContext.create(
            {
                data:{
                    api: {
                        connect:{id:Number(apiId)}
                    },
                    context:context,
                    type:type
                }
            }
        );        
        revalidatePath(`/my-api/${apiId}`);
        return true;
    }catch (err){
        throw err;
    }
}

export async function createFlagAction(apiId:number,reason:string,type:FlagLevel) {
    try{
        await prisma.apiFlag.create(
            {
                data:{
                    api: {
                        connect:{id:Number(apiId)}
                    },
                    reason:reason,
                    level:type
                }
            }
        );        
        revalidatePath(`/my-api/${apiId}`);
        return true;
    }catch (err){
        throw err;
    }
}

