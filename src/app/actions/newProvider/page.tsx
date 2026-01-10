import FormProvider from "./FormProvider";
import { getUserId } from "@/actions/auth/getUserId";
import ErrorAuthPage from "@/app/errorAuth/page";

export default async function NewApiIAPage() {
  
  const userId = await getUserId();

  if(!userId){
    return(
      <ErrorAuthPage/>
    );
  }

  return (
    <div className="p-6">
      
      <FormProvider />
      
    </div>
  );
}