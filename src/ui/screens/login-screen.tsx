"use client";

import { useActionState } from "react";
import type { LoginState } from "@/inputs/authentication";
import { LockIcon, MailIcon } from "@/ui/components/icons";
import styles from "./login-screen.module.css";

type Props = {
  loginAction: (state: LoginState, formData: FormData) => Promise<LoginState>;
};

const initialState: LoginState = {};

export function LoginScreen({ loginAction }: Props) {
  const [state, formAction, pending] = useActionState(
    loginAction,
    initialState,
  );

  return (
    <main className={styles.page}>
      <section className={styles.introduction}>
        <div className={styles.brand}>
          <span className={styles.brandMark}>C</span>
          <span>Cliently</span>
        </div>
        <div className={styles.message}>
          <p className={styles.eyebrow}>CUSTOMER RELATIONSHIP</p>
          <h1>
            顧客との関係を、
            <br />
            ひとつの場所で丁寧に。
          </h1>
          <p>
            大切な会話も、次のアクションも。
            <br />
            チームで共有しながら顧客との関係を育てます。
          </p>
        </div>
        <p className={styles.copyright}>© 2026 Cliently</p>
      </section>

      <section className={styles.loginArea} aria-labelledby="login-title">
        <div className={styles.loginCard}>
          <div className={styles.mobileBrand}>
            <span className={styles.brandMark}>C</span>
            <span>Cliently</span>
          </div>
          <div className={styles.lockBadge}>
            <LockIcon />
          </div>
          <p className={styles.welcome}>WELCOME BACK</p>
          <h2 id="login-title">ログイン</h2>
          <p className={styles.description}>
            ワークスペースにアクセスするため、
            <br />
            アカウント情報を入力してください。
          </p>

          <form action={formAction} className={styles.form}>
            <label htmlFor="email">メールアドレス</label>
            <div className={styles.field}>
              <MailIcon />
              <input
                id="email"
                name="email"
                type="email"
                defaultValue="tanaka@cliently.example"
                autoComplete="username"
                required
              />
            </div>

            <div className={styles.passwordLabel}>
              <label htmlFor="password">パスワード</label>
              <span>デモアカウント</span>
            </div>
            <div className={styles.field}>
              <LockIcon />
              <input
                id="password"
                name="password"
                type="password"
                defaultValue="Cliently2026!"
                autoComplete="current-password"
                required
              />
            </div>

            {state.error && (
              <p className={styles.error} role="alert">
                {state.error}
              </p>
            )}

            <button type="submit" disabled={pending}>
              {pending ? "確認しています..." : "ログイン"}
            </button>
          </form>

          <div className={styles.demoNote}>
            <strong>DEMO ACCOUNT</strong>
            <span>入力済みの認証情報でお試しいただけます。</span>
          </div>
        </div>
      </section>
    </main>
  );
}
