import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import {
  Box,
  Card,
  Table,
  Button,
  TableBody,
  Container,
  TableContainer,
  TablePagination,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useTabs from '../../hooks/useTabs';

import useTable from '../../hooks/useTable';
// components
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import { useDispatch, useSelector } from 'src/redux/store';
import {
  deleteEquipment,
  emptyEquipmentsDetails,
  getEquipmentsList,
} from 'src/redux/slices/equipment';
import Iconify from 'src/components/Iconify';
import Page from 'src/components/Page';
import { UserTableToolbar } from 'src/sections/@dashboard/user/list';
import Scrollbar from 'src/components/Scrollbar';
import { TableHeadCustom, TableNoData } from 'src/components/table';
import { EquipmentItem } from 'src/@types/equipment';
import EquipmentTableRow from 'src/sections/@dashboard/user/list/EquipmentTableRow';
import { useSnackbar } from 'notistack';
import { equipmentTableHeader } from 'src/mockUp/Equipment';
import ConfirmationModal from 'src/components/modal/Confirmation';
import { DeleteConfirmationContent } from '../sevak/DeleteConfirmationContent';

export default function EquipmentList() {
  const {
    page,
    order,
    orderBy,
    rowsPerPage,
    selected,
    onChangePage,
    onChangeRowsPerPage,
    setPage,
  } = useTable();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const [state, setState] = useState({
    name: '',
    village: '',
    openModal: false,
    id: '',
    equipmentName: '',
  });

  const { currentTab: filterStatus } = useTabs('all');

  const { equipmentListData } = useSelector((state) => state.equipments);

  useEffect(() => {
    getEquipmentsList();
  }, []);

  const onSearch = () => {
    setPage(0);
    getEquipmentsList(state?.name, state?.village);
  };

  const handleFilterName = (filterName: string) => {
    setState((prev) => ({ ...prev, name: filterName }));
  };

  const handleFilteRequipment = (filterVillage: string) => {
    setState((prev) => ({ ...prev, village: filterVillage }));
  };

  const isNotFound =
    (!equipmentListData?.length && !!state?.name) ||
    (!equipmentListData?.length && !!state?.village) ||
    (!equipmentListData?.length && !!filterStatus);

  const onhandleEditDetails = (id: string) => {
    dispatch(emptyEquipmentsDetails(null));
    navigate(PATH_DASHBOARD.equipments.edit(id));
  };

  const onhandleDeleteRow = (id: string, name: string) => {
    setState((prev) => ({ ...prev, openModal: true, id: id, equipmentName: name }));
  };

  const handleClose = () => {
    setState((prev) => ({ ...prev, openModal: false, id: '', equipmentName: '' }));
  };

  const handleDeleteEquipment = () => {
    dispatch(deleteEquipment(state?.id))
      .then((res) => {
        if (res?.data?.statusCode === 200) {
          enqueueSnackbar(res?.data?.message, {
            variant: 'success',
          });
          getEquipmentsList();
          setState((prev) => ({ ...prev, openModal: false, id: '', equipmentName: '' }));
        } else {
          getEquipmentsList();
          setState((prev) => ({ ...prev, openModal: false, id: '', equipmentName: '' }));
        }
      })
      .catch(() => {
        console.log('error');
      });
  };

  const handleShowLogs = (id: string) => {
    navigate(PATH_DASHBOARD.equipments.logs(id));
  };

  const handleAddEquipment = () => {
    dispatch(emptyEquipmentsDetails(null));
    navigate(PATH_DASHBOARD.equipments.create);
  };

  return (
    <Page title="equipments List">
      <Container maxWidth={'xl'}>
        <HeaderBreadcrumbs
          heading="Equipments List"
          links={[{ href: PATH_DASHBOARD.equipments.list }]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon={'eva:plus-fill'} />}
              onClick={handleAddEquipment}
            >
              Add Equipment
            </Button>
          }
        />

        <Card>
          <UserTableToolbar
            filterName={state?.name}
            filterVillage={state?.village}
            onFilterName={handleFilterName}
            onFilterVillage={handleFilteRequipment}
            onSearch={onSearch}
            placeholderText={'Search by names'}
            placeholderTextSecond={'Search by equipment'}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              <Table size={'medium'}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={equipmentTableHeader}
                  rowCount={equipmentListData?.length}
                  numSelected={selected.length}
                />

                <TableBody>
                  {equipmentListData?.length
                    ? equipmentListData
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row: EquipmentItem) => (
                          <EquipmentTableRow
                            key={row.id}
                            row={row}
                            onhandleEditDetails={onhandleEditDetails}
                            onhandleDeleteRow={onhandleDeleteRow}
                            handleShowLogs={handleShowLogs}
                          />
                        ))
                    : null}

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <Box sx={{ position: 'relative' }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={equipmentListData?.length ? equipmentListData.length : 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
            />
          </Box>
        </Card>
      </Container>

      <ConfirmationModal
        openModal={state.openModal}
        // isLoading={isLoading}
        handleClose={handleClose}
        title={'Delete Confirmation!'}
        handleSubmit={handleDeleteEquipment}
      >
        <DeleteConfirmationContent userName={state?.equipmentName} />
      </ConfirmationModal>
    </Page>
  );
}
