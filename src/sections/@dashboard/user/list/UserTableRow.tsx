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
  onSelectRow: VoidFunction;
  onDeleteRow?: VoidFunction;
  onhandleEditDetails?: (id: any) => void;
  onhandleDeleteRow?: (id: any) => void;
  handleShowDetails?: (id: any) => void;
};

export default function UserTableRow({
  row,
  onhandleEditDetails,
  onhandleDeleteRow,
  handleShowDetails,
}: Props) {
  const theme = useTheme();

  const [openMenu, setOpenMenuActions] = useState<HTMLElement | null>(null);
  const { name, village, phone, status, id } = row || {};

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow hover sx={{ cursor: 'pointer' }}>
      <TableCell
        sx={{ display: 'flex', alignItems: 'center' }}
        onClick={() => handleShowDetails && handleShowDetails(id)}
      >
        <Typography variant="subtitle2" noWrap>
          {name}
        </Typography>
      </TableCell>

      <TableCell onClick={() => handleShowDetails && handleShowDetails(id)}>
        <Typography variant="subtitle2" noWrap>
          {phone}
        </Typography>
      </TableCell>
      <TableCell onClick={() => handleShowDetails && handleShowDetails(id)}>
        <Typography variant="subtitle2" noWrap>
          {village?.name}
        </Typography>
      </TableCell>

      <TableCell onClick={() => handleShowDetails && handleShowDetails(id)}>
        <Typography variant="subtitle2" noWrap>
          {status}
        </Typography>
      </TableCell>

      <TableCell align="left">
        <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
            <>
              <MenuItem
                onClick={() => {
                  onhandleDeleteRow && onhandleDeleteRow(id);
                  handleCloseMenu();
                }}
                sx={{ color: 'error.main' }}
              >
                <Iconify icon={'eva:trash-2-outline'} />
                Delete
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onhandleEditDetails && onhandleEditDetails(id);
                  handleCloseMenu();
                }}
              >
                <Iconify icon={'eva:edit-fill'} />
                Edit
              </MenuItem>
            </>
          }
        />
      </TableCell>
    </TableRow>
  );
}
