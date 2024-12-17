import { Box, Typography, Button } from '@mui/material';
import Iconify from 'src/components/Iconify';

interface DeleteConfirmationProps {
  userName: string;
}

export const DeleteConfirmationContent = ({
  userName,
}: DeleteConfirmationProps) => (
  <Box
    sx={{
      p: 2,
      minHeight: '180px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      textAlign: 'center',
    }}
  >
    {/* Icon Box */}
    <Box
      sx={{
        width: 80,
        height: 80,
        borderRadius: '50%',
        backgroundColor: '#FDECF2', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: 2,
      }}
    >
      <Iconify  
        icon="mingcute:delete-2-line"
        sx={{ fontSize: 32, color: '#E91E63' }} 
      />
    </Box>

    {/* Confirmation Text */}
    <Typography
      variant="h6"
      sx={{
        fontWeight: 'bold',
        mb: 2,
      }}
    >
      Are you sure you want to remove {userName}?
    </Typography>

  </Box>
);
