"use client";

import {format} from "date-fns";
import { Button } from "@/components/ui/button"
import Link from 'next/link';
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Provider } from "@/interfaces/prisma.interface";

interface Props{
  provider: Provider;
}

export function ProviderComponent({provider}:Props) {
  return (
    <Card className="w-full flex-1">
      <CardHeader>
        <CardTitle>{provider.name}</CardTitle>
        <CardDescription>
          {provider.notes}
        </CardDescription>
        <CardAction>
          <Button variant="link"><Link href={`/gestor-proveedores/${provider.id}`}>Show More</Link></Button>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col gap-6 ">
        <span className="text-gray-400 text-xs self-start">{format(provider.createdAt!, "dd MM yyyy")}</span>
      </CardFooter>
    </Card>
  )
}
