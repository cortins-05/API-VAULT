import { SignupForm } from "@/components/signup-form"
import { signIn, signUp } from "@/lib/auth-client"

export default function RegisterPage() {
    return (
        <main>
            <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
                <div className="w-full max-w-sm">
                    <SignupForm />
                </div>
            </div>
        </main>
    )
}
