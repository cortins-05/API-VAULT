import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {format} from "date-fns";

import { prisma } from "@/lib/prisma";
import { ArrowRight } from "lucide-react";
import Link from 'next/link';

export default async function MyApiPage({params}:{params:Promise<{id:number}>}) {
    const { id } = await params;

    if(isNaN(id)){
        throw new Error("El id no es válido.");
    }

    const api = await prisma.api.findUnique({where:{id:Number(id)}});
    const contexts = await prisma.apiContext.findMany({where:{apiId:Number(id)}});
    const evaluation = await prisma.apiEvaluation.findMany({where:{apiId:Number(id)}});

    const flags = await prisma.apiFlag.findMany({where:{apiId:Number(id)}});
    const warnings = [];
    const black = [];
    const gray = [];

    for(const flag of flags){
        if(flag.level=="WARNING") warnings.push(flag);
        if(flag.level=="BLACK") black.push(flag);
        if(flag.level=="GRAY") gray.push(flag);
    }

    const memories = await prisma.apiMemory.findMany({where:{apiId:Number(id)}});
    const provider = await prisma.provider.findUnique({where:{id:Number(api?.providerId)}})

    return (
        <div className="h-full flex flex-col justify-around items-center p-5">
            <h1 className="text-6xl font-bold underline underline-offset-8 self-center justify-self-start">{api?.name}</h1>
            <div className="grid grid-cols-3 justify-center justify-items-start w-4/5 gap-7">
                <div className="min-w-3xs flex flex-col gap-5">
                    <h1 className="text-3xl font-bold text-blue-500">API:</h1>  
                    <p>{api?.description}</p>
                    <p className="text-gray-400">{format(api!.createdAt,"dd mm yy")}</p>
                </div>
                <div className="min-w-3xs flex flex-col gap-5">
                    <h1 className="text-3xl font-bold text-blue-500">Contexts:</h1>  
                    <ul>
                        {
                            contexts.map(context => (
                                <li key={context.id}>{context.context}</li>
                            ))
                        }
                    </ul>
                </div>
                <div className="min-w-3xs flex flex-col gap-5">
                    <h1 className="text-3xl font-bold text-blue-500">Evaluations:</h1>  
                    <ul>
                        {
                            evaluation.map(eva => (
                                <li key={eva.id}>
                                    <p><span className="font-bold">Cost Value:</span> {eva.costValue}/5.</p>
                                    <p><span className="font-bold">Perfomance</span>: {eva.performance}/5.</p>
                                    <p><span className="font-bold">Stability</span>: {eva.stability}/5.</p>
                                    <p><span className="font-bold">Support</span>: {eva.support}/5.</p>
                                    <p><span className="font-bold">Notes</span>: {eva.notes}.</p>
                                </li>
                            ))
                        }
                    </ul>
                </div>
                <div className="min-w-3xs flex flex-col gap-5">
                    <h1 className="text-3xl font-bold text-blue-500">Flags:</h1>  
                    <div className="flex flex-wrap gap-5">
                        <div>
                            {warnings.map(warning=>(
                                <p key={warning.id} className="bg-amber-400 text-center rounded-2xl p-2">{warning.reason}</p>
                            ))}
                        </div>
                        <div>
                            {black.map(bl=>(
                                <p key={bl.id} className="bg-amber-400 text-center rounded-2xl p-2">{bl.reason}</p>
                            ))}
                        </div>
                        <div>
                            {gray.map(gr=>(
                                <p key={gr.id} className="bg-amber-400 text-center rounded-2xl p-2">{gr.reason}</p>
                            ))}
                        </div>
                    </div>
                </div>
                
                <div className="min-w-3xs flex flex-col gap-5">
                    <h1 className="text-3xl font-bold text-blue-500">Memories:</h1>  
                    <div className="flex flex-wrap gap-5">
                        {
                            memories.map(memorie=>(
                                <p key={memorie.id} >
                                    {memorie.content} <ArrowRight/> {memorie.project} 
                                </p>
                            ))
                        }
                    </div>
                </div>

                <div className="min-w-3xs flex flex-col gap-5">
                    <h1 className="text-3xl font-bold text-blue-500">Provider Info:</h1>  
                    <div className="flex flex-col gap-5">
                        {
                            provider?.website
                            ? <p><Link className="text-xl font-bold" href={provider?.website}>Nombre: {provider?.name}</Link></p>
                            : <p className="text-xl font-bold">Nombre: {provider?.name}</p>
                        }
                        <p>{provider?.notes}</p>
                        {
                            provider?.docsUrl!=undefined ? <Link href={provider?.docsUrl} className="text-blue-300 underline underline-offset-4">Docs url</Link> : ""
                        }
                    </div>
                </div>

            </div>
        </div>
    );
}