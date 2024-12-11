import { MenuItem, Select, FormControl, InputLabel, Typography } from '@mui/material';
import { Controller } from 'react-hook-form';
import { useTheme } from '@mui/material/styles';

type Props = {
  disabled?: boolean;
  name: string;
  id?: string;
  optionId?: string;
  label: string;
  placeholder: string;
  options?: any[];
  sx?: object;
  onClick?: any;
  onChange?: (value: any) => void; // Update: onChange takes value as an argument
  onAdd?: VoidFunction;
  defaultMessage?: string;
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP, // Max height for dropdown
      width: 250, // Optional width adjustment
    },
  },
};

const RHFCustomSelectDropdown = ({
  disabled,
  onClick,
  onChange,
  name,
  id,
  optionId,
  label,
  placeholder,
  options,
  sx,
  onAdd,
  defaultMessage,
}: Props) => {
  const theme = useTheme();

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value; // Get the selected value
    if (onChange) {
      onChange(value); // Pass the selected value to the parent component
    }
  };

  return (
    <FormControl fullWidth disabled={disabled} sx={sx}>
      <InputLabel id={`${name}-label`}>{label}</InputLabel>
      <Controller
        name={name}
        render={({ field }) => (
          <Select
            {...field}
            labelId={`${name}-label`}
            value={field.value || ''} // Ensure value is controlled
            onChange={(event:any) => {
              field.onChange(event.target.value); // Update form state
              handleChange(event); // Call the custom onChange handler
            }}
            label={label}
            MenuProps={MenuProps}
            displayEmpty
            renderValue={(selected) => selected || placeholder}
            inputProps={{
              'aria-label': placeholder,
            }}
          >
            {(options?.length &&
              options?.map((option, index) => (
                <MenuItem key={index} value={option.id} sx={{ mx: 1, my: 0.5, borderRadius: 0.75 }}>
                  {option?.name}
                </MenuItem>
              ))) ||
              null}
            {defaultMessage && !options?.length && (
              <Typography sx={{ mx: 3, my: 0.5, borderRadius: 0.75, typography: 'body2' }}>
                {defaultMessage}
              </Typography>
            )}
          </Select>
        )}
      />
    </FormControl>
  );
};

export default RHFCustomSelectDropdown;
