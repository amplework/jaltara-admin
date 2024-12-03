// @mui
import { Box, Skeleton } from '@mui/material';

// ----------------------------------------------------------------------

export default function SkeletonPost() {
  return (
    <>
      <Box sx={{ mt: 3, display: 'flex', alignItems: 'center' }}>
        <Box sx={{ flexGrow: 1, ml: 2 }}>
          <Skeleton variant="text" height={50} />
          <Skeleton variant="text" height={50} />
          <Skeleton variant="text" height={50} />
          <Skeleton variant="text" height={50} />
          <Skeleton variant="text" height={50} />
        </Box>
      </Box>
    </>
  );
}
