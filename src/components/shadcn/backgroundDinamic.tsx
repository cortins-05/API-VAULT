'use client';
import { motion } from 'framer-motion';
import { RollingText } from '../text/rolling-text';
import { ShimmeringText } from '../text/shmiring-text';
import { TextGenerateEffect } from '../text/text-generate-effect';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useSession } from '@/lib/auth-client';
import { LucideMailWarning } from "lucide-react";

function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    color: `rgba(15,23,42,${0.1 + i * 0.03})`,
    width: 0.5 + i * 0.03,
  }));

  

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        className="w-full h-full text-slate-950 dark:text-white"
        viewBox="0 0 696 316"
        fill="none"
      >
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.1 + path.id * 0.03}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.3, 0.6, 0.3],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              // eslint-disable-next-line react-hooks/purity
              duration: 20 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'linear',
            }}
          />
        ))}
      </svg>
    </div>
  );
}

interface Props {
  title:string;
  titleDestacable: string;
  subtitle: string;
}

export function BackgroundPaths({title,titleDestacable,subtitle}:Props) {
  
  const session = useSession();

  const emailVerified = session.data?.user.emailVerified;

  const aviso = emailVerified === false;

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-white dark:bg-neutral-950">
      <div className="absolute inset-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>
      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="w-full text-center flex flex-col justify-center"
        >
          <div className="text-2xl sm:text-4xl md:text-6xl font-bold text-center pb-20">
            <ShimmeringText text={title} /> <RollingText className="text-blue-500" text={titleDestacable}/>
          </div>

          <div>
            <TextGenerateEffect 
              words={subtitle}
              className="text-xl sm:text-2xl md:text-4xl text-center text-red-500"
              duration={1}
              staggerDelay={1}
            />
          </div>

          {
            !session.data?.user.id
            &&
            <div className='mt-30'>
              <Button variant={"outline"} size={"lg"}><Link href={"/auth/login"} className='text-2xl' >Sign In</Link></Button>
            </div>
          }
          
        </motion.div>
      </div>
      {
        aviso
        &&
        <Link className='absolute top-5 left-5 bg-accent p-5 rounded-2xl font-bold flex gap-3' href={"/profile"}>
          <LucideMailWarning/> If you don&apos;t verify your email in 24 hours your account will be deleted.
        </Link>
      }
    </div>
  );
}