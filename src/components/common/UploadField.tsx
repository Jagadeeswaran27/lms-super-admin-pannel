import React from "react";
import { TextField, Button, InputAdornment } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { ThemeColors } from "../../resources/colors";

interface UploadFieldProps {
  placeholder: string;
  name: string;
  value: string;
  accept?: string;
  onChange: (file: File | null) => void;
}

function UploadField({
  placeholder,
  name,
  accept,
  value,
  onChange,
}: UploadFieldProps) {
  //   const [fileName, setFileName] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    // setFileName(file ? file.name : '');
    onChange(file);
  };

  return (
    <TextField
      className="w-full"
      label={placeholder}
      value={value}
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
      InputProps={{
        readOnly: true,
        endAdornment: (
          <InputAdornment position="end">
            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUpload />}
              sx={{
                backgroundColor: ThemeColors.authPrimary,
                color: "#ffffff",
                borderRadius: "9999px",
                "&:hover": {
                  backgroundColor: ThemeColors.authPrimary,
                  opacity: 0.9,
                },
              }}
            >
              Upload
              <input
                type="file"
                hidden
                name={name}
                accept={accept}
                onChange={handleFileChange}
              />
            </Button>
          </InputAdornment>
        ),
      }}
    />
  );
}

export default UploadField;
