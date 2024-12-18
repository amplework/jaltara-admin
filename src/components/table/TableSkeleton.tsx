// @mui
import { TableRow, TableCell, Skeleton, Stack, TableRowProps } from '@mui/material';

// ----------------------------------------------------------------------

export default function TableSkeleton({ ...other }: TableRowProps) {
  return (
    <TableRow {...other}>
      <TableCell colSpan={12}>
        <Stack spacing={1} direction="column" alignItems="center">
          <Skeleton variant="text" width="100%" height={50} />
          <Skeleton variant="text" width="100%" height={50} />
          <Skeleton variant="text" width="100%" height={50} />
          <Skeleton variant="text" width="100%" height={50} />
          <Skeleton variant="text" width="100%" height={50} />
        </Stack>
      </TableCell>
    </TableRow>
  );
}
