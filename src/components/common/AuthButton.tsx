import CircularProgress from "@mui/material/CircularProgress";

interface AuthButtonProps {
  text: string;
  onClick?: () => void;
  isLoading: boolean;
}

function AuthButton({ onClick, text, isLoading }: AuthButtonProps) {
  return (
    <button
      className="w-full my-2 py-4 rounded-full sm:text-lg text-sm text-white font-semibold bg-authGradient"
      type="submit"
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <CircularProgress size={28} color="inherit" />
        </div>
      ) : (
        text
      )}
    </button>
  );
}

export default AuthButton;
