'use client'

import { Button } from '@/components/ui/button'
import { deleteProviderAction } from '@/actions/prisma/delete-provider'

export function DeleteProviderButton({ id }: { id: number }) {
  return (
    <Button
      variant="destructive"
      onClick={() => deleteProviderAction(id)}
    >
      Borrar
    </Button>
  )
}