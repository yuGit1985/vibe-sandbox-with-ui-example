import { describe, expect, it } from "vitest";
import type { SessionRepository } from "@/ports/session-repository";
import type {
  UserRepository,
  UserWithCredentials,
} from "@/ports/user-repository";
import { Authentication } from "./authentication";

const user: UserWithCredentials = {
  id: "user-1",
  email: "tanaka@cliently.example",
  password: "secret-password",
  displayName: "田中 彩",
  team: "セールスチーム",
  initials: "田",
};

class TestUserRepository implements UserRepository {
  findByEmail(email: string): UserWithCredentials | undefined {
    return email === user.email ? { ...user } : undefined;
  }

  findById(id: string): UserWithCredentials | undefined {
    return id === user.id ? { ...user } : undefined;
  }
}

class TestSessionRepository implements SessionRepository {
  deletedToken: string | undefined;

  create(userId: string): string {
    return `session-${userId}`;
  }

  findUserId(token: string): string | undefined {
    return token === "session-user-1" ? "user-1" : undefined;
  }

  delete(token: string): void {
    this.deletedToken = token;
  }
}

describe("Authentication", () => {
  it("正しい認証情報でセッションを作成する", () => {
    const authentication = new Authentication(
      new TestUserRepository(),
      new TestSessionRepository(),
    );

    expect(
      authentication.signIn("  TANAKA@CLIENTLY.EXAMPLE ", "secret-password"),
    ).toBe("session-user-1");
  });

  it("誤った認証情報を拒否する", () => {
    const authentication = new Authentication(
      new TestUserRepository(),
      new TestSessionRepository(),
    );

    expect(() =>
      authentication.signIn("tanaka@cliently.example", "wrong-password"),
    ).toThrow("メールアドレスまたはパスワードが正しくありません。");
  });

  it("有効なセッションからパスワードを除いたユーザーを返す", () => {
    const authentication = new Authentication(
      new TestUserRepository(),
      new TestSessionRepository(),
    );

    expect(authentication.getCurrentUser("session-user-1")).toEqual({
      id: "user-1",
      email: "tanaka@cliently.example",
      displayName: "田中 彩",
      team: "セールスチーム",
      initials: "田",
    });
    expect(authentication.getCurrentUser("invalid-session")).toBeUndefined();
  });

  it("サインアウト時にセッションを破棄する", () => {
    const sessions = new TestSessionRepository();
    const authentication = new Authentication(
      new TestUserRepository(),
      sessions,
    );

    authentication.signOut("session-user-1");
    expect(sessions.deletedToken).toBe("session-user-1");
  });
});
