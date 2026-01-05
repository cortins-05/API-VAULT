"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function deleteProviderAction(id:number) {
    const providerID = Number(id)

    if (Number.isNaN(providerID)) {
        throw new Error('ID inválido')
    }

    await prisma.provider.delete({
        where: { id: providerID },
    })

    redirect("/gestor-proveedores");
}