'use server'

import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export async function deleteApiAction(id: string | number) {
  const apiId = Number(id)

  if (Number.isNaN(apiId)) {
    throw new Error('ID inválido')
  }

  await prisma.api.delete({
    where: { id: apiId },
  })

  redirect('/gestor-apis/all')
}