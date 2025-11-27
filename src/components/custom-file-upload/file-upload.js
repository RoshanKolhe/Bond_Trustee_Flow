import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form'; // Import useSnackbar at the top of the file
import { useSnackbar } from 'src/components/snackbar';
import {
  Box,
  Card,
  Typography,
  useMediaQuery,
  useTheme,
  FormHelperText,
  LinearProgress,
  Grid,
  Stack,
  Tooltip,
} from '@mui/material';
import { Icon } from '@iconify/react';

function UploadBox({
  label,
  icon,
  color,
  acceptedTypes,
  maxSizeMB,
  onChange,
  value,
  error,
  helperText,
  multiple = false,
  existing,
  onDrop,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Get the snackbar function
  const { enqueueSnackbar } = useSnackbar();

  // ---- Safe file processing ----
  const validateFile = (file) => {
    if (!file) return;

    const fileType = file?.type ? file.type.split('/')[1] : 'unknown';
    const allowedTypes = acceptedTypes ? acceptedTypes.split(',') : [];

    // Validate file type
    if (allowedTypes.length > 0 && !allowedTypes.includes(fileType)) {
      enqueueSnackbar(`Invalid file type. Allowed types: ${acceptedTypes}`, { variant: 'error' });
      return false;
    }

    // Validate size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      enqueueSnackbar(`File size exceeds ${maxSizeMB}MB limit.`, { variant: 'error' });
      return false;
    }

    return true;
  };

  const processSingleFile = (file) => {
    if (!file) return;
    if (!validateFile(file)) return;

    setProgress(0);
    const interval = setInterval(() => {
      setProgress((old) => {
        if (old >= 100) {
          clearInterval(interval);
          return 100;
        }
        return old + 10;
      });
    }, 150);

    onChange(file);
    if (onDrop) {
      console.log('🪶 Triggering parent onDrop with:', file);
      onDrop([file]);
    }
  };

  const processMultipleFiles = (files) => {
    const list = Array.from(files || []).filter((f) => validateFile(f));
    setProgress(100);
    onChange(list);
    if (onDrop) {
      onDrop(list);
    }
  };

  const handleFileSelect = (event) => {
    const files = event.target.files;
    if (multiple) {
      processMultipleFiles(files);
    } else {
      const file = files?.[0];
      processSingleFile(file);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const files = event.dataTransfer.files;
    if (multiple) {
      processMultipleFiles(files);
    } else {
      const file = files?.[0];
      processSingleFile(file);
    }
  };

  const handleClick = () => fileInputRef.current?.click();

  const uploadContent = (
    <Box
      sx={{
        textAlign: 'center',
        height: 'auto',
        borderRadius: 0,
        backgroundColor:
          progress === 100
            ? '#E1FFEC' // ✅ after upload complete
            : isDragging
            ? '#E1FFEC' // optional: keep same greenish color when dragging
            : '#CFE4FF',
        cursor: 'pointer',
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        accept={acceptedTypes}
        multiple={multiple}
        style={{ display: 'none' }}
      />

      {/* ✅ Show this when no file(s) selected and no existing */}
      {(!value || (Array.isArray(value) && value.length === 0)) && !existing ? (
        <Box
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: { xs: 'center', md: 'flex-start' },
            gap: 1.5,
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          <Icon icon="mdi:cloud-upload-outline" color={color} width="24" height="24" />
          <Box>
            <Typography
              component="span"
              variant="body2"
              color="primary"
              fontWeight={500}
              sx={{ cursor: 'pointer', textDecoration: 'underline' }}
            >
              {multiple
                ? 'Select files / Drop files here to upload'
                : 'Select file / Drop file here to upload'}
            </Typography>{' '}
            <Typography
              variant="caption"
              color="primary"
              display="block"
              mt={0.5}
              fontStyle="italic"
            >
              Maximum size: {maxSizeMB}MB / Supported: {acceptedTypes}
            </Typography>
          </Box>
        </Box>
      ) : (
        <Grid container sx={{ py: 2, px: { xs: 2, md: 4 } }}>
          <Grid item md={12} sx={{ pb: '10px' }}>
            <Stack justifyContent="space-between" sx={{ flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
              <Stack direction={{ xs: 'column', md: 'row' }}>
                <Grid xs={12} md={4}>
                  <Stack direction={'row'}>
                    <Icon icon="mdi:cloud-check-outline" color="#2e7d32" width="24" height="24" />
                    <Typography sx={{ pl: '10px' }}>Uploaded</Typography>
                  </Stack>
                </Grid>
                <Grid xs={12} md={8}>
                  {existing ? (
                    <Stack
                      direction={{ xs: 'column', md: 'row' }}
                      spacing={1}
                      alignItems={{ xs: 'flex-start', md: 'center' }}
                    >
                      <Typography variant="body2" fontWeight={500}>
                        {existing.name}
                      </Typography>
                      {existing.status && (
                        <Typography
                          variant="body2"
                          sx={{
                            color:
                              existing.status?.toLowerCase() === 'pending'
                                ? 'warning.main'
                                : 'text.secondary',
                          }}
                        >
                          • {existing.status}
                        </Typography>
                      )}
                    </Stack>
                  ) : Array.isArray(value) ? (
                    <Stack spacing={0.5}>
                      {value.map((f, idx) => (
                        <Typography key={idx} variant="body2" fontWeight={500}>
                          {f.name}
                        </Typography>
                      ))}
                    </Stack>
                  ) : (
                    <Tooltip title={value.name} placement="top" arrow>
                      <Typography
                        variant="body2"
                        fontWeight={500}
                        sx={{
                          maxWidth: '230px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          cursor: 'pointer',
                          display: 'block',
                        }}
                      >
                        {value.name}
                      </Typography>
                    </Tooltip>
                  )}
                </Grid>
              </Stack>
            </Stack>
          </Grid>
          <Grid item md={12}>
            {existing ? (
              <>
                <LinearProgress variant="determinate" value={100} fullWidth />
                <Typography
                  variant="caption"
                  sx={{
                    color: 'primary.main',
                    display: 'flex',
                    mt: 0.5,
                    fontStyle: 'italic',
                    justifyContent: 'start',
                  }}
                >
                  Existing file on server
                </Typography>
              </>
            ) : (
              <>
                <LinearProgress variant="determinate" value={progress} fullWidth />
                <Typography
                  variant="caption"
                  sx={{
                    color: 'primary.main',
                    display: 'flex',
                    mt: 0.5,
                    fontStyle: 'italic',
                    justifyContent: 'start',
                  }}
                >
                  {progress < 100 ? `${progress}% Uploading...` : 'Upload Complete (100%)'}
                </Typography>
              </>
            )}
            <Typography
              variant="caption"
              color="primary"
              display="block"
              mt={0.5}
              fontStyle="italic"
              sx={{ display: 'flex', mt: 0.5, fontStyle: 'italic', justifyContent: 'start' }}
            >
              Maximum size: {maxSizeMB}MB / Supported: {acceptedTypes}
            </Typography>
          </Grid>
        </Grid>
      )}
    </Box>
  );

  // --- Mobile layout ---
  if (isMobile) {
    return (
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 2,
          p: 3,
          border: 2,
          borderColor: '#b5b5b5ff',
          borderRadius: 2,
          cursor: 'pointer',
          width: '100%',
        }}
        onClick={handleClick}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Icon icon={icon} color={color} width="32" height="32" />
          <Typography variant="subtitle1" fontWeight={500}>
            {label}
          </Typography>
        </Box>
        {uploadContent}
      </Card>
    );
  }

  // --- Desktop layout (same structure, progress bar in same box) ---
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        alignItems: 'stretch',
        gap: 0,
      }}
    >
      {/* Left Label */}
      <Card
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: 4,
          border: 2,
          borderRight: 'none',
          borderColor: '#b5b5b5ff',
          borderRadius: 0,
          minHeight: 110,
          height: '100%',
        }}
      >
        <Icon icon={icon} color={color} width="32" height="32" />
        <Tooltip title={label} placement="top" arrow>
          <Typography
            variant="subtitle1"
            fontWeight={500}
            sx={{
              maxWidth: '230px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
            }}
          >
            {label}
          </Typography>
        </Tooltip>
      </Card>

      {/* Right Upload Area */}
      <Box
        onClick={handleClick}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        sx={{
          height: '100%',
          minHeight: 110,
          border: 2,
          borderColor: progress === 100 ? '#E1FFEC' : isDragging ? '#CFE4FF' : '#CFE4FF',
          borderRadius: 0,
          cursor: 'pointer',
        }}
      >
        {uploadContent}
      </Box>
    </Box>
  );
}

UploadBox.propTypes = {
  label: PropTypes.string,
  icon: PropTypes.string,
  color: PropTypes.string,
  acceptedTypes: PropTypes.string,
  maxSizeMB: PropTypes.number,
  onChange: PropTypes.func,
  value: PropTypes.any,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  multiple: PropTypes.bool,
  existing: PropTypes.shape({ name: PropTypes.string, status: PropTypes.string }),
  onDrop: PropTypes.func,
};

// --- Hook Form Integrated Wrapper ---
export default function RHFFileUploadBox({ name, ...props }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <UploadBox
          {...props}
          value={field.value}
          onChange={(fileOrFiles) => field.onChange(fileOrFiles)}
          error={!!error}
        />
      )}
    />
  );
}

RHFFileUploadBox.propTypes = {
  name: PropTypes.string.isRequired,
  helperText: PropTypes.string,
};
