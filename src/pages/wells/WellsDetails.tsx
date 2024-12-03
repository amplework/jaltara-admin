import { useParams } from 'react-router-dom';
// @mui
import { Card, Container, Grid, Typography, Box, TableContainer, TableBody } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'src/redux/store';
import { getWellsDetails, startLoading } from 'src/redux/slices/wells';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Image from 'src/components/Image';
import { formatedDate } from 'src/utils/formateDate';
import { Table } from '@mui/material';
import { TableHeadCustom } from 'src/components/table';
import WellsDetailsRow from 'src/sections/@dashboard/user/list/WellsDetails';
import Scrollbar from 'src/components/Scrollbar';
import { SkeletonProduct } from 'src/components/skeleton';

export default function WellsDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      dispatch(startLoading());
      dispatch(getWellsDetails(id));
    }
  }, [id, dispatch]);

  const { wellsDetails, isLoading } = useSelector((state) => state.wells);
  const { description, gpsLocation, level, photo, plotSize, stages, village, checkUpperGeo } =
    wellsDetails;

  const reverseGeoLocations = Array.isArray(checkUpperGeo?.parents)
    ? [...checkUpperGeo.parents].reverse()
    : [];

  const TABLE_HEAD = [
    { id: 'photo', label: 'Photo', align: 'left' },
    { id: 'update by sevek', label: 'Update by sevek', align: 'left' },
    { id: 'last update', label: 'Last update', align: 'left' },
  ];

  const details = [
    { label: 'Description', value: description },
    { label: 'GPS Location', value: gpsLocation },
    { label: 'Level', value: level },
    { label: 'Plot Size', value: `${plotSize} sq. ft.` },
    {
      label: 'Village',
      value: `${checkUpperGeo?.name} ${reverseGeoLocations?.map((item: any) => item?.name)}`,
    },
  ];

  return (
    <Page title="Wells Details">
      <Container maxWidth={'xl'}>
        <HeaderBreadcrumbs
          heading="Wells Details"
          links={[
            { name: 'Wells List', href: PATH_DASHBOARD.wells.list },
            { name: 'Wells Details' },
          ]}
        />
        <Card sx={{ p: 3 }}>
          {isLoading ? (
            <SkeletonProduct />
          ) : (
            <>
              <Grid container spacing={4} justifyContent="center">
                {/* Image Section */}
                <Grid item xs={12} sm={6} md={4}>
                  <Image
                    src={photo}
                    alt="Well Image"
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
                    Well Information
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
                                <WellsDetailsRow key={row.id} row={row} index={index} />
                              ))
                            : null}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Scrollbar>
                </Box>
              </Grid>
            </>
          )}
        </Card>
      </Container>
    </Page>
  );
}
