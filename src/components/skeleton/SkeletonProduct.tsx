// @mui
import { Grid, Skeleton } from '@mui/material';

// ----------------------------------------------------------------------

export default function SkeletonProduct() {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Skeleton variant="text" height={80} />
        <Skeleton variant="text" height={80} />
        <Skeleton variant="text" height={80} />
        <Skeleton variant="text" height={80} />
        <Skeleton variant="text" height={80} />
      </Grid>
    </Grid>
  );
}
