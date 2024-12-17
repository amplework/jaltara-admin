import { useDropzone } from 'react-dropzone';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Stack, Typography } from '@mui/material';
// type
import { UploadProps } from './type';
//
import Image from '../Image';
import RejectionFiles from './RejectionFiles';
import BlockContent from './BlockContent';
import Iconify from '../Iconify';

// ----------------------------------------------------------------------

const DropZoneStyle = styled('div')(({ theme }) => ({
  outline: 'none',
  overflow: 'hidden',
  position: 'relative',
  padding: theme.spacing(5, 1),
  borderRadius: '50%',
  transition: theme.transitions.create('padding'),
  backgroundColor: theme.palette.background.neutral,
  // border: `1px dashed ${theme.palette.grey[500_32]}`,
  // '&:hover': { opacity: 0.72, cursor: 'pointer' },
  width: '100%',
}));

// spacing={2}
// display={''}
// alignItems="center"
// justifyContent="center"
// direction={{ xs: 'column', md: 'row' }}
// sx={{ textAlign: { xs: 'center', md: 'center' } }}
// height={'100%'}

const PlaceholderStyle = styled('div')(({ theme }) => ({
  // display: 'flex',
  // position: 'absolute',
  // alignItems: 'center',
  // flexDirection: 'column',
  // justifyContent: 'center',
  // height:'100%',
  // direction:{ xs: 'column', md: 'row' },
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.background.neutral,
  transition: theme.transitions.create('opacity', {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&:hover': { opacity: 0.72 },
}));

export default function UploadSingleFile({
  error = false,
  file,
  helperText,
  sx,
  ...other
}: UploadProps) {
  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    multiple: false,
    ...other,
  });

  return (
    <Box
      sx={{
        width: '200px',
        height: '200px',
        display: 'flex',
        margin: 'auto',
        borderRadius: '50%',
        ...sx,
      }}
    >
      <DropZoneStyle {...getRootProps()}>
        <input {...getInputProps()} />

        {/* <BlockContent /> */}

        {file && (
         <Image
         alt="file preview"
         src={typeof file === 'string' ? file : file.preview}
         sx={{
           top: 0,
           left: 0,
           right: 0,
           bottom: 0,
           borderRadius: 1,
           position: 'absolute',
           width: '100%',
           height: '100%',
           objectFit: 'contain',  // Ensures the entire image fits within the container
         }}
       />
       
        )}

        {/* <PlaceholderStyle
          className="placeholder"
          sx={{
            ...(file && {
              opacity: 0,
              color: 'common.white',
              // bgcolor: 'grey.900',
              bgcolor:"#a2a",
              '&:hover': { opacity: 0.72 },
            }),
            ...((isDragReject || error) && {
              bgcolor: 'error.lighter',
            }),
          }}
        > */}
        <Stack
          spacing={2}
          display={''}
          alignItems="center"
          justifyContent="center"
          direction={'column'}
          sx={{ textAlign: { xs: 'center', md: 'center' } }}
          height={'100%'}
        >
          <Iconify icon={'ic:round-add-a-photo'} sx={{ width: 30, height: 30 }} />
          <Typography variant="caption">{file ? 'Update photo' : 'Upload photo'}</Typography>
        </Stack>
        {/* </PlaceholderStyle> */}
      </DropZoneStyle>

      {fileRejections.length > 0 && <RejectionFiles fileRejections={fileRejections} />}

      {helperText && helperText}
    </Box>
  );
}
