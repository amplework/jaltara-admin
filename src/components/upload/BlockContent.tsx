// @mui
import { Box, Typography, Stack } from '@mui/material';
// assets
import { UploadIllustration } from '../../assets';
import Iconify from '../Iconify';

// ----------------------------------------------------------------------

export default function BlockContent() {
  return (
    <Stack
      spacing={2}
      display={''}
      alignItems="center"
      justifyContent="center"
      direction={{ xs: 'column', md: 'row' }}
      sx={{ textAlign: { xs: 'center', md: 'center' } }}
      height={'100%'}
    >
      {/* <Iconify icon={'ic:round-add-a-photo'} sx={{ width: 24, height: 24, mb: 1 }} /> */}
      <Typography gutterBottom variant="h6">
        Drop & Select image
      </Typography>
    </Stack>
  );
}
