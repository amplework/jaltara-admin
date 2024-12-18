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
import { getPitsList } from 'src/redux/slices/pits';
import useTable from 'src/hooks/useTable';
import useTabs from 'src/hooks/useTabs';
import Page from 'src/components/Page';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { UserTableToolbar } from 'src/sections/@dashboard/user/list';
import Scrollbar from 'src/components/Scrollbar';
import { TableHeadCustom, TableNoData, TableSkeleton } from 'src/components/table';
import LocationTableRow from 'src/sections/@dashboard/user/list/LocationTableRow';
import {
  addLocationsDetails,
  deleteVillage,
  editLocationsDetails,
  getLocationDetails,
  getLocationList,
  getVillageLocationList,
  setEmptyLocationData,
} from 'src/redux/slices/locations';
import { LocationAdd, LocationListing } from 'src/@types/location';
import MasterDataForm from 'src/components/modal/MasterDataForm';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  emptyDistrictList,
  emptyStatesDetails,
  getDistrictList,
  getStatesList,
  getTalukList,
  getVillageList,
} from 'src/redux/slices/user';
import { useSnackbar } from 'notistack';
import Iconify from 'src/components/Iconify';
import { getEntityName } from 'src/utils/common';
import ConfirmationModal from 'src/components/modal/Confirmation';
import { DeleteConfirmationContent } from '../../sevak/DeleteConfirmationContent';
import GeoLocationAdd from '../village/GeoLocationAdd';
import DistrictForm from './DistrictForm';
import DistrictTableRow from 'src/sections/@dashboard/user/list/DistrictTableRow';

const TABLE_HEAD = [
  { id: 'district', label: 'District Name', align: 'left' },
  { id: 'state', label: 'State', align: 'left' },
  { id: 'nofarmer', label: 'Farmer Count', align: 'left' },
  { id: 'action', label: 'Action', align: 'left' },
];

export default function DistrictList() {
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

  const [filterName, setFilterName] = useState('');

  const [filterVillage, setFilterVillage] = useState('');

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
  });
  console.log('state', state);

  const { currentTab: filterStatus } = useTabs('all');

  useEffect(() => {
    handleLocationList();
    getStatesList();
  }, []);

  const handleLocationList = () => {
    getVillageLocationList('', '', 'district');
  };

  const handleLocationDetails = () => {
    setState((prev: any) => ({ ...prev, isLoading: true }));
    getLocationDetails(state?.id);
  };

  const { locationData, districtLoactionList, isLoading } = useSelector((state) => state.locations);

  const { districtList } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(emptyDistrictList(null));
    if (locationData?.id && state?.id) {
      setState((prev: any) => ({ ...prev, isLoading: true }));
      const stateName = getEntityName('state', locationData?.checkUpperGeo);
      const districtName = getEntityName('district', locationData?.checkUpperGeo);
      setValue('selectStates', stateName?.id);
      setValue('location', locationData?.checkUpperGeo?.entityType);
      setValue('name', locationData?.checkUpperGeo?.name);
      setState((prev: any) => ({ ...prev, isLoading: false }));

      if (locationData && stateName?.id) {
        getDistrictList(stateName?.id);
        setState((prev: any) => ({ ...prev, isLoading: false }));
        if (locationData && districtName?.id && districtList?.childEntities) {
          getTalukList(districtName?.id);
          setValue('selectDistrict', districtName?.id || '');
          setState((prev: any) => ({ ...prev, isLoading: false }));
        } else if (locationData && stateName?.id && !districtName?.id) {
          setValue('selectDistrict', locationData?.checkUpperGeo?.id || '');
          setState((prev: any) => ({ ...prev, isLoading: false }));
        }
      }
    }
  }, [locationData?.id, state?.id]);

  const defaultValues = useMemo(
    () => ({
      location: '',
      selectStates: '',
      selectDistrict: '',
      selectTaluk: '',
      name: '',
    }),
    []
  );

  const NewLocationSchema = Yup.object().shape({
    location: Yup.string().required('Location is required'),
    name: Yup.string().required('Name is required').max(50, 'Limit of 50 characters'),
    selectStates: Yup.string().when('location', {
      is: (value: any) => value === 'district' || value === 'taluk' || value === 'village', // Check if location is 'district' or 'taluk'
      then: Yup.string().required('State is required'),
      otherwise: Yup.string(),
    }),
  });

  const methods = useForm<LocationAdd>({
    resolver: yupResolver(NewLocationSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setError,
    clearErrors,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const fieldsToClear = ['location', 'name', 'selectDistrict', 'selectStates', 'selectTaluk'];

  const onSearch = () => {
    setPage(0);
    const statgesSearch = state.selectStages;
    getPitsList(filterName, filterVillage, statgesSearch);
  };

  const handleFilterName = (filterName: string) => {
    setFilterName(filterName);
  };

  const handleFilterRole = (filterVillage: string) => {
    setFilterVillage(filterVillage);
  };

  const isNotFound =
    (!districtLoactionList?.length && !!filterName) ||
    (!districtLoactionList?.length && !!filterVillage) ||
    (!districtLoactionList?.length && !!filterName) ||
    (!districtLoactionList?.length && !!filterStatus);

  const handleLocationChange = () => {
    getStatesList();
    setValue('selectStates', '');
    setValue('selectDistrict', '');
    setValue('selectTaluk', '');
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
    setValue('location', 'district');
    handleLocationChange();
  };

  const handleStatesSelect = (id: any) => {
    setState((prev: any) => ({ ...prev, parentId: id, stateId: id }));
    getDistrictList(id);
    setValue('selectDistrict', '');
    setValue('selectTaluk', '');
    setValue('name', '');
  };

  const onSubmit = async (data?: LocationAdd) => {
    const payload = {
      name: data?.name,
      entityType: data?.location,
      ...(state?.parentId && { parentId: state?.parentId }),
    };

    if (state?.id) {
      dispatch(editLocationsDetails(payload, state?.id)).then((res: any) => {
        if (res?.data?.statusCode === 200) {
          enqueueSnackbar(res?.data?.message, {
            variant: 'success',
          });
          handleLocationList();
          setState((prev: any) => ({ ...prev, isLoading: false }));
          handleClose();
          dispatch(emptyDistrictList(null));
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

  const handleDeleteDistrict = () => {
    dispatch(deleteVillage(state?.id))
      .then((res) => {
        if (res?.data?.statusCode === 200) {
          enqueueSnackbar(res?.data?.message, {
            variant: 'success',
          });
          getLocationList();
          setState((prev) => ({ ...prev, openDeleteModal: false, id: '', VillageName: '' }));
        } else {
          getLocationList();
          setState((prev) => ({ ...prev, openDeleteModal: false, id: '', VillageName: '' }));
        }
      })
      .catch((error) => {
        console.log('error');
      });
  };

  const handleDistrictDisabled = () => {
    if (
      locationData?.checkUpperGeo?.name === watch('name') ||
      !watch('name')?.length ||
      !watch('selectStates')?.length
    ) {
      return true;
    } else {
      return false;
    }
  };
  
  return (
    <Page title="District">
      <Container maxWidth={'xl'}>
        <HeaderBreadcrumbs
          heading="District List"
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
            filterName={filterName}
            filterVillage={filterVillage}
            onFilterName={handleFilterName}
            onFilterVillage={handleFilterRole}
            onSearch={onSearch}
            placeholderText={'Search by state name'}
            placeholderTextSecond={'Search by village name'}
          /> */}

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              <Table size={'medium'}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={districtLoactionList?.length}
                  numSelected={selected.length}
                />

                <TableBody>
                  {isLoading && !districtLoactionList?.length ? (
                    <TableSkeleton />
                  ) : districtLoactionList?.length ? (
                    districtLoactionList
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row: LocationListing) => (
                        <DistrictTableRow
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
              count={districtLoactionList?.length ? districtLoactionList.length : 0}
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
        isLoading={state.isLoading}
        handleClose={handleClose}
        onSubmit={onSubmit}
        methods={methods}
        id={state?.id}
        handleCropDetails={handleLocationDetails}
        title={state.id ? 'Edit District location' : 'Add District Geo Location'}
        disabled={handleDistrictDisabled()}
      >
        <DistrictForm
          state={state}
          methods={methods}
          handleLocationChange={handleLocationChange}
          handleStatesSelect={handleStatesSelect}
          isLoading={state.isLoading}
        />
      </MasterDataForm>

      <ConfirmationModal
        openModal={state.openDeleteModal}
        // isLoading={isLoading}
        handleClose={handleDeleteClose}
        title={'Delete Confirmation!'}
        handleSubmit={handleDeleteDistrict}
      >
        <DeleteConfirmationContent userName={state?.VillageName} />
      </ConfirmationModal>
    </Page>
  );
}
