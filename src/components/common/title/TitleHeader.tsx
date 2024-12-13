import { Box, Typography } from '@mui/material';

const SectionHeader = ({ title }: { title: string }) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      sx={{
        boxShadow: '0px 4px 12px rgba(55, 155, 155, 0.3)',
        padding: 2,
        borderRadius: 1,
        bgcolor: 'rgba(209, 235, 230, 0.8)',
      }}
    >
      <Typography variant="subtitle1" fontWeight="bold" sx={{ color: 'text.primary' }}>
        {title}
      </Typography>
    </Box>
  );
};
export default SectionHeader
