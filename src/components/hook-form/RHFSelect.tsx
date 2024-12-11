// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { TextField, TextFieldProps } from '@mui/material';

// ----------------------------------------------------------------------

type IProps = {
  name: string;
  children: React.ReactNode;
  onChange?: any;

};

type Props = IProps & TextFieldProps;

export default function RHFSelect({ name, children, onChange, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          select
          fullWidth
          SelectProps={{ native: true }}
          error={!!error}
          onChange={(event) => {
            const value = event?.target.value;
            field.onChange(value);
            if (onChange) {
              onChange(value);
            }
          }}
          helperText={error?.message}
          {...other}
        >
          {children}
        </TextField>
      )}
    />
  );
}
