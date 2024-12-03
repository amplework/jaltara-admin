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
import useSettings from '../../hooks/useSettings';
import useTable from '../../hooks/useTable';
// _mock_
import { _userList } from '../../_mock';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { TableNoData, TableHeadCustom } from '../../components/table';
// sections
import { UserTableToolbar, UserTableRow } from '../../sections/@dashboard/user/list';
import {
  deleteSevak,
  emptyStatesDetails,
  emptyUserDetails,
  getUsersList,
} from 'src/redux/slices/user';
import { dispatch, useSelector } from 'src/redux/store';
import { useSnackbar } from 'notistack';
const TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'phone', label: 'Phone', align: 'left' },
  { id: 'village', label: 'Village', align: 'left' },
  { id: 'status', label: 'status', align: 'left' },
  { id: 'action', label: 'Action', align: 'left' },
];

// ----------------------------------------------------------------------

export default function UserList() {
  const {
    page,
    order,
    orderBy,
    rowsPerPage,
    selected,
    onSelectRow,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettings();

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const [filterName, setFilterName] = useState('');

  const [filterVillage, setFilterVillage] = useState('');

  const { currentTab: filterStatus } = useTabs('all');

  useEffect(() => {
    getUsersList();
  }, []);

  const { userListData } = useSelector((state) => state.user);

  const onSearch = () => {
    getUsersList(filterName, filterVillage);
  };

  const handleFilterName = (filterName: string) => {
    setFilterName(filterName);
  };

  const handleFilterRole = (filterVillage: string) => {
    setFilterVillage(filterVillage);
  };

  const handleEditRow = () => {
    // navigate(PATH_DASHBOARD.sevak.edit(paramCase(id)));
  };

  const isNotFound =
    (!userListData?.length && !!filterName) ||
    (!userListData?.length && !!filterVillage) ||
    (!userListData?.length && !!filterStatus);

  const handleAddUser = () => {
    dispatch(emptyUserDetails(null));
    dispatch(emptyStatesDetails(null));
    navigate(PATH_DASHBOARD.sevak.create);
  };

  const onhandleEditDetails = (id: string) => {
    dispatch(emptyUserDetails(null));
    dispatch(emptyStatesDetails(null));
    navigate(PATH_DASHBOARD.sevak.edit(id));
  };
  
  const onhandleDeleteRow = (id: string) => {
    dispatch(deleteSevak(id))
      .then((res) => {
        if (res?.data?.statusCode === 200) {
          enqueueSnackbar(res?.data?.message, {
            variant: 'success',
          });
          getUsersList();
        } else {
          getUsersList();
        }
      })
      .catch((error) => {
        console.log('error');
      });
  };

  const handleShowDetails = (id: string) => {
    navigate(PATH_DASHBOARD.sevak.details(id));
  };

  return (
    <Page title="Sevaks List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Sevaks List"
          links={[{ href: PATH_DASHBOARD.sevak.root }]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon={'eva:plus-fill'} />}
              onClick={handleAddUser}
            >
              New Sevak
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
            placeholderText={'Search by sevak name'}
            placeholderTextSecond={'Search by village name'}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              <Table>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={userListData?.length}
                  numSelected={selected.length}
                />

                <TableBody>
                  {userListData?.length
                    ? userListData
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => (
                          <UserTableRow
                            key={row.id}
                            row={row}
                            selected={selected.includes(row.id)}
                            onSelectRow={() => onSelectRow(row.id)}
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
              count={userListData?.length ? userListData.length : 0}
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
