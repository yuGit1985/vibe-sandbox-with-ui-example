import type { SessionRepository } from "@/ports/session-repository";
import type { User, UserRepository } from "@/ports/user-repository";

export class Authentication {
  constructor(
    private readonly users: UserRepository,
    private readonly sessions: SessionRepository,
  ) {}

  signIn(email: string, password: string): string {
    const normalizedEmail = email.trim().toLocaleLowerCase("en");
    const user = this.users.findByEmail(normalizedEmail);

    if (!user || user.password !== password) {
      throw new Error("メールアドレスまたはパスワードが正しくありません。");
    }

    return this.sessions.create(user.id);
  }

  getCurrentUser(token: string | undefined): User | undefined {
    if (!token) return undefined;
    const userId = this.sessions.findUserId(token);
    if (!userId) return undefined;
    const user = this.users.findById(userId);
    if (!user) return undefined;

    const { password: _password, ...publicUser } = user;
    return publicUser;
  }

  signOut(token: string | undefined): void {
    if (token) this.sessions.delete(token);
  }
}
