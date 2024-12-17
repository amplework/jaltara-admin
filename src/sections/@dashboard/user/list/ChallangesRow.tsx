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
import { FarmerListData } from 'src/@types/farmer';
import Image from 'src/components/Image';
import { ChallangesItem } from 'src/@types/challanges';

// ----------------------------------------------------------------------

type Props = {
  row: ChallangesItem | null;
  onEditRow: (id: any) => void;
  onDeleteRow?: (id: any,name:any) => void;
  handleShowDetails?: (id: any) => void;
};

export default function ChallangesTableRow({
  row,
  onEditRow,
  handleShowDetails,
  onDeleteRow,
}: Props) {
  const [openMenu, setOpenMenuActions] = useState<HTMLElement | null>(null);
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setOpenMenuActions(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  const { status, challenge, id } = row || {};

  return (
    <TableRow hover>
      <TableCell onClick={() => handleShowDetails && handleShowDetails(id)}>
        <Typography variant="subtitle2" noWrap sx={{ textTransform: 'capitalize' }}>
          {challenge}
        </Typography>
      </TableCell>
      <TableCell onClick={() => handleShowDetails && handleShowDetails(id)}>
        <Typography variant="subtitle2" noWrap sx={{ textTransform:"capitalize" }}>
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
                  onEditRow && onEditRow(id);
                  handleCloseMenu();
                }}
              >
                <Iconify icon={'eva:edit-fill'} />
                Edit
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onDeleteRow && onDeleteRow(id,challenge);
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
