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
import { useSelector } from 'src/redux/store';
import { getPitsList } from 'src/redux/slices/pits';
import { PitItem } from 'src/@types/pits';
import PitTableRow from 'src/sections/@dashboard/user/list/PitTableRow';
import useTable from 'src/hooks/useTable';
import useSettings from 'src/hooks/useSettings';
import useTabs from 'src/hooks/useTabs';
import Page from 'src/components/Page';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from 'src/routes/paths';
import Iconify from 'src/components/Iconify';
import { UserTableToolbar } from 'src/sections/@dashboard/user/list';
import Scrollbar from 'src/components/Scrollbar';
import { TableHeadCustom, TableNoData } from 'src/components/table';
import LocationTableRow from 'src/sections/@dashboard/user/list/LocationTableRow';

const TABLE_HEAD = [
  { id: 'village', label: 'Village Name', align: 'left' },
  { id: 'district', label: 'District', align: 'left' },
  { id: 'state', label: 'State', align: 'left' },
  { id: 'noUser', label: 'No Of User', align: 'left' },
//   { id: 'update by sevek', label: 'Update by sevek', align: 'left' },
  { id: 'last update', label: 'Last update', align: 'left' },
  { id: 'delete', label: 'delete', align: 'left' },
];

export default function LocationList() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    selected,
    onSelectRow,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettings();

  const [filterName, setFilterName] = useState('');

  const [filterVillage, setFilterVillage] = useState('');

  const [state, setState] = useState({
    selectStages: '',
  });

  const { currentTab: filterStatus } = useTabs('all');

  useEffect(() => {
    getPitsList();
  }, []);

  const { pitListData } = useSelector((state) => state.pits);
  const onSearch = () => {
    const statgesSearch = state.selectStages;
    getPitsList(filterName, filterVillage, statgesSearch);
  };

  const handleFilterName = (filterName: string) => {
    setFilterName(filterName);
  };

  const handleFilterRole = (filterVillage: string) => {
    setFilterVillage(filterVillage);
  };

  const handleEditRow = () => {
    // navigate(PATH_DASHBOARD.sevek.edit(paramCase(id)));
  };
  const onChange = (value: any) => {
    setState((prev) => ({ ...prev, selectStages: value }));
  };

  const isNotFound =
    (!pitListData?.length && !!filterName) ||
    (!pitListData?.length && !!filterVillage) ||
    (!pitListData?.length && !!filterName) ||
    (!pitListData?.length && !!filterStatus);

  return (
    <Page title="location">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Location"
          links={[
            // { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { href: PATH_DASHBOARD.sevak.root },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.sevak.new}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              New Location
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
            placeholderText={'Search by Sevek name'}
            placeholderTextSecond={'Search by village name'}
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
                  {pitListData?.length
                    ? pitListData
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row: PitItem) => <LocationTableRow key={row.id} row={row} />)
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
              count={pitListData?.length ? pitListData.length : 0}
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
