import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
// @mui
import {
  Box,
  Card,
  Table,
  TableBody,
  Container,
  TableContainer,
  TablePagination,
  Button,
} from '@mui/material';
import { useDispatch, useSelector } from 'src/redux/store';
import useTable from 'src/hooks/useTable';
import useTabs from 'src/hooks/useTabs';
import Page from 'src/components/Page';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from 'src/routes/paths';
import Scrollbar from 'src/components/Scrollbar';
import { TableHeadCustom, TableNoData, TableSkeleton } from 'src/components/table';
import {
  addLocationsDetails,
  deleteVillage,
  editLocationsDetails,
  getLocationDetails,
  getVillageListing,
  getVillageLocationList,
  setEmptyLocationData,
} from 'src/redux/slices/locations';
import { LocationAdd, LocationListing } from 'src/@types/location';
import MasterDataForm from 'src/components/modal/MasterDataForm';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { emptyDistrictList, emptyStatesDetails, getStatesList } from 'src/redux/slices/user';
import { useSnackbar } from 'notistack';
import Iconify from 'src/components/Iconify';
import ConfirmationModal from 'src/components/modal/Confirmation';
import { DeleteConfirmationContent } from '../../sevak/DeleteConfirmationContent';
import VillageTableRow from 'src/sections/@dashboard/user/list/VillageTableRow';
import StateForm from './StateForm';
import { UserTableToolbar } from 'src/sections/@dashboard/user/list';

const TABLE_HEAD = [
  { id: 'state', label: 'State Name', align: 'left' },
  { id: 'code', label: 'Code', align: 'left' },
  // { id: 'district', label: 'District', align: 'left' },
  // { id: 'state', label: 'State', align: 'left' },
  { id: 'nofarmer', label: 'Farmer Count', align: 'left' },
  { id: 'action', label: 'Action', align: 'left' },
];

export const StateLocationList = [{ id: 'state', label: 'State', name: 'State', value: 'state' }];

export default function StateList() {
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

  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  const [state, setState] = useState({
    id: '',
    selectStages: '',
    openModal: false,
    villageId: null,
    parentId: '',
    stateId: '',
    districtId: '',
    talukId: '',
    isLoading: false,
    openDeleteModal: false,
    VillageName: '',
    filterName: '',
    filterVillage: '',
  });
  // console.log('state', state);

  const { currentTab: filterStatus } = useTabs('all');

  useEffect(() => {
    handleLocationList();
    // handleSetLocation()
  }, []);

  const handleLocationList = () => {
    getVillageLocationList('', '', 'state');
    // getVillageListing()
  };

  const handleLocationDetails = () => {
    setState((prev: any) => ({ ...prev, isLoading: true }));
    getLocationDetails(state?.id);
  };

  const { locationData, villageList, isLoading } = useSelector((state) => state.locations);

  useEffect(() => {
    dispatch(emptyDistrictList(null));
    if (locationData?.id && state?.id) {
      setState((prev: any) => ({ ...prev, isLoading: true, parentId: locationData?.id }));
      setValue('location', locationData?.checkUpperGeo?.entityType);
      setValue('name', locationData?.checkUpperGeo?.name);
      setState((prev: any) => ({ ...prev, isLoading: false, parentId: locationData?.id }));
    }
  }, [locationData?.id, state?.id]);

  const defaultValues = useMemo(
    () => ({
      location: '',
      name: '',
    }),
    []
  );

  const NewLocationSchema = Yup.object().shape({
    location: Yup.string().required('Location is required'),
    name: Yup.string()
      .required('Name is required')
      .matches(/^[^\s].*$/, 'First Characters space not allowed.')
      .max(50, 'Limit of 50 characters'),
  });

  const methods = useForm<LocationAdd>({
    resolver: yupResolver(NewLocationSchema),
    defaultValues,
  });

  const { clearErrors, setValue, watch } = methods;

  const fieldsToClear = ['location', 'name', 'selectDistrict', 'selectStates', 'selectTaluk'];

  const isNotFound =
    (!villageList?.length && !!state.filterName) ||
    (!villageList?.length && !!state.filterVillage) ||
    (!villageList?.length && !!state.filterName) ||
    (!villageList?.length && !!filterStatus);

  const handleLocationChange = () => {
    getStatesList();
    setValue('name', '');
  };

  const onhandleEditDetails = (id: string) => {
    // dispatch(emptyDistrictList(null));
    setState((prev) => ({ ...prev, openModal: true, id: id, isLoading: true }));
  };

  const handleClose = () => {
    dispatch(emptyDistrictList(null));
    setState((prev) => ({ ...prev, openModal: false, id: '', isLoading: false }));
    fieldsToClear.forEach((field: any) => clearErrors(field));
  };

  const handleAddUser = () => {
    setState((prev) => ({ ...prev, openModal: true, id: '' }));
    setValue('location', 'state');
    handleLocationChange();
  };

  const onSubmit = async (data?: LocationAdd) => {
    const payload = {
      name: data?.name,
      entityType: data?.location,
    };

    if (state?.id) {
      dispatch(editLocationsDetails(payload, state?.id)).then((res: any) => {
        if (res?.data?.statusCode === 200) {
          enqueueSnackbar(res?.data?.message, {
            variant: 'success',
          });
          setState((prev: any) => ({ ...prev, isLoading: false }));
          handleLocationList();
          handleClose();
          // dispatch(emptyDistrictList(null));
          dispatch(emptyStatesDetails(null));
          dispatch(setEmptyLocationData(null));
        } else if (res?.data?.statusCode === 409) {
          enqueueSnackbar(res?.data?.message, {
            variant: 'error',
          });
          setState((prev: any) => ({ ...prev, isLoading: false }));
        } else if (res?.data?.statusCode === 422) {
          enqueueSnackbar(res?.data?.message, {
            variant: 'error',
          });
          setState((prev: any) => ({ ...prev, isLoading: false }));
        } else {
          enqueueSnackbar(res?.data?.message, {
            variant: 'error',
          });
          setState((prev: any) => ({ ...prev, isLoading: false }));
          handleClose();
        }
      });
    } else {
      dispatch(addLocationsDetails(payload)).then((res: any) => {
        if (res?.data?.statusCode === 201) {
          enqueueSnackbar(res?.data?.message, {
            variant: 'success',
          });
          handleLocationList();
          handleClose();
        } else if (res?.data?.statusCode === 409) {
          enqueueSnackbar(res?.data?.message, {
            variant: 'error',
          });
        } else if (res?.data?.statusCode === 422) {
          enqueueSnackbar(res?.data?.message, {
            variant: 'error',
          });
        }
      });
    }
  };

  const onhandleDeleteRow = (id: string, name: string) => {
    setState((prev) => ({ ...prev, openDeleteModal: true, id: id, VillageName: name }));
  };

  const handleDeleteClose = () => {
    setState((prev) => ({ ...prev, openDeleteModal: false, id: '', VillageName: '' }));
  };

  const handleDeleteState = () => {
    dispatch(deleteVillage(state?.id))
      .then((res) => {
        if (res?.data?.statusCode === 200) {
          enqueueSnackbar(res?.data?.message, {
            variant: 'success',
          });
          getVillageListing();
          setState((prev) => ({ ...prev, openDeleteModal: false, id: '', VillageName: '' }));
        } else {
          getVillageListing();
          setState((prev) => ({ ...prev, openDeleteModal: false, id: '', VillageName: '' }));
        }
      })
      .catch(() => {
        console.log('error');
      });
  };

  const handleStateDisabled = () => {
    if (locationData?.checkUpperGeo?.name === watch('name') || !watch('name')?.length) {
      return true;
    } else {
      return false;
    }
  };

  // work filter
  const handleFilterName = (Name: string) => {
    setState((prev) => ({ ...prev, filterName: Name }));
  };

  const onSearch = () => {
    setPage(0);
    getVillageLocationList(state?.filterName, state?.filterVillage, 'state');
  };
  return (
    <Page title="State">
      <Container maxWidth={'xl'}>
        <HeaderBreadcrumbs
          heading="State List"
          links={[{ href: PATH_DASHBOARD.location.root }]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon={'eva:plus-fill'} />}
              onClick={handleAddUser}
            >
              Add Geolocation
            </Button>
          }
        />

        <Card sx={{ pt: 2 }}>
          {/* <UserTableToolbar
            filterName={state.filterName}
            filterVillage={state.filterVillage}
            onFilterName={handleFilterName}
            // onFilterVillage={handleFilterRole}
            onSearch={onSearch}
            stateList={false}
            placeholderText={'Search by state name'}
            placeholderTextSecond={'Search by village name'}
          /> */}

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              <Table size={'medium'} sx={{}}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={villageList?.length}
                  numSelected={selected.length}
                />

                <TableBody>
                  {isLoading && !villageList?.length ? (
                    <TableSkeleton />
                  ) : villageList?.length ? (
                    villageList
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row: LocationListing) => (
                        <VillageTableRow
                          key={row.id}
                          row={row}
                          onhandleDeleteRow={onhandleDeleteRow}
                          onhandleEditDetails={onhandleEditDetails}
                        />
                      ))
                  ) : (
                    <TableNoData isNotFound={isNotFound} />
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <Box sx={{ position: 'relative' }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={villageList?.length ? villageList.length : 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
            />
          </Box>
        </Card>
      </Container>

      <MasterDataForm
        openModal={state.openModal}
        isLoading={state?.isLoading}
        handleClose={handleClose}
        onSubmit={onSubmit}
        methods={methods}
        id={state?.id}
        handleCropDetails={handleLocationDetails}
        title={state.id ? 'Edit State Location' : 'Add State Geo Location'}
        disabled={handleStateDisabled()}
      >
        <StateForm
          selectLocation={StateLocationList}
          state={state}
          methods={methods}
          handleLocationChange={handleLocationChange}
          isLoading={state.isLoading}
        />
      </MasterDataForm>

      <ConfirmationModal
        openModal={state.openDeleteModal}
        // isLoading={isLoading}
        handleClose={handleDeleteClose}
        title={'Delete Confirmation!'}
        handleSubmit={handleDeleteState}
      >
        <DeleteConfirmationContent userName={state?.VillageName} />
      </ConfirmationModal>
    </Page>
  );
}
