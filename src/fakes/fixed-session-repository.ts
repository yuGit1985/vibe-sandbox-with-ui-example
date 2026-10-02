import type { SessionRepository } from "@/ports/session-repository";

const demoUserId = "user-tanaka";
const demoSessionToken = "cliently-demo-session";

export class FixedSessionRepository implements SessionRepository {
  create(userId: string): string {
    if (userId !== demoUserId)
      throw new Error("ユーザーが見つかりませんでした。");
    return demoSessionToken;
  }

  findUserId(token: string): string | undefined {
    return token === demoSessionToken ? demoUserId : undefined;
  }

  delete(_token: string): void {
    // The prototype session ends when the input boundary deletes its cookie.
  }
}
