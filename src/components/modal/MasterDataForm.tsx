import { LoadingButton } from '@mui/lab';
import { Box, Container, Divider, Modal, Stack, Typography, useTheme } from '@mui/material';
import React, { useEffect } from 'react';
import Iconify from '../Iconify';
import { FormProvider } from '../hook-form';
import { CropItem } from 'src/@types/crops';
import { ChallangesItem } from 'src/@types/challanges';
import { startLoading } from 'src/redux/slices/crops';
import { useDispatch } from 'src/redux/store';
import { SkeletonPost, SkeletonProduct } from '../skeleton';

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
  isLoading?: boolean;
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
  isLoading,
}: MasterDataFormProps) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      dispatch(startLoading());
      handleCropDetails();
    }
  }, [id]);

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

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
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            {/* Header */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderRadius={'10px 10px 0 0'}
              p={2}
              bgcolor={theme.palette.primary.lighter}
            >
              <Typography variant="h6" color={theme.palette.grey[0]} sx={{ letterSpacing:"0.7px" }}>{title}</Typography>
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
      </Container>
    </Modal>
  );
};

export default MasterDataForm;
