import * as Yup from 'yup';
import { useParams, useNavigate } from 'react-router-dom';
// @mui
import { Card, Container, Grid, InputAdornment } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import { useSnackbar } from 'notistack';
import { useEffect, useMemo, useState } from 'react';
import { CreateUserType } from 'src/@types/user';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, RHFSelectDropdown, RHFTextField } from 'src/components/hook-form';
import { Box } from '@mui/material';
import { Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
  createNewSevek,
  detailsLoading,
  editSevekDetails,
  emptyDistrictList,
  getDistrictList,
  getStatesList,
  getTalukList,
  getUsersDetails,
  getVillageList,
  startLoading,
} from 'src/redux/slices/user';
import { useDispatch, useSelector } from 'src/redux/store';
import { Typography } from '@mui/material';
import Iconify from 'src/components/Iconify';
import { SkeletonProduct } from 'src/components/skeleton';
import { getEntityName } from 'src/utils/common';

const statusList = [
  { id: 'active', label: 'Active', name: 'active' },
  { id: 'inactive', label: 'Inactive', name: 'inactive' },
];

const languageList = [
  { id: 'hindi', label: 'Hindi', name: 'hindi' },
  { id: 'marathi', label: 'Marathi', name: 'marathi' },
  { id: 'english', label: 'English', name: 'english' },
];

export default function SevekCreate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const [state, setState] = useState<any>({
    villageId: null,
  });

  useEffect(() => {
    if (id) {
      dispatch(detailsLoading());
      dispatch(getUsersDetails(id));
    }
    getStatesList();
  }, []);

  const { statesList, districtList, talukList, villageList, usersDetails, isDetailsLoading } =
    useSelector((state) => state.user);
  console.log('statesList', statesList);

  const NewUserSchema = Yup.object().shape({
    name: Yup.string()
      .required('Sevak name is required')
      .matches(/^[^\s].*$/, 'First Characters space not allowed.'),
    phoneNumber: Yup.string()
      .required('Phone number is required')
      .matches(/^\d{10}$/, 'Only numbers are allowed and limit is 10 digits'),
    status: Yup.string().required('Status is required'),
    language: Yup.string().required('Language is required'),
    selectStates: Yup.string().required('States is required'),
    selectDistrict: Yup.string(),
    selectTaluk: Yup.string(),
    selectVillage: Yup.string(),
    // photo: Yup.mixed().test('required', 'Photo is required', (value) => value !== ''),
  });

  const defaultValues = useMemo(
    () => ({
      name: '',
      phoneNumber: '',
      status: '',
      language: '',
      selectStates: '',
      selectDistrict: '',
      selectTaluk: '',
      selectVillage: '',
      // photo: '',
    }),
    [usersDetails]
  );

  const methods = useForm<CreateUserType>({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const getAssignVillageData = (value: string) => {
    return usersDetails?.checkUpperGeo?.parents?.find((item: any) => item?.entityType === value);
  };

  const values = watch();

  useEffect(() => {
    setVillageData();
  }, [
    usersDetails,
    // districtList?.childEntities?.length,
    // talukList?.childEntities?.length,
    // villageList?.childEntities?.length,
  ]);

  const setVillageData = async () => {
    // const stateIdData = getAssignVillageData('state');
    // const districtIdData = getAssignVillageData('district');
    // const talukIdData = getAssignVillageData('taluk');
    const stateIdData = getEntityName('state', usersDetails?.checkUpperGeo);

    const districtIdData = getEntityName('district', usersDetails?.checkUpperGeo);
    const talukIdData = getEntityName('taluk', usersDetails?.checkUpperGeo);
    const villagetName = getEntityName('village', usersDetails?.checkUpperGeo);
    const isDistrict = usersDetails?.checkUpperGeo?.entityType === 'district';
    const isVillage = usersDetails?.checkUpperGeo?.entityType === 'village';
    const isTaluk = usersDetails?.checkUpperGeo?.entityType === 'taluk';
    setValue('name', usersDetails?.name);
    setValue('phoneNumber', usersDetails?.phone);
    setValue('status', usersDetails?.status);
    setValue('language', usersDetails?.language);
    setValue('selectStates', stateIdData?.id || '');
    // setValue('photo', usersDetails?.name || '');
    if (usersDetails && stateIdData?.id) {
      getDistrictList(stateIdData?.id);
      setState((prev: any) => ({ ...prev, villageId: stateIdData?.id }));

      if (usersDetails && districtIdData?.id && districtList?.childEntities) {
        getTalukList(districtIdData?.id);
        setValue('selectDistrict', districtIdData?.id || '');
        setState((prev: any) => ({ ...prev, villageId: districtIdData?.id }));
        if (talukIdData && usersDetails && talukList?.childEntities) {
          getVillageList(talukIdData?.id);
          setValue('selectTaluk', talukIdData?.id || '');
          setState((prev: any) => ({ ...prev, villageId: talukIdData?.id, isLoading: false }));
          if (isVillage && usersDetails) {
            setValue('selectVillage', usersDetails?.checkUpperGeo?.id);
            setState((prev: any) => ({
              ...prev,
              villageId: usersDetails?.checkUpperGeo?.id,
              isLoading: false,
            }));
          } else {
            setValue('selectVillage', usersDetails?.checkUpperGeo?.id);
            setState((prev: any) => ({
              ...prev,
              villageId: usersDetails?.checkUpperGeo?.id,
              isLoading: false,
            }));
          }
        } else {
          setState((prev: any) => ({ ...prev, isLoading: false }));
          setValue('selectTaluk', usersDetails?.checkUpperGeo?.id || '');
        }
      } else if (usersDetails && stateIdData?.id && !districtIdData?.id) {
        setValue('selectDistrict', usersDetails?.checkUpperGeo?.id || '');
      }
    }
  };
  console.log('watch ---->', watch('selectStates'));

  const onSubmit = async (data: CreateUserType) => {
    try {
      let previousState: any = {
        name: usersDetails?.name,
        phone: usersDetails?.phone,
        language: usersDetails?.language,
        status: usersDetails?.status,
      };

      let payload: any = {
        name: data?.name,
        phone: data?.phoneNumber,
        language: data?.language,
        status: data?.status,
        villageId: state?.villageId,
      };

      Object.keys(payload).forEach((key) => {
        if (payload[key] === previousState[key]) {
          delete payload[key];
        }
      });

      if (id) {
        dispatch(editSevekDetails(payload, id)).then((res: any) => {
          if (res?.data?.statusCode === 200) {
            enqueueSnackbar(res?.data?.message, {
              variant: 'success',
            });
            navigate(PATH_DASHBOARD.sevak.list);
            reset();
          }
        });
      } else {
        dispatch(createNewSevek(payload))
          .then((res: any) => {
            if (res?.data?.statusCode === 201) {
              enqueueSnackbar(res?.data?.message, {
                variant: 'success',
              });
              navigate(PATH_DASHBOARD.sevak.list);
              reset();
            } else {
              navigate(PATH_DASHBOARD.sevak.list);
              reset();
            }
          })
          .catch((error) => {
            console.log('error');
          });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatesSelect = (id: any) => {
    console.log('id', id);

    setState((prev: any) => ({ ...prev, villageId: id }));
    setValue('selectDistrict', '');
    setValue('selectTaluk', '');
    setValue('selectVillage', '');
    dispatch(emptyDistrictList(null));
    getDistrictList(id);
  };

  const handleDistrictSelect = (id: any) => {
    setState((prev: any) => ({ ...prev, villageId: id }));
    setValue('selectTaluk', '');
    setValue('selectVillage', '');
    // dispatch(emptyTalukList(null));
    getTalukList(id);
  };

  const handleTalukSelect = (id: string) => {
    setState((prev: any) => ({ ...prev, villageId: id }));
    setValue('selectVillage', '');
    getVillageList(id);
  };

  const handleVillageSelect = (id: string) => {
    // setValue('selectVillage', '');
    setState((prev: any) => ({ ...prev, villageId: id }));
  };

  // const handleDrop = useCallback(
  //   (acceptedFiles: File[]) => {
  //     const file = acceptedFiles[0];
  //     console.log('file', file?.name);

  //     if (file) {
  //       const preview = URL.createObjectURL(file);
  //       console.log('preview', preview);
  //       // setValue('photo', preview);
  //     }
  //   },
  //   [setValue]
  // );

  return (
    <Page title="Create sevak">
      <Container maxWidth={'xl'}>
        <HeaderBreadcrumbs
          heading={!id ? 'Add sevak' : 'Edit sevak details'}
          links={[
            { name: 'Sevak List', href: PATH_DASHBOARD.sevak.list },
            { name: !id ? 'Add Sevak' : 'Edit Sevak' },
          ]}
        />
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              {isDetailsLoading ? (
                <Card sx={{ p: 3 }}>
                  <SkeletonProduct />
                </Card>
              ) : (
                <Card sx={{ p: 3, boxShadow: '0 12px 24px rgba(0,0,0,0.18)' }}>
                  <Box
                    sx={{
                      display: 'grid',
                      columnGap: 2,
                      rowGap: 3,
                      gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' },
                    }}
                  >
                    <RHFTextField name="name" label="Full Name" />
                    <RHFTextField
                      name="phoneNumber"
                      label="Phone Number"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">+91</InputAdornment>,
                      }}
                    />
                    <RHFSelectDropdown
                      name="status"
                      label={'Select Status'}
                      placeholder={'Status'}
                      value={watch('status')}
                      options={statusList}
                    />
                    <RHFSelectDropdown
                      name="language"
                      label={'Select Language'}
                      placeholder={'Language'}
                      value={watch('language')}
                      options={languageList}
                    />
                  </Box>
                  <Typography variant="h4" py={2}>
                    Assign Location
                  </Typography>
                  <Box
                    sx={{
                      display: 'grid',
                      columnGap: 2,
                      rowGap: 3,
                      gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                    }}
                  >
                    <RHFSelectDropdown
                      name="selectStates"
                      label={'Select States'}
                      placeholder={'States'}
                      options={statesList}
                      value={watch('selectStates')}
                      defaultMessage="Please Select State"
                      onChange={handleStatesSelect}
                    />
                    {districtList?.childEntities?.length ? (
                      <RHFSelectDropdown
                        name="selectDistrict"
                        label={'Select District'}
                        placeholder={'District'}
                        value={watch('selectDistrict')}
                        options={districtList?.childEntities}
                        defaultMessage="Please Select State"
                        onChange={handleDistrictSelect}
                        //   disabled={state.isLoading}
                      />
                    ) : (
                      ''
                    )}

                    {talukList?.childEntities?.length ? (
                      <RHFSelectDropdown
                        name="selectTaluk"
                        label={'Select Taluk'}
                        placeholder={'Taluk'}
                        value={watch('selectTaluk')}
                        options={talukList?.childEntities || []}
                        defaultMessage="Please Select District"
                        onChange={handleTalukSelect}
                      />
                    ) : (
                      ''
                    )}

                    {villageList?.childEntities?.length ? (
                      <RHFSelectDropdown
                        name="selectVillage"
                        label={'Select Village'}
                        placeholder={'Village'}
                        value={watch('selectVillage')}
                        options={villageList?.childEntities}
                        defaultMessage="Please Select Village"
                        onChange={handleVillageSelect}
                      />
                    ) : (
                      ''
                    )}
                  </Box>
                  <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                    <LoadingButton
                      type="submit"
                      variant="contained"
                      loading={isSubmitting}
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
