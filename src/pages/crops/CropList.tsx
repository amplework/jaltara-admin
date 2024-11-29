import { useEffect, useState } from 'react';
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
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useTabs from '../../hooks/useTabs';
import useSettings from '../../hooks/useSettings';
import useTable from '../../hooks/useTable';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { TableNoData, TableHeadCustom } from '../../components/table';
// sections
import { UserTableToolbar } from '../../sections/@dashboard/user/list';
import { useDispatch, useSelector } from 'src/redux/store';
import { emptyCropsDetails, getCropsList } from 'src/redux/slices/crops';
import { CropItem } from 'src/@types/crops';
import CropTableRow from 'src/sections/@dashboard/user/list/CropTableRow';

// ----------------------------------------------------------------------

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

  const { themeStretch } = useSettings();
  
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [filterName, setFilterName] = useState('');

  const [filterVillage, setFilterVillage] = useState('');

  const { currentTab: filterStatus } = useTabs('all');

  useEffect(() => {
    getCropsList();
  }, []);

  const { cropListData } = useSelector((state) => state.crops);

  const onSearch = () => {
    getCropsList(filterName);
  };

  const handleFilterName = (filterName: string) => {
    setFilterName(filterName);
  };

  const handleFilterRole = (filterVillage: string) => {
    setFilterVillage(filterVillage);
  };


  const isNotFound =
    (!cropListData?.length && !!filterName) ||
    (!cropListData?.length && !!filterVillage) ||
    (!cropListData?.length && !!filterName) ||
    (!cropListData?.length && !!filterStatus);

    const handleAddCrop = () => {
      dispatch(emptyCropsDetails(null))
      navigate(PATH_DASHBOARD.masterdata.create);
    };

    const onDeleteRow = (id: string) => {
      // navigate(PATH_DASHBOARD.farmers.details(id));
    };
    const onEditRow = (id: string) => {
      dispatch(emptyCropsDetails(null))
      navigate(PATH_DASHBOARD.masterdata.edit(id));
    };
  return (
    <Page title="Crops List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Crops List"
          links={[
            { href: PATH_DASHBOARD.masterdata.create },
          ]}
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
            filterName={filterName}
            filterVillage={filterVillage}
            onFilterName={handleFilterName}
            onFilterVillage={handleFilterRole}
            onSearch={onSearch}
            placeholderText={'Search by crop name'}
            placeholderTextSecond={''}
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
    </Page>
  );
}
