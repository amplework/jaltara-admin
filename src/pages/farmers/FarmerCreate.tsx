import * as Yup from 'yup';
import { useParams, useNavigate } from 'react-router-dom';
// @mui
import { Card, Container, Grid, InputAdornment } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks

// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  FormProvider,
  RHFRadioGroup,
  RHFSelectDropdown,
  RHFSwitch,
  RHFTextField,
  RHFUploadSingleFile,
} from 'src/components/hook-form';
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
import { getCropsList } from 'src/redux/slices/crops';
import RHFMultiSelectDropdown from 'src/components/hook-form/RHFMultiSelectDropdown';
import { getCropsChallengesList } from 'src/redux/slices/challanges';
import RHFMultiSelect from 'src/components/hook-form/RHFMultiSelect';
import { getEntityName } from 'src/utils/common';
import profilepic from 'src/assets/images/profile-background.jpg';
import { getImageUploadUrl } from 'src/redux/slices/imageUpload';

const languageList = [
  { id: 'hi', label: 'हिन्दी', name: 'हिन्दी' },
  { id: 'mr', label: 'मराठी', name: 'मराठी' },
  { id: 'en', label: 'English', name: 'english' },
];

const OPTION = [
  { label: 'Yes', value: 'true' },
  { label: 'No', value: 'false' },
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
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const [state, setState] = useState<any>({
    villageId: null,
    selectedValues: [],
    selectCropItem: [],
    selectedItems: [],
    selectChallangesValue: [],
    selectChallangesItems: [],
    selectCropChallangesItems: [],
  });

  useEffect(() => {
    if (id) {
      dispatch(startLoading());
      dispatch(getFarmerDetails(id));
    }
    getStatesList();
    getCropsList();
    getCropsChallengesList();
  }, []);

  const { statesList, districtList, talukList, villageList, usersDetails } = useSelector(
    (state) => state.user
  );

  const { cropListData, cropsDetails } = useSelector((state) => state.crops);

  const { challengesListData } = useSelector((state) => state.challenges);

  const { farmersDetails, isLoading } = useSelector((state) => state.farmer);

  const NewFarmerSchema = Yup.object().shape({
    name: Yup.string()
      .required('Farmer name is required')
      .max(50, 'Limit of 50 characters')
      .matches(/^[^\s].*$/, 'First character cannot be a space.')
      .matches(/^[A-Za-z\s]+$/, 'Only alphabetic characters are allowed.'),
    phone: Yup.string()
      .required('Phone number is required')
      .matches(/^\d{10}$/, 'Only numbers are allowed and limit is 10 digits'), // status: Yup.string().required('Status is required'),
    land: Yup.string()
      .required('Land field is required')
      .matches(
        /^\d{1,6}(\.\d{0,6})?$/,
        'Only numbers are allowed, with a maximum of 6 digits and an optional decimal point.'
      ),
    familyMemberNumber: Yup.string()
      .required('Family member is required')
      .matches(
        /^\d{1,2}$/, // Matches up to 2 digits
        'Only numbers are allowed, and the maximum number is 2 digits.'
      ),
    language: Yup.string(),
    farmAvailableDate: Yup.string().required('date is required').nullable(),
    selectStates: Yup.string().required('State is required'),
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
    isParticipate: Yup.string().required('Participate is required').nullable(),
    crops: Yup.array()
      .of(Yup.string().required('Each crop must be selected'))
      .min(1, 'At least one crop must be selected'),
    // farmingChallenge: Yup.array()
    //   .of(Yup.string().required('Each crop challanges must be selected'))
    //   .min(1, 'At least one crop must be selected'),
    farmingChallenge: Yup.array()
      .of(Yup.string().required('Each farming challenge must be selected'))
      .notRequired(),
    photo: Yup.mixed(),
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
      isParticipate: '',
      crops: [],
      farmingChallenge: [],
      photo: '',
    }),
    [usersDetails]
  );

  const methods = useForm<FarmerDetailsType>({
    resolver: yupResolver(NewFarmerSchema),
    defaultValues,
  });

  const {
    watch,
    setValue,
    handleSubmit,
    clearErrors,
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
    // const stateIdData = getAssignVillageData('state');
    // const districtIdData: any = getAssignVillageData('district');
    // const talukIdData = getAssignVillageData('taluk');
    const stateIdData = getEntityName('state', farmersDetails?.checkUpperGeo);

    const districtIdData = getEntityName('district', farmersDetails?.checkUpperGeo);
    const talukIdData = getEntityName('taluk', farmersDetails?.checkUpperGeo);
    console.log(
      'stateIdData',
      stateIdData
      // 'districtIdData',
      // districtIdData,
      // 'talukIdData',
      // talukIdData
    );
    const isVillage = farmersDetails?.checkUpperGeo?.entityType === 'village';
    setValue('name', farmersDetails?.name);
    setValue('phone', farmersDetails?.phone);
    setValue('land', farmersDetails?.land);
    setValue('familyMemberNumber', farmersDetails?.familyMemberNumber);
    setValue('language', farmersDetails?.language);
    setValue('farmAvailableDate', farmersDetails?.farmAvailableDate);
    setValue('isParticipate', farmersDetails?.isParticipate);
    setValue('photo', farmersDetails?.photo);
    setValue('crops', farmersDetails?.crops?.map((item: any) => item?.id) || []);

    setValue(
      'farmingChallenge',
      farmersDetails?.farmingChallenge?.map((item: any) => item?.id) || []
    );

    setValue('selectStates', stateIdData?.id || '');

    setState((prev: any) => ({
      ...prev,
      selectedValues: farmersDetails?.crops?.map((item: any) => item?.id) || [],
      selectChallangesValue: farmersDetails?.farmingChallenge?.map((item: any) => item?.id) || [],
      selectCropItem: farmersDetails?.crops?.map((item: any) => item) || [],
      selectCropChallangesItems: farmersDetails?.farmingChallenge?.map((item: any) => item) || [],
    }));

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
        isParticipate: farmersDetails?.isParticipate,
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
        isParticipate: data?.isParticipate === 'true' ? true : false,
        crops: state?.selectedItems?.length ? state?.selectedItems : state?.selectCropItem,
        farmingChallenge: state?.selectChallangesItems?.length
          ? state?.selectChallangesItems
          : state.selectCropChallangesItems,
        photo: data?.photo,
      };

      Object.keys(payload).forEach((key) => {
        if (payload[key] === previousState[key]) {
          delete payload[key];
        }
      });
      console.log('payload', payload);

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
    clearErrors('selectDistrict');
    setValue('selectDistrict', '');
    setValue('selectTaluk', '');
    setValue('selectVillage', '');
    dispatch(emptyDistrictList(null));
    getDistrictList(id);
  };

  const handleDistrictSelect = (id: any) => {
    clearErrors('selectTaluk');
    setState((prev: any) => ({ ...prev, villageId: id }));
    setValue('selectTaluk', '');
    setValue('selectVillage', '');
    getTalukList(id);
  };

  const handleTalukSelect = (id: string) => {
    setState((prev: any) => ({ ...prev, villageId: id }));
    clearErrors('selectVillage');
    setValue('selectVillage', '');
    getVillageList(id);
  };

  const handleVillageSelect = (id: string) => {
    setState((prev: any) => ({ ...prev, villageId: id }));
  };

  const handleChange = (newSelectedValues: any[]) => {
    const names = cropListData
      ?.filter((item: any) => newSelectedValues.includes(item?.id))
      .map((item) => item);

    setState((prev: any) => ({
      ...prev,
      selectedValues: newSelectedValues,
      selectedItems: names,
    }));
  };

  const handleCropChallangesChange = (newSelectedValues: any[]) => {
    const names = challengesListData
      ?.filter((item: any) => newSelectedValues?.includes(item?.id))
      ?.map((item: any) => item);

    setState((prev: any) => ({
      ...prev,
      selectChallangesValue: newSelectedValues,
      selectChallangesItems: names,
    }));
  };

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

  return (
    <Page title="Create farmer">
      <Container maxWidth={'xl'}>
        <HeaderBreadcrumbs
          heading={!id ? 'Add Farmer' : 'Edit Farmer details'}
          links={[
            { name: 'Farmer List', href: PATH_DASHBOARD.sevak.list },
            { name: !id ? 'Add Farmer' : 'Edit Farmer' },
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
                    <RHFTextField name="name" label="Farmer Name" />
                    <RHFTextField
                      name="phone"
                      label="Phone Number"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">+91</InputAdornment>,
                      }}
                    />

                    <RHFTextField name="land" label="Land (arces)" />
                    <RHFTextField name="familyMemberNumber" label="Family Members (including farmer)" />
                    <RHFDatePicker
                      name="farmAvailableDate"
                      label="Farm Available Date"
                      minDate={new Date()}
                    />
                    {/* <RHFSelectDropdown
                      name="language"
                      label={'Select Language'}
                      value={watch('language')}
                      placeholder={'Language'}
                      options={languageList}
                    /> */}
                    <RHFMultiSelectDropdown
                      name="crops"
                      label={'Crops'}
                      placeholder={'Crops'}
                      options={cropListData}
                      onChange={handleChange}
                      selectedValues={state.selectedValues}
                    />
                    <RHFMultiSelect
                      name="farmingChallenge"
                      label={'Farming Challenge'}
                      placeholder={'Farming Challenge'}
                      options={challengesListData}
                      onChange={handleCropChallangesChange}
                      selectedValues={state.selectChallangesValue}
                    />
                    <Box width="100%">
                      <Box display="flex" alignItems="center">
                        <Box display="flex" flexWrap="wrap" flex="1">
                          {content2?.map((text, index) => (
                            <Typography
                              key={index}
                              variant="body2"
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
                      </Box>

                      {content?.map((text, index) => (
                        <Typography key={index} variant={'body2'} sx={{ mb: 0.5 }}>
                          {text}
                        </Typography>
                      ))}
                      {/* <RHFSwitch
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
                      /> */}
                      <RHFRadioGroup
                        name="isParticipate"
                        options={OPTION}
                        sx={{
                          '& .MuiFormControlLabel-root': { mr: 4 },
                        }}
                      />
                    </Box>
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
                      label={'Select State'}
                      placeholder={'State'}
                      options={statesList}
                      value={watch('selectStates')}
                      onChange={handleStatesSelect}
                    />
                    {/* <RHFSelectDropdown
                      name="selectStates"
                      label={'Select States'}
                      value={watch('selectStates')}
                      placeholder={'States'}
                      options={statesList}
                      defaultMessage="Please Select State"
                      onChange={handleStatesSelect}
                    /> */}
                    {districtList?.childEntities?.length ? (
                      <RHFSelectDropdown
                        name="selectDistrict"
                        label={'Select District'}
                        value={watch('selectDistrict')}
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
                      startIcon={<Iconify icon={'mingcute:user-add-fill'} />}
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
