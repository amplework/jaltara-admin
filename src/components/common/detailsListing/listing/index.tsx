import { Box, Typography } from '@mui/material';

export default function DetailsList({ details }: { details: { label: string; value: string }[] }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
      {details.map(({ label, value }) => (
        <Box key={label} display="flex" alignItems="center">
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', minWidth: 180,textTransform: 'capitalize' }}>
            {label} :
          </Typography>
          <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
            {value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
