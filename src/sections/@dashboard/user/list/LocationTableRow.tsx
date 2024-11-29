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
};

export default function LocationTableRow({ row, handleShowDetails }: Props) {
  const theme = useTheme();

  const { farmer, village, level, stages, id } = row || {};

  return (
    <TableRow
      hover
      onClick={() => handleShowDetails && handleShowDetails(id)}
      sx={{ cursor: 'pointer' }}
    >
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        {/* <Avatar alt={} src={''} sx={{ mr: 2 }} /> */}
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

      {/* <TableCell>
        <Typography variant="subtitle2" noWrap>
          {stages?.[0]?.updatedbySevek?.name ? stages?.[0]?.updatedbySevek?.name : '--'}
        </Typography>
      </TableCell> */}

      <TableCell>
        <Typography variant="subtitle2" noWrap>
          {formatedDate(stages?.[0]?.created)}
        </Typography>
      </TableCell>
      {/* 
      <TableCell>
        <Box
          onClick={() => onhandleEditDetails && onhandleEditDetails(id)}
          sx={{ cursor: 'pointer' }}
        >
          <Iconify icon={'fluent-color:edit-16'} width="64" height="64" />
        </Box>
      </TableCell> */}

      <TableCell>
        <Iconify
          icon={'icon-park:delete'}
          sx={{ color: theme.palette.error.dark }}
          width="64"
          height="64"
          // onClick={() => onhandleDeleteRow && onhandleDeleteRow(id)}
        />
      </TableCell>
    </TableRow>
  );
}
