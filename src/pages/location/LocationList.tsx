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
import { TableHeadCustom, TableNoData } from 'src/components/table';
import LocationTableRow from 'src/sections/@dashboard/user/list/LocationTableRow';
import {
  editLocationsDetails,
  getLocationDetails,
  getLocationList,
} from 'src/redux/slices/locations';
import { LocationDetails, LocationListing } from 'src/@types/location';
import MasterDataForm from 'src/components/modal/MasterDataForm';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { emptyDistrictList, getStatesList } from 'src/redux/slices/user';
import LocationForm from './LocationForm';
import { useSnackbar } from 'notistack';
import { getEntityName } from 'src/utils/common';

const TABLE_HEAD = [
  { id: 'village', label: 'Village Name', align: 'left' },
  { id: 'taluk', label: 'Taluk', align: 'left' },
  { id: 'district', label: 'District', align: 'left' },
  { id: 'state', label: 'State', align: 'left' },
  { id: 'nofarmer', label: 'Farmer Count', align: 'left' },
  { id: 'action', label: 'Action', align: 'left' },
];

export default function LocationList() {
  const { page, order, orderBy, rowsPerPage, selected, onChangePage, onChangeRowsPerPage } =
    useTable();

  const [filterName, setFilterName] = useState('');

  const [filterVillage, setFilterVillage] = useState('');

  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  const [state, setState] = useState({
    id: '',
    selectStages: '',
    openModal: false,
    villageId: null,
  });

  const { currentTab: filterStatus } = useTabs('all');

  useEffect(() => {
    handleLocationList();
    getStatesList();
  }, []);

  const handleLocationList = () => {
    getLocationList();
  };

  const handleLocationDetails = () => {
    getLocationDetails(state?.id);
  };

  const { locationList, isLoading, locationData } = useSelector((state) => state.locations);

  console.log('locationData', locationData);

  useEffect(() => {
    dispatch(emptyDistrictList(null));
    if (locationData?.id && state?.id) {
      const stateName = getEntityName('state', locationData?.checkUpperGeo);
      const districtName = getEntityName('district', locationData?.checkUpperGeo);
      const talukName = getEntityName('taluk', locationData?.checkUpperGeo);
      const villageName = getEntityName('village', locationData?.checkUpperGeo);
      setValue('selectStates', stateName?.name);
      setValue('selectDistrict', districtName?.name);
      setValue('selectTaluk', talukName?.name);
      setValue('selectVillage', villageName?.name);
    }
  }, [locationData?.id, state?.id]);

  const getAssignVillageData = (value: string) => {
    return locationData?.checkUpperGeo?.parents?.find((item: any) => item?.entityType === value);
  };

  const defaultValues = useMemo(
    () => ({
      selectStates: '',
      selectDistrict: '',
      selectTaluk: '',
      selectVillage: '',
    }),
    [locationList]
  );

  const NewLocationSchema = Yup.object().shape({
    selectStates: Yup.string().required('States is required'),
    selectDistrict: Yup.string(),
    selectTaluk: Yup.string(),
    selectVillage: Yup.string(),
  });

  const methods = useForm<LocationDetails>({
    resolver: yupResolver(NewLocationSchema),
    defaultValues,
  });

  const { setValue } = methods;

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

  const isNotFound =
    (!locationList?.length && !!filterName) ||
    (!locationList?.length && !!filterVillage) ||
    (!locationList?.length && !!filterName) ||
    (!locationList?.length && !!filterStatus);

  const onhandleDeleteRow = () => {
    console.log('delte');
  };

  const onhandleEditDetails = (id: string) => {
    setState((prev) => ({ ...prev, openModal: true, id: id }));
  };

  const handleClose = () => {
    setState((prev) => ({ ...prev, openModal: false, id: '' }));
  };

  const onSubmit = async () => {
    try {
      if (state.id) {
        dispatch(editLocationsDetails(state.id)).then((res: any) => {
          if (res?.data?.statusCode === 200) {
            enqueueSnackbar(res?.data?.message, {
              variant: 'success',
            });
            handleLocationList();
          }
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Page title="location">
      <Container maxWidth={'xl'}>
        <HeaderBreadcrumbs
          heading="Location List"
          links={[{ href: PATH_DASHBOARD.location.list }]}
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
                  rowCount={locationList?.length}
                  numSelected={selected.length}
                />

                <TableBody>
                  {locationList?.length
                    ? locationList
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row: LocationListing) => (
                          <LocationTableRow
                            key={row.id}
                            row={row}
                            onhandleDeleteRow={onhandleDeleteRow}
                            onhandleEditDetails={onhandleEditDetails}
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
              count={locationList?.length ? locationList.length : 0}
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
        isLoading={isLoading}
        handleClose={handleClose}
        onSubmit={onSubmit}
        methods={methods}
        id={state.id}
        handleCropDetails={handleLocationDetails}
        title={state.id ? 'Edit Crop Details' : 'Create New Crop'}
      >
        <LocationForm statusList={locationData} />
      </MasterDataForm>
    </Page>
  );
}
