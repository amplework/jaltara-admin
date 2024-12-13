import { useParams } from 'react-router-dom';
// @mui
import {
  Card,
  Container,
  Grid,
  Typography,
  Box,
  TableContainer,
  TableBody,
  TableRow,
  TableCell,
  useTheme,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// redux
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'src/redux/store';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { Table } from '@mui/material';
import { TableHeadCustom } from 'src/components/table';
import Scrollbar from 'src/components/Scrollbar';
import noImage from 'src/assets/images/noImage.jpg';
import { getFarmerDetails, startLoading } from 'src/redux/slices/farmers';
import { formatedDate } from 'src/utils/formateDate';
import FarmerPitsDetails from 'src/sections/@dashboard/user/list/FarmerPitsDetails';
import { SkeletonProduct } from 'src/components/skeleton';
import ImageCard from 'src/components/common/cards/imageCard';
import DetailsList from 'src/components/common/detailsListing/listing';
import SelectedCrops from 'src/components/common/detailsListing/selectedCrops';
import { farmerLogsHeader } from 'src/mockUp/Farmer';


export default function FarmerDetails() {
  const { id } = useParams();
  const theme = useTheme();
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      dispatch(startLoading());
      dispatch(getFarmerDetails(id));
    }
  }, [id, dispatch]);

  const { farmersDetails, isLoading } = useSelector((state) => state.farmer);

  const {
    photo,
    name,
    phone,
    language,
    checkUpperGeo,
    land,
    familyMemberNumber,
    farmAvailableDate,
    isParticipate,
    farmingChallenge,
    crops,
    pits,
  } = farmersDetails;

  const reverseGeoLocations = Array.isArray(checkUpperGeo?.parents)
    ? [...checkUpperGeo.parents].reverse()
    : [];

  const details = [
    { label: 'Name', value: name },
    { label: 'Language', value: language },
    { label: 'Phone', value: phone },
    { label: 'Land', value: land },
    { label: 'Family member count', value: familyMemberNumber },
    { label: 'Farmer available date', value: formatedDate(farmAvailableDate) },
    { label: 'Is participate', value: isParticipate ? 'Yes' : 'No' },
    {
      label: 'Village',
      value: `${
        checkUpperGeo?.name
          ? `${checkUpperGeo?.name} ${reverseGeoLocations
              ?.map((item: any, index: number) => `${index === 0 ? ',' : ''}${item?.name}`)
              .join(' ')}`
          : 'N/A'
      }`,
    },
  ];

  return (
    <Page title="Farmer Details">
      <Container maxWidth={'xl'}>
        <HeaderBreadcrumbs
          heading="Farmer Details"
          links={[
            { name: 'Farmer List', href: PATH_DASHBOARD.farmers.list },
            { name: 'Farmer Details' },
          ]}
        />

        <Card sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
          {isLoading ? (
            <SkeletonProduct />
          ) : (
            <Grid container spacing={4} justifyContent="center">
              {/* Image Section */}
              <Grid item xs={12} sm={6} md={4} display={'flex'} justifyContent={'center'}>
                <ImageCard src={photo ? photo : noImage} />
              </Grid>

              {/* Details Section */}
              <Grid item xs={12} sm={6} md={8}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Farmer Information
                </Typography>
                <DetailsList details={details} />
              </Grid>
            </Grid>
          )}

          {/* crops and challanges Listing */}
          {isLoading ? (
            <SkeletonProduct />
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2, pl: 1 }}>
              <SelectedCrops
                title="Crops"
                data={crops?.map((item: any) => item?.name) || ['N/A']}
              />
              <SelectedCrops
                title="Farming Challenges"
                data={farmingChallenge?.map((item: any) => item?.challenge) || ['N/A']}
              />
            </Box>
          )}

          {/* Stages Section */}
          {pits && (
            <Grid item xs={12} sm={12} md={12} pt={3}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                Pit Information
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                <Scrollbar>
                  <TableContainer sx={{ minWidth: 800, boxShadow: 3, borderRadius: 2 }}>
                    <Table size="medium">
                      <TableHeadCustom headLabel={farmerLogsHeader} />
                      <TableBody>
                        {pits?.length > 0 ? (
                          pits?.map((row: any, index: number) => (
                            <FarmerPitsDetails key={row.id} row={row} index={index} />
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={farmerLogsHeader?.length} align="center">
                              No data available
                            </TableCell>
                          </TableRow>
                        )}
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
