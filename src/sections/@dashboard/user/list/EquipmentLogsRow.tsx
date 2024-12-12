import { TableRow, TableCell, Typography } from '@mui/material';
// components
import { formatedDateTime } from 'src/utils/formateDate';
import { EquipmentLogsType } from 'src/@types/equipment';

// ----------------------------------------------------------------------

type Props = {
  row: EquipmentLogsType;
  index: number;
};

export default function EquipmentLogsRow({ row }: Props) {
  const { startTime, endTime, timeRecord } = row || {};

  return (
    <TableRow hover>

      <TableCell>
        <Typography variant="subtitle2" noWrap>
          {formatedDateTime(startTime)}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography variant="subtitle2" noWrap>
        {formatedDateTime(startTime)}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography variant="subtitle2" noWrap>
          {timeRecord?timeRecord:'-'}
        </Typography>
      </TableCell>
    </TableRow>
  );
}
