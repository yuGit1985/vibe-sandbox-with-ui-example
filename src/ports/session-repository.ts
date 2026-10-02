export interface SessionRepository {
  create(userId: string): string;
  findUserId(token: string): string | undefined;
  delete(token: string): void;
}
