import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { TableNoData, TableHeadCustom } from '../../components/table';
// sections
import { UserTableToolbar } from '../../sections/@dashboard/user/list';
import { useDispatch, useSelector } from 'src/redux/store';
import { deleteFarmer, emptyFarmerDetails, getFarmerList } from 'src/redux/slices/farmers';
import FarmerTableRow from 'src/sections/@dashboard/user/list/FarmerTableRow';
import { emptyStatesDetails } from 'src/redux/slices/user';
import { useSnackbar } from 'notistack';
import { farmerTableHeader } from 'src/mockUp/Farmer';
import ConfirmationModal from 'src/components/modal/Confirmation';
import { DeleteConfirmationContent } from '../sevak/DeleteConfirmationContent';

export default function FarmersList() {
  const {
    dense,
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
    farmerName: '',
  });

  const { currentTab: filterStatus } = useTabs('all');

  useEffect(() => {
    getFarmerList();
  }, []);

  const { farmerListData } = useSelector((state) => state.farmer);

  const onSearch = () => {
    setPage(0);
    getFarmerList(state?.name, state?.village);
  };

  const handleEmptySerachBox = (name: string) => {
    if (state?.name?.length === 1 && name === '') {
      getFarmerList();
    }
  };

  const handleFilterName = (filterName: string) => {
    setState((prev) => ({ ...prev, name: filterName }));
    handleEmptySerachBox(filterName);
  };

  const handleFilterRole = (filterVillage: string) => {
    setState((prev) => ({ ...prev, village: filterVillage }));
  };

  const isNotFound =
    (!farmerListData?.length && !!state?.name) ||
    (!farmerListData?.length && !!state?.village) ||
    (!farmerListData?.length && !!filterStatus);

  const handleAddUser = () => {
    dispatch(emptyFarmerDetails(null));
    dispatch(emptyStatesDetails(null));
    navigate(PATH_DASHBOARD.farmers.new);
  };

  const onhandleEditDetails = (id: string) => {
    dispatch(emptyFarmerDetails(null));
    dispatch(emptyStatesDetails(null));
    navigate(PATH_DASHBOARD.farmers.edit(id));
  };

  const handleShowDetails = (id: string) => {
    navigate(PATH_DASHBOARD.farmers.details(id));
  };

  const onhandleDeleteRow = (id: string, name: string) => {
    setState((prev) => ({ ...prev, openModal: true, id: id, farmerName: name }));
  };

  const handleClose = () => {
    setState((prev) => ({ ...prev, openModal: false, id: '', farmerName: '' }));
  };

  const handleDeleteFarmer = () => {
    dispatch(deleteFarmer(state?.id))
      .then((res) => {
        if (res?.data?.statusCode === 200) {
          enqueueSnackbar(res?.data?.message, {
            variant: 'success',
          });
          getFarmerList();
          setState((prev) => ({ ...prev, openModal: false, id: '', farmerName: '' }));
        } else {
          getFarmerList();
          setState((prev) => ({ ...prev, openModal: false, id: '', farmerName: '' }));
        }
      })
      .catch((error) => {
        console.log('error');
      });
  };
  
  return (
    <Page title="Farmer List">
      <Container maxWidth={'xl'}>
        <HeaderBreadcrumbs
          heading="Farmer List"
          links={[{ href: PATH_DASHBOARD.farmers.list }]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon={'eva:plus-fill'} />}
              onClick={handleAddUser}
            >
              Add Farmer
            </Button>
          }
        />

        <Card>
          <UserTableToolbar
            filterName={state?.name}
            filterVillage={state?.village}
            onFilterName={handleFilterName}
            onFilterVillage={handleFilterRole}
            onSearch={onSearch}
            placeholderText={'Search by farmer name'}
            placeholderTextSecond={'Search by village name'}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              <Table size={'medium'}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={farmerTableHeader}
                  rowCount={farmerListData?.length}
                  numSelected={selected.length}
                />

                <TableBody>
                  {farmerListData?.length
                    ? farmerListData
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => (
                          <FarmerTableRow
                            key={row.id}
                            row={row}
                            onhandleEditDetails={onhandleEditDetails}
                            onhandleDeleteRow={onhandleDeleteRow}
                            handleShowDetails={handleShowDetails}
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
              count={farmerListData?.length ? farmerListData.length : 0}
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
        handleSubmit={handleDeleteFarmer}
      >
        <DeleteConfirmationContent userName={state?.farmerName} />
      </ConfirmationModal>
    </Page>
  );
}
