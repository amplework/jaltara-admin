import ReactApexChart from 'react-apexcharts';
// @mui
import { alpha, useTheme, styled } from '@mui/material/styles';
import { Box, Card, Typography, Stack, CardProps } from '@mui/material';
// utils
import { fNumber, fPercent } from '../../../../utils/formatNumber';
// components
import Iconify from '../../../../components/Iconify';
import { SkeletonPostItem } from 'src/components/skeleton';

// ----------------------------------------------------------------------

const IconWrapperStyle = styled('div')(({ theme }) => ({
  width: 24,
  height: 24,
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.success.main,
  backgroundColor: alpha(theme.palette.success.main, 0.16),
}));

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title: string;
  total: number | string | undefined;
  isLoading?: boolean;
}

export default function SevekSummary({ title, total, sx,isLoading, ...other }: Props) {
  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 3, ...sx }} {...other}>
      {isLoading ? (
        <SkeletonPostItem />
      ) : (
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle2" textAlign={'center'}>
            {title}
          </Typography>
          <Typography variant="h3" textAlign={'center'}>
            {total}
          </Typography>
        </Box>
      )}
    </Card>
  );
}
