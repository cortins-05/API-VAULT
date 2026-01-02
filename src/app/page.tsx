import { RollingText } from "@/components/text/rolling-text";
import { ShimmeringText } from "@/components/text/shmiring-text";
import { TextGenerateEffect } from "@/components/text/text-generate-effect";

export default function Home() {
  return (
    <main className="w-full h-full flex flex-col gap-20 items-center justify-center" >

      <span className="text-6xl font-bold">
        <ShimmeringText text="Welcome to" /> <RollingText className="text-blue-500" text="Api Vault"/>
      </span>

      <div>
        <TextGenerateEffect 
          words="Code better, think less."
          className="text-2xl md:text-4xl text-center max-w-2xl text-red-500"
          duration={1}
          staggerDelay={1}
        />
      </div>

    </main>
  );
}
