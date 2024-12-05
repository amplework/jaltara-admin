import MenuItem from '@mui/material/MenuItem';
import RHFSelect from './RHFSelect';
import { useTheme } from '@mui/material/styles';
import { Typography } from '@mui/material';

type Props = {
  disabled?: boolean;
  name: string;
  id?: string;
  optionId?: string;
  label: string;
  placeholder: string;
  options?: any;
  sx?: object;
  onClick?: any;
  onChange?: any;
  onAdd?: VoidFunction;
  defaultMessage?: string;
};

const RHFSelectDropdown = ({
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

  return (
    <RHFSelect
      fullWidth
      disabled={disabled}
      onChange={onChange}
      name={name}
      id={id}
      label={label}
      placeholder={placeholder}
      onClick={onClick}
      SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
    >
      {(options?.length &&
        options?.map((option: any, index: any) => {
          return (
            <MenuItem
              key={index}
              id={`${optionId}.${index}`}
              value={option.id}
              sx={{
                mx: 1,
                my: 0.5,
                borderRadius: 0.75,
                typography: 'body2',
                textTransform: 'capitalize',
              }}
            >
              {option?.name}
            </MenuItem>
          );
        })) ||
        null}
      {defaultMessage && !options?.length && (
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

export default RHFSelectDropdown;
