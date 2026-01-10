import { signUp } from "@/lib/auth-client";

type SignUpInput = {
  name: string;
  email: string;
  password: string;
};

type SignUpResult =
  | { ok: true }
  | { ok: false; error: string };

export const signUpUser = async (
  { name, email, password }: SignUpInput
): Promise<SignUpResult> => {
  try {
    await signUp.email(
      { name, email, password },
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
          : "Error desconocido al registrar el usuario",
    };
  }
};