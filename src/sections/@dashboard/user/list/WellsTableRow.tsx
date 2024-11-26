import { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { TableRow, TableCell, Typography } from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';
import { formatedDate } from 'src/utils/formateDate';
import { WellsItem } from 'src/@types/wells';

// ----------------------------------------------------------------------

type Props = {
  row: WellsItem | null;
  handleShowDetails?: (id: any) => void;
};

export default function WellsTableRow({ row, handleShowDetails }: Props) {
  const theme = useTheme();

  const { village, level, stages, id } = row || {};

  return (
    <TableRow hover onClick={() => handleShowDetails && handleShowDetails(id)} sx={{ cursor:"pointer" }}>
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
          {stages?.[0]?.updatedbySevek?.name ? stages?.[0]?.updatedbySevek?.name : '--'}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography variant="subtitle2" noWrap>
          {formatedDate(stages?.[0]?.created)}
        </Typography>
      </TableCell>

      {/* <TableCell>
        <Box
          onClick={() => handleShowDetails && handleShowDetails(id)}
          sx={{ cursor: 'pointer' }}
        >
          <Iconify icon={'mdi:show-outline'} width="20px" height="20px" />
        </Box>
      </TableCell> */}

      <TableCell>
        <Iconify
          icon={'icon-park:delete'}
          sx={{ color: theme.palette.error.dark }}
          width="64"
          height="64"
          //   onClick={() => onhandleDeleteRow && onhandleDeleteRow(id)}
        />
      </TableCell>
    </TableRow>
  );
}
