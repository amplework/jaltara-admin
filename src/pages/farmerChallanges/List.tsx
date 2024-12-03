import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import {
  Box,
  Card,
  Table,
  Switch,
  Button,
  TableBody,
  Container,
  TableContainer,
  TablePagination,
  FormControlLabel,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useTabs from '../../hooks/useTabs';

import useTable from '../../hooks/useTable';
// @types
import { UserItem } from '../../@types/user';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { TableNoData, TableHeadCustom } from '../../components/table';
// sections
import { UserTableToolbar } from '../../sections/@dashboard/user/list';
import { useDispatch, useSelector } from 'src/redux/store';
import { emptyFarmerDetails, getFarmerList } from 'src/redux/slices/farmers';
import FarmerTableRow from 'src/sections/@dashboard/user/list/FarmerTableRow';
import { emptyStatesDetails } from 'src/redux/slices/user';
const TABLE_HEAD = [
  // { id: '' },
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'land', label: 'Land (acres)', align: 'left' },
  { id: 'village', label: 'Village', align: 'left' },
  { id: 'language', label: 'Language', align: 'left' },
  { id: 'pits', label: `Total pit's`, align: 'left' },
  { id: 'action', label: 'Action', align: 'left' },
];

export default function FarmerChallangesList() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [filterName, setFilterName] = useState('');

  const [filterVillage, setFilterVillage] = useState('');

  const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } = useTabs('all');

  useEffect(() => {
    getFarmerList();
  }, []);

  const { farmerListData } = useSelector((state) => state.farmer);

  const onSearch = () => {
    getFarmerList(filterName, filterVillage);
  };

  const handleFilterName = (filterName: string) => {
    setFilterName(filterName);
  };

  const handleFilterRole = (filterVillage: string) => {
    setFilterVillage(filterVillage);
  };

  const handleEditRow = (id: string) => {
    // navigate(PATH_DASHBOARD.sevek.edit(paramCase(id)));
  };

  const isNotFound =
    (!farmerListData?.length && !!filterName) ||
    (!farmerListData?.length && !!filterVillage) ||
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

  const onhandleDeleteRow = (id: string) => {};
  const handleShowDetails = (id: string) => {
    navigate(PATH_DASHBOARD.farmers.details(id));
  };

  return (
    <Page title="Farmer List">
      <Container maxWidth={'xl'}>
        <HeaderBreadcrumbs
          heading="Farmer List"
          links={[{ href: PATH_DASHBOARD.sevak.root }]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon={'eva:plus-fill'} />}
              onClick={handleAddUser}
            >
              New Farmer
            </Button>
          }
        />

        <Card>
          <UserTableToolbar
            filterName={filterName}
            filterVillage={filterVillage}
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
                  headLabel={TABLE_HEAD}
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
    </Page>
  );
}
