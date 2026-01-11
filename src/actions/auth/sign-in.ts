import { signIn } from "@/lib/auth-client";

type SignInInput = {
  email: string;
  password: string;
};

type SignInResult =
  | { ok: true }
  | { ok: false; error: string };

export const signInUser = async (
  { email, password }: SignInInput
): Promise<SignInResult> => {
  try {
    await signIn.email(
      {
        email,
        password,
        rememberMe: false,
        callbackURL: "/"
      },
      {
        onError: (ctx) => {
          throw new Error(ctx.error.message);
        },
      }
    );

    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error
          ? err.message
          : "Error desconocido al iniciar sesión",
    };
  }
};