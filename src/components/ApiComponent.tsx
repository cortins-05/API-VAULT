import { Api } from "../../generated/prisma/client";
import {format} from "date-fns";

interface Props{
  api: Api;
}

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

export function ApiComponent({api}:Props) {
  return (
    <Card className="flex-1 w-full">
      <CardHeader>
        <CardTitle>{api.name}</CardTitle>
        <CardDescription>
          {api.description}
        </CardDescription>
        <CardAction>
          <Button variant="link"><Link href={`/my-api/${api.id}`}>Show More</Link></Button>
        </CardAction>
      </CardHeader>
      <CardFooter>
        <span className="text-gray-400 text-xs self-start">{format(api.createdAt, "dd MM yyyy")}</span>
      </CardFooter>
    </Card>
  )
}
