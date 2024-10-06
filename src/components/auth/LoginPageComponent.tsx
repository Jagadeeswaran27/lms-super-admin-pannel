import React from "react";
import AuthButton from "../common/AuthButton";
import InputField from "../common/InputField";

interface LoginFormComponentProps {
  login: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

function LoginPageComponent({ login, isLoading }: LoginFormComponentProps) {
  return (
    <div className="flex flex-col w-full h-[100vh] login-background bg-authGradient">
      <section className="w-full text-center mt-10">
        <h1 className="text-authPrimary text-3xl font-extrabold">Sign In</h1>
        <p className="text-brown text-lg my-2">
          Enter your email and password to login into admin panel
        </p>
      </section>

      <div className="flex flex-grow justify-center items-center w-full">
        <form
          className="w-[90%] md:w-[70%] lg:w-[35%] mx-auto py-10 px-6 bg-white rounded-3xl"
          onSubmit={(e) => login(e)}
        >
          <div className="mb-4">
            <InputField
              placeholder="Enter your email"
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
            <span className="cursor-pointer md:text-base text-sm text-authPrimary hover:underline">
              Forgot your password?
            </span>
          </div>
          <AuthButton isLoading={isLoading} text="Login" />
        </form>
      </div>
    </div>
  );
}

export default LoginPageComponent;
