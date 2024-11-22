import { DatePicker } from "@mui/x-date-pickers";
import { TextField, TextFieldProps, useTheme } from "@mui/material";
import { useFormContext, Controller } from "react-hook-form";

type IProps = {
  id?: string;
  name: string;
  label: string;
  sx?: any;
  disabled?: boolean;
  maxDate?: any;
  minDate?: any;
  onChange?: () => void;
  onChangeDate?: any;
  onOpen?: () => void;
  defaultMonth?: any;
};

type Props = IProps & TextFieldProps;

export const RHFDatePicker = ({
  id,
  name,
  label,
  sx,
  disabled,
  maxDate,
  minDate,
  onChange,
  onChangeDate,
  onOpen,
  defaultMonth,
  ...other
}: Props) => {
  const { control } = useFormContext();
  const theme = useTheme();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={null}
      render={({ field, fieldState: { error } }) => (
        <DatePicker
          label={<label>{label}</label>}
          inputFormat="MM/dd/yyyy"
          minDate={minDate}
          maxDate={maxDate}
          defaultCalendarMonth={defaultMonth}
          {...field}
          onChange={(date) => {
            field.onChange(date);
            if (onChangeDate) {
              onChangeDate(date);
            }
            if (onChange) {
              onChange();
            }
          }}
          onOpen={onOpen}
          renderInput={(params) => (
            <TextField
              {...params}
              id={id}
              fullWidth
              error={!!error}
              helperText={error?.message}
              value={
                typeof field.value === "number" && field.value === 0
                  ? ""
                  : field.value
              }
              disabled={disabled}
              autoComplete="off"
            />
          )}
          disabled={disabled}
        />
      )}
    />
  );
};
