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
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{api.name}</CardTitle>
        <CardDescription>
          {api.description}
        </CardDescription>
        <CardAction>
          <Button variant="link"><Link href={`/my-api/${api.id}`}>Show More</Link></Button>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col gap-6 ">
        <span className="text-gray-400 text-xs self-start">{format(api.createdAt, "dd MM yyyy")}</span>
      </CardFooter>
    </Card>
  )
}
