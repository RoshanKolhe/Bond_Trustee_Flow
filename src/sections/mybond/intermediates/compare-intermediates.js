import React, { useState } from 'react';
import {
  Box,
  Typography,
  Divider,
  Avatar,
  Card,
  Grid,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TableContainer,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  Paper,
} from '@mui/material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Iconify from 'src/components/iconify';

import {
  DEBENTURE_TRUSTEES,
  RTAS,
  LEAD_MANAGERS,
  LEGAL_ADVISORS,
  VALUERS,
} from './intermediates-dummy-date';

// ------------------ helpers ------------------

const DATA_MAP = {
  trustee: DEBENTURE_TRUSTEES,
  rta: RTAS,
  'lead-manager': LEAD_MANAGERS,
  legal: LEGAL_ADVISORS,
  valuer: VALUERS,
};

const parseNumber = (value) =>
  typeof value === 'number' ? value : Number(String(value).replace(/[^\d]/g, ''));

// ------------------ component ------------------

export default function CompareIntermediaryView() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  const type = searchParams.get('type');
  const selectedIds = searchParams.get('ids')?.split(',') || [];

  const sourceData = DATA_MAP[type] || [];
  const selectedItems = sourceData.filter((i) => selectedIds.includes(i.id));

  const handleClose = () => {
    setOpen(false);
    navigate(-1); // ⬅️ go back to previous page
  };

  if (selectedItems.length < 2) {
    return (
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <Typography textAlign="center" color="text.secondary">
            Select at least 2 items to compare
          </Typography>
        </DialogContent>
      </Dialog>
    );
  }

  // ------------------ best values ------------------

  const bestExperience = Math.max(...selectedItems.map((i) => parseNumber(i.experience)));
  const bestResponse = Math.min(...selectedItems.map((i) => parseNumber(i.responseTime)));
  const bestFees = Math.min(
    ...selectedItems.map((i) => parseNumber(i.fees || i.feeStructure || '0'))
  );

  const highlight = (condition) => ({
    color: condition ? '#1b5e20' : 'inherit',
    fontWeight: condition ? 700 : 400,
  });

  const comparisonRows = [
    {
      label: 'Experience',
      key: 'experience',
      bestValue: bestExperience,
    },
    {
      label: 'Response Time',
      key: 'responseTime',
      bestValue: bestResponse,
      reverse: true,
    },
    {
      label: 'Fees',
      key: 'fees',
      altKey: 'feeStructure',
      bestValue: bestFees,
      reverse: true,
    },
    { label: 'Regulatory', key: 'regulatory' },
    { label: 'Past Issues', key: 'pastIssues' },
    { label: 'Tech Capability', key: 'techCapability' },
    { label: 'Rating', key: 'rating' },
    { label: 'Charge Creation', key: 'chargeCreationSupport' },
  ];


  // ------------------ render ------------------

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontWeight: 700,
        }}
      >
        COMPARE {type?.toUpperCase()}
        <IconButton onClick={handleClose}>
          <Iconify icon="eva:close-fill" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            border: '1px solid #BDBDBD',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <Table>
            {/* ---------- HEADER ---------- */}
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{ backgroundColor: '#978e8eff', color: '#fff', fontWeight: 700 }}
                >
                  Parameter
                </TableCell>

                {selectedItems.map((item) => (
                  <TableCell
                    key={item.id}
                    sx={{
                      backgroundColor: 'info.darker',
                      color: '#fff',
                      fontWeight: 700,
                      textAlign: 'center',
                    }}
                  >
                    {item.legalEntityName}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            {/* ---------- BODY ---------- */}
            <TableBody>
              {comparisonRows.map((row) => (
                <TableRow key={row.label}>
                  {/* Parameter */}
                  <TableCell sx={{ fontWeight: 600 }}>
                    {row.label}
                  </TableCell>

                  {/* Values */}
                  {selectedItems.map((item) => {
                    const rawValue =
                      item[row.key] ?? (row.altKey ? item[row.altKey] : '-');

                    const numericValue = parseNumber(rawValue);

                    const isBest =
                      row.bestValue !== undefined &&
                      numericValue === row.bestValue;

                    return (
                      <TableCell
                        key={item.id}
                        sx={{
                          textAlign: 'center',
                          fontWeight: isBest ? 700 : 500,
                          color: isBest ? 'success.main' : 'inherit',
                        }}
                      >
                        {rawValue || '-'}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>

    </Dialog>
  );
}
