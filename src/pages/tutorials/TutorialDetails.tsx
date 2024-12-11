import { useParams, useNavigate } from 'react-router-dom';
import { Card, Container, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import Page from 'src/components/Page';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../routes/paths';
import { useDispatch, useSelector } from 'src/redux/store';
import { getTutorialsDetails } from 'src/redux/slices/tutorial';

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
  const { subject, status ,description,videos} = tutorialDetails;
  console.log('tutorialDetails', tutorialDetails);



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
        <Card>
          <Typography variant='h4'>{subject}</Typography>
        </Card>
      </Container>
    </Page>
  );
}
