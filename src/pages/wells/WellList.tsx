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
import { wellTableHeader } from 'src/mockUp/Well';

// ----------------------------------------------------------------------

export default function WellList() {
  const { page, order, orderBy, rowsPerPage, setPage, onChangePage, onChangeRowsPerPage } =
    useTable();

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  const [state, setState] = useState({ name: '', village: '' });

  const { currentTab: filterStatus } = useTabs('all');

  useEffect(() => {
    getWillsList();
  }, []);

  const { wellsListData } = useSelector((state) => state.wells);

  const onSearch = () => {
    setPage(0);
    getWillsList(state?.name, state?.village);
  };

  const handleFilterName = (filterName: string) => {
    setState((prev) => ({ ...prev, name: filterName }));
  };

  const handleFilterRole = (filterVillage: string) => {
    setState((prev) => ({ ...prev, village: filterVillage }));
  };

  const handleShowDetails = (id: string) => {
    navigate(PATH_DASHBOARD.wells.details(id));
  };

  const isNotFound =
    (!wellsListData?.length && !!state?.name) ||
    (!wellsListData?.length && !!state?.village) ||
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
            filterName={state?.name}
            filterVillage={state?.village}
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
                  headLabel={wellTableHeader}
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
