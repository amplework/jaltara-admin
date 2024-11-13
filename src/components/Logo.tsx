// @mui
import { Box, BoxProps } from '@mui/material';
import logos from '../assets/images/logo.svg'
interface Props extends BoxProps {
  disabledLink?: boolean;
}

export default function Logo({ sx }: Props) {
  return (
    <Box sx={{ width: 30, height: 40, ...sx }}>
      <img
        src={logos}
        alt="login"
      />
    </Box>
  );;
}