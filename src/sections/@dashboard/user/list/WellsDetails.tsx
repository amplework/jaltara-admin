// @mui
import { useTheme } from '@mui/material/styles';
import { TableRow, TableCell, Typography } from '@mui/material';
// components
import { formatedDate } from 'src/utils/formateDate';
import { Stage } from 'src/@types/wells';
import Image from 'src/components/Image';

// ----------------------------------------------------------------------

type Props = {
  row: Stage | null;
  index: number;
  pit?: boolean;
  sevek?: boolean;
};

export default function WellsDetailsRow({ row, pit }: Props) {

  const theme = useTheme();

  const { created, photo, updatedbySevek, stageName } = row || {};

  

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

      {pit ? (
        <TableCell>
          <Typography variant="subtitle2" noWrap>
            {stageName ? stageName : '--'}
          </Typography>
        </TableCell>
      ) : null}

      <TableCell>
        <Typography variant="subtitle2" noWrap>
          {updatedbySevek?.name ? updatedbySevek?.name : '--'}
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
