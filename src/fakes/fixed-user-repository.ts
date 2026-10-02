import type {
  UserRepository,
  UserWithCredentials,
} from "@/ports/user-repository";

const demoUser: UserWithCredentials = {
  id: "user-tanaka",
  email: "tanaka@cliently.example",
  password: "Cliently2026!",
  displayName: "田中 彩",
  team: "セールスチーム",
  initials: "田",
};

const clone = (user: UserWithCredentials): UserWithCredentials => ({ ...user });

export class FixedUserRepository implements UserRepository {
  findByEmail(email: string): UserWithCredentials | undefined {
    return email === demoUser.email ? clone(demoUser) : undefined;
  }

  findById(id: string): UserWithCredentials | undefined {
    return id === demoUser.id ? clone(demoUser) : undefined;
  }
}
