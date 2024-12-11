import * as Yup from 'yup';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Container, Grid, Typography, Box, Stack } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, RHFSelectDropdown, RHFTextField } from 'src/components/hook-form';
import { LoadingButton } from '@mui/lab';
import Iconify from 'src/components/Iconify';
import Page from 'src/components/Page';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../routes/paths';
import { TutorialType } from 'src/@types/tutorial';
import { useDispatch, useSelector } from 'src/redux/store';
import { AddTutorials, emptyTutorialDetails, getTutorialsDetails } from 'src/redux/slices/tutorial';

const statusList = [
  { id: 'active', label: 'Active', name: 'active' },
  { id: 'inactive', label: 'Inactive', name: 'inactive' },
];

const NewUserSchema = Yup.object().shape({
  subject: Yup.string()
    .required('Subject name is required')
    .matches(/^[^\s].*$/, 'First Characters space not allowed.'),
  description: Yup.string()
    .required('Description is required')
    .matches(/^[^\s].*$/, 'First Characters space not allowed.'),
  status: Yup.string(),
  videos: Yup.array()
    .of(
      Yup.object().shape({
        url: Yup.string().required('Video URL is required'),
        thumbnail: Yup.string().required('Thumbnail is required'),
        status: Yup.string().required('Video status is required'),
      })
    )
    .min(1, 'At least one video must be added'),
});

export default function LocationCreate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { tutorialDetails } = useSelector((state) => state.tutorials);
  useEffect(() => {
    if (id) {
      getDetails();
    }
  }, []);

  const getDetails = () => {
    dispatch(getTutorialsDetails(id));
  };

  useEffect(() => {
    if (tutorialDetails && id) {
      setAllDetails();
    }
  }, [tutorialDetails?.id]);

  const setAllDetails = () => {
    setValue('subject', tutorialDetails?.subject);
    setValue('status', tutorialDetails?.status);
    setValue('description', tutorialDetails?.description);
    setValue('videos', tutorialDetails?.videos);
  };

  console.log('tutorialDetails', tutorialDetails);

  const defaultValues = {
    subject: '',
    description: '',
    status: '',
    videos: [{ url: '', thumbnail: '', status: '' }],
  };

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    clearErrors,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const videos = watch('videos');
  console.log('videos --------->', videos);

  const handleAddVideos = () => {
    const newVideo = { url: '', thumbnail: '', status: '' };

    setValue('videos', [...videos, newVideo]);
    clearErrors('videos');
  };

  const handleDeleteVideos = (index: number) => {
    if (videos?.length > 1) {
      const updatedVideos = videos?.filter((_: any, i: number) => i !== index);
      setValue('videos', updatedVideos);
    } else if (videos?.length === 1) {
      setValue(`videos.${index}.url`, '');
      setValue(`videos.${index}.thumbnail`, '');
      setValue(`videos.${index}.status`, '');
    }
  };

  const handleVideoChange = (index: number, field: 'url' | 'thumbnail' | 'status', value: any) => {
    const updatedVideos = [...videos];

    if (field === 'status') {
      updatedVideos[index][field] = watch(`videos.${index}.status`);
      clearErrors(`videos.${index}.${field}`);
    } else {
      updatedVideos[index][field] = value;
      clearErrors(`videos.${index}.${field}`);
    }
    setValue('videos', updatedVideos);
  };

  const onSubmit = async (data: TutorialType) => {
    let previousState: any = {
      subject: tutorialDetails?.subject,
      description: tutorialDetails?.description,
      // status: tutorialDetails?.status,
    };

    let payload = {
      subject: data?.subject,
      description: data?.description,
      // status: data?.status,
      videos: videos,
    };

    Object.keys(payload).forEach((key) => {
      const typedKey = key as keyof typeof payload; // Explicitly cast key as a valid key of payload
      if (payload[typedKey] === previousState[typedKey]) {
        delete payload[typedKey];
      }
    });

    if (id) {
      dispatch(AddTutorials(payload, id)).then((res: any) => {
        if (res?.data?.statusCode === 200) {
          enqueueSnackbar(res?.data?.message, {
            variant: 'success',
          });
          dispatch(emptyTutorialDetails());
          navigate(PATH_DASHBOARD.masterdata.tutorial);
        }
      });
    } else {
      dispatch(AddTutorials(payload)).then((res: any) => {
        if (res?.data?.statusCode === 201) {
          enqueueSnackbar(res?.data?.message, {
            variant: 'success',
          });
          dispatch(emptyTutorialDetails());
          navigate(PATH_DASHBOARD.masterdata.tutorial);
        } else {
          enqueueSnackbar(res?.data?.message, {
            variant: 'success',
          });
          dispatch(emptyTutorialDetails());
          navigate(PATH_DASHBOARD.masterdata.tutorial);
        }
      });
    }
  };

  const handleDisabledVideos = () => {
    const nonEmptyObjects = videos.some(
      (obj) => obj?.status === '' || obj?.thumbnail === '' || obj?.url === ''
    );
    return nonEmptyObjects;
  };

  return (
    <Page title="Add Tutorials">
      <Container maxWidth={'xl'}>
        <HeaderBreadcrumbs
          heading={!id ? 'Add Tutorials' : 'Edit Tutorial details'}
          links={[
            { name: 'Tutorial List', href: PATH_DASHBOARD.sevak.list },
            { name: !id ? 'Add Tutorial' : 'Edit Tutorials' },
          ]}
        />
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card sx={{ p: 3, boxShadow: '0 12px 24px rgba(0,0,0,0.18)' }}>
                <Box
                  sx={{
                    display: 'grid',
                    columnGap: 2,
                    rowGap: 3,
                    gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' },
                  }}
                >
                  <RHFTextField name="subject" label="Subject Name" />
                  <RHFTextField name="description" label="description Name" />
                  {/* <RHFSelectDropdown
                    name="status"
                    label={'Select Status'}
                    placeholder={'Status'}
                    options={statusList}
                  /> */}
                </Box>

                {/* tutorials urls */}
                <Box>
                  <LoadingButton
                    onClick={handleAddVideos}
                    disabled={handleDisabledVideos()}
                    sx={{
                      py: 1,
                      width: '150px',
                      display: 'flex',
                      bgcolor: '#aaa',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      color: 'white',
                      mt: 2,
                      ':hover': {
                        bgcolor: '#aaa',
                        color: 'white',
                      },
                      ':disabled': {
                        color: 'white',
                      },
                    }}
                  >
                    Add Videos
                  </LoadingButton>
                </Box>
                <Box sx={{ p: 1, borderRadius: '10px' }}>
                  {videos?.map((video: any, index: number) => (
                    <Box
                      key={index}
                      sx={{
                        // bgcolor: getRandomExtremelyLightColor(),
                        // bgcolor: '#acc',
                        boxShadow: '1px 2px 12px rgba(0,0,0,0.18)',
                        p: 2,
                        borderRadius: '10px',
                        mt: 3,
                      }}
                    >
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h5" py={2}>
                          Tutorial Video {index + 1}
                        </Typography>

                        <Iconify
                          icon="uiw:delete"
                          sx={{ color: '#d23838', cursor: 'pointer' }}
                          onClick={() => handleDeleteVideos(index)}
                        />
                      </Box>
                      <Box
                        sx={{
                          display: 'grid',
                          columnGap: 2,
                          rowGap: 3,
                          gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                        }}
                      >
                        <RHFTextField
                          name={`videos[${index}].url`}
                          label="Video URL"
                          value={video.url}
                          onChange={(e) => handleVideoChange(index, 'url', e.target.value)}
                        />
                        <RHFTextField
                          name={`videos[${index}].thumbnail`}
                          label="Thumbnail URL"
                          value={video.thumbnail}
                          onChange={(e) => handleVideoChange(index, 'thumbnail', e.target.value)}
                        />
                        <RHFSelectDropdown
                          name={`videos[${index}].status`}
                          label="Status"
                          placeholder="Select Status"
                          value={videos[index]?.status}
                          options={statusList}
                          onClick={(e: any) => handleVideoChange(index, 'status', e.target.value)}
                        />
                      </Box>
                    </Box>
                  ))}
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
            </Grid>
          </Grid>
        </FormProvider>
      </Container>
    </Page>
  );
}
