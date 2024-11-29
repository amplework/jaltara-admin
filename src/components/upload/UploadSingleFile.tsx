import { useDropzone } from 'react-dropzone';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
// type
import { UploadProps } from './type';
//
import Image from '../Image';
import RejectionFiles from './RejectionFiles';
import BlockContent from './BlockContent';

// ----------------------------------------------------------------------

const DropZoneStyle = styled('div')(({ theme }) => ({
  outline: 'none',
  overflow: 'hidden',
  position: 'relative',
  padding: theme.spacing(5, 1),
  borderRadius: "50%",
  transition: theme.transitions.create('padding'),
  backgroundColor: theme.palette.background.neutral,
  // border: `1px dashed ${theme.palette.grey[500_32]}`,
  // '&:hover': { opacity: 0.72, cursor: 'pointer' },
  width:"100%",
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
    <Box sx={{ width: '200px',height:"200px",display:"flex",margin:"auto",borderRadius:"50%", ...sx }}>
      <DropZoneStyle
        {...getRootProps()}
      >
        <input {...getInputProps()} />

        <BlockContent />

        {file && (
          <Image
            alt="file preview"
            src={typeof file === 'string' ? file : file.preview}
            sx={{
              top: 0,
              left: 0,
              right:0,
              bottom:0,
              borderRadius: 1,
              position: 'absolute',
            }}
          />
        )}
      </DropZoneStyle>

      {fileRejections.length > 0 && <RejectionFiles fileRejections={fileRejections} />}

      {helperText && helperText}
    </Box>
  );
}
