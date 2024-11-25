import { paramCase } from 'change-case';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import {
  Box,
  Tab,
  Tabs,
  Card,
  Table,
  Switch,
  Button,
  Tooltip,
  Divider,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  TablePagination,
  FormControlLabel,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useTabs from '../../hooks/useTabs';
import useSettings from '../../hooks/useSettings';
import useTable, { getComparator, emptyRows } from '../../hooks/useTable';
// @types
import { UserItem, UserManager } from '../../@types/user';
// _mock_
import { _userList } from '../../_mock';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import {
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedActions,
} from '../../components/table';
// sections
import { UserTableToolbar, UserTableRow } from '../../sections/@dashboard/user/list';
import { emptyStatesDetails, emptyUserDetails, getUsersList } from 'src/redux/slices/user';
import { dispatch, useSelector } from 'src/redux/store';
const TABLE_HEAD = [
  // { id: '' },
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'phone', label: 'Phone', align: 'left' },
  { id: 'village', label: 'Village', align: 'left' },
  { id: 'status', label: 'status', align: 'left' },
  { id: 'edit', label: 'edit', align: 'left' },
  { id: 'delete', label: 'delete', align: 'left' },
];

// ----------------------------------------------------------------------

export default function UserList() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettings();

  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);

  const [filterName, setFilterName] = useState('');

  const [filterVillage, setFilterVillage] = useState('');

  const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } = useTabs('all');


  useEffect(() => {
    getUsersList()
  }, [])

  const { userListData, statesList } = useSelector((state) => state.user);

  const onSearch = () => {
    getUsersList(filterName, filterVillage)
  }

  const handleFilterName = (filterName: string) => {
    setFilterName(filterName);
  };

  const handleFilterRole = (filterVillage: string) => {
    setFilterVillage(filterVillage);
  };

  const handleEditRow = (id: string) => {
    // navigate(PATH_DASHBOARD.sevek.edit(paramCase(id)));
  };

  const denseHeight = dense ? 52 : 72;

  const isNotFound =
    (!userListData?.length && !!filterName) ||
    (!userListData?.length && !!filterVillage) ||
    (!userListData?.length && !!filterStatus);

  const handleAddUser = () => {
    dispatch(emptyUserDetails(null))
    dispatch(emptyStatesDetails(null))
    navigate(PATH_DASHBOARD.sevek.create)
  }
  
  const onhandleEditDetails = (id: string) => {
    dispatch(emptyUserDetails(null))
    dispatch(emptyStatesDetails(null))
    navigate(PATH_DASHBOARD.sevek.edit(id))
  }
  const onhandleDeleteRow=(id:string)=>{
  }

  return (
    <Page title="Seveks List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Seveks List"
          links={[
            { href: PATH_DASHBOARD.sevek.root },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon={'eva:plus-fill'} />}
              onClick={handleAddUser}
            >
              New Sevek
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
            placeholderText={"Search by sevak name"}
            placeholderTextSecond={"Search by village name"}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              <Table size={'medium'}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={userListData?.length}
                  numSelected={selected.length}
                />

                <TableBody>
                  {userListData?.length ? userListData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <UserTableRow
                        key={row.id}
                        row={row}
                        selected={selected.includes(row.id)}
                        onSelectRow={() => onSelectRow(row.id)}
                        // onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={() => handleEditRow(row.name)}
                        onhandleEditDetails={onhandleEditDetails}
                        onhandleDeleteRow={onhandleDeleteRow}
                      />
                    )) : null}
                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <Box sx={{ position: 'relative' }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={userListData?.length ? userListData.length : 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
            />

            <FormControlLabel
              control={<Switch checked={dense} onChange={onChangeDense} />}
              label="Dense"
              sx={{ px: 3, py: 1.5, top: 0, position: { md: 'absolute' } }}
            />
          </Box>
        </Card>
      </Container>
    </Page>
  );
}
