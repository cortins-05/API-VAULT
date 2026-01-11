export const dynamic = 'force-dynamic';

import { redirect } from "next/navigation";
import { getSessionUser } from "@/actions/auth/getUserId";
import ProfileCard from './ProfileCard';

export default async function ProfilePage() {

  const user  = await getSessionUser();

  if(!user){
    redirect("/auth/login");
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <ProfileCard user={user} />
    </div>
  );
}