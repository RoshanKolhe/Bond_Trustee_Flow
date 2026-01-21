import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
//
import { fileData, fileFormat, fileThumb } from './utils';
import DownloadButton from './download-button';

// ----------------------------------------------------------------------

export default function FileThumbnail({ file, tooltip, imageView, onDownload, sx, imgSx }) {
  const { name = '', path = '', fileUrl = '' } = fileData(file);

  const format = fileFormat(path || fileUrl);

  const handleClick = () => {
    window.open(fileUrl, '_blank');
  }

  const renderContent =
    format === 'image' && imageView ? (
      <Box
        onClick={() => handleClick()}
        component="img"
        src={fileUrl}
        sx={{
          width: 1,
          height: 1,
          flexShrink: 0,
          objectFit: 'cover',
          cursor: 'pointer',
          ...imgSx,
        }}
      />
    ) : (
      <Box
        onClick={() => handleClick()}
        component="img"
        src={fileThumb(format)}
        sx={{
          width: 32,
          height: 32,
          flexShrink: 0,
          cursor: 'pointer',
          ...sx,
        }}
      />
    );

  if (tooltip) {
    return (
      <Tooltip title={name}>
        <Stack
          flexShrink={0}
          component="span"
          alignItems="center"
          justifyContent="center"
          sx={{
            width: 'fit-content',
            height: 'inherit',
          }}
        >
          {renderContent}
          {onDownload && <DownloadButton onDownload={onDownload} />}
        </Stack>
      </Tooltip>
    );
  }

  return (
    <>
      {renderContent}
      {onDownload && <DownloadButton onDownload={onDownload} />}
    </>
  );
}

FileThumbnail.propTypes = {
  file: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  imageView: PropTypes.bool,
  imgSx: PropTypes.object,
  onDownload: PropTypes.func,
  sx: PropTypes.object,
  tooltip: PropTypes.bool,
};
