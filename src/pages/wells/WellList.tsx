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
import { deleteWells, getWillsList } from 'src/redux/slices/wells';
import { useDispatch, useSelector } from 'src/redux/store';
import WellsTableRow from 'src/sections/@dashboard/user/list/WellsTableRow';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'village', label: 'Village name', align: 'left' },
  { id: 'level', label: 'Level', align: 'left' },
  { id: 'update by sevak', label: 'Update by sevak', align: 'left' },
  { id: 'last update', label: 'Last update', align: 'left' },
  { id: 'action', label: 'Action', align: 'left' },
];

export default function WellList() {
  const { page, order, orderBy, rowsPerPage, setPage, onChangePage, onChangeRowsPerPage } =
    useTable();

  const navigate = useNavigate();

  const [filterName, setFilterName] = useState('');

  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  const [filterVillage, setFilterVillage] = useState('');

  const [filterRole, setFilterRole] = useState('all');

  const { currentTab: filterStatus } = useTabs('all');

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

  const onhandleDeleteRow = (id: string) => {
    dispatch(deleteWells(id))
      .then((res) => {
        if (res?.data?.statusCode === 200) {
          enqueueSnackbar(res?.data?.message, {
            variant: 'success',
          });
          getWillsList();
        } else {
          getWillsList();
        }
      })
      .catch(() => {
        console.log('error');
      });
  };

  return (
    <Page title="Well: List">
      <Container maxWidth={'xl'}>
        <HeaderBreadcrumbs
          heading="Well List"
          links={[{ href: PATH_DASHBOARD.wells.list }]}
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
            placeholderText={'Search by sevak name'}
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
