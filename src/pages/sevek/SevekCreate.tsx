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
import { FormProvider, RHFSelect, RHFSelectDropdown, RHFTextField } from 'src/components/hook-form';
import { Box } from '@mui/material';
import { Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
  addEditUsers,
  getDistrictList,
  getStatesList,
  getTalukList,
  getUsersDetails,
  getVillageList,
} from 'src/redux/slices/user';
import { dispatch, useDispatch, useSelector } from 'src/redux/store';
import { Typography } from '@mui/material';
import Iconify from 'src/components/Iconify';

const statusList = [
  { id: 1, label: 'Active', name: 'active' },
  { id: 2, label: 'Inactive', name: 'inactive' },
];

const languageList = [
  { id: 1, label: 'Hindi', name: 'hindi' },
  { id: 3, label: 'Marathi', name: 'marathi' },
  { id: 2, label: 'English', name: 'english' },
];

export default function SevekCreate() {
  const { themeStretch } = useSettings();
  const { id } = useParams();

  const isEdit = id === 'undefined' ? false : true;

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const [state, setState] = useState<any>({
    villageId: null,
  });

  useEffect(() => {
    if (isEdit) {
      dispatch(getUsersDetails(id));
    }
    getStatesList();
  }, []);

  const { statesList, districtList, talukList, villageList, usersDetails } = useSelector(
    (state) => state.user
  );
  console.log('districtList', districtList);

  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required').max(50, 'Limit of 50 characters'),
    phoneNumber: Yup.string().required('Phone number is required').max(10, 'Limit of 10 digit'),
    status: Yup.string().required('Status is required'),
    language: Yup.string().required('Language is required'),
    selectStates: Yup.string().required('States is required'),
    // selectDistrict: Yup.string().required('District is required'),
    selectDistrict: Yup.string(),
    selectTaluk: Yup.string(),
    selectVillage: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      name:  '',
      phoneNumber:  '',
      status: '',
      language:  '',
      selectStates: '',
      selectDistrict: '',
      selectTaluk: '',
      selectVillage: '',
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

  useEffect(() => {
    const statesEntityType: any = usersDetails?.checkUpperGeo?.parents?.find(
      (item: any) => item?.entityType === 'state'
    );
    if (statesEntityType?.id) {
      getDistrictList(statesEntityType?.id);
    }
    
    const selectDistrictType: any = usersDetails?.checkUpperGeo?.parents?.find(
      (item: any) => item?.entityType === 'district'
    );
    if (selectDistrictType?.id) {
      getTalukList(selectDistrictType?.id);
    }

    const selectTalukType: any = usersDetails?.checkUpperGeo?.parents?.find(
      (item: any) => item?.entityType === 'taluk'
    );
    
    if (selectTalukType?.id) {
      getVillageList(selectTalukType?.id);
    }
    const selectVillageType: any = usersDetails?.checkUpperGeo?.parents?.find(
      (item: any) => item?.entityType === 'village'
    );
    // setValue('name', usersDetails?.name || '');
    // setValue('phoneNumber', usersDetails?.phone || '');
    // setValue('language', usersDetails?.language || '');
    // setValue('status', usersDetails?.status || '');
    // setValue(
    //   'selectStates',
    //   usersDetails?.checkUpperGeo?.entityType === 'state' && usersDetails?.checkUpperGeo?.entityType
    //     ? usersDetails?.checkUpperGeo?.id
    //     : statesEntityType?.id || ''
    // );
    // setValue(
    //   'selectDistrict',
    //   usersDetails?.checkUpperGeo?.entityType === 'district' &&
    //     usersDetails?.checkUpperGeo?.entityType
    //     ? usersDetails?.checkUpperGeo?.id
    //     : selectDistrictType?.id || ''
    // );

    // setValue(
    //   'selectTaluk',
    //   usersDetails?.checkUpperGeo?.entityType === 'taluk' && usersDetails?.checkUpperGeo?.entityType
    //     ? usersDetails?.checkUpperGeo?.id
    //     : selectTalukType?.id || ''
    // );
    // setValue(
    //   'selectVillage',
    //   usersDetails?.checkUpperGeo?.entityType === 'village' &&
    //     usersDetails?.checkUpperGeo?.entityType
    //     ? usersDetails?.checkUpperGeo?.id
    //     : selectVillageType?.id || ''
    // );
  }, [usersDetails, setValue]);

  // useEffect(() => {
  //   const checkUpperGeo = usersDetails?.checkUpperGeo;
  //   const parents = checkUpperGeo?.parents || [];
  //   const entityType = checkUpperGeo?.entityType;

  //   const findEntityName = (type: string) =>
  //     entityType === type ? checkUpperGeo?.name : parents.find((item: any) => item?.entityType === type)?.name || "";
  //   console.log('state', findEntityName("state"));
  //   console.log('District', findEntityName("district"));
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
    console.log('111111');

    try {
      const payload = {
        name: data?.name,
        phone: data?.phoneNumber,
        language: data?.language,
        status: data?.status,
        villageId: state?.villageId,
      };
      console.log('payload', payload);

      dispatch(addEditUsers(payload)).then((res: any) => {
        if (res?.data?.statusCode === 200) {
          enqueueSnackbar(res?.data?.message, {
            variant: 'success',
          });
          navigate(PATH_DASHBOARD.sevek.list);
          reset();
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatesSelect = (value: any) => {
    const selectedState = statesList?.find((item: any) => item?.id === value);
    getDistrictList(selectedState?.id);
  };

  const handleDistrictSelect = (value: any) => {
    const selectedDistrict = districtList?.childEntities?.find((item: any) => item?.id === value);
    setState((prev: any) => ({ ...prev, villageId: selectedDistrict?.id }));
    getTalukList(selectedDistrict?.id);
  };

  const handleTalukSelect = (value: string) => {
    const selectedTaluk = talukList?.childEntities?.find((item: any) => item?.id === value);
    setState((prev: any) => ({ ...prev, villageId: selectedTaluk?.id }));
    getVillageList(selectedTaluk?.id);
  };

  const handleVillageSelect = (value: string) => {
    const selectedVillage = villageList?.childEntities?.find((item: any) => item?.id === value);
    setState((prev: any) => ({ ...prev, villageId: selectedVillage?.id }));
  };

  return (
    <Page title="Create sevek">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          // heading={!isEdit ? 'Create a new sevek' : 'Edit sevek details'}
          heading={'Create a new sevek'}
          links={[
            { name: 'Sevek List', href: PATH_DASHBOARD.sevek.list },
            // { name: !isEdit ? 'New sevek' : 'Edit sevek' },
            { name: 'Create a new sevek' },
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
                  <RHFSelectDropdown
                    name="status"
                    label={'Select Status'}
                    placeholder={'Status'}
                    options={statusList}
                  />
                  <RHFSelectDropdown
                    name="language"
                    label={'Select Language'}
                    placeholder={'Language'}
                    options={languageList}
                  />
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
                    {'Add New'}
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
