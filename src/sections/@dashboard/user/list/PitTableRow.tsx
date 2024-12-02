import { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Avatar, Checkbox, TableRow, TableCell, Typography, MenuItem, Box } from '@mui/material';
// @types
import { UserItem } from '../../../../@types/user';
// components
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';
import { PitItem } from 'src/@types/pits';
import { formatedDate } from 'src/utils/formateDate';

// ----------------------------------------------------------------------

type Props = {
  row: PitItem | null;
  handleShowDetails?: (id: any) => void;
  onhandleDeleteRow?: (id: any) => void;
};

export default function PitTableRow({ row, handleShowDetails, onhandleDeleteRow }: Props) {
  const theme = useTheme();
  const [openMenu, setOpenMenuActions] = useState<HTMLElement | null>(null);
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setOpenMenuActions(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  const { farmer, village, level, stages, id } = row || {};

  return (
    <TableRow hover sx={{ cursor: 'pointer' }}>
      <TableCell
        sx={{ display: 'flex', alignItems: 'center' }}
        onClick={() => handleShowDetails && handleShowDetails(id)}
      >
        {/* <Avatar alt={} src={''} sx={{ mr: 2 }} /> */}
        <Typography variant="subtitle2" noWrap>
          {farmer?.name}
        </Typography>
      </TableCell>

      <TableCell onClick={() => handleShowDetails && handleShowDetails(id)}>
        <Typography variant="subtitle2" noWrap>
          {village?.name}
        </Typography>
      </TableCell>

      <TableCell onClick={() => handleShowDetails && handleShowDetails(id)}>
        <Typography variant="subtitle2" noWrap>
          {level}
        </Typography>
      </TableCell>

      <TableCell onClick={() => handleShowDetails && handleShowDetails(id)}>
        <Typography variant="subtitle2" noWrap>
          {stages?.[0]?.stageName}
        </Typography>
      </TableCell>

      <TableCell onClick={() => handleShowDetails && handleShowDetails(id)}>
        <Typography variant="subtitle2" noWrap>
          {stages?.[0]?.updatedbySevek?.name ? stages?.[0]?.updatedbySevek?.name : '--'}
        </Typography>
      </TableCell>

      <TableCell onClick={() => handleShowDetails && handleShowDetails(id)}>
        <Typography variant="subtitle2" noWrap>
          {formatedDate(stages?.[0]?.created)}
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
              {/* <MenuItem
                onClick={() => {
                  onhandleEditDetails && onhandleEditDetails(id);
                  handleCloseMenu();
                }}
              >
                <Iconify icon={'eva:edit-fill'} />
                Edit
              </MenuItem> */}
            </>
          }
        />
      </TableCell>
    </TableRow>
  );
}
