import { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Avatar, Checkbox, TableRow, TableCell, Typography } from '@mui/material';
// @types
// components
import { CropItem } from 'src/@types/crops';
import _ from 'lodash';

// ----------------------------------------------------------------------

type Props = {
  row: CropItem | null;
  selected: boolean;
  onEditRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow?: VoidFunction;
};

export default function CropTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
}: Props) {
  const theme = useTheme();

  const { name, status } = row || {};

  const [openMenu, setOpenMenuActions] = useState<HTMLElement | null>(null);

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell>
        <Typography variant="subtitle2" noWrap>
          {_.capitalize(name) || 'N/A'}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography variant="subtitle2" noWrap>
          {_.capitalize(status) || 'N/A'}
        </Typography>
      </TableCell>
    </TableRow>
  );
}
