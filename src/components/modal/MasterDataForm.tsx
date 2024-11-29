import { LoadingButton } from '@mui/lab';
import { Box, Divider, Modal, Stack, Typography, useTheme } from '@mui/material';
import React, { useEffect } from 'react';
import Iconify from '../Iconify';
import { FormProvider } from '../hook-form';
import { CropItem } from 'src/@types/crops';
import { ChallangesItem } from 'src/@types/challanges';

interface MasterDataFormProps {
  openModal: boolean;
  handleClose?: VoidFunction;
  children?: React.ReactNode;
  title?: string;
  methods: any;
  onSubmit: any;
  id?: string;
  handleCropDetails?: any;
  cropDetails?: CropItem | ChallangesItem;
  disabled?: boolean;
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

const MasterDataForm = ({
  openModal,
  handleClose,
  children,
  methods,
  onSubmit,
  id,
  cropDetails,
  handleCropDetails,
  title = 'Add New Crop',
  disabled,
}: MasterDataFormProps) => {
  const theme = useTheme();
  useEffect(() => {
    if (id) {
      handleCropDetails();
    }
  }, [id]);

  const {
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  return (
    <Modal
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      open={openModal}
      onClose={handleClose}
      disableEnforceFocus={false} // Ensures focus stays trapped inside the modal
      disableAutoFocus={false} // Allows proper initial focus handling
      sx={{ outline: 0 }}
    >
      <Box sx={style}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          {/* Header */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            // mb={2}
            borderRadius={'10px 10px 0 0'}
            p={2}
            bgcolor={theme.palette.primary.lighter}
          >
            <Typography variant="h6">{title}</Typography>
            <LoadingButton
              onClick={handleClose}
              sx={{
                minWidth: 0,
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                bgcolor: theme.palette.common.white,
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
          <Box mt={2}>{children}</Box>

          {/* Footer */}
          <Divider />
          <Stack direction="row" spacing={2} justifyContent="flex-end" p={2}>
            <LoadingButton variant="outlined" onClick={handleClose}>
              Cancel
            </LoadingButton>
            <LoadingButton
              type="submit"
              variant="contained"
              disabled={disabled}
              startIcon={<Iconify icon="mingcute:user-add-fill" />}
            >
              {id ? 'Edit Crop' : 'Add New'}
            </LoadingButton>
          </Stack>
        </FormProvider>
      </Box>
    </Modal>
  );
};

export default MasterDataForm;
