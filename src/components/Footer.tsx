import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from 'next/link';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

export function Footer() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link"><Link href='https://github.com/cortins-05'>@cortins-05</Link></Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-90 mr-3">
        <div className="flex justify-between gap-4">
          <Avatar>
            <AvatarImage src="https://avatars.githubusercontent.com/u/179585073?v=4" />
            <AvatarFallback>LC</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">@cortins-05</h4>
            <p className="text-sm">
              Created and maintained by @cortins-05.
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}