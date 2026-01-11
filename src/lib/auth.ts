import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { sendEmail } from "@/helper/sendEmail";

export const auth = betterAuth({
    user: {
        deleteUser: {
            enabled: true
        }
    },
    emailVerification: {
        sendOnSignIn: true, // envía correo automáticamente al iniciar sesión
        sendVerificationEmail: async ({ user, url, token }, request) => {
        // Envía el correo de forma asíncrona
        void sendEmail({
            to: user.email,
            subject: "Verifica tu correo",
            text: `Hola ${user.name}, haz click aquí para verificar tu correo: ${url}`,
            html: `<p>Hola ${user.name}, haz click aquí para verificar tu correo: <a href="${url}">Verificar</a></p>`,
        });
        },
    },
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true
    },
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
            
        },
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        }
    },
});