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
  List,
  ListItemText,
  TableRow,
  TableCell,
  useTheme,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks

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
import noImage from 'src/assets/images/noImage.jpg';
import { getFarmerDetails, startLoading } from 'src/redux/slices/farmers';
import { formatedDate } from 'src/utils/formateDate';
import FarmerPitsDetails from 'src/sections/@dashboard/user/list/FarmerPitsDetails';
import { ListItem } from '@mui/material';
import LogoOnlyLayout from 'src/layouts/LogoOnlyLayout';
import Logo from 'src/components/Logo';
import LoadingScreen from 'src/components/LoadingScreen';
import { SkeletonProduct } from 'src/components/skeleton';

const TABLE_HEAD = [
  { id: 'photo', label: 'Photo', align: 'left' },
  { id: 'name ', label: 'Name', align: 'left' },
  { id: 'level ', label: 'Level', align: 'left' },
  { id: 'plot ', label: 'Plot Size', align: 'left' },
  { id: 'stage ', label: 'Stage Name', align: 'left' },
  { id: 'last update', label: 'Last update', align: 'left' },
];

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
  console.log('farmersDetails------>', farmersDetails);

  const reverseGeoLocations = Array.isArray(checkUpperGeo?.parents)
    ? [...checkUpperGeo.parents].reverse()
    : [];

  const cropDetails = [
    {
      value:
        crops && Array.isArray(crops) && crops.length > 0
          ? crops.map((item: any, index: number) => `${item.name || 'N/A'}`)
          : ['N/A'],
    },
  ];
  const cropChallangesDetails = [
    {
      // label: 'Farming Challenges',
      value:
        farmingChallenge && Array.isArray(farmingChallenge) && farmingChallenge.length > 0
          ? farmingChallenge.map((item: any, index: number) => ` ${item.challenge || 'N/A'}`)
          : ['N/A'],
    },
  ];

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

  function getRandomExtremelyLightColor() {
    const r = Math.floor(Math.random() * 26 + 230); // Red: 230-255
    const g = Math.floor(Math.random() * 26 + 230); // Green: 230-255
    const b = Math.floor(Math.random() * 26 + 230); // Blue: 230-255

    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }
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
            <Grid container spacing={4} justifyContent="center" >
              {/* Image Section */}
              <Grid item xs={12} sm={6} md={4} display={"flex"} justifyContent={"center"} >
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
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Farmer Information
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {details?.map(({ label, value }) => (
                    <Box key={label} sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 'bold',
                          minWidth: 170,
                          color: 'text.primary',
                          textAlign: 'left',
                        }}
                      >
                        {label} :
                      </Typography>
                      <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                        {value || 'N/A'}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Grid>
            </Grid>
          )}
          {isLoading ? (
            <SkeletonProduct />
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                mt: 2,
                paddingLeft: 1,
              }}
            >
              <Box>
                <Box
                  display={'flex'}
                  justifyContent={'center'}
                  sx={{
                    boxShadow: '0px 4px 12px rgba(55, 155, 155, 0.3)',
                    padding: 2,
                    borderRadius: 1,
                    bgcolor: 'rgba(209, 235, 230, 0.8)',
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ color: 'text.primary' }}>
                    Crops
                  </Typography>
                </Box>
                {cropDetails?.map(({ value }, index) => (
                  <Box key={index} sx={{ my: 2 }}>
                    {value && value.length > 0 ? (
                      <Box display={'flex'} sx={{ flexWrap: 'wrap' }}>
                        {value?.map((item: any, idx: number) => (
                          <Typography
                            key={idx}
                            variant="body2"
                            mx={1}
                            sx={{
                              bgcolor: getRandomExtremelyLightColor(),
                              p: 2,
                              mb: 1,
                              borderRadius: '10px',
                              textTransform: 'capitalize',
                            }}
                          >
                            {item}
                          </Typography>
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        N/A
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
              <Box>
                <Box
                  display={'flex'}
                  justifyContent={'center'}
                  sx={{
                    boxShadow: '0px 4px 12px rgba(55, 155, 155, 0.3)',
                    padding: 2,
                    borderRadius: 1,
                    bgcolor: 'rgba(209, 235, 230, 0.8)',
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ color: 'text.primary' }}>
                    Farming Challenges
                  </Typography>
                </Box>
                {cropChallangesDetails?.map(({ value }, index) => (
                  <Box key={index} sx={{ my: 2 }}>
                    {value && value.length > 0 ? (
                      <Box display={'flex'} sx={{ flexWrap: 'wrap' }}>
                        {value?.map((item: any, idx: number) => (
                          <Typography
                            key={idx}
                            variant="body2"
                            mx={1}
                            sx={{
                              bgcolor: getRandomExtremelyLightColor(),
                              p: 2,
                              mb: 1,
                              borderRadius: '10px',
                              textTransform: 'capitalize',
                            }}
                          >
                            {item}
                          </Typography>
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        N/A
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
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
                      <TableHeadCustom headLabel={TABLE_HEAD} />
                      <TableBody>
                        {pits?.length > 0 ? (
                          pits?.map((row: any, index: number) => (
                            <FarmerPitsDetails key={row.id} row={row} index={index} />
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={TABLE_HEAD.length} align="center">
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
