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
import { FormProvider, RHFSelect, RHFTextField } from 'src/components/hook-form';
import { Box } from '@mui/material';
import { Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { addEditUsers, getDistrictList, getStatesList, getTalukList, getUsersDetails, getVillageList } from 'src/redux/slices/user';
import { dispatch, useDispatch, useSelector } from 'src/redux/store';
import { Typography } from '@mui/material';
const statusList = [
  { id: 1, label: 'Active', name: "active" },
  { id: 2, label: 'Inactive', name: "inactive" },
]
const languageList = [
  { id: 1, label: 'Hindi', name: "hindi" },
  { id: 2, label: 'English', name: 'english' },
  { id: 3, label: 'Marathi', name: 'marathi' },
]

export default function UserCreate() {
  const { themeStretch } = useSettings();
  const { id } = useParams();

  const isEdit = id === 'undefined' ? false : true
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const [state, setState] = useState<any>({
    villageId: null
  })

  useEffect(() => {
    if (isEdit) {
      dispatch(getUsersDetails(id))
    }
    getStatesList()
  }, [])


  const { statesList, districtList, talukList, villageList, usersDetails } = useSelector((state) => state.user);
  console.log('usersDetails', usersDetails);


  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    phoneNumber: Yup.string().required('Phone number is required'),
    status: Yup.string().required('status is required'),
    language: Yup.string().required('language is required'),
    selectStates: Yup.string().required('states is required'),
    selectDistrict: Yup.string().required('district is required'),
    selectTaluk: Yup.string(),
    selectVillage: Yup.string(),
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
      selectVillage: ''
    }),
    []
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

  useEffect(() => {
    const statesEntityType = usersDetails?.checkUpperGeo?.parents?.find((item: any) => item?.entityType === 'state')
    const selectDistrictType = usersDetails?.checkUpperGeo?.parents?.find((item: any) => item?.entityType === 'district')
    const selectTalukType = usersDetails?.checkUpperGeo?.parents?.find((item: any) => item?.entityType === 'taluk')
    const selectVillageType = usersDetails?.checkUpperGeo?.parents?.find((item: any) => item?.entityType === 'village')

    setValue("name", usersDetails?.name || "");
    setValue("phoneNumber", usersDetails?.phone || "");
    setValue("language", usersDetails?.language || "");
    setValue("status", usersDetails?.status || "");
    setValue("selectStates", usersDetails?.checkUpperGeo?.entityType === 'state' && usersDetails?.checkUpperGeo?.entityType ? usersDetails?.checkUpperGeo?.name : statesEntityType?.name || "");
    setValue("selectDistrict", usersDetails?.checkUpperGeo?.entityType === 'district' && usersDetails?.checkUpperGeo?.entityType ? usersDetails?.checkUpperGeo?.name : selectDistrictType?.name || "");
    setValue("selectTaluk", usersDetails?.checkUpperGeo?.entityType === 'taluk' && usersDetails?.checkUpperGeo?.entityType ? usersDetails?.checkUpperGeo?.name : selectTalukType?.name || "");
    setValue("selectVillage", usersDetails?.checkUpperGeo?.entityType === 'village' && usersDetails?.checkUpperGeo?.entityType ? usersDetails?.checkUpperGeo?.name : selectVillageType?.name || "");
  }, [usersDetails,setValue]);

  // useEffect(() => {
  //   const checkUpperGeo = usersDetails?.checkUpperGeo;
  //   const parents = checkUpperGeo?.parents || [];
  //   const entityType = checkUpperGeo?.entityType;

  //   const findEntityName = (type: string) =>
  //     entityType === type ? checkUpperGeo?.name : parents.find((item: any) => item?.entityType === type)?.name || "";
  //   console.log('state', findEntityName("state"));
  //   console.log('District', findEntityName("district"));
  //   console.log('taluk', findEntityName("taluk"));
  //   console.log('village', findEntityName("village"));

  //   setValue("name", usersDetails?.name || "");
  //   setValue("phoneNumber", usersDetails?.phone || "");
  //   setValue("language", usersDetails?.language || "");
  //   setValue("status", usersDetails?.status || "");
  //   setValue("selectStates", findEntityName("state"));
  //   setValue("selectDistrict", findEntityName("district"));
  //   setValue("selectTaluk", findEntityName("taluk"));
  //   setValue("selectVillage", findEntityName("village"));
  // }, [isEdit,usersDetails]);

  const onSubmit = async (data: CreateUserType) => {
    try {
      const payload = {
        name: data?.name,
        phone: data?.phoneNumber,
        language: data?.language,
        status: data?.status,
        villageId: state?.villageId
      }
      dispatch(addEditUsers(payload)).then((res: any) => {
        if (res?.data?.statusCode === 200) {
          enqueueSnackbar(res?.data?.message, {
            variant: "success",
          });
          navigate(PATH_DASHBOARD.user.list);
          reset();

        }
      })
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatesSelect = (value: any) => {
    const selectedState = statesList?.find((item: any) => item?.name === value)
    const stateId = selectedState?.id;
    getDistrictList(stateId)
  }

  const handleDistrictSelect = (value: any) => {
    const selectedDistrict = districtList?.childEntities?.find((item: any) => item?.name === value)
    const districtId = selectedDistrict?.id
    setState((prev: any) => ({ ...prev, villageId: districtId }));
    getTalukList(districtId)
  }

  const handleTalukSelect = (value: string) => {
    const selectedTaluk = talukList?.childEntities?.find((item: any) => item?.name === value)
    const talukId = selectedTaluk?.id;
    setState((prev: any) => ({ ...prev, villageId: talukId }));
    getVillageList(talukId)
  }

  const handleVillageSelect = (value: string) => {
    const selectedVillage = villageList?.childEntities?.find((item: any) => item?.name === value)
    const talukId = selectedVillage?.id;
    setState((prev: any) => ({ ...prev, villageId: talukId }));
  }

  return (
    <Page title="User: Create a new user">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new user' : 'Edit user details'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'User', href: PATH_DASHBOARD.user.list },
            { name: !isEdit ? 'New user' : 'Edit user' },
          ]}
        />
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: 'grid',
                    columnGap: 2,
                    rowGap: 3,
                    gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                  }}
                >
                  <RHFTextField name="name" label="Full Name" />
                  <RHFTextField name="phoneNumber" label="Phone Number" />
                  <RHFSelect name="status" label="Status" placeholder="Status">
                    <option value="" />
                    {statusList?.map((option) => (
                      <option key={option.id} value={option.name}>
                        {option.label}
                      </option>
                    ))}
                  </RHFSelect>
                  <RHFSelect name="language" label="Language" placeholder="Language">
                    <option value="" />
                    {languageList?.map((option) => (
                      <option key={option.id} value={option.name}>
                        {option.label}
                      </option>
                    ))}
                  </RHFSelect>
                </Box>
                <Typography variant="h4" py={2}>
                  Assign village
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    columnGap: 2,
                    rowGap: 3,
                    gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                  }}
                >
                  <RHFSelect name="selectStates" label="States" placeholder="States" onChange={(event: any) => handleStatesSelect(event)}>
                    <option value="" />
                    {statesList?.map((option) => (
                      <option key={option?.id} value={option?.name}>
                        {option?.name}
                      </option>
                    ))}
                  </RHFSelect>
                  <RHFSelect name="selectDistrict" label="District" placeholder="District" onChange={(event: any) => handleDistrictSelect(event)}>
                    <option value="" />
                    {districtList?.childEntities?.map((option) => (
                      <option key={option.id} value={option.name}>
                        {option?.name}
                      </option>
                    ))}
                  </RHFSelect>
                  <RHFSelect name="selectTaluk" label="Taluk" placeholder="Taluk" onChange={(event: any) => handleTalukSelect(event)}>
                    <option value="" />
                    {talukList?.childEntities?.map((option) => (
                      <option key={option.id} value={option.name}>
                        {option?.name}
                      </option>
                    ))}
                  </RHFSelect>
                  <RHFSelect name="selectVillage" label="Village" placeholder="Village" onChange={(event: any) => handleVillageSelect(event)}>
                    <option value="" />
                    {villageList?.childEntities?.map((option) => (
                      <option key={option.id} value={option.name}>
                        {option?.name}
                      </option>
                    ))}
                  </RHFSelect>
                </Box>

                <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? 'Create User' : 'Edit User'}
                  </LoadingButton>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </FormProvider>

      </Container>
    </Page >
  );
}
