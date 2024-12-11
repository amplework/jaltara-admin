import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
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
import MasterDataForm from 'src/components/modal/MasterDataForm';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import ChallangesTableRow from 'src/sections/@dashboard/user/list/ChallangesRow';
import {
  addEditCropsChallenges,
  deleteCropsChallanges,
  emptyCropsChallengesDetails,
  getCropsChallangesDetails,
  getCropsChallengesList,
} from 'src/redux/slices/challanges';
import { ChallangesItem } from 'src/@types/challanges';
import ChallengesForm from '../form/ChallengesForm';

// ----------------------------------------------------------------------

export const statusChallangesList = [
  { id: 'active', label: 'Active', name: 'active' },
  { id: 'inactive', label: 'Inactive', name: 'inactive' },
];

export const statusList = [
  { id: 'state', label: 'State', name: 'State', value: 'state' },
  { id: 'district', label: 'District', name: 'District', value: 'district' },
  { id: 'taluk', label: 'Taluk', name: 'Taluk', value: 'taluk' },
  { id: 'village', label: 'Village', name: 'Village', value: 'village' },
];

const TABLE_HEAD = [
  { id: 'challenges', label: 'Challenge', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'action', label: 'Action', align: 'left' },
];

export default function ChallangesList() {
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

  const [state, setState] = useState({
    openModal: false,
    filterChallenge: '',
    filterStatus: '',
    id: '',
  });

  const { currentTab: filterStatus } = useTabs('all');

  useEffect(() => {
    handleCropListing();
  }, []);

  const handleCropListing = () => {
    getCropsChallengesList();
  };

  const { challengesListData, challengesDetails } = useSelector((state) => state.challenges);

  const onSearch = () => {
    getCropsChallengesList(state.filterChallenge, state.filterStatus);
  };

  const handleFilterChallenge = (filterChallenge: string) => {
    setState((prev) => ({ ...prev, filterChallenge: filterChallenge }));
  };

  const onChange = (value: any) => {
    setState((prev) => ({ ...prev, filterStatus: value }));
  };

  const handleCropDetails = () => {
    dispatch(getCropsChallangesDetails(state?.id));
  };

  const defaultValues = useMemo(
    () => ({
      challenge: '',
      status: '',
    }),
    [challengesDetails]
  );

  const NewCropsSchema = Yup.object().shape({
    challenge: Yup.string().required('Challenge is required').max(50, 'Limit of 50 characters'),
    status: Yup.string().required('Status is required'),
  });

  const methods = useForm<ChallangesItem>({
    resolver: yupResolver(NewCropsSchema),
    defaultValues,
  });

  const { watch, setValue } = methods;

  useEffect(() => {
    setValue('challenge', challengesDetails?.challenge);
    setValue('status', challengesDetails?.status);
  }, [challengesDetails]);

  const isNotFound =
    (!challengesListData?.length && !!state.filterChallenge) ||
    (!challengesListData?.length && !!state.filterStatus) ||
    (!challengesListData?.length && !!state.filterChallenge) ||
    (!challengesListData?.length && !!filterStatus);

  const handleAddCrop = () => {
    dispatch(emptyCropsChallengesDetails(null));
    setState((prev) => ({ ...prev, openModal: true, id: '' }));
  };

  const handleClose = () => {
    setState((prev) => ({ ...prev, openModal: false, id: '' }));
  };

  const onDeleteRow = (id: string) => {
    dispatch(deleteCropsChallanges(id))
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
    dispatch(emptyCropsChallengesDetails(null));
    setState((prev) => ({ ...prev, openModal: true, id: id }));
  };

  const onSubmit = async (data: ChallangesItem) => {
    try {
      let previousState: any = {
        challenge: challengesDetails?.challenge,
        status: challengesDetails?.status,
      };
      let payload: any = {
        challenge: data?.challenge,
        status: data?.status,
      };
      Object.keys(payload).forEach((key) => {
        if (payload[key] === previousState[key]) {
          delete payload[key];
        }
      });

      if (state?.id) {
        dispatch(addEditCropsChallenges(payload, state.id)).then((res: any) => {
          if (res?.data?.statusCode === 200) {
            enqueueSnackbar(res?.data?.message, {
              variant: 'success',
            });
            handleCropListing();
            setState((prev) => ({ ...prev, openModal: false, id: '' }));
          }
        });
      } else {
        dispatch(addEditCropsChallenges(payload)).then((res: any) => {
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
    <Page title="Crop Challanges List">
      <Container maxWidth={'xl'}>
        <HeaderBreadcrumbs
          heading="Farmer Challanges List"
          links={[{ href: PATH_DASHBOARD.masterdata.create }]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon={'eva:plus-fill'} />}
              onClick={handleAddCrop}
            >
            Add Challanges
            </Button>
          }
        />

        <Card>
          <UserTableToolbar
            filterName={state.filterChallenge}
            filterVillage={state.filterStatus}
            onFilterName={handleFilterChallenge}
            onSearch={onSearch}
            placeholderText={'Search by crop challanges name'}
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
                  rowCount={challengesListData?.length}
                  numSelected={selected.length}
                />

                <TableBody>
                  {challengesListData?.length
                    ? challengesListData
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row: ChallangesItem) => (
                          <ChallangesTableRow
                            key={row.id}
                            row={row}
                            onEditRow={onEditRow}
                            onDeleteRow={onDeleteRow}
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
              count={challengesListData?.length ? challengesListData.length : 0}
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
        handleClose={handleClose}
        onSubmit={onSubmit}
        methods={methods}
        id={state.id}
        handleCropDetails={handleCropDetails}
        title={state.id ? 'Edit Farmer Challenges Details' : 'Add New Farmer Challenges'}
        cropDetails={challengesDetails}
        disabled={
          challengesDetails?.challenge === watch('challenge') &&
          challengesDetails?.status === watch('status')
        }
      >
        <ChallengesForm statusList={statusChallangesList} methods={methods} />
      </MasterDataForm>
    </Page>
  );
}
