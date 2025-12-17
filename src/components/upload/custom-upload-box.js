import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
//
import Iconify from '../iconify';
import { Button, Grid, LinearProgress, Stack, Typography } from '@mui/material';
import MultiFilePreview from './preview-multi-file';

// ----------------------------------------------------------------------

export default function CustomUploadBox({
    label,
    icon,
    placeholder,
    error,
    disabled,
    multiple,
    onRemove,
    onRemoveAll,
    sx,
    uploadProgress = 0,
    file = null,
    files = [],
    maxSizeMB = 5,
    accept,
    ...other
}) {
    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        disabled,
        multiple,
        accept,
        maxSize: maxSizeMB * 1024 * 1024,
        ...other,
    });

    const hasError = isDragReject || error;

    const uploadStatus =
        hasError ? 'error' :
            uploadProgress === 100 ? 'success' :
                uploadProgress > 0 ? 'uploading' :
                    'idle';

    const statusStyles = {
        uploading: {
            bg: '#E3F2FD',
            bar: 'primary.main',
            track: 'primary.lighter',
        },
        success: {
            bg: '#E8F5E9',
            bar: 'success.main',
            track: 'success.lighter',
        },
        error: {
            bg: '#FDECEA',
            bar: 'error.main',
            track: 'error.lighter',
        },
    };

    const hasFiles = (!!files && multiple && !!files.length) || (!multiple && !!file);

    const renderMultiPreview = hasFiles && (
        <>
            <Box sx={{ my: 3 }}>
                <MultiFilePreview files={multiple ? files : [file]} thumbnail={true} onRemove={onRemove} />
            </Box>

            <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
                {(multiple) && (
                    <Button color="inherit" variant="outlined" size="small" onClick={onRemoveAll}>
                        Remove All
                    </Button>
                )}
            </Stack>
        </>
    );

    const getSupportedFormats = (accept) => {
        if (!accept) return '';

        return Object.values(accept)
            .flat()
            .map(ext => ext.replace('.', '').toUpperCase())
            .join(', ');
    };

    const supportedFormats = getSupportedFormats(accept);

    return (
        <>
            <Box
                {...getRootProps()}
                sx={{
                    width: 1,
                    height: 140,
                    display: 'flex',
                    borderRadius: 1,
                    cursor: disabled ? 'default' : 'pointer',
                    bgcolor: 'white',
                    border: (theme) =>
                        `solid 2px ${alpha(theme.palette.grey[500], 0.24)}`,
                    ...(isDragActive && { opacity: 0.72 }),
                    ...(hasError && {
                        bgcolor: 'error.lighter',
                        borderColor: 'error.light',
                    }),
                    ...sx,
                }}
            >
                <input {...getInputProps()} />

                <Grid container sx={{ height: '100%' }}>
                    {/* LEFT SIDE */}
                    <Grid
                        item
                        xs={12}
                        md={5}
                        sx={{
                            px: 2,
                            py: 1,
                            borderRight: (theme) =>
                                `1px dashed ${alpha(theme.palette.grey[500], 0.3)}`,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                        }}
                    >
                        {/* ICON */}
                        <Stack spacing={1} alignItems="center">
                            <Box component='div' sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <Iconify icon={icon || "eva:cloud-upload-fill"} width={32} />
                                {label && <Typography variant="subtitle1">
                                    {label}
                                </Typography>}
                            </Box>
                            {/* MAX SIZE */}
                            <Typography variant="caption" color="text.disabled">
                                Max size: {maxSizeMB} MB
                            </Typography>

                            {supportedFormats && (
                                <Typography variant="caption" color="text.secondary">
                                    Supported: {supportedFormats}
                                </Typography>
                            )}
                        </Stack>
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        md={7}
                        sx={{
                            px: 2,
                            backgroundColor: statusStyles[uploadStatus]?.bg || '#CFE4FF',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            transition: 'background-color 0.3s ease',
                        }}
                    >
                        <Typography variant="subtitle2">
                            Drag & drop files here
                        </Typography>

                        <Typography variant="caption" color="text.disabled">
                            or click to browse
                        </Typography>

                        {/* UPLOAD PROGRESS */}
                        {uploadProgress > 0 && (
                            <Box mt={2}>
                                <LinearProgress
                                    variant="determinate"
                                    value={uploadProgress}
                                    sx={{
                                        height: 10,
                                        borderRadius: 5,
                                        backgroundColor: (theme) =>
                                            theme.palette[statusStyles[uploadStatus]?.track.split('.')[0]].lighter,
                                        '& .MuiLinearProgress-bar': {
                                            borderRadius: 5,
                                            backgroundColor: (theme) =>
                                                theme.palette[statusStyles[uploadStatus]?.bar.split('.')[0]].main,
                                            transition: 'width 0.3s ease',
                                        },
                                    }}
                                />

                                <Typography
                                    variant="caption"
                                    color={
                                        uploadStatus === 'error'
                                            ? 'error.main'
                                            : uploadStatus === 'success'
                                                ? 'success.main'
                                                : 'text.secondary'
                                    }
                                    mt={0.5}
                                >
                                    {uploadStatus === 'error'
                                        ? 'Upload failed'
                                        : uploadStatus === 'success'
                                            ? 'Upload completed'
                                            : `Uploading… ${uploadProgress}%`}
                                </Typography>
                            </Box>
                        )}
                    </Grid>
                </Grid>
            </Box>
            {renderMultiPreview}
        </>
    );
}

CustomUploadBox.propTypes = {
    disabled: PropTypes.object,
    error: PropTypes.bool,
    placeholder: PropTypes.object,
    sx: PropTypes.object,
};
