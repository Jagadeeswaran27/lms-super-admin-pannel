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
  onChange?: (e: SelectChangeEvent<string>) => void; // Change the event type to handle array
  value: string; // Use string array for multiple selection
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
        Select an Super Category
      </InputLabel>
      <Select
        value={value}
        onChange={onChange}
        label="Select an Super Category"
        input={
          <OutlinedInput
            label="Select an Super Category"
            sx={{
              borderRadius: "9999px",
              padding: "0px",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: ThemeColors.authPrimary,
                borderRadius: "9999px",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: ThemeColors.authPrimary,
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: ThemeColors.authPrimary,
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
