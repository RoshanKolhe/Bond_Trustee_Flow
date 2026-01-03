import isEqual from 'lodash/isEqual';
import { useState, useCallback, useEffect } from 'react';
// @mui
import {
  alpha,
  Table,
  Tab,
  Tabs,
  Card,
  Button,
  Tooltip,
  Container,
  TableBody,
  IconButton,
  TableContainer,
  TableRow,
  TableCell,
} from '@mui/material';

// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';
import { RouterLink } from 'src/routes/components';
// _mock
// import { _companyList } from 'src/_mock/_company';
import { _jobsOption, USER_STATUS_OPTIONS } from 'src/_mock';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,

} from 'src/components/table';
// import { TableRow,TableCell } from '@mui/material';

//
import { mockJob } from 'src/sections/job/mockData';

import { useNavigate } from 'react-router';
import axiosInstance from 'src/utils/axios';
import { LoadingButton } from '@mui/lab';
import BondApplicationsTableRow from '../bond-application-table-row';
import BondApplicationsTableFiltersResult from '../bond-application-filters-result';
import BondApplicationsTableToolbar from '../bond-application-table-toolbar';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [{ value: 'all', label: 'All' }, ...USER_STATUS_OPTIONS];

const TABLE_HEAD = [
  { id: 'applicationId', label: 'Application Id' },
  { id: 'status', label: 'Status' },
  { id: 'createdAt', label: 'Created At' },
  { id: '', label: 'Actions', width: 88 },
];

const defaultFilters = {
  name: '',
  email: '',
  role: [],
  status: 'all',
};

// ----------------------------------------------------------------------

export default function BondsApplicationListView({ bondsApplication, bondsApplicationLoading, count,
  table,
  filters,
  setFilters, }) {

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const settings = useSettingsContext();

  const router = useRouter();

  const confirm = useBoolean();

  const [tableData, setTableData] = useState(mockJob);

  // const dataFiltered = applyFilter({
  //   inputData: tableData,
  //   comparator: getComparator(table.order, table.orderBy),
  //   filters,
  // });

  // const dataInPage = dataFiltered.slice(
  //   table.page * table.rowsPerPage,
  //   table.page * table.rowsPerPage + table.rowsPerPage
  // );

  const denseHeight = table.dense ? 52 : 72;

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!bondsApplication.length && canReset) || !bondsApplication.length;

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );
  const handleView = useCallback(
    (id) => {
      router.push(paths.dashboard.job.details(id));
    },
    [router]
  );
  const handleDeleteRow = useCallback(
    (id) => {
      const deleteRow = tableData.filter((row) => row.id !== id);
      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(bondsApplication.length);
    },
    [bondsApplication.length, table, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));
    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRows: tableData.length,
      totalRowsInPage: bondsApplication.length,
      totalRowsFiltered: bondsApplication.length,
    });
  }, [bondsApplication.length, table, tableData]);

  // const handleEditRow = useCallback(
  //   (id) => {
  //     router.push(paths.dashboard.company.edit(id));
  //   },
  //   [router]
  // );

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleStart = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post('/bonds-pre-issue/new-application');
      if (response.data.success) {
        localStorage.removeItem('formData');
        localStorage.removeItem('stepsProgress');
        navigate(paths.dashboard.mybond.bondIssue(response.data?.application?.id));
      }
    } catch (error) {
      console.error('error while starting bond estimation :', error);

    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (bondsApplication && !bondsApplicationLoading) {
      setTableData(bondsApplication);
    }
  }, [bondsApplication, bondsApplicationLoading]);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Bond Applications"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Bond Application', href: paths.dashboard.mybond.create },
            { name: 'List' },
          ]}
          action={
            <LoadingButton
              onClick={() => handleStart()}
              variant="contained"
              loading={isLoading}
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Application
            </LoadingButton>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card>
          <Tabs
            value={filters.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
                    }
                    color={
                      (tab.value === '1' && 'success') ||
                      (tab.value === '0' && 'warning') ||
                      //   (tab.value === 'banned' && 'error') ||
                      'default'
                    }
                  >
                    {tab.value === 'all' && tableData.length}
                    {tab.value === '1' &&
                      tableData.filter((isSynced) => isSynced.status === '1').length}

                    {tab.value === '0' &&
                      tableData.filter((isSynced) => isSynced.status === '0').length}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <BondApplicationsTableToolbar
            filters={filters}
            onFilters={handleFilters}
            //
            roleOptions={_jobsOption}
          />

          {canReset && (
            <BondApplicationsTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              //
              onResetFilters={handleResetFilters}
              //
              results={bondsApplication.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            {/* <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  tableData.map((row) => row.id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            /> */}

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {bondsApplication.map((row) => (
                    <BondApplicationsTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onViewRow={() => handleView(row._id.$oid)}
                    // onDeleteRow={() => handleDeleteRow(row.id)}
                    // onEditRow={() => handleEditRow(row.id)}
                    />
                  ))}
                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                  />
                  <TableNoData notFound={notFound} />
                </TableBody>


              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={count}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            //
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>

      {/* <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      /> */}
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters }) {
  const { name, status, email, role } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter((job) =>
      Object.values(job).some((value) => String(value).toLowerCase().includes(name.toLowerCase()))
    );
  }

  if (role.length > 0) {
    inputData = inputData.filter((job) =>
      role.some((r) =>
        job.source.toLowerCase().includes(r.toLowerCase()) ||
        (job.jobType && job.jobType.toLowerCase().includes(r.toLowerCase()))
      )
    );
  }




  if (status !== 'all') {
    inputData = inputData.filter((job) => String(job.isSynced) === status);
  }


  if (email.length) {
    inputData = inputData.filter((job) => email.includes(job.email));
  }

  return inputData;
}
