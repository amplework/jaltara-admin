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
import palette from 'src/theme/palette';
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

type Props = {
  row: UserItem | null;
  selected: boolean;
  onEditRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow?: VoidFunction;
  onhandleEditDetails?: (id: any) => void,
  onhandleDeleteRow?:(id: any) => void,
};

export default function UserTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
  onhandleEditDetails,
  onhandleDeleteRow
}: Props) {
  const theme = useTheme();

  const { name, village, phone, status, id } = row || {};

  return (
    <TableRow hover selected={selected}>
      {/* <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell> */}

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={name} src={''} sx={{ mr: 2 }} />
        <Typography variant="subtitle2" noWrap>
          {name}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography variant="subtitle2" noWrap>
          {phone}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography variant="subtitle2" noWrap>
          {village?.name}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography variant="subtitle2" noWrap>
          {status}
        </Typography>
      </TableCell>

      <TableCell>
        <Box onClick={() => onhandleEditDetails && onhandleEditDetails(id)} sx={{ cursor: "pointer" }}>
          <Iconify icon={"fluent-color:edit-16"} width="64" height="64" />
        </Box>
      </TableCell>

      <TableCell>
        <Iconify icon={"icon-park:delete"} sx={{ color: theme.palette.error.dark }} width="64" height="64" onClick={() => onhandleDeleteRow && onhandleDeleteRow(id)}/>
      </TableCell>
    </TableRow>
  );
}
