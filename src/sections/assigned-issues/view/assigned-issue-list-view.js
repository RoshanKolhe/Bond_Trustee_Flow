import { useState, useCallback, useEffect } from 'react';
import { alpha } from '@mui/material/styles';
import { Card, Table, TableBody, TableContainer, Container, Button } from '@mui/material';

import { useParams, useRouter } from 'src/routes/hook';
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
import { useGetAssignedIssues } from 'src/api/assignedIssues';
import { useAuthContext } from 'src/auth/hooks';

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
// export const ASSIGNED_ISSUES = [
//   {
//     id: 1,
//     companyName: 'Sunrise Infrastructure Ltd.',
//     cin: 'U35900XYZ23A4B5C60',
//     description: 'Appointment request for ₹600 Cr infrastructure bond issuance',
//     amount: '₹600 Crores',
//     tenure: '8 Years',
//     requestedDate: '10/12/2024',
//   },
//   {
//     id: 2,
//     companyName: 'Blue Ocean Logistics Pvt Ltd',
//     cin: 'U35800XYZ23A4B5C60',
//     description: 'Trustee appointment for ₹250 Cr secured NCD issuance',
//     amount: '₹250 Crores',
//     tenure: '5 Years',
//     requestedDate: '10/23/2024',
//   },
// ];

export default function AssignedIssuesListView() {
  const table = useTable();
  const router = useRouter();

  const { assignedIssuesData } = useGetAssignedIssues();

  const [tableData, setTableData] = useState([]);
  const [filters, setFilters] = useState({ name: '' });

  useEffect(() => {
    if (assignedIssuesData) {
      setTableData(assignedIssuesData.applications);
    }
  }, [assignedIssuesData]);

  const handleFilters = useCallback((name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  }, []);

  const notFound = !tableData.length;

  return (
    <Container maxWidth="lg">
      <CustomBreadcrumbs
        heading="Assigned Issues"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Assigned Issues' }]}
      />

      <Card>
        <AssignedIssueTableToolbar filters={filters} onFilters={handleFilters} />

        <TableContainer sx={{ position: 'relative' }}>
          <Scrollbar>
            <Table size="medium" sx={{ minWidth: 900 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                rowCount={tableData.length}
                onSort={table.onSort}
              />

              <TableBody>
                {tableData.map((row) => (
                  <AssignedIssueTableRow
                    key={row.id}
                    row={row}
                    onView={() => router.push(paths.dashboard.mybond.bondIssue(row.id))}
                  />
                ))}

                <TableEmptyRows height={52} emptyRows={table.emptyRows} />

                <TableNoData notFound={!tableData.length} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          count={tableData.length}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
