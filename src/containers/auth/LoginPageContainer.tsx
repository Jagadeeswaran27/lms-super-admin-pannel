import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SnackBarContext } from "../../store/SnackBarContext";
import { showSnackBar } from "../../utils/Snackbar";
import { ThemeColors } from "../../resources/colors";
import { emailRegex } from "../../constants/RegEx";
import { login } from "../../core/services/AuthService";
import LoginPageComponent from "../../components/auth/LoginPageComponent";

function LoginPageContainer() {
  const [_, dispatch] = useContext(SnackBarContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      showSnackBar({
        dispatch: dispatch,
        color: ThemeColors.error,
        message: "Please fill in all details",
      });
      setIsLoading(false);

      return;
    }

    if (!emailRegex.test(trimmedEmail)) {
      showSnackBar({
        dispatch: dispatch,
        color: ThemeColors.error,
        message: "Invalid email",
      });
      setIsLoading(false);

      return;
    }

    // if (trimmedEmail !== "jagadeeswaran.work@gmail.com") {
    //   showSnackBar({
    //     dispatch: dispatch,
    //     color: ThemeColors.error,
    //     message: "Invalid Super Admin Email!",
    //   });
    //   setIsLoading(false);
    //   return;
    // }

    const response = await login(trimmedEmail, trimmedPassword);

    if (response) {
      // if (!response.user.emailVerified) {
      //   showSnackBar({
      //     dispatch: dispatch,
      //     color: ThemeColors.error,
      //     message: "Please verify your email",
      //   });
      //   setIsLoading(false);
      //   return;
      // }
      showSnackBar({
        dispatch: dispatch,
        color: ThemeColors.success,
        message: "Login successfull",
      });
      navigate("/suggestions");
    } else {
      showSnackBar({
        dispatch: dispatch,
        color: ThemeColors.error,
        message: "Invalid Credentials",
      });
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
  };
  return <LoginPageComponent isLoading={isLoading} login={handleLogin} />;
}

export default LoginPageContainer;
