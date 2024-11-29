import { TableRow, TableCell, Typography, Box } from '@mui/material';
// components
import { formatedDate } from 'src/utils/formateDate';
import Image from 'src/components/Image';
import noImage from 'src/assets/images/noImage.jpg';

// ----------------------------------------------------------------------

type Props = {
  row: any;
  index: number;
};

export default function FarmerPitsDetails({ row }: Props) {
  const { photo, level, stages, plotSize } = row || {};

  const pitStageName = stages?.[0]?.stageName || 'N/A';
  const pitName = stages?.[0]?.updatedbySevek?.name || 'N/A';
  const pitStageUpdatedDate = stages?.[0]?.modified ? formatedDate(stages[0].modified) : 'N/A';

  return (
    <TableRow>
      <TableCell>
        <Image
          src={photo}
          alt="Well Image"
          sx={{
            width: '50%',
            height: '120px',
            borderRadius: 2,
            objectFit: 'cover',
            boxShadow: 3,
          }}
        />
      </TableCell>

      <TableCell>
        <Typography variant="subtitle2" noWrap>
          {pitName}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography variant="subtitle2" noWrap>
          {level}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography variant="subtitle2" noWrap>
          {plotSize}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography variant="subtitle2" noWrap>
          {pitStageName}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography variant="subtitle2" noWrap>
          {pitStageUpdatedDate}
        </Typography>
      </TableCell>
    </TableRow>
  );
}
