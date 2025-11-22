import React from 'react';
import PropTypes from 'prop-types';
import { useFormContext } from 'react-hook-form';
import { Typography } from '@mui/material';

export default function YupErrorMessage({ name, sx }) {
  const {
    formState: { errors },
  } = useFormContext();

  const errorMessage = name
    .split('.') // handle nested fields like "creditRatingLetter.fileUrl"
    .reduce((obj, key) => obj?.[key], errors);

  if (!errorMessage?.message) return null;

  return (
    <Typography
      variant="caption"
      color="error"
      sx={{ mt: 0.5, display: 'block', ...sx }}
    >
      {errorMessage.message}
    </Typography>
  );
}

YupErrorMessage.propTypes = {
  name: PropTypes.string.isRequired,
  sx: PropTypes.object,
};
