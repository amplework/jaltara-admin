import { TableRow, TableCell, Typography } from '@mui/material';
// components
import { formatedDate } from 'src/utils/formateDate';
import Image from 'src/components/Image';

// ----------------------------------------------------------------------

type Props = {
  row: any;
};

export default function SevekPitsList({ row }: Props) {

  const { created, photo, stageName, pitId, wellId, pit, well } = row || {};

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
          {pitId ? 'Pit' : wellId ? 'Well' : '--'}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="subtitle2" noWrap>
          {pitId ? pit?.farmer?.name : '--'}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="subtitle2" noWrap>
          {pitId ? pit?.village?.name : wellId ? well?.village?.name : '--'}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="subtitle2" noWrap>
          {stageName}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="subtitle2" noWrap>
        {pitId ? pit?.level : wellId ? well?.level : '--'}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography variant="subtitle2" noWrap>
          {formatedDate(created)}
        </Typography>
      </TableCell>
    </TableRow>
  );
}
