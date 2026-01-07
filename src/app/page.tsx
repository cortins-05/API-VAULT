import { BackgroundPaths } from "@/components/shadcn/backgroundDinamic";

export default function Home() {

  return (
    <main className="w-full h-full flex flex-col gap-20 items-center justify-center" >

      <BackgroundPaths title="Welcome to" titleDestacable="Api Vault" subtitle="Code better, think less." />

    </main>
  );
}
