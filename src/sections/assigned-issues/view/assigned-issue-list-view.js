import { useState, useCallback } from 'react';
import { alpha } from '@mui/material/styles';
import {
  Card,
  Table,
  TableBody,
  TableContainer,
  Container,
  Button,
} from '@mui/material';

import { useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';

import {
  useTable,
  getComparator,
  TableHeadCustom,
  TablePaginationCustom,
  TableEmptyRows,
  TableNoData,
} from 'src/components/table';

import Scrollbar from 'src/components/scrollbar';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import AssignedIssueTableToolbar from '../assigned-issue-table-toolbar';
import AssignedIssueTableRow from '../assigned-issue-table-row';


// -------------------------------------------------

const TABLE_HEAD = [
  { id: 'companyName', label: 'Company Name' },
  { id: 'cin', label: 'CIN' },
  { id: 'amount', label: 'Amount' },
  { id: 'tenure', label: 'Tenure' },
  { id: 'requestedDate', label: 'Requested Date' },
  { id: '', width: 80 },
];

// MOCK DATA
const ASSIGNED_ISSUES = [
  {
    id: 1,
    companyName: 'Blue Ocean Logistics Pvt Ltd',
    description: 'Trustee appointment for ₹250 Cr secured NCD issuance',
    amount: '₹12.5 Crores',
    title: 'RTGS to Debenture Holders',
    date: '12/15/2024',
    status: 'High',
    Background: 'linear-gradient(180deg, #991C1E 0%, #FF2F32 100%)',
  },
  {
    id: 2,
    companyName: 'Sunrise Infrastructure Ltd.',
    description: 'Trustee appointment for ₹250 Cr secured NCD issuance',
    amount: '₹8.0 Crores',
    title: 'RTGS to Debenture Holders',
    date: '01/15/2025',
    status: 'Medium',
    Background: 'linear-gradient(180deg, #0E458C 0%, #1877F2 100%)',
  },
];

export default function AssignedIssuesListView() {
  const table = useTable();
  const router = useRouter();

  const [data, setData] = useState(ASSIGNED_ISSUES);
  const [filters, setFilters] = useState({ name: '' });

  const dataFiltered = applyFilter({
    inputData: data,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const handleFilters = useCallback((name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  }, []);

  return (
    <Container maxWidth="lg">
      <CustomBreadcrumbs
        heading="Assigned Issues"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Assigned Issues' },
        ]}
      />

      <Card>
        <AssignedIssueTableToolbar
          filters={filters}
          onFilters={handleFilters}
        />

        <TableContainer sx={{ position: 'relative' }}>
          <Scrollbar>
            <Table size="medium" sx={{ minWidth: 900 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                rowCount={data.length}
                onSort={table.onSort}
              />

              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <AssignedIssueTableRow
                      key={row.id}
                      row={row}
                      onView={() =>
                        router.push(paths.dashboard.mybond.bondIssue(row.id))
                      }
                    />
                  ))}

                <TableEmptyRows
                  height={52}
                  emptyRows={table.emptyRows}
                />

                <TableNoData notFound={!dataFiltered.length} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          count={dataFiltered.length}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}

// -------------------------------------------------

function applyFilter({ inputData, comparator, filters }) {
  const { name } = filters;

  const stabilized = inputData.map((el, index) => [el, index]);

  stabilized.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    return order !== 0 ? order : a[1] - b[1];
  });

  let filtered = stabilized.map((el) => el[0]);

  if (name) {
    filtered = filtered.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(name.toLowerCase())
      )
    );
  }

  return filtered;
}
