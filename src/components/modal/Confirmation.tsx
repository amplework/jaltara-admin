import { LoadingButton } from '@mui/lab';
import { Box, Container, Divider, Modal, Stack, Typography, useTheme } from '@mui/material';
import React from 'react';
import Iconify from '../Iconify';
import { SkeletonPost } from '../skeleton';

interface ConfirmationModalProps {
  openModal: boolean;
  handleClose?: VoidFunction;
  children?: React.ReactNode;
  disabled?: boolean;
  isLoading?: boolean;
  title: string;
  handleSubmit: () => void;
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 550,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '10px',
};

const ConfirmationModal = ({
  openModal,
  handleClose,
  handleSubmit,
  children,
  title = 'Add New Crop',
  disabled,
  isLoading,
}: ConfirmationModalProps) => {
  const theme = useTheme();

  return (
    <Modal
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      open={openModal}
      onClose={handleClose}
      disableEnforceFocus={false}
      disableAutoFocus={false}
      sx={{ outline: 0 }}
    >
      <Container
        sx={{
          maxWidth: {
            xl: '2600px',
            position: 'relative',
            borderRadius: '20px',
            height: '100%',
          },
        }}
      >
        <Box sx={style}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderRadius={'10px 10px 0 0'}
            p={2}
            bgcolor={theme.palette.primary.lighter}
          >
            <Typography variant="h6" color={theme.palette.grey[0]} sx={{ letterSpacing: '0.7px' }}>
              {title}
            </Typography>
            <LoadingButton
              onClick={handleClose}
              sx={{
                minWidth: 0,
                padding: 0.2,
                display: 'flex',
                alignItems: 'center',
                borderRadius: '50%',
                bgcolor: theme.palette.common.white,
                ':hover': {
                  bgcolor: theme.palette.common.white,
                },
              }}
            >
              <Iconify
                icon="iconamoon:close-bold"
                width={24}
                height={24}
                color={theme.palette.common.black}
              />
            </LoadingButton>
          </Box>

          <Divider />
          {/* Content */}
          {isLoading ? (
            <SkeletonPost />
          ) : (
            <Box
              mt={2}
              //  sx={{ minHeight: 300 }}
            >
              {children}
            </Box>
          )}

          {/* Footer */}
          <Stack direction="row" spacing={2} justifyContent="flex-end" p={2}>
            <LoadingButton variant="outlined" onClick={handleClose} fullWidth sx={{ p: 1 }}>
              Cancel
            </LoadingButton>
            <LoadingButton
              variant="contained"
              disabled={disabled}
              onClick={handleSubmit}
              fullWidth
              sx={{ p: 1 }}
            >
              {'Delete'}
            </LoadingButton>
          </Stack>
        </Box>
      </Container>
    </Modal>
  );
};

export default ConfirmationModal;
