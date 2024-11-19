import { paramCase } from 'change-case';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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
import { getEquipmentsList } from 'src/redux/slices/equipment';
import { EquipmentItem } from 'src/@types/equipment';
import EquipmentTableRow from 'src/sections/@dashboard/user/list/EquipmentTableRow';

// ----------------------------------------------------------------------

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
  { id: 'equipment', label: 'Equipment', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
];

// ----------------------------------------------------------------------

export default function EquipmentList() {
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

  const [filterEquipment, setFilterVillage] = useState('');

  const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } = useTabs('all');

  const { equipmentListData } = useSelector((state) => state.equipments);

  console.log('quipmentListData', equipmentListData);

  useEffect(() => {
    getEquipmentsList();
  }, []);

  const onSearch = () => {
    getEquipmentsList(filterName);
  };

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
    (!equipmentListData?.length && !!filterName) ||
    (!equipmentListData?.length && !!filterName) ||
    (!equipmentListData?.length && !!filterStatus);

  return (
    <Page title="equipments List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Equipments List"
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
              New Equipment
            </Button>
          }
        />

        <Card>
          {/* <Tabs
            allowScrollButtonsMobile
            variant="scrollable"
            scrollButtons="auto"
            value={filterStatus}
            onChange={onChangeFilterStatus}
            sx={{ px: 2, bgcolor: 'background.neutral' }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab disableRipple key={tab} label={tab} value={tab} />
            ))}
          </Tabs> */}

          {/* <Divider /> */}

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
                  rowCount={equipmentListData?.length}
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
                  {equipmentListData?.length
                    ? equipmentListData
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row: EquipmentItem) => (
                          <EquipmentTableRow
                            key={row.id}
                            row={row}
                            selected={selected.includes(row.id)}
                            onSelectRow={() => onSelectRow(row.id)}
                            onEditRow={() => handleEditRow(row.name)}
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
