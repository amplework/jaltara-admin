import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import {
  Box,
  Card,
  Table,
  TableBody,
  Container,
  TableContainer,
  TablePagination,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useTabs from '../../hooks/useTabs';
import useTable from '../../hooks/useTable';
// components
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { TableNoData, TableHeadCustom } from '../../components/table';
// sections
import { UserTableToolbar } from '../../sections/@dashboard/user/list';
import { useDispatch, useSelector } from 'src/redux/store';
import { deletePits, getPitsList, startLoading } from 'src/redux/slices/pits';
import { PitItem } from 'src/@types/pits';
import PitTableRow from 'src/sections/@dashboard/user/list/PitTableRow';
import { useSnackbar } from 'notistack';

const TABLE_HEAD = [
  { id: 'name', label: 'Farmer name', align: 'left' },
  { id: 'village', label: 'Village name', align: 'left' },
  { id: 'number of pits', label: 'Pit level', align: 'left' },
  { id: 'stage name', label: 'Stage name', align: 'left' },
  { id: 'update by sevak', label: 'Update by sevak', align: 'left' },
  { id: 'last update', label: 'Last update', align: 'left' },
  { id: 'action', label: 'Action', align: 'left' },
];

export default function PitList() {
  const {
    page,
    order,
    orderBy,
    rowsPerPage,
    selected,
    onChangePage,
    onChangeRowsPerPage,
    setPage,
  } = useTable();

  const stagesName = [
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

  const [filterName, setFilterName] = useState('');

  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

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
    setPage(0)
    const statgesSearch = state.selectStages;
    getPitsList(filterName, filterVillage, statgesSearch);
  };

  const handleFilterName = (filterName: string) => {
    setFilterName(filterName);
  };

  const handleFilterRole = (filterVillage: string) => {
    setFilterVillage(filterVillage);
  };

  const onChange = (value: any) => {
    setState((prev) => ({ ...prev, selectStages: value }));
  };

  const handleShowDetails = (id: string) => {
    navigate(PATH_DASHBOARD.pits.details(id));
  };

  const onhandleDeleteRow = (id: string) => {
    dispatch(deletePits(id))
      .then((res) => {
        if (res?.data?.statusCode === 200) {
          enqueueSnackbar(res?.data?.message, {
            variant: 'success',
          });
          getPitsList();
        } else {
          getPitsList();
        }
      })
      .catch(() => {
        console.log('error');
      });
  };

  const isNotFound =
    (!pitListData?.length && !!filterName) ||
    (!pitListData?.length && !!filterVillage) ||
    (!pitListData?.length && !!filterName) ||
    (!pitListData?.length && !!filterStatus);

  return (
    <Page title="Pits List">
      <Container maxWidth={'xl'}>
        <HeaderBreadcrumbs heading="Pits List" links={[{ href: PATH_DASHBOARD.pits.list }]} />

        <Card>
          <UserTableToolbar
            filterName={filterName}
            filterVillage={filterVillage}
            onFilterName={handleFilterName}
            onFilterVillage={handleFilterRole}
            onSearch={onSearch}
            placeholderText={'Search by farmer name'}
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
                            onhandleDeleteRow={onhandleDeleteRow}
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
