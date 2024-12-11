import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import RHFSelect from './RHFSelect';
import { useTheme } from '@mui/material/styles';
import { Typography } from '@mui/material';

type Props = {
  disabled?: boolean;
  name: string;
  id?: string;
  label: string;
  placeholder: string;
  options?: any;
  sx?: object;
  onChange?: (selected: any) => void;
  defaultMessage?: string;
  selectedValues?: any[];
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const RHFMultiSelect = ({
  disabled,
  name,
  id,
  label,
  placeholder,
  options = [],
  sx,
  defaultMessage,
  selectedValues = [],
  onChange,
}: Props) => {
  const theme = useTheme();

  const handleSelect = (id: any) => {
    const updatedValues = selectedValues.includes(id)
      ? selectedValues.filter((value) => value !== id)
      : [...selectedValues, id];

    onChange?.(updatedValues);
  };
  return (
    <RHFSelect
      fullWidth
      disabled={disabled}
      name={name}
      id={id}
      label={label}
      placeholder={placeholder}
      sx={sx}
      SelectProps={{
        multiple: true,
        value: selectedValues,
        renderValue: (selected: any) => {
          const selectedNames = selected
            .map((id: any) => options?.find((option: any) => option?.id === id)?.challenge)
            .filter(Boolean);
          return selectedNames.length > 0 ? selectedNames.join(', ') : placeholder;
        },
        MenuProps,
      }}
    >
      {options?.length > 0
        ? options.map((option: any) => {
            const isSelected = selectedValues.includes(option.id);
            return (
              <MenuItem
                key={option.id}
                value={option.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'background.paper',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                  mx: 1,
                  my: 0.5,
                  borderRadius: 0.75,
                  typography: 'body2',
                  textTransform: 'capitalize',
                }}
                onClick={() => handleSelect(option?.id)} // Toggle the selection of the option
              >
                <Checkbox checked={isSelected} />
                <ListItemText primary={option?.challenge} />
              </MenuItem>
            );
          })
        : defaultMessage && (
            <Typography
              sx={{
                mx: 3,
                my: 0.5,
                borderRadius: 0.75,
                typography: 'body2',
                textTransform: 'capitalize',
              }}
            >
              {defaultMessage}
            </Typography>
          )}
    </RHFSelect>
  );
};

export default RHFMultiSelect;
