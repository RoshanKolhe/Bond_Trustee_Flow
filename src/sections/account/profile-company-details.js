import { useState } from 'react';
import {
  Box,
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
  IconButton,
  Card,
} from '@mui/material';

import Iconify from 'src/components/iconify';
import { enqueueSnackbar } from 'notistack';
import axiosInstance from 'src/utils/axios';
import { useGetDocuments, useGetSignatories } from 'src/api/trusteeKyc';

import RejectReasonDialog from './reject-signatory';
import Label from 'src/components/label';

export default function KYCSignatories({ trusteeProfile }) {
  const trusteeId = trusteeProfile?.id;
  const stepperId = trusteeProfile?.kycApplications?.currentProgress?.[3];

  const { documents = [], refreshDocuments } = useGetDocuments(trusteeId);

  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);

  // APPROVE DOCUMENT
  const handleApprove = async (documentId) => {
    try {
      await axiosInstance.patch('/trustee-profiles/document-verification', {
        status: 1,
        documentId,
        reason: '',
      });

      enqueueSnackbar('Document Approved', { variant: 'success' });
      refreshDocuments(); // Refresh instantly
    } catch (err) {
      enqueueSnackbar('Approval failed', { variant: 'error' });
    }
  };

  // OPEN REJECT POPUP
  const handleRejectClick = (documentId) => {
    setSelectedDocumentId(documentId);
    setRejectOpen(true);
  };

  // SUBMIT REJECTION
  const handleRejectSubmit = async () => {
    if (!rejectReason) {
      enqueueSnackbar('Please enter a reason', { variant: 'warning' });
      return;
    }

    try {
      await axiosInstance.patch('/trustee-profiles/document-verification', {
        status: 2,
        documentId: selectedDocumentId,
        reason: rejectReason,
      });

      enqueueSnackbar('Document Rejected', { variant: 'success' });

      setRejectOpen(false);
      setRejectReason('');
      refreshDocuments(); // Refresh instantly
    } catch (err) {
      enqueueSnackbar('Rejection failed', { variant: 'error' });
    }
  };

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
                <TableCell align="right">
                  <b>Actions</b>
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

                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <IconButton
                        color="success"
                        onClick={() => handleApprove(doc.id)}
                        disabled={doc.status === 1 || doc.status === 2} // DISABLE for APPROVED or REJECTED
                        sx={{
                          opacity: doc.status === 1 || doc.status === 2 ? 0.4 : 1,
                          cursor: doc.status === 1 || doc.status === 2 ? 'not-allowed' : 'pointer',
                        }}
                      >
                        <Iconify icon="eva:checkmark-circle-2-outline" width={26} />
                      </IconButton>

                      <IconButton
                        color="error"
                        onClick={() => handleRejectClick(doc.id)}
                        disabled={doc.status === 1 || doc.status === 2} // DISABLE for APPROVED or REJECTED
                        sx={{
                          opacity: doc.status === 1 || doc.status === 2 ? 0.4 : 1,
                          cursor: doc.status === 1 || doc.status === 2 ? 'not-allowed' : 'pointer',
                        }}
                      >
                        <Iconify icon="eva:close-circle-outline" width={26} />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* REJECT DIALOG */}
      <RejectReasonDialog
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        reason={rejectReason}
        setReason={setRejectReason}
        onSubmit={handleRejectSubmit}
      />
    </Container>
  );
}
