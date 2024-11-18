import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
  SelectChangeEvent,
} from "@mui/material";
import { ThemeColors } from "../../resources/colors";

interface MultipleCustomDropDownProps {
  items: string[];
  onChange?: (e: SelectChangeEvent<string[]>) => void; // Change the event type to handle array
  value?: string[]; // Use string array for multiple selection
}

function MultipleCustomDropDown({
  items,
  onChange,
  value,
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
        value={value || []}
        onChange={onChange}
        label="Select an option"
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
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default MultipleCustomDropDown;
