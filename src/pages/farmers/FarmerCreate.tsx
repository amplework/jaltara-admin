import * as Yup from 'yup';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
// @mui
import { Card, Container, Grid } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// _mock_
import { _userList, countries } from '../../_mock';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import { useSnackbar } from 'notistack';
import { useEffect, useMemo, useState } from 'react';
import { CreateUserType } from 'src/@types/user';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  FormProvider,
  RHFSelect,
  RHFSelectDropdown,
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
} from 'src/components/hook-form';
import { Box } from '@mui/material';
import { Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
  addEditUsers,
  editUsersDetails,
  emptyVillageList,
  getDistrictList,
  getStatesList,
  getTalukList,
  getUsersDetails,
  getVillageList,
} from 'src/redux/slices/user';
import { dispatch, useDispatch, useSelector } from 'src/redux/store';
import { Typography } from '@mui/material';
import Iconify from 'src/components/Iconify';
import { RHFDatePicker } from 'src/components/hook-form/RHFDatePicker';
import { FarmerDetailsType } from 'src/@types/farmer';
import { addNewFarmer, editNewFarmer } from 'src/redux/slices/farmers';

const statusList = [
  { id: 'active', label: 'Active', name: 'active' },
  { id: 'inactive', label: 'Inactive', name: 'inactive' },
];

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
      dispatch(getUsersDetails(id));
    }
    getStatesList();
  }, []);

  const { statesList, districtList, talukList, villageList, usersDetails } = useSelector(
    (state) => state.user
  );

  const NewFarmerSchema = Yup.object().shape({
    name: Yup.string().required('Name is required').max(50, 'Limit of 50 characters'),
    phone: Yup.string().required('Phone number is required').max(10, 'Limit of 10 digit'),
    // status: Yup.string().required('Status is required'),
    land: Yup.string().required('Land(arces) is required'),
    familyMemberNumber: Yup.string().required('Family Count is required'),
    language: Yup.string().required('Language is required'),
    farmAvailableDate: Yup.string().required('Report period date is required').nullable(),
    selectStates: Yup.string().required('States is required'),
    // selectDistrict: Yup.string().required('District is required'),
    selectDistrict: Yup.string().required('District is required'),
    selectTaluk: Yup.string().required('Taluk is required'),
    selectVillage: Yup.string().required('Village is required'),
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
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const getAssignVillageData = (value: string) => {
    return usersDetails?.checkUpperGeo?.parents?.find((item: any) => item?.entityType === value);
  };

  useEffect(() => {
    setVillageData();
  }, [
    usersDetails,
    // districtList?.childEntities?.length,
    // talukList?.childEntities?.length,
    // villageList?.childEntities?.length,
  ]);

  const setVillageData = async () => {
    const stateIdData = getAssignVillageData('state');
    const districtIdData = getAssignVillageData('district');
    const talukIdData = getAssignVillageData('taluk');
    const isDistrict = usersDetails?.checkUpperGeo?.entityType === 'district';
    const isVillage = usersDetails?.checkUpperGeo?.entityType === 'village';
    const isTaluk = usersDetails?.checkUpperGeo?.entityType === 'taluk';
    setValue('name', usersDetails?.name);
    setValue('phone', usersDetails?.phone);
    setValue('status', usersDetails?.status);
    setValue('language', usersDetails?.language);

    let isDistrictData;

    if (usersDetails && stateIdData?.id) {
      getDistrictList(stateIdData?.id);
      setValue('selectStates', stateIdData?.id || '');
      setState((prev: any) => ({ ...prev, villageId: stateIdData?.id }));
      isDistrictData = await getTalukList(districtIdData?.id);
    }

    if (districtIdData && usersDetails && districtList?.childEntities?.length && !isDistrict) {
      getTalukList(districtIdData?.id);
      setValue('selectDistrict', districtIdData?.id || '');
      setState((prev: any) => ({ ...prev, villageId: districtIdData?.id }));
    }

    if (talukIdData && usersDetails && talukList?.childEntities?.length && !isTaluk) {
      getVillageList(talukIdData?.id);
      setValue('selectTaluk', talukIdData?.id || '');
      setState((prev: any) => ({ ...prev, villageId: talukIdData?.id }));
    }

    if (isDistrict && districtList?.childEntities?.length) {
      setValue('selectDistrict', usersDetails?.checkUpperGeo?.id);
      setState((prev: any) => ({ ...prev, villageId: usersDetails?.checkUpperGeo?.id }));
    }

    if (isVillage && villageList?.childEntities?.length) {
      setValue('selectVillage', usersDetails?.checkUpperGeo?.id);
      setState((prev: any) => ({ ...prev, villageId: usersDetails?.checkUpperGeo?.id }));
    }

    if (isTaluk && talukList?.childEntities?.length) {
      getVillageList(usersDetails?.checkUpperGeo?.id);
      setValue('selectTaluk', usersDetails?.checkUpperGeo?.id || '');
      setState((prev: any) => ({ ...prev, villageId: usersDetails?.checkUpperGeo?.id }));
    }
  };

  const onSubmit = async (data: FarmerDetailsType) => {
    try {
      let previousState: any = {
        name: usersDetails?.name,
        phone: usersDetails?.phone,
        language: usersDetails?.language,
        // familyMemberNumber:usersDetails?.familyMemberNumber,
        // date:usersDetails?.date,
        // land:usersDetails?.land,
        // status: usersDetails?.status,
      };

      let payload: any = {
        name: data?.name,
        phone: data?.phone,
        language: data?.language,
        // status: data?.status,
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
          if (res?.data?.statusCode === 201) {
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
            { name: 'Farmer List', href: PATH_DASHBOARD.sevek.list },
            // { name: !isEdit ? 'New sevek' : 'Edit sevek' },
            { name: !id ? 'Create a new farmer' : 'Edit farmer' },
          ]}
        />
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
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
                  Select village
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
                  <RHFSelectDropdown
                    name="selectDistrict"
                    label={'Select District'}
                    placeholder={'District'}
                    options={districtList?.childEntities}
                    defaultMessage="Please Select State"
                    onChange={handleDistrictSelect}
                  />
                  <RHFSelectDropdown
                    name="selectTaluk"
                    label={'Select Taluk'}
                    placeholder={'Taluk'}
                    options={talukList?.childEntities}
                    defaultMessage="Please Select District"
                    onChange={handleTalukSelect}
                  />
                  <RHFSelectDropdown
                    name="selectVillage"
                    label={'Select Village'}
                    placeholder={'Village'}
                    options={villageList?.childEntities}
                    defaultMessage="Please Select Village"
                    onChange={handleVillageSelect}
                  />
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
            </Grid>
          </Grid>
        </FormProvider>
      </Container>
    </Page>
  );
}