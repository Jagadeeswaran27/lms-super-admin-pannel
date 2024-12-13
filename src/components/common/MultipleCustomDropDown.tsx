import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
  SelectChangeEvent,
} from "@mui/material";
import { ThemeColors } from "../../resources/colors";
import { Check } from "@mui/icons-material";

interface MultipleCustomDropDownProps {
  items: string[];
  onChange?: (e: SelectChangeEvent<string[]>) => void; // Change the event type to handle array
  value?: string[]; // Use string array for multiple selection
}

function MultipleCustomDropDown({
  items,
  onChange,
  value = [], // Default to an empty array
}: MultipleCustomDropDownProps) {
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
        multiple
        value={value}
        onChange={onChange}
        renderValue={(selected) => selected.join(", ")} // Displays selected items as a comma-separated string
        input={
          <OutlinedInput
            label="Select an option"
            sx={{
              borderRadius: "9999px",
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
            {value.includes(item) && <Check />}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default MultipleCustomDropDown;
