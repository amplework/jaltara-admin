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
import { deleteTutorial, emptyTutorialDetails, getTutorialList } from 'src/redux/slices/tutorial';
import LoadingScreen from 'src/components/LoadingScreen';
import ConfirmationModal from 'src/components/modal/Confirmation';
import { DeleteConfirmationContent } from 'src/pages/sevak/DeleteConfirmationContent';

// ----------------------------------------------------------------------

export const statusList = [
  { id: 'active', label: 'Active', name: 'active' },
  { id: 'inactive', label: 'Inactive', name: 'inactive' },
];

const TABLE_HEAD = [
  { id: 'tutorial', label: 'Training Subject Name', align: 'left' },
  { id: 'video', label: 'Video Count', align: 'left' },
  // { id: 'status', label: 'Status', align: 'left' },
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
    openDeleteModal: false,
    TutorialName: '',
  });

  const { currentTab: filterStatus } = useTabs('all');

  useEffect(() => {
    handleTutorialListing();
  }, []);

  const handleTutorialListing = () => {
    getTutorialList();
  };

  const { tutorialList, isLoading } = useSelector((state) => state.tutorials);

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

  const onDeleteRow = (id: string,name:string) => {
    setState((prev) => ({ ...prev, openDeleteModal: true, id: id, TutorialName: name }));
  };

  const onEditRow = (id: string) => {
    emptyTutorialDetails();
    navigate(PATH_DASHBOARD.masterdata.tutorialEdit(id));
  };

  const handleDeleteClose = () => {
    setState((prev) => ({ ...prev, openDeleteModal: false, id: '', TutorialName: '' }));
  };

   const handleDeleteTutorial = () => {
    dispatch(deleteTutorial(state?.id))
      .then((res) => {
        if (res?.data?.statusCode === 200) {
          enqueueSnackbar(res?.data?.message, {
            variant: 'success',
          });
          handleTutorialListing();
          setState((prev) => ({ ...prev, openDeleteModal: false, id: '', TutorialName: '' }));

        } else {
          handleTutorialListing();
          setState((prev) => ({ ...prev, openDeleteModal: false, id: '', TutorialName: '' }));

        }
      })
      .catch((error) => {
        console.log('error');
      });
    };

  return (
    <Page title="Training List">
      <Container maxWidth={'xl'}>
        <HeaderBreadcrumbs
          heading="Training List"
          links={[{ href: PATH_DASHBOARD.masterdata.create }]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon={'eva:plus-fill'} />}
              onClick={handleAddCrop}
            >
              Add Training
            </Button>
          }
        />

        <Card sx={{ pt:2 }}>
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

                  {isLoading ? (
                    <LoadingScreen isDashboard={true} />
                  ) : (
                    <TableNoData isNotFound={isNotFound && !isLoading} />
                  )}
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

      <ConfirmationModal
        openModal={state.openDeleteModal}
        // isLoading={isLoading}
        handleClose={handleDeleteClose}
        title={'Delete Confirmation!'}
        handleSubmit={handleDeleteTutorial}
      >
        <DeleteConfirmationContent userName={state?.TutorialName} />
      </ConfirmationModal>
    </Page>
  );
}
