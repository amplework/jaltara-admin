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
import Image from 'src/components/Image';
import { Table } from '@mui/material';
import { TableHeadCustom } from 'src/components/table';
import Scrollbar from 'src/components/Scrollbar';
import noImage from 'src/assets/images/noImage.jpg';
import { SkeletonProduct } from 'src/components/skeleton';
import { getEquipmentsDetails } from 'src/redux/slices/equipment';
import EquipmentLogsRow from 'src/sections/@dashboard/user/list/EquipmentLogsRow';
import jcbPic from 'src/assets/images/jcbPic.jpeg';
import { equipmentLogs } from 'src/mockUp/Equipment';
import ImageCard from 'src/components/common/cards/imageCard';
import DetailsList from 'src/components/common/detailsListing/listing';

export default function EquipmentDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      dispatch(getEquipmentsDetails(id));
    }
  }, [id, dispatch]);

  const { equipmentDetails, isLoading } = useSelector((state) => state.equipments);

  const { name, phone, equipment, status, logs,photo } = equipmentDetails;

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
            <Grid container spacing={4} justifyContent="center">
              {/* Image Section */}
              <Grid item xs={12} sm={6} lg={4} display="flex" justifyContent="center">
                <ImageCard src={photo || noImage} />
              </Grid>

              {/* Details Section */}
              <Grid item xs={12} sm={6} lg={8}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Equipment Information
                </Typography>
                <DetailsList details={details} />
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
                      <TableHeadCustom headLabel={equipmentLogs} />
                      <TableBody>
                        {logs?.length > 0 ? (
                          logs?.map((row: any, index: number) => (
                            <EquipmentLogsRow key={row.id} row={row} index={index} />
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={equipmentLogs?.length} align="center">
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
