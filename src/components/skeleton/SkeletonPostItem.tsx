// @mui
import { Box, Skeleton, Grid } from '@mui/material';

// ----------------------------------------------------------------------

export default function SkeletonPostItem() {
  return (
    <Grid item xs={12} sm={6} md={3} >
      <Box sx={{ display: 'flex', mt: 1.5 , alignItems: 'center'}}>
        <Skeleton variant="text" sx={{ width: "100%", height: 60 }} />
      </Box>
    </Grid>
  );
}
