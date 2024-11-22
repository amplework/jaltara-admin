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
import useSettings from '../../hooks/useSettings';
import useTable, {  } from '../../hooks/useTable';
// @types
import { UserItem } from '../../@types/user';
// _mock_
import { _userList } from '../../_mock';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import {
  TableNoData,
  TableHeadCustom,
} from '../../components/table';
// sections
import { UserTableToolbar } from '../../sections/@dashboard/user/list';
import { useSelector } from 'src/redux/store';
import { getFarmerList } from 'src/redux/slices/farmers';
import FarmerTableRow from 'src/sections/@dashboard/user/list/FarmerTableRow';
const TABLE_HEAD = [
  // { id: '' },
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'land', label: 'Land (acres)', align: 'left' },
  { id: 'village', label: 'Village', align: 'left' },
  { id: 'language', label: 'Language', align: 'left' },
  { id: 'pits', label: `Total pit's`, align: 'left' },
  { id: 'edit', label: 'Edit', align: 'left' },
  { id: 'delete', label: 'Delete', align: 'left' },
];


export default function FarmersList() {
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

  const [filterName, setFilterName] = useState('');

  const [filterVillage, setFilterVillage] = useState('');

  const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } = useTabs('all');


  useEffect(() => {
    getFarmerList()
  }, [])

  const { farmerListData } = useSelector((state) => state.farmer);

  const onSearch = () => {
    getFarmerList(filterName, filterVillage)
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
    (!farmerListData?.length && !!filterName) ||
    (!farmerListData?.length && !!filterVillage) ||
    (!farmerListData?.length && !!filterStatus);

  const handleAddUser = () => {
    navigate(PATH_DASHBOARD.farmers.new)
  }
  
  const onhandleEditDetails = (id: string) => {
    // navigate(PATH_DASHBOARD.sevek.create(id))
  }
  const onhandleDeleteRow=(id:string)=>{

  }

  return (
    <Page title="Farmer List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Farmer List"
          links={[
            { href: PATH_DASHBOARD.sevek.root },
          ]}
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
            placeholderText={"Search by farmer name"}
            placeholderTextSecond={"Search by village name"}
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
                  {farmerListData?.length ? farmerListData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <FarmerTableRow
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
              count={farmerListData?.length ? farmerListData.length : 0}
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
  const stabilizedThis = tableData.map((el: any, index: any) => [el, index] as const);

  stabilizedThis.sort((a: any, b: any) => {
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
