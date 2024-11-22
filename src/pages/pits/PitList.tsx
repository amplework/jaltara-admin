import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
import { getPitsList } from 'src/redux/slices/pits';
import { PitItem } from 'src/@types/pits';
import PitTableRow from 'src/sections/@dashboard/user/list/PitTableRow';

// ----------------------------------------------------------------------


const TABLE_HEAD = [
  { id: '' },
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'village', label: 'Village', align: 'left' },
  { id: 'number of pits', label: 'Number Of Pits', align: 'left' },
];

// ----------------------------------------------------------------------

export default function PitList() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    //
    selected,
    onSelectRow,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettings();

  const [filterName, setFilterName] = useState('');

  const [filterVillage, setFilterVillage] = useState('');

  const { currentTab: filterStatus } = useTabs('all');

  const {pitListData} = useSelector((state) => state.pits)
  
  useEffect(()=>{
    getPitsList()
  },[])

  const onSearch = () => {
    getPitsList(filterName, filterVillage)
  }

  const handleFilterName = (filterName: string) => {
    setFilterName(filterName);
  };

  const handleFilterRole = (filterVillage: string) => {
    setFilterVillage(filterVillage);
  };

  const handleEditRow = () => {
    // navigate(PATH_DASHBOARD.sevek.edit(paramCase(id)));
  };


  const isNotFound =
    (!pitListData?.length && !!filterName) ||
    (!pitListData?.length && !!filterVillage) ||
    (!pitListData?.length && !!filterName) ||
    (!pitListData?.length && !!filterStatus);

  return (
    <Page title="Pits List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Pits List"
          links={[
            // { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { href: PATH_DASHBOARD.sevek.root },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.sevek.new}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              New Pit
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
            placeholderTextSecond={"Search by stage name"}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>

              <Table size={'medium'}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={pitListData?.length}
                  numSelected={selected.length}
                />

                <TableBody>
                  {pitListData?.length ? pitListData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row : PitItem) => (
                      <PitTableRow
                        key={row.userData.id}
                        row={row}
                        selected={selected.includes(row.userData.id)}
                        onSelectRow={() => onSelectRow(row.userData.id)}
                        // onDeleteRow={() => handleDeleteRow(row.id)}
                        // onEditRow={() => handleEditRow(row.userData.name)}
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
              count={pitListData?.length ? pitListData.length : 0}
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
