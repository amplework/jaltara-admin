import { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { TableRow, TableCell, Typography, MenuItem } from '@mui/material';
// @types
import { UserItem } from '../../../../@types/user';
// components
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';
import { languageList } from 'src/mockUp/Sevak';

// ----------------------------------------------------------------------

type Props = {
  row: UserItem | null;
  selected: boolean;
  onSelectRow: VoidFunction;
  onDeleteRow?: VoidFunction;
  onhandleEditDetails?: (id: any) => void;
  onhandleDeleteRow?: (id: any, name: any) => void;
  handleShowDetails?: (id: any) => void;
};

export default function SevakTableRow({
  row,
  onhandleEditDetails,
  onhandleDeleteRow,
  handleShowDetails,
}: Props) {
  const theme = useTheme();

  const [openMenu, setOpenMenuActions] = useState<HTMLElement | null>(null);
  const { name, village, phone, status, id, language } = row || {};

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  const handleStatusColor = (status?: string) => {
    if (status === 'active') {
      return theme.palette.success.darker;
    } else if (status === 'inactive') {
      return theme.palette.error.main;
    } else {
      return theme.palette.warning.main;
    }
  };

  return (
    <TableRow hover sx={{ cursor: 'pointer' }}>
      <TableCell
        sx={{ display: 'flex', alignItems: 'center' }}
        onClick={() => handleShowDetails && handleShowDetails(id)}
      >
        <Typography variant="subtitle2" noWrap>
          {name || '--'}
        </Typography>
      </TableCell>

      <TableCell sx={{ cursor: 'default' }}>
        <Typography variant="subtitle2" noWrap>
          {phone || '--'}
        </Typography>
      </TableCell>

      <TableCell sx={{ cursor: 'default' }}>
        <Typography variant="subtitle2" noWrap>
          {language ? languageList.find((item) => item?.id === language)?.label || '--' : '--'}
        </Typography>
      </TableCell>

      <TableCell sx={{ cursor: 'default' }}>
        <Typography variant="subtitle2" noWrap>
          {village?.name || '--'}
        </Typography>
      </TableCell>

      <TableCell sx={{ cursor: 'default' }}>
        <Typography
          variant="subtitle2"
          noWrap
          color={handleStatusColor(status)}
          sx={{ letterSpacing: '1px', textTransform: 'capitalize' }}
        >
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
                  onhandleEditDetails && onhandleEditDetails(id);
                  handleCloseMenu();
                }}
              >
                <Iconify icon={'eva:edit-fill'} />
                Edit
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onhandleDeleteRow && onhandleDeleteRow(id, name);
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
