import { getCurrentUser, login, logout } from "@/inputs/authentication";
import { CustomerDashboardContainer } from "@/inputs/customer-dashboard-container";
import { LoginScreen } from "@/ui/screens/login-screen";

export default async function Home() {
  const user = await getCurrentUser();

  if (!user) return <LoginScreen loginAction={login} />;

  return <CustomerDashboardContainer user={user} logoutAction={logout} />;
}
