import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import FormHelperText from '@mui/material/FormHelperText';
//
import { UploadAvatar, Upload, UploadBox } from '../upload';
import { Icon } from '@iconify/react';

// ----------------------------------------------------------------------

export function RHFUploadAvatar({ name, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div>
          <UploadAvatar error={!!error} file={field.value} {...other} />

          {!!error && (
            <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
              {error.message}
            </FormHelperText>
          )}
        </div>
      )}
    />
  );
}

RHFUploadAvatar.propTypes = {
  name: PropTypes.string,
};

// ----------------------------------------------------------------------

export function RHFUploadBox({ name, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <UploadBox files={field.value} error={!!error} {...other} />
      )}
    />
  );
}

RHFUploadBox.propTypes = {
  name: PropTypes.string,
};

// ----------------------------------------------------------------------

export function RHFUpload({ name, multiple, helperText, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) =>
        multiple ? (
          <Upload
            multiple
            accept={{ 'image/*': [] }}
            files={field.value}
            error={!!error}
            helperText={
              (!!error || helperText) && (
                <FormHelperText error={!!error} sx={{ px: 2 }}>
                  {error ? error?.message : helperText}
                </FormHelperText>
              )
            }
            {...other}
          />
        ) : (
          <Upload
            accept={{ 'image/*': [] }}
            file={field.value}
            error={!!error}
            helperText={
              (!!error || helperText) && (
                <FormHelperText error={!!error} sx={{ px: 2 }}>
                  {error ? error?.message : helperText}
                </FormHelperText>
              )
            }
            {...other}
          />
        )
      }
    />
  );
}

RHFUpload.propTypes = {
  helperText: PropTypes.string,
  multiple: PropTypes.bool,
  name: PropTypes.string,
};


// ----------------------------------------------------------------------
export function RHFUploadRectangle({ name, label = "Upload File", ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        // Extract file name (works for File object or preview string)
        const fileName =
          value instanceof File ? value.name : value?.name || value?.fileUrl?.split("/")?.pop();

        return (
          <>
            {/* Hidden input */}
            <input
              type="file"
              style={{ display: "none" }}
              id={name}
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                onChange(file);
              }}
              {...other}
            />

            {/* Blue rectangle button */}
            <label
              htmlFor={name}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                width: "100%",
                height: 50,
                backgroundColor: "#2E6CF6",
                color: "#fff",
                borderRadius: "10px",
                padding: "0 8px",
                fontSize: "12px",
                cursor: "pointer",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              <Icon icon={fileName ? "mdi:file" : "mdi:upload"} width={14} height={14} />
              <span style={{ lineHeight: "15px" }}>
                {fileName ? fileName : label}
              </span>
            </label>

            {/* Error */}
            {error && (
              <FormHelperText error sx={{ mt: 0.5 }}>
                {error.message}
              </FormHelperText>
            )}
          </>
        );
      }}
    />
  );
}

RHFUploadRectangle.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
};
