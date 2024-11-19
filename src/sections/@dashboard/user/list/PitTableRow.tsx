import { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Avatar, Checkbox, TableRow, TableCell, Typography, MenuItem } from '@mui/material';
// @types
import { UserItem } from '../../../../@types/user';
// components
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';
import { PitItem } from 'src/@types/pits';

// ----------------------------------------------------------------------

type Props = {
  row: PitItem | null;
  selected: boolean;
  onEditRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow?: VoidFunction;
};

export default function PitTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
}: Props) {
  const theme = useTheme();

  const { userData, pitCount } = row || {};

  const [openMenu, setOpenMenuActions] = useState<HTMLElement | null>(null);

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={userData?.name} src={''} sx={{ mr: 2 }} />
        <Typography variant="subtitle2" noWrap>
          {userData?.name}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography variant="subtitle2" noWrap>
          {userData?.village.name}
        </Typography>
      </TableCell>
      
      <TableCell>
        <Typography variant="subtitle2" noWrap>
          {pitCount}
        </Typography>
      </TableCell>
      
      {/* <TableCell>
        <Typography variant="subtitle2" noWrap>
          {pitCount}
        </Typography>
      </TableCell> */}
  
    </TableRow>
  );
}
