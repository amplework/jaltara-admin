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
import { getUsersList } from 'src/redux/slices/user';
import { dispatch, useSelector } from 'src/redux/store';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['all', 'active', 'banned'];

const ROLE_OPTIONS = [
  'all',
  'ux designer',
  'full stack designer',
  'backend developer',
  'project manager',
  'leader',
  'ui designer',
  'ui/ux designer',
  'front end developer',
  'full stack developer',
];

const TABLE_HEAD = [
  { id: '' },
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'phone', label: 'Phone', align: 'left' },
  { id: 'village', label: 'Village', align: 'left' },
  { id: 'status', label: 'status', align: 'left' },
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

  const { userListData } = useSelector((state) => state.user);

  console.log('userListData', userListData);
  
  useEffect(()=>{
    getUsersList()
  },[])

  const onSearch = () => {
    getUsersList(filterName, filterVillage)
  }

  const handleFilterName = (filterName: string) => {
    setFilterName(filterName);
  };

  const handleFilterRole = (filterVillage: string) => {
    setFilterVillage(filterVillage);
  };

  // const handleDeleteRow = (id: string) => {
  //   const deleteRow = tableData.filter((row) => row.id !== id);
  //   setSelected([]);
  //   setTableData(deleteRow);
  // };

  // const handleDeleteRows = (selected: string[]) => {
  //   const deleteRows = tableData.filter((row) => !selected.includes(row.id));
  //   setSelected([]);
  //   setTableData(deleteRows);
  // };

  const handleEditRow = (id: string) => {
    navigate(PATH_DASHBOARD.user.edit(paramCase(id)));
  };

  // let dataFiltered = applySortFilter({
  //   userListData,
  //   comparator: getComparator(order, orderBy),
  //   filterName,
  //   filterRole,
  //   filterStatus,
  // });

  const denseHeight = dense ? 52 : 72;

  const isNotFound =
    (!userListData?.length && !!filterName) ||
    (!userListData?.length && !!filterVillage) ||
    (!userListData?.length && !!filterStatus);

  return (
    <Page title="Users List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Users List"
          links={[
            // { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { href: PATH_DASHBOARD.user.root },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.user.new}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              New User
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
              {/* {selected.length > 0 && (
                <TableSelectedActions
                  dense={dense}
                  numSelected={selected.length}
                  rowCount={userListData?.length || 0}
                  // onSelectAllRows={(checked) =>
                  //   onSelectAllRows(
                  //     checked,
                  //     tableData.map((row) => row.id)
                  //   )
                  // }
                  // actions={
                  //   <Tooltip title="Delete">
                  //     <IconButton color="primary" onClick={() => handleDeleteRows(selected)}>
                  //       <Iconify icon={'eva:trash-2-outline'} />
                  //     </IconButton>
                  //   </Tooltip>
                  // }
                />
              )} */}

              <Table size={'medium'}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={userListData?.length}
                  numSelected={selected.length}
                  // onSort={onSort}
                  // onSelectAllRows={(checked) =>
                  //   onSelectAllRows(
                  //     checked,
                  //     tableData.map((row) => row.id)
                  //   )
                  // }
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
                      />
                    )) : null}

                  {/* <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                  /> */}

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

// ----------------------------------------------------------------------

function applySortFilter({
  tableData,
  comparator,
  filterName,
  filterStatus,
  filterRole,
}: {
  tableData: UserItem[];
  comparator: (a: any, b: any) => number;
  filterName: string;
  filterStatus: string;
  filterRole: string;
}) {
  const stabilizedThis = tableData.map((el:any, index:any) => [el, index] as const);

  stabilizedThis.sort((a:any, b:any) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    tableData = tableData.filter(
      (item: Record<string, any>) =>
        item.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterStatus !== 'all') {
    tableData = tableData.filter((item: Record<string, any>) => item.status === filterStatus);
  }

  if (filterRole !== 'all') {
    tableData = tableData.filter((item: Record<string, any>) => item.role === filterRole);
  }

  return tableData;
}
