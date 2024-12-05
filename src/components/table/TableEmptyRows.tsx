// @mui
import { TableRow, TableCell } from '@mui/material';

// ----------------------------------------------------------------------

type Props = {
  emptyRows: any;
};

export default function TableEmptyRows({ emptyRows }: Props) {
  if (!emptyRows) {
    return null;
  }

  return (
    <TableRow
      sx={{
        height: 52,
      }}
    >
      <TableCell colSpan={9} />
    </TableRow>
  );
}
