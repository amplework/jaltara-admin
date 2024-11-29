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

// ----------------------------------------------------------------------

type Props = {
  row: FarmerListData | null;
  selected: boolean;
  onEditRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow?: VoidFunction;
  onhandleEditDetails?: (id: any) => void;
  onhandleDeleteRow?: (id: any) => void;
  handleShowDetails?: (id: any) => void;
};

export default function ChallangesTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
  onhandleEditDetails,
  onhandleDeleteRow,
  handleShowDetails,
}: Props) {
  const [openMenu, setOpenMenuActions] = useState<HTMLElement | null>(null);
  const theme = useTheme();
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setOpenMenuActions(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  const { name, phone, id, land, village, language, totalPits, photo } = row || {};
  console.log('row', row);

  return (
    <TableRow hover selected={selected}>
      <TableCell
        sx={{ display: 'flex', alignItems: 'center' }}
        onClick={() => handleShowDetails && handleShowDetails(id)}
      >
        {photo ? (
          <Image alt="cover" src={photo} ratio="16/9" />
        ) : (
          <Avatar alt={name} src={''} sx={{ mr: 2 }} />
        )}

        <Typography variant="subtitle2" noWrap>
          {name}
        </Typography>
      </TableCell>

      <TableCell onClick={() => handleShowDetails && handleShowDetails(id)}>
        <Typography variant="subtitle2" noWrap>
          {land}
        </Typography>
      </TableCell>

      <TableCell onClick={() => handleShowDetails && handleShowDetails(id)}>
        <Typography variant="subtitle2" noWrap>
          {village ? village?.name : '--'}
        </Typography>
      </TableCell>

      <TableCell onClick={() => handleShowDetails && handleShowDetails(id)}>
        <Typography variant="subtitle2" noWrap>
          {language}
        </Typography>
      </TableCell>
      <TableCell onClick={() => handleShowDetails && handleShowDetails(id)}>
        <Typography variant="subtitle2" noWrap>
          {totalPits}
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
