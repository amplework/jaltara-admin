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

import { useDispatch, useSelector } from 'src/redux/store';
import { deleteCrops, getCropsList } from 'src/redux/slices/crops';
import { useSnackbar } from 'notistack';
import useTable from 'src/hooks/useTable';
import useTabs from 'src/hooks/useTabs';
import Page from 'src/components/Page';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from 'src/routes/paths';
import Iconify from 'src/components/Iconify';
import Scrollbar from 'src/components/Scrollbar';
import { TableHeadCustom, TableNoData } from 'src/components/table';
import TutorialTableRow from 'src/sections/@dashboard/user/list/TutorialTableRow';
import { emptyTutorialDetails, getTutorialList } from 'src/redux/slices/tutorial';

// ----------------------------------------------------------------------

export const statusList = [
  { id: 'active', label: 'Active', name: 'active' },
  { id: 'inactive', label: 'Inactive', name: 'inactive' },
];

const TABLE_HEAD = [
  { id: 'tutorial', label: 'Tutorial Subject Name', align: 'left' },
  { id: 'video', label: 'Video Count', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'action', label: 'Action', align: 'left' },
];

export default function TutorialsList() {
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

  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [state, setState] = useState({
    openModal: false,
    filterName: '',
    filterStatus: '',
    id: '',
  });

  const { currentTab: filterStatus } = useTabs('all');

  useEffect(() => {
    handleTutorialListing();
  }, []);

  const handleTutorialListing = () => {
    getTutorialList();
  };

  const { tutorialList } = useSelector((state) => state.tutorials);

  const onSearch = () => {
    getCropsList(state.filterName, state.filterStatus);
  };

  const handleFilterName = (filterName: string) => {
    setState((prev) => ({ ...prev, filterName: filterName }));
  };

  const handleShowDetails = (id: string) => {
    emptyTutorialDetails();
    navigate(PATH_DASHBOARD.masterdata.tutorialDetails(id));
  };

  const isNotFound =
    (!tutorialList?.length && !!state.filterName) ||
    (!tutorialList?.length && !!state.filterStatus) ||
    (!tutorialList?.length && !!state.filterName) ||
    (!tutorialList?.length && !!filterStatus);

  const handleAddCrop = () => {
    emptyTutorialDetails();
    navigate(PATH_DASHBOARD.masterdata.tutorialCreate);
  };

  const onDeleteRow = (id: string) => {
    dispatch(deleteCrops(id))
      .then((res) => {
        if (res?.data?.statusCode === 200) {
          enqueueSnackbar(res?.data?.message, {
            variant: 'success',
          });
          handleTutorialListing();
        } else {
          handleTutorialListing();
        }
      })
      .catch((error) => {
        console.log('error');
      });
  };

  const onEditRow = (id: string) => {
    emptyTutorialDetails();
    navigate(PATH_DASHBOARD.masterdata.tutorialEdit(id));
  };

  return (
    <Page title="Tutorial List">
      <Container maxWidth={'xl'}>
        <HeaderBreadcrumbs
          heading="Tutorial List"
          links={[{ href: PATH_DASHBOARD.masterdata.create }]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon={'eva:plus-fill'} />}
              onClick={handleAddCrop}
            >
              Add Tutorial
            </Button>
          }
        />

        <Card>
          {/* <UserTableToolbar
            filterName={state.filterName}
            filterVillage={state.filterStatus}
            onFilterName={handleFilterName}
            onSearch={onSearch}
            placeholderText={'Search by crop name'}
            placeholderTextSecond={'Search by status'}
            challenges={true}
            state={state}
            onChange={onChange}
          /> */}

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              <Table size={'medium'}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tutorialList?.length}
                  numSelected={selected.length}
                />

                <TableBody>
                  {tutorialList?.length
                    ? tutorialList
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row: any) => (
                          <TutorialTableRow
                            key={row.id}
                            row={row}
                            onDeleteRow={onDeleteRow}
                            onEditRow={onEditRow}
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
              count={tutorialList?.length ? tutorialList.length : 0}
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
