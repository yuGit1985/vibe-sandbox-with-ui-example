"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { FixedSessionRepository } from "@/fakes/fixed-session-repository";
import { FixedUserRepository } from "@/fakes/fixed-user-repository";
import type { User } from "@/ports/user-repository";
import { Authentication } from "@/usecases/authentication";

const sessionCookieName = "cliently-session";
const authentication = new Authentication(
  new FixedUserRepository(),
  new FixedSessionRepository(),
);

export type LoginState = {
  error?: string;
};

export async function getCurrentUser(): Promise<User | undefined> {
  const token = (await cookies()).get(sessionCookieName)?.value;
  return authentication.getCurrentUser(token);
}

export async function login(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    return { error: "メールアドレスとパスワードを入力してください。" };
  }

  try {
    const token = authentication.signIn(email, password);
    (await cookies()).set(sessionCookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 8,
      path: "/",
    });
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "ログインできませんでした。もう一度お試しください。",
    };
  }

  redirect("/");
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  authentication.signOut(cookieStore.get(sessionCookieName)?.value);
  cookieStore.delete(sessionCookieName);
  redirect("/");
}
