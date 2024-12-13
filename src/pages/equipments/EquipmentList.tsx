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

const TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'equipment', label: 'Equipment', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'action', label: 'Action', align: 'left' },
];

export default function EquipmentList() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    selected,
    onSelectRow,
    onChangePage,
    onChangeRowsPerPage,
    setPage
  } = useTable();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [filterName, setFilterName] = useState('');

  const { enqueueSnackbar } = useSnackbar();

  const [filterVillage, setFilterVillage] = useState('');

  const { currentTab: filterStatus } = useTabs('all');

  const { equipmentListData } = useSelector((state) => state.equipments);

  useEffect(() => {
    getEquipmentsList();
  }, []);

  const onSearch = () => {
    setPage(0)
    getEquipmentsList(filterName,filterVillage);
  };

  const handleFilterName = (filterName: string) => {
    setFilterName(filterName);
  };

  const handleFilteRequipment = (filterVillage: string) => {
    setFilterVillage(filterVillage);
  };

  const handleEditRow = () => {
    // navigate(PATH_DASHBOARD.sevek.edit(paramCase(id)));
  };

  const isNotFound =
    (!equipmentListData?.length && !!filterName) ||
    (!equipmentListData?.length && !!filterName) ||
    (!equipmentListData?.length && !!filterStatus);

  const onhandleEditDetails = (id: string) => {
    dispatch(emptyEquipmentsDetails(null));
    navigate(PATH_DASHBOARD.equipments.edit(id));
  };

  const onhandleDeleteRow = (id: string) => {
    dispatch(deleteEquipment(id))
      .then((res) => {
        if (res?.data?.statusCode === 200) {
          enqueueSnackbar(res?.data?.message, {
            variant: 'success',
          });
          getEquipmentsList();
        } else {
          getEquipmentsList();
        }
      })
      .catch((error) => {
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
            filterName={filterName}
            filterVillage={filterVillage}
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
                  headLabel={TABLE_HEAD}
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
    </Page>
  );
}
