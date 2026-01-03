import { Controller, useFormContext } from "react-hook-form";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { TextField, InputAdornment, Tooltip, IconButton } from "@mui/material";
import Iconify from "src/components/iconify";
import PropTypes from "prop-types";

export default function RHFDateTimePicker({ name, label, tooltip }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <DateTimePicker
          {...field}
          label={label}
          slotProps={{
            textField: {
              fullWidth: true,
              error: !!error,
              helperText: error?.message,
              // InputProps: {
              //   endAdornment: (
              //     <InputAdornment position="end">
              //       <Tooltip title={tooltip}>
              //         <IconButton edge="end">
              //           <Iconify icon="mdi:information-outline" fontSize="small" />
              //         </IconButton>
              //       </Tooltip>
              //     </InputAdornment>
              //   ),
              // },
            },
          }}
        />
      )}
    />
  );
}

RHFDateTimePicker.propTypes = {
    name: PropTypes.string,
    label: PropTypes.string,
    tooltip: PropTypes.string
}