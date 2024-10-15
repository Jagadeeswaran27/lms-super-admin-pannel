import { useState } from "react";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { ThemeColors } from "../../resources/colors";

interface InputFieldProps {
  placeholder: string;
  type: string;
  name: string;
  inputRef?: React.RefObject<HTMLInputElement> | null;
}

function InputField({ placeholder, type, name, inputRef }: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <TextField
      className="w-full"
      label={placeholder}
      type={type === "password" && !showPassword ? "password" : "text"}
      name={name}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "9999px",
          "& fieldset": {
            borderColor: ThemeColors.authPrimary,
          },
          "&:hover fieldset": {
            borderColor: ThemeColors.authPrimary,
          },
          "&.Mui-focused fieldset": {
            borderColor: ThemeColors.authPrimary,
          },
        },
        "& .MuiInputLabel-root": {
          color: ThemeColors.brown,
          fontSize: "0.875rem",
        },
        "& .MuiInputLabel-root.Mui-focused": {
          color: ThemeColors.brown,
          fontSize: "0.875rem",
        },
      }}
      slotProps={{
        htmlInput: {
          ref: inputRef,
        },
        input: {
          // ref: inputRef,
          endAdornment: type === "password" && (
            <InputAdornment position="end">
              <IconButton
                sx={{
                  color: ThemeColors.brown,
                }}
                aria-label="toggle password visibility"
                onClick={handleTogglePasswordVisibility}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
}

export default InputField;
