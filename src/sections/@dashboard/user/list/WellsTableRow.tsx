import { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { TableRow, TableCell, Typography, MenuItem } from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';
import { formatedDate } from 'src/utils/formateDate';
import { WellsItem } from 'src/@types/wells';
import { TableMoreMenu } from 'src/components/table';

// ----------------------------------------------------------------------

type Props = {
  row: WellsItem | null;
  handleShowDetails?: (id: any) => void;
  onhandleDeleteRow?: (id: any,) => void;
};

export default function WellsTableRow({ row, handleShowDetails, onhandleDeleteRow }: Props) {
  const theme = useTheme();
  const [openMenu, setOpenMenuActions] = useState<HTMLElement | null>(null);
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setOpenMenuActions(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };
  const { village, level, stages, id } = row || {};

  return (
    <TableRow hover sx={{ cursor: 'default' }}>
      <TableCell
        onClick={() => handleShowDetails && handleShowDetails(id)}
        sx={{ cursor: 'pointer' }}
      >
        <Typography variant="subtitle2" noWrap sx={{ textTransform: 'capitalize' }}>
          {village?.name}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography variant="subtitle2" noWrap >
          {level}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography variant="subtitle2" noWrap sx={{ textTransform: 'capitalize' }}>
          {stages?.[0]?.updatedbySevek?.name ? stages?.[0]?.updatedbySevek?.name : '--'}
        </Typography>
      </TableCell>

      <TableCell>
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
