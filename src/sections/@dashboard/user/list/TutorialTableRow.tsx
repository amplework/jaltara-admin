import { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Avatar, Checkbox, TableRow, TableCell, Typography, MenuItem } from '@mui/material';
// @types
// components
import { CropItem } from 'src/@types/crops';
import _ from 'lodash';
import { formatedDate } from 'src/utils/formateDate';
import { TableMoreMenu } from 'src/components/table';
import Iconify from 'src/components/Iconify';

// ----------------------------------------------------------------------

type Props = {
  row: any | null;
  onDeleteRow?: (id: any,name:any) => void;
  onEditRow?: (id: any) => void;
  handleShowDetails?: (id: any) => void;
};

export default function TutorialTableRow({
  row,
  onDeleteRow,
  handleShowDetails,
  onEditRow,
}: Props) {
  const theme = useTheme();

  const [openMenu, setOpenMenuActions] = useState<HTMLElement | null>(null);
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setOpenMenuActions(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  const { subject, status, id, videos } = row || {};

  return (
    <TableRow hover>
      <TableCell onClick={() => handleShowDetails && handleShowDetails(id)}>
        <Typography variant="subtitle2" noWrap sx={{ cursor: 'pointer' }}>
          {_.capitalize(subject) || 'N/A'}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="subtitle2" noWrap>
          {_.capitalize(videos?.length) || 'N/A'}
        </Typography>
      </TableCell>
      {/* <TableCell>
        <Typography variant="subtitle2" noWrap>
          {_.capitalize(status) || 'N/A'}
        </Typography>
      </TableCell> */}
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
                  onDeleteRow && onDeleteRow(id,subject);
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
