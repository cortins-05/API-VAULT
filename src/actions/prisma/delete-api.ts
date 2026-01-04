'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function deleteApiAction(id: string | number) {
  const apiId = Number(id)

  if (Number.isNaN(apiId)) {
    throw new Error('ID inválido')
  }

  await prisma.api.delete({
    where: { id: apiId },
  })

  redirect('/gestor-apis')
}

export async function deleteMemoryAction(id: number,apiId:number) {
  const memoryId = Number(id)

  if (Number.isNaN(memoryId)) {
    throw new Error('ID inválido')
  }

  await prisma.apiMemory.delete({
    where: { id: memoryId },
  }).then(()=>{revalidatePath("/my-api/"+apiId)});

}

export async function deleteEvaluationAction(id: number) {
  const evaluationID = Number(id)

  if (Number.isNaN(evaluationID)) {
    throw new Error('ID inválido')
  }

  await prisma.apiEvaluation.delete({
    where: { id: evaluationID },
  })
}

