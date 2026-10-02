export type User = {
  id: string;
  email: string;
  displayName: string;
  team: string;
  initials: string;
};

export type UserWithCredentials = User & {
  password: string;
};

export interface UserRepository {
  findByEmail(email: string): UserWithCredentials | undefined;
  findById(id: string): UserWithCredentials | undefined;
}
