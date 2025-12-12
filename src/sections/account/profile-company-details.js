import {
  Button,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
} from '@mui/material';

import Iconify from 'src/components/iconify';
import { useGetDocuments } from 'src/api/trusteeKyc';

import Label from 'src/components/label';

export default function KYCSignatories({ trusteeProfile }) {
  const trusteeId = trusteeProfile?.id;

  const { documents = [] } = useGetDocuments(trusteeId);

  return (
    <Container>
      <Card sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
          Document Verification
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>Document Name</b>
                </TableCell>
                <TableCell>
                  <b>Preview Document</b>
                </TableCell>
                <TableCell>
                  <b>Status</b>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>{doc.documents?.name || 'NA'}</TableCell>

                  <TableCell>
                    <Button
                      variant="outlined"
                      startIcon={<Iconify icon="mdi:eye" />}
                      onClick={() => window.open(doc.documentsFile?.fileUrl, '_blank')}
                    >
                      Preview
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Label
                      variant="soft"
                      color={
                        (doc.status === 1 && 'success') ||
                        (doc.status === 0 && 'warning') ||
                        (doc.status === 2 && 'error') ||
                        'default'
                      }
                    >
                      {doc.status === 1 ? 'Approved' : doc.status === 0 ? 'Pending' : 'Rejected'}
                    </Label>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Container>
  );
}
