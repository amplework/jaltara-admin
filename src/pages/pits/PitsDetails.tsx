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
import WellsDetailsRow from 'src/sections/@dashboard/user/list/WellsDetails';
import Scrollbar from 'src/components/Scrollbar';
import { getPitDetails } from 'src/redux/slices/pits';

export default function PitsDetails() {
  const { themeStretch } = useSettings();
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      dispatch(getPitDetails(id));
    }
  }, [id, dispatch]);

  const { pitsDetails } = useSelector((state) => state.pits);

  const {  farmer,gpsLocation, level,stageName, photo, plotSize, stages, checkUpperGeo } =
  pitsDetails;
  const reverseGeoLocations = [...checkUpperGeo?.parents]?.reverse();
  const TABLE_HEAD = [
    { id: 'photo', label: 'Photo', align: 'left' },
    { id: 'stage ', label: 'Stage Name', align: 'left' },
    { id: 'update by sevek', label: 'Update by sevek', align: 'left' },
    { id: 'last update', label: 'Last update', align: 'left' },
  ];

  const details = [
    { label: 'Farmer Name', value: farmer?.name },
    { label: 'Stage', value: stageName },
    { label: 'GPS Location', value: gpsLocation },
    { label: 'Level', value: level },
    { label: 'Plot Size', value: `${plotSize} sq. ft.` },
    {
      label: 'Village',
      value: `${checkUpperGeo?.name} ${reverseGeoLocations?.map((item: any) => item?.name)}`,
    },
  ];

  return (
    <Page title="Pits Details">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Pits Details"
          links={[
            { name: 'pits List', href: PATH_DASHBOARD.pits.list },
            { name: 'Pits Details' },
          ]}
        />
        <Card sx={{ p: 3 }}>
          <Grid container spacing={4} justifyContent="center">
            {/* Image Section */}
            <Grid item xs={12} sm={6} md={4}>
              <Image
                src={photo}
                alt="Pits Image"
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
                Pits Information
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
          <Grid item xs={12} sm={6} md={8} pt={3}>
            <Typography variant="h5" gutterBottom>
              Stages Information
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
                            <WellsDetailsRow key={row.id} row={row} index={index} pit={true}/>
                          ))
                        : null}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Scrollbar>
            </Box>
          </Grid>
        </Card>
      </Container>
    </Page>
  );
}
