import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useTabs from '../../../hooks/useTabs';

import useTable from '../../../hooks/useTable';
// components
import Page from '../../../components/Page';
import Iconify from '../../../components/Iconify';
import Scrollbar from '../../../components/Scrollbar';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import { TableNoData, TableHeadCustom } from '../../../components/table';
// sections
import { UserTableToolbar } from '../../../sections/@dashboard/user/list';
import { useDispatch, useSelector } from 'src/redux/store';
import {
  addEditCrops,
  deleteCrops,
  emptyCropsDetails,
  getCropsDetails,
  getCropsList,
} from 'src/redux/slices/crops';
import { CropItem } from 'src/@types/crops';
import CropTableRow from 'src/sections/@dashboard/user/list/CropTableRow';
import MasterDataForm from 'src/components/modal/MasterDataForm';
import CropAddEditForm from '../form/CropAddEditForm';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

const statusList = [
  { id: 'active', label: 'Active', name: 'active' },
  { id: 'inactive', label: 'Inactive', name: 'inactive' },
];

const TABLE_HEAD = [
  { id: 'crop', label: 'Crops', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'lastdate', label: 'Last Update Date', align: 'left' },
  { id: 'action', label: 'Action', align: 'left' },
];

export default function CropList() {
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
    handleCropListing();
  }, []);

  const handleCropListing = () => {
    getCropsList();
  };

  const { cropListData, cropsDetails,isLoading } = useSelector((state) => state.crops);

  const onSearch = () => {
    getCropsList(state.filterName, state.filterStatus);
  };

  const handleFilterName = (filterName: string) => {
    setState((prev) => ({ ...prev, filterName: filterName }));
  };

  const handleCropDetails = () => {
    dispatch(getCropsDetails(state.id));
  };

  const defaultValues = useMemo(
    () => ({
      name: '',
      status: '',
    }),
    [cropsDetails]
  );

  const NewCropsSchema = Yup.object().shape({
    name: Yup.string().required('Name is required').max(50, 'Limit of 50 characters'),
    status: Yup.string().required('Status is required'),
  });

  const methods = useForm<CropItem>({
    resolver: yupResolver(NewCropsSchema),
    defaultValues,
  });

  const { watch, setValue } = methods;

  useEffect(() => {
    setValue('name', cropsDetails?.name);
    setValue('status', cropsDetails?.status);
  }, [cropsDetails]);

  const isNotFound =
    (!cropListData?.length && !!state.filterName) ||
    (!cropListData?.length && !!state.filterStatus) ||
    (!cropListData?.length && !!state.filterName) ||
    (!cropListData?.length && !!filterStatus);

  const handleAddCrop = () => {
    dispatch(emptyCropsDetails(null));
    setState((prev) => ({ ...prev, openModal: true, id: '' }));
    // dispatch(emptyCropsDetails(null))
    // navigate(PATH_DASHBOARD.masterdata.create);
  };

  const handleClose = () => {
    setState((prev) => ({ ...prev, openModal: false, id: '' }));
  };

  const onChange = (value: any) => {
    setState((prev) => ({ ...prev, filterStatus: value }));
  };

  const onDeleteRow = (id: string) => {
    dispatch(deleteCrops(id))
      .then((res) => {
        if (res?.data?.statusCode === 200) {
          enqueueSnackbar(res?.data?.message, {
            variant: 'success',
          });
          handleCropListing();
        } else {
          handleCropListing();
        }
      })
      .catch((error) => {
        console.log('error');
      });
  };

  const onEditRow = (id: string) => {
    dispatch(emptyCropsDetails(null));
    setState((prev) => ({ ...prev, openModal: true, id: id }));
    // dispatch(emptyCropsDetails(null));
    // navigate(PATH_DASHBOARD.masterdata.edit(id));
  };

  const onSubmit = async (data: CropItem) => {
    console.log('submit');

    try {
      let previousState: any = {
        name: cropsDetails?.name,
        status: cropsDetails?.status,
      };
      let payload: any = {
        name: data?.name,
        status: data?.status,
      };
      Object.keys(payload).forEach((key) => {
        if (payload[key] === previousState[key]) {
          delete payload[key];
        }
      });

      if (state?.id) {
        dispatch(addEditCrops(payload, state.id)).then((res: any) => {
          if (res?.data?.statusCode === 200) {
            enqueueSnackbar(res?.data?.message, {
              variant: 'success',
            });
            handleCropListing();
            setState((prev) => ({ ...prev, openModal: false, id: '' }));
          }
        });
      } else {
        dispatch(addEditCrops(payload)).then((res: any) => {
          if (res?.data?.statusCode === 201) {
            enqueueSnackbar(res?.data?.message, {
              variant: 'success',
            });
            handleCropListing();
            setState((prev) => ({ ...prev, openModal: false, id: '' }));
          } else {
            enqueueSnackbar(res?.data?.message, {
              variant: 'success',
            });
            setState((prev) => ({ ...prev, openModal: false, id: '' }));
          }
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Page title="Crops List">
      <Container maxWidth={'xl'}>
        <HeaderBreadcrumbs
          heading="Crops List"
          links={[{ href: PATH_DASHBOARD.masterdata.create }]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon={'eva:plus-fill'} />}
              onClick={handleAddCrop}
            >
              New Crop
            </Button>
          }
        />

        <Card>
          <UserTableToolbar
            filterName={state.filterName}
            filterVillage={state.filterStatus}
            onFilterName={handleFilterName}
            onSearch={onSearch}
            placeholderText={'Search by crop name'}
            placeholderTextSecond={'Search by status'}
            challenges={true}
            state={state}
            onChange={onChange}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              <Table size={'medium'}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={cropListData?.length}
                  numSelected={selected.length}
                />

                <TableBody>
                  {cropListData?.length
                    ? cropListData
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row: CropItem) => (
                          <CropTableRow
                            key={row.id}
                            row={row}
                            onDeleteRow={onDeleteRow}
                            onEditRow={onEditRow}
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
              count={cropListData?.length ? cropListData.length : 0}
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
        handleCropDetails={handleCropDetails}
        title={state.id ? 'Edit Crop Details' : 'Create New Crop'}
        cropDetails={cropsDetails}
        disabled={cropsDetails?.name === watch('name') && cropsDetails?.status === watch('status')}
      >
        <CropAddEditForm statusList={statusList} methods={methods} />
      </MasterDataForm>
    </Page>
  );
}
