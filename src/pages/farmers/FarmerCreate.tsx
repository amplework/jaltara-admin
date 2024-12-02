import * as Yup from 'yup';
import { useParams, useNavigate } from 'react-router-dom';
// @mui
import { Card, Container, Grid } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// _mock_
import { _userList } from '../../_mock';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import { useSnackbar } from 'notistack';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, RHFSelectDropdown, RHFSwitch, RHFTextField } from 'src/components/hook-form';
import { Box } from '@mui/material';
import { Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
  emptyDistrictList,
  getDistrictList,
  getStatesList,
  getTalukList,
  getVillageList,
} from 'src/redux/slices/user';
import { useDispatch, useSelector } from 'src/redux/store';
import { Typography } from '@mui/material';
import Iconify from 'src/components/Iconify';
import { RHFDatePicker } from 'src/components/hook-form/RHFDatePicker';
import { FarmerDetailsType } from 'src/@types/farmer';
import {
  addNewFarmer,
  editNewFarmer,
  getFarmerDetails,
  startLoading,
} from 'src/redux/slices/farmers';
import { SkeletonProduct } from 'src/components/skeleton';

const languageList = [
  { id: 'hindi', label: 'Hindi', name: 'hindi' },
  { id: 'marathi', label: 'Marathi', name: 'marathi' },
  { id: 'english', label: 'English', name: 'english' },
];

const content = [
  '(i) telling us where to dig',
  '(ii) collecting rocks/stones',
  '(iii) filling the pit?*',
];
const content2 = [
  'Do you agree to participate and do your shramdaan for your family’s benefits - which also includes:',
];

export default function FarmerCreate() {
  const { themeStretch } = useSettings();
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const [state, setState] = useState<any>({
    villageId: null,
  });

  useEffect(() => {
    if (id) {
      dispatch(startLoading());
      dispatch(getFarmerDetails(id));
    }
    getStatesList();
  }, []);

  const { statesList, districtList, talukList, villageList, usersDetails } = useSelector(
    (state) => state.user
  );

  const { farmersDetails, isLoading } = useSelector((state) => state.farmer);

  const NewFarmerSchema = Yup.object().shape({
    name: Yup.string().required('Name is required').max(50, 'Limit of 50 characters'),
    phone: Yup.string().required('Phone number is required').max(10, 'Limit of 10 digit'),
    // status: Yup.string().required('Status is required'),
    land: Yup.number()
      .required('Land(arces) is required')
      .typeError('land count must be a number')
      .positive('land count must be a positive number'),
    familyMemberNumber: Yup.number()
      .required('Family Count is required')
      .typeError('Family count must be a number')
      .positive('Family count must be a positive number'),
    language: Yup.string().required('Language is required'),
    farmAvailableDate: Yup.string().required('date is required').nullable(),
    selectStates: Yup.string().required('States is required'),
    selectDistrict: Yup.string().required('District is required'),
    selectTaluk: Yup.string().when([], {
      is: () => talukList?.childEntities && talukList?.childEntities?.length > 0,
      then: Yup.string().required('Taluk is required'),
      otherwise: Yup.string(),
    }),
    selectVillage: Yup.string().when([], {
      is: () => villageList?.childEntities && villageList?.childEntities?.length > 0,
      then: Yup.string().required('Village is required'),
      otherwise: Yup.string(),
    }),
    isParticipate: Yup.boolean().required('Participate is required'),
  });

  const defaultValues = useMemo(
    () => ({
      name: '',
      phone: '',
      land: '',
      familyMemberNumber: '',
      farmAvailableDate: '',
      status: '',
      language: '',
      selectStates: '',
      selectDistrict: '',
      selectTaluk: '',
      selectVillage: '',
      isParticipate: true,
    }),
    [usersDetails]
  );

  const methods = useForm<FarmerDetailsType>({
    resolver: yupResolver(NewFarmerSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const getAssignVillageData = (value: string) => {
    return farmersDetails?.checkUpperGeo?.parents?.find((item: any) => item?.entityType === value);
  };

  useEffect(() => {
    if (farmersDetails && id) {
      handleState();
    }
  }, [farmersDetails]);

  const handleState = () => {
    const stateIdData = getAssignVillageData('state');
    const districtIdData: any = getAssignVillageData('district');
    const talukIdData = getAssignVillageData('taluk');
    const isVillage = farmersDetails?.checkUpperGeo?.entityType === 'village';
    setValue('name', farmersDetails?.name);
    setValue('phone', farmersDetails?.phone);
    setValue('land', farmersDetails?.land);
    setValue('familyMemberNumber', farmersDetails?.familyMemberNumber);
    setValue('language', farmersDetails?.language);
    setValue('farmAvailableDate', farmersDetails?.farmAvailableDate);
    setValue('isParticipate', farmersDetails?.isParticipate);
    setValue('selectStates', stateIdData?.id);

    if (farmersDetails && stateIdData?.id) {
      getDistrictList(stateIdData?.id);
      setState((prev: any) => ({ ...prev, villageId: stateIdData?.id }));

      if (farmersDetails && districtIdData?.id && districtList?.childEntities) {
        getTalukList(districtIdData?.id);
        setValue('selectDistrict', districtIdData?.id || '');
        setState((prev: any) => ({ ...prev, villageId: districtIdData?.id }));
        if (talukIdData && farmersDetails && talukList?.childEntities) {
          getVillageList(talukIdData?.id);
          setValue('selectTaluk', talukIdData?.id || '');
          setState((prev: any) => ({ ...prev, villageId: talukIdData?.id, isLoading: false }));
          if (isVillage && farmersDetails) {
            setValue('selectVillage', farmersDetails?.checkUpperGeo?.id);
            setState((prev: any) => ({
              ...prev,
              villageId: farmersDetails?.checkUpperGeo?.id,
              isLoading: false,
            }));
          } else {
            setValue('selectVillage', farmersDetails?.checkUpperGeo?.id);
            setState((prev: any) => ({
              ...prev,
              villageId: farmersDetails?.checkUpperGeo?.id,
              isLoading: false,
            }));
          }
        } else {
          setState((prev: any) => ({ ...prev, isLoading: false }));
          setValue('selectTaluk', farmersDetails?.checkUpperGeo?.id || '');
        }
      } else if (farmersDetails && stateIdData?.id && !districtIdData?.id) {
        setValue('selectDistrict', farmersDetails?.checkUpperGeo?.id || '');
      }
    }
  };

  const onSubmit = async (data: FarmerDetailsType) => {
    try {
      let previousState: any = {
        name: farmersDetails?.name,
        phone: farmersDetails?.phone,
        language: farmersDetails?.language,
        familyMemberNumber: Number(farmersDetails?.familyMemberNumber),
        farmAvailableDate: farmersDetails?.farmAvailableDate,
        land: Number(farmersDetails?.land),
        status: farmersDetails?.status,
      };

      let payload: any = {
        name: data?.name,
        phone: data?.phone,
        language: data?.language,
        villageId: state?.villageId,
        familyMemberNumber: Number(data.familyMemberNumber),
        farmAvailableDate: data?.farmAvailableDate,
        land: Number(data?.land),
        status: data?.status,
        isParticipate: data?.isParticipate,
      };

      Object.keys(payload).forEach((key) => {
        if (payload[key] === previousState[key]) {
          delete payload[key];
        }
      });

      if (id) {
        dispatch(editNewFarmer(payload, id)).then((res: any) => {
          if (res?.data?.statusCode === 200) {
            enqueueSnackbar(res?.data?.message, {
              variant: 'success',
            });
            navigate(PATH_DASHBOARD.farmers.list);
          }
        });
      } else {
        dispatch(addNewFarmer(payload)).then((res: any) => {
          if (res?.data?.statusCode === 201) {
            enqueueSnackbar(res?.data?.message, {
              variant: 'success',
            });
            navigate(PATH_DASHBOARD.farmers.list);
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

  const handleStatesSelect = (id: any) => {
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

  return (
    <Page title="Create farmer">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          // heading={!isEdit ? 'Create a new sevek' : 'Edit sevek details'}
          heading={!id ? 'Create a new Farmer' : 'Edit Farmer details'}
          links={[
            { name: 'Farmer List', href: PATH_DASHBOARD.sevak.list },
            // { name: !isEdit ? 'New sevek' : 'Edit sevek' },
            { name: !id ? 'Create a new farmer' : 'Edit farmer' },
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
                    <RHFTextField name="name" label="Farmer Name" />
                    <RHFTextField name="phone" label="Phone Number" />
                    <RHFTextField name="land" label="Land (arces)" />
                    <RHFTextField name="familyMemberNumber" label="Family Count" />
                    <RHFDatePicker name="farmAvailableDate" label="Farm Available Date" />
                    <RHFSelectDropdown
                      name="language"
                      label={'Select Language'}
                      placeholder={'Language'}
                      options={languageList}
                    />
                    <Box width="100%">
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box display="flex" flexWrap="wrap" flex="1">
                          {content2?.map((text, index) => (
                            <Typography
                              key={index}
                              variant="subtitle2"
                              sx={{
                                mb: 0.5,
                                width: '100%',
                                flexShrink: 0,
                              }}
                            >
                              {text}
                            </Typography>
                          ))}
                        </Box>
                        <RHFSwitch
                          name="isParticipate"
                          labelPlacement="end"
                          label=""
                          sx={{
                            mx: 0,
                            justifyContent: 'flex-end',
                            flexShrink: 0,
                            '& .MuiSwitch-switchBase': {
                              color: '#ccc',
                            },
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: '#a2a',
                            },
                            '& .MuiSwitch-track': {
                              backgroundColor: '#ddd',
                              opacity: 1,
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: '#a2a',
                            },
                          }}
                        />
                      </Box>

                      {content?.map((text, index) => (
                        <Typography
                          key={index}
                          variant={index === 0 ? 'subtitle2' : 'body2'}
                          sx={{ mb: 0.5 }}
                        >
                          {text}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                  <Typography variant="h4" py={2}>
                    Select State
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
                      onChange={handleStatesSelect}
                    />
                    {districtList?.childEntities?.length ? (
                      <RHFSelectDropdown
                        name="selectDistrict"
                        label={'Select District'}
                        placeholder={'District'}
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
                      startIcon={<Iconify icon={'mingcute:user-add-fill'} />}
                    >
                      {/* {!isEdit ? 'Create sevek' : 'Edit sevek'} */}
                      {id ? 'Edit sevek' : 'Add New'}
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
