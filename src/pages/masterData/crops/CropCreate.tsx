import * as Yup from 'yup';
import { useParams, useNavigate } from 'react-router-dom';
// @mui
import { Card, Container, Grid } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks

// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
// sections
import { useSnackbar } from 'notistack';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, RHFSelectDropdown, RHFTextField } from 'src/components/hook-form';
import { Box } from '@mui/material';
import { Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useDispatch, useSelector } from 'src/redux/store';
import Iconify from 'src/components/Iconify';
import { addEditCrops, getCropsDetails, startLoading } from 'src/redux/slices/crops';
import { CropItem } from 'src/@types/crops';
import { SkeletonProduct } from 'src/components/skeleton';

const statusList = [
  { id: 'active', label: 'Active', name: 'active' },
  { id: 'inactive', label: 'Inactive', name: 'inactive' },
];

const languageList = [
  { id: 'hindi', label: 'Hindi', name: 'hindi' },
  { id: 'marathi', label: 'Marathi', name: 'marathi' },
  { id: 'english', label: 'English', name: 'english' },
];

export default function CropCreate() {
  
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      dispatch(startLoading());
      dispatch(getCropsDetails(id));
    }
  }, [id, dispatch]);

  const { cropsDetails, isLoading } = useSelector((state) => state.crops);

  const defaultValues = useMemo(
    () => ({
      name: '',
      status: '',
    }),
    [cropsDetails]
  );

  const NewCropsSchema = Yup.object().shape({
    name: Yup.string().required('Name is required').max(50, 'Limit of 50 characters'),
    status: Yup.string().required('Status is required'),
    // equipment: Yup.string().required('equipment is required').max(50, 'Limit of 50 characters'),
  });

  useEffect(() => {
    setValue('name', cropsDetails?.name);
    setValue('status', cropsDetails?.status);
    // setValue('equipment', cropsDetails?.equipment);
  }, [cropsDetails]);

  const methods = useForm<CropItem>({
    resolver: yupResolver(NewCropsSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: CropItem) => {
    try {
      let previousState: any = {
        name: cropsDetails?.name,
        status: cropsDetails?.status,
        // equipment: cropsDetails?.equipment,
      };

      let payload: any = {
        name: data?.name,
        status: data?.status,
        // equipment: data?.equipment,
      };

      Object.keys(payload).forEach((key) => {
        if (payload[key] === previousState[key]) {
          delete payload[key];
        }
      });

      if (id) {
        dispatch(addEditCrops(payload, id)).then((res: any) => {
          if (res?.data?.statusCode === 200) {
            enqueueSnackbar(res?.data?.message, {
              variant: 'success',
            });
            navigate(PATH_DASHBOARD.masterdata.cropList);
          }
        });
      } else {
        dispatch(addEditCrops(payload)).then((res: any) => {
          if (res?.data?.statusCode === 201) {
            enqueueSnackbar(res?.data?.message, {
              variant: 'success',
            });
            navigate(PATH_DASHBOARD.masterdata.cropList);
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
    <Page title="Create Crop">
      <Container maxWidth={'xl'}>
        <HeaderBreadcrumbs
          heading={!id ? 'Create a new crop' : 'Edit crop details'}
          links={[
            { name: 'Crop List', href: PATH_DASHBOARD.masterdata.cropList },
            { name: !id ? 'Create a new crop' : 'Edit crop' },
          ]}
        />
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
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
                    <RHFTextField name="name" label="Crop Name" />
                    <RHFSelectDropdown
                      name="status"
                      label={'Status'}
                      placeholder={'Status'}
                      value={watch('status')}
                      options={statusList}

                    />
                    {/* <RHFTextField name="equipment" label="Equipment Name" /> */}
                  </Box>
                  <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                    <LoadingButton
                      type="submit"
                      variant="contained"
                      loading={isSubmitting}
                      disabled={
                        cropsDetails?.name === watch('name') &&
                        cropsDetails?.status === watch('status')
                        // cropsDetails?.equipment === watch('equipment')
                      }
                      startIcon={<Iconify icon={'mingcute:user-add-fill'} />}
                    >
                      {id ? 'Edit Crop' : 'Add New'}
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
