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
  Paper,
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
import { SkeletonProduct } from 'src/components/skeleton';
import { getEquipmentsDetails } from 'src/redux/slices/equipment';
import EquipmentLogsRow from 'src/sections/@dashboard/user/list/EquipmentLogsRow';
import jcbPic from 'src/assets/images/jcbPic.jpeg';

const TABLE_HEAD = [
  { id: 'startTime ', label: 'Start Date & Time', align: 'left' },
  { id: 'endTime ', label: 'End Date & Time', align: 'left' },
  { id: 'timeRecord', label: 'Time Record', align: 'left' },
];

export default function EquipmentDetails() {
  const { id } = useParams();
  const theme = useTheme();
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      dispatch(getEquipmentsDetails(id));
    }
  }, [id, dispatch]);

  const { equipmentDetails, isLoading } = useSelector((state) => state.equipments);

  const { name, phone, equipment, created, modified, status, photo, logs } = equipmentDetails;

  const details = [
    { label: 'Name', value: name },
    { label: 'number plate', value: equipment },
    { label: 'Phone Number', value: phone },
    { label: 'status', value: status },
  ];

  return (
    <Page title="Equipment Details">
      <Container maxWidth={'xl'}>
        <HeaderBreadcrumbs
          heading="Equipment Details"
          links={[
            { name: 'Equipment List', href: PATH_DASHBOARD.equipments.list },
            { name: 'Equipment Details' },
          ]}
        />
        <Card sx={{ p: 3, boxShadow: 3, borderRadius: 2, margin: 'auto' }}>
          {isLoading ? (
            <SkeletonProduct />
          ) : (
            <Grid
              container
              spacing={4}
              justifyContent="center"
              direction={{ xs: 'row' }}
            >
              {/* Image Section */}
              <Grid item xs={12} sm={6} lg={4} display="flex" justifyContent="center">
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
                    '&:hover': { boxShadow: 6 },
                  }}
                >
                  <Image
                    src={jcbPic || noImage}
                    alt={jcbPic ? 'Uploaded Equipment Image' : 'No Image Available'}
                    sx={{
                      width: '90%',
                      height: '90%',
                      objectFit: 'cover',
                      borderRadius: '10px',
                      transition: 'transform 0.3s ease-in-out',
                      '&:hover': { transform: 'scale(1.05)' },
                    }}
                  />
                </Box>
              </Grid>

              {/* Details Section */}
              <Grid item xs={12} sm={6} lg={8}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Equipment Information
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
                          textTransform: 'capitalize',
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

          {/* Stages Section */}
          {logs && (
            <Grid item xs={12} pt={3}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                Equipment Logs
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Scrollbar>
                  <TableContainer
                    // component={Paper}
                    sx={{ minWidth: 800, boxShadow: 3, borderRadius: 2, overflow: 'hidden' }}
                  >
                    <Table size="medium">
                      <TableHeadCustom headLabel={TABLE_HEAD} />
                      <TableBody>
                        {logs?.length > 0 ? (
                          logs?.map((row: any, index: number) => (
                            <EquipmentLogsRow key={row.id} row={row} index={index} />
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
