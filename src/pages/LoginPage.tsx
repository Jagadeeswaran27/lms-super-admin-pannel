import { useContext } from "react";
import AuthButton from "../components/common/AuthButton";
import InputField from "../components/common/InputField";
import React from "react";
import { emailRegex } from "../constants/RegEx";
import { login } from "../core/services/AuthService";
import { useNavigate } from "react-router-dom";
import { SnackBarContext } from "../store/SnackBarContext";
import { showSnackBar } from "../utils/snackbar";
import { ThemeColors } from "../resources/colors";

function LoginPage() {
  const [_, dispatch] = useContext(SnackBarContext);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      showSnackBar({
        dispatch: dispatch,
        color: ThemeColors.error,
        message: "Please fill in all details",
      });
      return;
    }

    if (!emailRegex.test(email)) {
      showSnackBar({
        dispatch: dispatch,
        color: ThemeColors.error,
        message: "Invalid email",
      });
      return;
    }

    const response = await login(email, password);
    if (response) {
      if (!response.user.emailVerified) {
        showSnackBar({
          dispatch: dispatch,
          color: ThemeColors.error,
          message: "Please verify your email",
        });
        return;
      }
      showSnackBar({
        dispatch: dispatch,
        color: ThemeColors.success,
        message: "Login successful",
      });
      navigate("/home");
    } else {
      showSnackBar({
        dispatch: dispatch,
        color: ThemeColors.error,
        message: "Invalid Credentails",
      });
      return;
    }
  };

  return (
    <div className="flex bg-authGradient justify-center items-center w-full h-[100vh]">
      <form
        className="w-[90%] md:w-[70%] lg:w-[35%] py-10 px-6 bg-white rounded-3xl"
        onSubmit={handleLogin}
      >
        <div className="mb-4">
          <InputField
            placeholder="Enter your email / Phone no"
            type="email"
            name="email"
          />
        </div>
        <div className="mb-4">
          <InputField
            placeholder="Enter your password"
            type="password"
            name="password"
          />
        </div>
        <div className="mb-2 text-right">
          <span className="cursor-pointer text-authPrimary hover:underline">
            Forgot your password?
          </span>
        </div>
        <AuthButton text="Login" />
        <section className="my-2 flex justify-center gap-2">
          <p className="text-brown font-semibold">Don't have an account?</p>
          <p className="text-authPrimary font-semibold cursor-pointer">
            Register now
          </p>
        </section>
      </form>
    </div>
  );
}

export default LoginPage;
