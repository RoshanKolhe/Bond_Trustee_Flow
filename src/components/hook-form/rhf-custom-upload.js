import { Controller, useFormContext } from 'react-hook-form';
import PropTypes from 'prop-types';
import { useState } from 'react';
import axiosInstance from 'src/utils/axios';
import { CustomUploadBox } from '../upload';

export default function RHFCustomFileUploadBox({
  name,
  multiple = false,
  onRemove,
  onRemoveAll,
  ...other
}) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const { control, setValue } = useFormContext();

  const handleFileDrop = async (fieldName, acceptedFiles) => {
    if (!acceptedFiles || acceptedFiles.length === 0) return;

    let fakeProgress = 0;
    setUploadProgress(0);

    // Fake smooth progress
    const interval = setInterval(() => {
      fakeProgress += 5;
      if (fakeProgress <= 90) {
        setUploadProgress(fakeProgress);
      }
    }, 200);

    try {
      const formData = new FormData();
      if (multiple) {
        formData.append('files', acceptedFiles);
      } else {
        formData.append('file', acceptedFiles[0]);
      }

      const res = await axiosInstance.post('/files', formData);

      clearInterval(interval);
      setUploadProgress(100);

      if (multiple) {
        setValue(fieldName, res?.data?.files, {
          shouldValidate: true,
        });
      } else {
        setValue(fieldName, res?.data?.files?.[0], {
          shouldValidate: true,
        });
      }
    } catch (error) {
      clearInterval(interval);
      setUploadProgress(0);
    }
  };

  const handleRemoveFile = (fieldName) => {
    setUploadProgress(0);
    setValue(fieldName, null, { shouldValidate: true });
  };

  const handleRemoveAllFiles = (fieldName) => {
    setUploadProgress(0);
    setValue(fieldName, [], { shouldValidate: true });
  };

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={multiple ? [] : null}
      render={({ field, fieldState: { error } }) =>
        multiple ? (
          <CustomUploadBox
            files={field.value || []}
            multiple
            uploadProgress={uploadProgress}
            error={!!error}
            onRemove={() => (onRemove || handleRemoveFile)(name)}
            onRemoveAll={() => (onRemoveAll || handleRemoveAllFiles)(name)}
            onDrop={(acceptedFiles) => {
              handleFileDrop(name, acceptedFiles);
            }}
            {...other}
          />
        ) : (
          <CustomUploadBox
            file={field.value}
            uploadProgress={uploadProgress}
            error={!!error}
            onRemove={() => (onRemove || handleRemoveFile)(name)}
            onDrop={(acceptedFiles) => {
              handleFileDrop(name, acceptedFiles);
            }}
            {...other}
          />
        )
      }
    />
  );
}

// -----------------------------------------------------

RHFCustomFileUploadBox.propTypes = {
  name: PropTypes.string.isRequired,
  multiple: PropTypes.bool,
  onRemove: PropTypes.func,
  onRemoveAll: PropTypes.func,
};
