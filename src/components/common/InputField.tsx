import { useState } from "react";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { ThemeColors } from "../../resources/colors";

interface InputFieldProps {
  placeholder: string;
  type: string;
  name: string;
  inputRef?: React.RefObject<HTMLInputElement> | null;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  disabled?: boolean;
}

function InputField({
  placeholder,
  type,
  name,
  inputRef,
  onChange,
  value,
  disabled,
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <TextField
      disabled={disabled}
      className="w-full"
      onChange={onChange}
      value={value}
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
          "&.Mui-disabled": {
            "& fieldset": {
              borderColor: ThemeColors.authPrimary,
            },
            color: ThemeColors.brown,
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
        "& .MuiInputLabel-root.Mui-disabled": {
          color: ThemeColors.brown,
        },
        // Override input text color when disabled
        "& .MuiInputBase-input.Mui-disabled": {
          color: ThemeColors.brown, // Text color when disabled
          "-webkit-text-fill-color": ThemeColors.brown, // WebKit browser compatibility
        },
      }}
      slotProps={{
        htmlInput: {
          ref: inputRef,
        },
        input: {
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
