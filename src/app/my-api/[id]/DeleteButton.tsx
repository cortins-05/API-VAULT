'use client'

import { Button } from '@/components/ui/button'
import { deleteApiAction } from '@/actions/delete-api'

export function DeleteApiButton({ id }: { id: number }) {
  return (
    <Button
      variant="destructive"
      onClick={() => deleteApiAction(id)}
    >
      Borrar
    </Button>
  )
}