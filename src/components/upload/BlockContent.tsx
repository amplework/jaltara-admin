// @mui
import { Box, Typography, Stack } from '@mui/material';
// assets
import { UploadIllustration } from '../../assets';

// ----------------------------------------------------------------------

export default function BlockContent() {
  return (
    <Stack
      spacing={2}
      alignItems="center"
      justifyContent="center"
      direction={{ xs: 'column', md: 'row' }}
      sx={{ textAlign: { xs: 'center', md: 'center' } }}
      height={"100%"}
    >
        <Typography gutterBottom variant="h6">
          Drop & Select image
        </Typography>

    </Stack>
  );
}
