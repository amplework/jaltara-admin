import { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { TableRow, TableCell, Typography, MenuItem } from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';
import { PitItem } from 'src/@types/pits';
import { formatedDate } from 'src/utils/formateDate';
import { LocationListing } from 'src/@types/location';
import { getEntityName } from 'src/utils/common';

// ----------------------------------------------------------------------

type Props = {
  row: LocationListing | null;
  handleShowDetails?: (id: any) => void;
  onhandleDeleteRow?: (id: any, name: any) => void;
  onhandleEditDetails?: (id: any) => void;
};

export default function DistrictTableRow({
  row,
  handleShowDetails,
  onhandleDeleteRow,
  onhandleEditDetails,
}: Props) {
  const theme = useTheme();
  const [openMenu, setOpenMenuActions] = useState<HTMLElement | null>(null);
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setOpenMenuActions(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  const { id, name, farmerCount, checkUpperGeo } = row || {};

  const stateName = getEntityName('state', checkUpperGeo);
  const districtName = getEntityName('district', checkUpperGeo);
  const talukName = getEntityName('taluk', checkUpperGeo);

  return (
    <TableRow
      hover
      onClick={() => handleShowDetails && handleShowDetails(id)}
      sx={{  textTransform: 'capitalize' }}
    >
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle2" noWrap>
          {name}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography variant="subtitle2" noWrap>
          {stateName?.id ? stateName?.name : '--'}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography variant="subtitle2" noWrap>
          {farmerCount || '--'}
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
