export const dynamic = 'force-dynamic';

import { emptyApiDraft } from "@/interfaces/gemini.interface";
import FormConfirm from '@/components/CreateFormConfirm'
import { getProviders } from "@/actions/prisma/create-provider";
import NoProvidersError from "@/components/NoProvidersError";
import { getUserId } from "@/actions/auth/getUserId";
import ErrorAuthPage from "@/app/errorAuth/page";

export default async function NewApiIAPage() {

  const userId = await getUserId();

  if(!userId){
    return(
      <ErrorAuthPage/>
    );
  }

  const providers = await getProviders(userId);

  return (
    <div className="p-6">
      {
        providers.length > 0
        ?
        <FormConfirm data={emptyApiDraft} />
        :
        <NoProvidersError/>
      }
    </div>
  );
}