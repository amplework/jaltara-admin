import { useParams } from 'react-router-dom';
// @mui
import { Card, Container, Grid, Typography, Box, TableContainer, TableBody } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'src/redux/store';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Image from 'src/components/Image';
import { Table } from '@mui/material';
import { TableHeadCustom } from 'src/components/table';
import Scrollbar from 'src/components/Scrollbar';
import { detailsLoading, getUsersDetails } from 'src/redux/slices/user';
import SevekSummary from 'src/sections/@dashboard/user/list/SevekPitsCount';
import SevekPitsList from 'src/sections/@dashboard/user/list/SevekPitsList';
import noImage from 'src/assets/images/noImage.jpg';
import { SkeletonPostItem, SkeletonProduct } from 'src/components/skeleton';

export default function SevekDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      dispatch(detailsLoading());
      dispatch(getUsersDetails(id));
    }
  }, [id, dispatch]);

  const { usersDetails, isDetailsLoading } = useSelector((state) => state.user);
  console.log('usersDetails', usersDetails);

  const {
    photo,
    name,
    phone,
    status,
    language,
    checkUpperGeo,
    stages,
    pitCount,
    wellCount,
    farmerCount,
  } = usersDetails;
  console.log('language', language);

  const reverseGeoLocations = Array.isArray(checkUpperGeo?.parents)
    ? [...checkUpperGeo.parents].reverse()
    : [];

  const TABLE_HEAD = [
    { id: 'photo', label: 'Photo', align: 'left' },
    { id: 'status ', label: 'Status', align: 'left' },
    { id: 'fname ', label: 'Farmer Name', align: 'left' },
    { id: 'vname ', label: 'Village Name', align: 'left' },
    { id: 'stage ', label: 'Stage Name', align: 'left' },
    { id: 'level ', label: 'Level', align: 'left' },
    { id: 'last update', label: 'Last update', align: 'left' },
  ];

  const details = [
    { label: 'Name', value: name },
    {
      label: 'Language',
      value: language === 'mr' ? 'मराठी' : language === 'hi' ? 'हिन्दी' : 'English',
    },
    { label: 'Phone', value: phone },
    { label: 'Status', value: status },
    {
      label: 'Village',
      value: `${checkUpperGeo?.name} ${reverseGeoLocations?.map(
        (item: any, index: number) => `${index === 0 ? `${','}` : ''}${item?.name}`
      )}`,
    },
  ];

  return (
    <Page title="Sevak Details">
      <Container maxWidth={'xl'}>
        <HeaderBreadcrumbs
          heading="Sevak Details"
          links={[
            { name: 'Sevak List', href: PATH_DASHBOARD.sevak.list },
            { name: 'Sevak Details' },
          ]}
        />
        <Grid container spacing={3} pb={2}>
          {[
            { title: 'Total Pit Count', total: pitCount },
            { title: 'Total Well Count', total: wellCount },
            { title: 'Total Farmer Count', total: farmerCount },
          ].map((item, index) => (
            <Grid item xs={12} md={4} key={index}>
              <SevekSummary title={item.title} total={item.total} isLoading={isDetailsLoading} />
            </Grid>
          ))}
        </Grid>

        <Card sx={{ p: 3 }}>
          {isDetailsLoading ? (
            <SkeletonProduct />
          ) : (
            <Grid container spacing={4} justifyContent="center">
              {/* Image Section */}
              <Grid item xs={12} sm={6} md={4} display={'flex'} justifyContent={'center'}>
                <Box
                  sx={{
                    width: 300,
                    height: 300,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: 3,
                    transition: 'box-shadow 0.3s ease-in-out',
                    '&:hover': {
                      boxShadow: 6,
                    },
                  }}
                >
                  <Image
                    src={photo ? photo : noImage}
                    alt={photo ? 'Uploaded Image' : 'No Image Available'}
                    sx={{
                      width: '70%',
                      height: 'auto',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                    }}
                  />
                </Box>
              </Grid>

              {/* Details Section */}
              <Grid item xs={12} sm={6} md={8}>
                <Typography variant="h5" gutterBottom>
                  Sevak Information
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    mt: 2,
                  }}
                >
                  {details?.map(({ label, value }) => (
                    <Box
                      key={label}
                      display="flex"
                      // justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', minWidth: 120 }}>
                        {label} :
                      </Typography>
                      <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                        {value}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Grid>
            </Grid>
          )}

          {/* stages Section */}
          {usersDetails?.stages && (
            <Grid item xs={12} sm={6} md={8} pt={3}>
              <Typography variant="h5" gutterBottom>
                Pit , well and it's Stages Information
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  mt: 2,
                }}
              >
                <Scrollbar>
                  <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
                    <Table size={'medium'}>
                      <TableHeadCustom headLabel={TABLE_HEAD} />
                      <TableBody>
                        {stages?.length
                          ? stages?.map((row: any, index: number) => (
                              <SevekPitsList key={row.id} row={row} />
                            ))
                          : null}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Scrollbar>
              </Box>
            </Grid>
          )}
        </Card>
      </Container>
    </Page>
  );
}
