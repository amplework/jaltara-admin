import { useParams, useNavigate } from 'react-router-dom';
import { Box, Card, Container, Grid, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import Page from 'src/components/Page';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { useDispatch, useSelector } from 'src/redux/store';
import { getTutorialsDetails } from 'src/redux/slices/tutorial';
import ReactPlayer from 'react-player';
import { VideoPlayer } from 'src/components/common/videoPlayer';

const statusList = [
  { id: 'active', label: 'Active', name: 'active' },
  { id: 'inactive', label: 'Inactive', name: 'inactive' },
];

export default function TutorialDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (id) {
      getDetails();
    }
  }, []);

  const { tutorialDetails } = useSelector((state) => state.tutorials);
  const { subject, status, description, videos } = tutorialDetails;
  const getDetails = () => {
    dispatch(getTutorialsDetails(id));
  };

  return (
    <Page title="Tutorial Details">
      <Container maxWidth={'xl'}>
        <HeaderBreadcrumbs
          heading={'Tutorial Details'}
          links={[
            { name: 'Tutorial List', href: PATH_DASHBOARD.sevak.list },
            { name: 'Tutorial Details' },
          ]}
        />
        <Card
          sx={{
            p: 3,
            boxShadow: 4,
            borderRadius: 3,
            // backgroundColor: '#f9f9f9',
            overflow: 'hidden',
          }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {subject}
          </Typography>
          <Typography
            variant="body1"
            py={1}
            color="text.secondary"
            sx={{ textTransform: 'capitalize', fontSize: '1.1rem' }}
          >
            {description}
          </Typography>
          <Grid container spacing={3} py={2}>
            {videos?.map((item: any, index: any) => {
              return (
                <Box key={index} m={2}>
                  <VideoPlayer item={item} />
                </Box>
              );
            })}
          </Grid>
        </Card>
      </Container>
    </Page>
  );
}
