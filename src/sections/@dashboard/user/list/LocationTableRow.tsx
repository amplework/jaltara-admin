import { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { TableRow, TableCell, Typography, MenuItem } from '@mui/material';
// components
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

export default function LocationTableRow({ row, handleShowDetails, onhandleDeleteRow }: Props) {
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
    <TableRow
      hover
      onClick={() => handleShowDetails && handleShowDetails(id)}
      sx={{ cursor: 'pointer' }}
    >
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle2" noWrap>
          {farmer?.name}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography variant="subtitle2" noWrap>
          {village?.name}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography variant="subtitle2" noWrap>
          {level}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography variant="subtitle2" noWrap>
          {stages?.[0]?.stageName}
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
            </>
          }
        />
      </TableCell>
    </TableRow>
  );
}
