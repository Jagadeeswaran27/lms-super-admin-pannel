import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
  SelectChangeEvent,
} from "@mui/material";
import { ThemeColors } from "../../resources/colors";

interface CustomDropDownProps {
  items: string[];
  onChange?: (e: SelectChangeEvent<string>) => void;
  value?: string;
}

function CustomDropDown({ items, onChange, value }: CustomDropDownProps) {
  return (
    <FormControl fullWidth>
      <InputLabel
        sx={{
          color: ThemeColors.brown,
          fontSize: "0.875rem",
          "&.Mui-focused": {
            color: ThemeColors.brown,
          },
        }}
      >
        Select an option
      </InputLabel>
      <Select
        value={value}
        onChange={onChange}
        label="Select an option"
        defaultValue=""
        input={
          <OutlinedInput
            label="Select an option"
            sx={{
              borderRadius: "9999px",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: ThemeColors.authPrimary, // Default border color
                borderRadius: "9999px", // Apply rounded corners
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: ThemeColors.authPrimary, // Hover border color
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: ThemeColors.authPrimary, // Focus border color
              },
            }}
          />
        }
      >
        {items.map((item, index) => (
          <MenuItem key={index} value={item}>
            {item}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default CustomDropDown;
