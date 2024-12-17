import { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Avatar, Checkbox, TableRow, TableCell, Typography, MenuItem } from '@mui/material';
// @types
// components
import { EquipmentItem } from 'src/@types/equipment';
import _ from 'lodash';
import { TableMoreMenu } from 'src/components/table';
import Iconify from 'src/components/Iconify';

// ----------------------------------------------------------------------

type Props = {
  row: EquipmentItem | null;
  onhandleEditDetails?: (id: any) => void;
  onhandleDeleteRow?: (id: any,name:any) => void;
  handleShowLogs?: (id: any) => void;
};

export default function EquipmentTableRow({
  row,
  onhandleEditDetails,
  onhandleDeleteRow,
  handleShowLogs,
}: Props) {
  const theme = useTheme();

  const [openMenu, setOpenMenuActions] = useState<HTMLElement | null>(null);
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setOpenMenuActions(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };
  const { name, equipment, status, id } = row || {};

  return (
    <TableRow hover>
      <TableCell sx={{ cursor: 'pointer' }} onClick={() => handleShowLogs && handleShowLogs(id)}>
        <Typography variant="subtitle2" noWrap sx={{textTransform: 'capitalize' }}>
          {name || 'N/A'}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="subtitle2" noWrap sx={{textTransform: 'capitalize' }}>
          {equipment || 'N/A'}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="subtitle2" noWrap sx={{textTransform: 'capitalize' }}>
          {status || 'N/A'}
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
                  onhandleEditDetails && onhandleEditDetails(id);
                  handleCloseMenu();
                }}
              >
                <Iconify icon={'eva:edit-fill'} />
                Edit
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onhandleDeleteRow && onhandleDeleteRow(id,name);
                  handleCloseMenu();
                }}
                sx={{ color: 'error.main' }}
              >
                <Iconify icon={'eva:trash-2-outline'} />
                Delete
              </MenuItem>
            </>
          }
        />
      </TableCell>
    </TableRow>
  );
}
