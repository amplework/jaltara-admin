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
import { UserManager } from '../../@types/user';
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
import { getWillsList } from 'src/redux/slices/wells';
import { useSelector } from 'src/redux/store';
import WellsTableRow from 'src/sections/@dashboard/user/list/WellsTableRow';

// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'village', label: 'Village name', align: 'left' },
  { id: 'level', label: 'Level', align: 'left' },
  { id: 'update by sevek', label: 'Update by sevek', align: 'left' },
  { id: 'last update', label: 'Last update', align: 'left' },
  // { id: 'edit', label: 'edit', align: 'left' },
  { id: 'delete', label: 'delete', align: 'left' },
];

export default function WellList() {
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

  const [filterRole, setFilterRole] = useState('all');

  const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } = useTabs('all');

  useEffect(() => {
    getWillsList();
  }, []);

  const { wellsListData } = useSelector((state) => state.wells);

  const onSearch = () => {
    getWillsList(filterName, filterVillage);
  };
  const handleFilterName = (filterName: string) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleFilterRole = (filterVillage: string) => {
    setFilterVillage(filterVillage);
  };

  const handleShowDetails = (id: string) => {
    navigate(PATH_DASHBOARD.wells.details(id));
  };

  const isNotFound =
    (!wellsListData?.length && !!filterName) ||
    (!wellsListData?.length && !!filterRole) ||
    (!wellsListData?.length && !!filterStatus);

  return (
    <Page title="Well: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Well List"
          links={[
            { href: PATH_DASHBOARD.wells.list },
          ]}
          // action={
          //   <Button
          //     variant="contained"
          //     startIcon={<Iconify icon={'eva:plus-fill'} />}
          //     onClick={handleAddWells}
          //   >
          //     New Wells
          //   </Button>
          // }
        />

        <Card>
          <UserTableToolbar
            filterName={filterName}
            filterVillage={filterVillage}
            onFilterVillage={handleFilterRole}
            onFilterName={handleFilterName}
            onSearch={onSearch}
            placeholderText={'Search by Sevek name'}
            placeholderTextSecond={'Search by village name'}
            pits={false}
          />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              <Table size={'medium'}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={wellsListData?.length}
                />

                <TableBody>
                  {wellsListData?.length
                    ? wellsListData
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row: any) => (
                          <WellsTableRow
                            key={row.id}
                            row={row}
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
              count={wellsListData?.length ? wellsListData.length : 0}
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
