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
import useTable from '../../hooks/useTable';
// @types
// _mock_
import { _userList } from '../../_mock';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { TableNoData, TableHeadCustom } from '../../components/table';
// sections
import { UserTableToolbar } from '../../sections/@dashboard/user/list';
import { useSelector } from 'src/redux/store';
import { getPitsList } from 'src/redux/slices/pits';
import { PitItem } from 'src/@types/pits';
import PitTableRow from 'src/sections/@dashboard/user/list/PitTableRow';

const TABLE_HEAD = [
  { id: 'name', label: 'Farmer name', align: 'left' },
  { id: 'village', label: 'Village name', align: 'left' },
  { id: 'number of pits', label: 'Pit level', align: 'left' },
  { id: 'stage name', label: 'Stage name', align: 'left' },
  { id: 'update by sevek', label: 'Update by sevek', align: 'left' },
  { id: 'last update', label: 'Last update', align: 'left' },
  // { id: 'edit', label: 'edit', align: 'left' },
  { id: 'delete', label: 'delete', align: 'left' },
];

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

  const stagesName = [
    // {
    //   id: '5',
    //   name: '',
    //   value: 'all',
    //   label: 'All',
    // },
    {
      id: '1',
      name: 'marking',
      value: 'marking',
      label: 'Marking',
    },
    {
      id: '2',
      name: 'digging',
      value: 'digging',
      label: 'Digging',
    },
    {
      id: '3',
      name: 'filling',
      value: 'filling',
      label: 'Filling',
    },
    {
      id: '4',
      name: 'maintenance',
      value: 'maintenance',
      label: 'Maintenance',
    },
  ];

    const navigate = useNavigate();

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


  const handleShowDetails = (id: string) => {
    navigate(PATH_DASHBOARD.pits.details(id));
  };

  const isNotFound =
    (!pitListData?.length && !!filterName) ||
    (!pitListData?.length && !!filterVillage) ||
    (!pitListData?.length && !!filterName) ||
    (!pitListData?.length && !!filterStatus);

  return (
    <Page title="Pits List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs heading="Pits List" links={[{ href: PATH_DASHBOARD.pits.list }]} />

        <Card>
          <UserTableToolbar
            filterName={filterName}
            filterVillage={filterVillage}
            onFilterName={handleFilterName}
            onFilterVillage={handleFilterRole}
            onSearch={onSearch}
            placeholderText={'Search by Sevek name'}
            placeholderTextSecond={'Search by village name'}
            pits={true}
            stagesName={stagesName}
            onChange={onChange}
            state={state}
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
                        .map((row: PitItem) => (
                          <PitTableRow
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
