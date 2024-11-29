import { useParams } from 'react-router-dom';
// @mui
import { Card, Container, Grid, Typography, Box, TableContainer, TableBody } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// redux
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'src/redux/store';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Image from 'src/components/Image';
import { Table } from '@mui/material';
import { TableHeadCustom } from 'src/components/table';
import Scrollbar from 'src/components/Scrollbar';
import { getUsersDetails } from 'src/redux/slices/user';
import SevekSummary from 'src/sections/@dashboard/user/list/SevekPitsCount';
import SevekPitsList from 'src/sections/@dashboard/user/list/SevekPitsList';
import noImage from 'src/assets/images/noImage.jpg';

export default function SevekDetails() {
  const { themeStretch } = useSettings();
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      dispatch(getUsersDetails(id));
    }
  }, [id, dispatch]);

  const { usersDetails } = useSelector((state) => state.user);

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

  const reverseGeoLocations = [...checkUpperGeo?.parents]?.reverse();
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
    { label: 'language', value: language },
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
    <Page title="Sevek Details">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Sevek Details"
          links={[
            { name: 'sevek List', href: PATH_DASHBOARD.sevek.list },
            { name: 'Sevek Details' },
          ]}
        />
        <Grid container spacing={3} pb={2}>
          {[
            { title: 'Total Pit Count', total: pitCount },
            { title: 'Total Well Count', total: wellCount },
            { title: 'Total Farmer Count', total: farmerCount },
          ].map((item, index) => (
            <Grid item xs={12} md={4} key={index}>
              <SevekSummary title={item.title} total={item.total} />
            </Grid>
          ))}
        </Grid>

        <Card sx={{ p: 3 }}>
          <Grid container spacing={4} justifyContent="center">
            {/* Image Section */}
            <Grid item xs={12} sm={6} md={4}>
              <Image
                src={photo ? photo : noImage}
                alt="sevek Image"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 2,
                  objectFit: 'cover',
                  boxShadow: 3,
                }}
              />
            </Grid>

            {/* Details Section */}
            <Grid item xs={12} sm={6} md={8}>
              <Typography variant="h5" gutterBottom>
                Sevek Information
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  mt: 2,
                }}
              >
                {details.map(({ label, value }) => (
                  <Box
                    key={label}
                    display="flex"
                    // justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', minWidth: 120 }}>
                      {label} :
                    </Typography>
                    <Typography variant="body1">{value}</Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>

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
                          ? stages.map((row: any, index: number) => (
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
