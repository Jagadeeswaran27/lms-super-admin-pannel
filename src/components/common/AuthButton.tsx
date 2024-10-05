interface AuthButtonProps {
  text: string;
  onClick?: () => void;
}
function AuthButton({ onClick, text }: AuthButtonProps) {
  return (
    <button
      className="w-full my-2 py-4 rounded-full sm:text-lg text-sm text-white font-semibold bg-authGradient"
      type="submit"
      onClick={onClick}
    >
      {text}
    </button>
  );
}

export default AuthButton;
