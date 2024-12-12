import * as Yup from 'yup';
import { LoadingButton } from '@mui/lab';
import { Box, Container, Divider, Modal, Stack, Typography, useTheme } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import Iconify from '../Iconify';
import { FormProvider, RHFSelectDropdown, RHFTextField } from '../hook-form';
import { CropItem } from 'src/@types/crops';
import { ChallangesItem } from 'src/@types/challanges';
import { startLoading } from 'src/redux/slices/crops';
import { useDispatch, useSelector } from 'src/redux/store';
import { SkeletonPost, SkeletonProduct } from '../skeleton';
import { statusList } from 'src/pages/masterData/cropsChallanges/ChallangesList';
import { useForm } from 'react-hook-form';
import { LocationAdd, LocationDetails } from 'src/@types/location';
import { yupResolver } from '@hookform/resolvers/yup';
import { addLocationsDetails } from 'src/redux/slices/locations';
import { useSnackbar } from 'notistack';
import { getDistrictList, getTalukList } from 'src/redux/slices/user';

interface LocationAddForm {
  openModal: boolean;
  handleClose?: any;
  children?: React.ReactNode;
  title?: string;
  methods?: any;
  onSubmit?: any;
  id?: string;
  handleCropDetails?: any;
  cropDetails?: CropItem | ChallangesItem;
  disabled?: boolean;
  isLoading?: boolean;
  handleLocationList?: any;
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

const LocationAddForm = ({
  openModal,
  handleClose,
  children,
  // methods,
  // onSubmit,
  id,
  cropDetails,
  handleCropDetails,
  title = 'Add New Geo Location',
  handleLocationList,
}: //   disabled,
//   isLoading,
LocationAddForm) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { statesList, districtList, talukList } = useSelector((state) => state.user);

  const [state, setState] = useState({
    parentId: '',
    stateId: '',
    districtId: '',
    talukId: '',
  });

  const defaultValues = useMemo(
    () => ({
      location: '',
      selectStates: '',
      selectDistrict: '',
      selectTaluk: '',
      name: '',
    }),
    []
  );

  const NewLocationSchema = Yup.object().shape({
    location: Yup.string().required('States is required'),
    name: Yup.string().required('Name is required').max(50, 'Limit of 50 characters'),
    selectStates: Yup.string().required('States is required'),
    selectDistrict: Yup.string(),
    selectTaluk: Yup.string(),
  });

  const methods = useForm<LocationAdd>({
    resolver: yupResolver(NewLocationSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleLocationChange = () => {
    setValue('selectStates', '');
    setValue('selectDistrict', '');
    setValue('selectTaluk', '');
    setValue('name', '');
  };

  const handleStatesSelect = (id: any) => {
    setState((prev: any) => ({ ...prev, parentId: id, stateId: id }));
    getDistrictList(id);
  };

  const handleDistrictSelect = (id: any) => {
    setState((prev: any) => ({ ...prev, parentId: id, districtId: id }));
    getTalukList(id);
  };

  const handleTalukSelect = (id: string) => {
    setState((prev: any) => ({ ...prev, parentId: id, talukId: id }));
  };

  const onSubmit = async (data?: LocationAdd) => {
    const payload = {
      name: data?.name,
      entityType: data?.location,
      ...(state?.parentId && { parentId: state?.parentId }),
    };

    dispatch(addLocationsDetails(payload)).then((res: any) => {
      if (res?.data?.statusCode === 201) {
        enqueueSnackbar(res?.data?.message, {
          variant: 'success',
        });
        handleLocationList();
        handleClose();
      } else if (res?.data?.statusCode === 409) {
        enqueueSnackbar(res?.data?.message, {
          variant: 'success',
        });
      } else if (res?.data?.statusCode === 422) {
        enqueueSnackbar(res?.data?.message, {
          variant: 'error',
        });
      }
    });
  };

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
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 2,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' },
                p: 2,
              }}
            >
              <RHFSelectDropdown
                name="location"
                label={'Select location'}
                placeholder={'location'}
                value={watch('location')}
                options={statusList}
                onChange={handleLocationChange}
              />

              {['district', 'taluk', 'village']?.includes(watch('location')) && (
                <RHFSelectDropdown
                  name="selectStates"
                  label={'Select States'}
                  placeholder={'States'}
                  value={watch('selectStates')}
                  options={statesList}
                  onChange={handleStatesSelect}
                />
              )}

              {['taluk', 'village']?.includes(watch('location')) &&
                watch('selectStates') &&
                districtList?.childEntities?.length && (
                  <RHFSelectDropdown
                    name="selectDistrict"
                    label={'Select District'}
                    placeholder={'District'}
                    value={watch('selectDistrict')}
                    options={districtList?.childEntities}
                    defaultMessage="Please Select State"
                    onChange={handleDistrictSelect}
                  />
                )}
              {['village']?.includes(watch('location')) &&
                watch('selectStates') &&
                watch('selectDistrict') && (
                  <RHFSelectDropdown
                    name="selectTaluk"
                    label={'Select Taluk'}
                    placeholder={'Taluk'}
                    value={watch('selectTaluk')}
                    options={talukList?.childEntities || []}
                    defaultMessage="Please Select District"
                    onChange={handleTalukSelect}
                  />
                )}

              {['state', 'district', 'taluk', 'village']?.includes(watch('location')) && (
                <RHFTextField name="name" label={'Name'} placeholder={'Name'} />
              )}
            </Box>

            <Divider />
            <Stack direction="row" spacing={2} justifyContent="flex-end" p={2}>
              <LoadingButton variant="outlined" onClick={handleClose}>
                Cancel
              </LoadingButton>
              <LoadingButton
                type="submit"
                variant="contained"
                startIcon={<Iconify icon="mingcute:user-add-fill" />}
              >
                {'Add New'}
              </LoadingButton>
            </Stack>
          </FormProvider>
        </Box>
      </Container>
    </Modal>
  );
};

export default LocationAddForm;
