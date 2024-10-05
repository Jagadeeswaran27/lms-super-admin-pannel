import AuthButton from "../components/common/AuthButton";
import { logout } from "../core/services/AuthService";

function HomePage() {
  async function handleLogout() {
    try {
      await logout();
    } catch (e) {}
  }
  return (
    <div className="text-black">
      HomePage
      <AuthButton onClick={handleLogout} text="logout" />
    </div>
  );
}

export default HomePage;
