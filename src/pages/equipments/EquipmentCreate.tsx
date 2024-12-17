import * as Yup from 'yup';
import { useParams, useNavigate } from 'react-router-dom';
// @mui
import { Card, Container, Grid, InputAdornment } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  FormProvider,
  RHFSelectDropdown,
  RHFTextField,
  RHFUploadSingleFile,
} from 'src/components/hook-form';
import { Box } from '@mui/material';
import { Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useDispatch, useSelector } from 'src/redux/store';
import Iconify from 'src/components/Iconify';
import { EquipmentItem } from 'src/@types/equipment';
import { addEditEquipment, getEquipmentsDetails, startLoading } from 'src/redux/slices/equipment';
import { SkeletonProduct } from 'src/components/skeleton';
import { getImageUploadUrl } from 'src/redux/slices/imageUpload';
import profilepic from 'src/assets/images/profile-background.jpg';

const statusList = [
  { id: 'active', label: 'Active', name: 'active' },
  { id: 'inactive', label: 'Inactive', name: 'inactive' },
];

export default function EquipmentCreate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      dispatch(startLoading());
      dispatch(getEquipmentsDetails(id));
    }
  }, [id, dispatch]);

  const { equipmentDetails, isLoading } = useSelector((state) => state.equipments);
  const defaultValues = useMemo(
    () => ({
      name: '',
      status: '',
      equipment: '',
      phone: '',
      photo: '',
    }),
    [equipmentDetails]
  );

  const NewEquipmentSchema = Yup.object().shape({
    name: Yup.string().required('Name is required').max(50, 'Limit of 50 characters'),
    status: Yup.string().required('Status is required'),
    equipment: Yup.string().required('Number plate is required').max(50, 'Limit of 50 characters'),
    phone: Yup.string()
      .required('Phone number is required')
      .matches(/^\d{10}$/, 'Only numbers are allowed and limit is 10 digits'),
    photo: Yup.mixed(),
  });

  useEffect(() => {
    setValue('name', equipmentDetails?.name);
    setValue('status', equipmentDetails?.status);
    setValue('equipment', equipmentDetails?.equipment);
    setValue('phone', equipmentDetails?.phone);
    setValue('photo', equipmentDetails?.photo);
  }, [equipmentDetails]);

  const methods = useForm<EquipmentItem>({
    resolver: yupResolver(NewEquipmentSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        let formData = new FormData();
        formData.append('image', file);
        dispatch(getImageUploadUrl(formData)).then((res) => {
          if (res?.statusCode === 200) {
            enqueueSnackbar(res?.message, {
              variant: 'success',
            });
            setValue('photo', res?.data);
          }
        });
      }
    },
    [setValue]
  );
  const onSubmit = async (data: EquipmentItem) => {
    try {
      let previousState: any = {
        name: equipmentDetails?.name,
        status: equipmentDetails?.status,
        equipment: equipmentDetails?.equipment,
        phone: equipmentDetails?.phone,
      };

      let payload: any = {
        name: data?.name,
        status: data?.status,
        equipment: data?.equipment,
        phone: data?.phone,
        photo: data?.photo,
      };

      Object.keys(payload).forEach((key) => {
        if (payload[key] === previousState[key]) {
          delete payload[key];
        }
      });

      if (id) {
        dispatch(addEditEquipment(payload, id)).then((res: any) => {
          if (res?.data?.statusCode === 200) {
            enqueueSnackbar(res?.data?.message, {
              variant: 'success',
            });
            navigate(PATH_DASHBOARD.equipments.list);
          }
        });
      } else {
        dispatch(addEditEquipment(payload)).then((res: any) => {
          if (res?.data?.statusCode === 201) {
            enqueueSnackbar(res?.data?.message, {
              variant: 'success',
            });
            navigate(PATH_DASHBOARD.equipments.list);
          } else {
            enqueueSnackbar(res?.data?.message, {
              variant: 'success',
            });
          }
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Page title="Create Equipments">
      <Container maxWidth={'xl'}>
        <HeaderBreadcrumbs
          heading={!id ? 'Add equipment' : 'Edit equipment details'}
          links={[
            { name: 'Equipment List', href: PATH_DASHBOARD.sevak.list },
            { name: !id ? 'Add equipment' : 'Edit equipment details' },
          ]}
        />
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <Card
                sx={{
                  mb: 10,
                  overflow: 'visible', // Allow the image to overflow outside the Card
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center', // Center content horizontally
                  alignItems: 'center', // Center content vertically
                  minHeight: '200px', // Adjust height based on content
                  padding: 2,
                  backgroundImage: `url(${profilepic})`,
                  // backgroundImage: `url(${watch('photo')})`,
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                  }}
                >
                  <RHFUploadSingleFile
                    name="photo"
                    onDrop={handleDrop}
                    sx={{
                      zIndex: 9,
                      mt: 5,
                      position: 'absolute',
                      bottom: '-60px',
                      width: '200px',
                      height: '200px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid #e0e0e0',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                      cursor: 'pointer',
                    }}
                  />
                </Box>
              </Card>
              {isLoading ? (
                <Card sx={{ p: 3 }}>
                  <SkeletonProduct />
                </Card>
              ) : (
                <Card sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: 'grid',
                      columnGap: 2,
                      rowGap: 3,
                      gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                    }}
                  >
                    <RHFTextField name="name" label="Owner Name" />
                    <RHFSelectDropdown
                      name="status"
                      label={'Status'}
                      placeholder={'Status'}
                      value={watch('status')}
                      options={statusList}
                    />
                    <RHFTextField name="equipment" label="Number Plate" />
                    <RHFTextField
                      name="phone"
                      label="Phone Number"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">+91</InputAdornment>,
                      }}
                    />
                  </Box>
                  <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                    <LoadingButton
                      type="submit"
                      variant="contained"
                      loading={isSubmitting}
                      disabled={
                        equipmentDetails?.name === watch('name') &&
                        equipmentDetails?.status === watch('status') &&
                        equipmentDetails?.equipment === watch('equipment') &&
                        equipmentDetails?.phone === watch('phone')
                      }
                      startIcon={
                        <Iconify icon={!id ? 'mingcute:user-add-fill' : 'fa-solid:user-edit'} />
                      }
                    >
                      {id ? 'Save' : 'Add'}
                    </LoadingButton>
                  </Stack>
                </Card>
              )}
            </Grid>
          </Grid>
        </FormProvider>
      </Container>
    </Page>
  );
}
