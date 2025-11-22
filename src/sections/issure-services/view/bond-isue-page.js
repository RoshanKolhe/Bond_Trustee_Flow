import React from 'react';
import {
  Card,
  CardHeader,
  Box,
  Grid,
  Stack,
  Typography,
  Slider,
  Paper,
  Divider,
} from '@mui/material';
import Chart, { useChart } from 'src/components/chart';
import BondIssueParameters from '../afterAllSteps/issue-parameter';
import IssueInvestmentMatrics from '../afterAllSteps/issue-investement-matrics';
import ScenarioComparison from '../afterAllSteps/scenario-comparison';
import CostsBreakdown from '../afterAllSteps/costs-breakdown';
import MarketComparisons from '../afterAllSteps/market-comparisons';
import { m } from 'framer-motion';


// ----------------------------------------------------------------------
const mockBonds = [
  {
    asin_code: "INE08X507Q82",
    asapl: "12.00%",
    company_name: "Satya microcapital ltd.",
    issue_date: "14-Jun-2024",
    isin_code: "INE08X507Q82",
    price: "10,00,000",
    coupon_rate_percent: "8.25",
    ytm_percent: "8.40",
    interest_payment_frequency: "Quarterly",
    maturity_date: "14-Jun-2034",
    issuer_type: "Corporate",
    ratings: [{ rating: "AAA" }],
  },
  {
    asin_code: "INE12X307P62",
    asapl: "10.75%",
    company_name: "Satya microcapital ltd",
    issue_date: "10-Apr-2023",
    isin_code: "INE12X307P62",
    price: "10,00,000",
    coupon_rate_percent: "7.80",
    ytm_percent: "8.00",
    interest_payment_frequency: "Half-Yearly",
    maturity_date: "10-Apr-2033",
    issuer_type: "Corporate",
    ratings: [{ rating: "AA+" }],
  },
  {
    asin_code: "INE98X102K81",
    asapl: "9.50%",
    company_name: "Satya microcapital ltd",
    issue_date: "20-Jan-2022",
    isin_code: "INE98X102K81",
    price: "5,00,000",
    coupon_rate_percent: "7.25",
    ytm_percent: "7.40",
    interest_payment_frequency: "Monthly",
    maturity_date: "20-Jan-2032",
    issuer_type: "Government",
    ratings: [{ rating: "AAA" }],
  },
  {
    asin_code: "INE01X107L91",
    asapl: "11.20%",
    company_name: "Satya microcapital ltd",
    issue_date: "05-Mar-2025",
    isin_code: "INE01X107L91",
    price: "8,00,000",
    coupon_rate_percent: "9.00",
    ytm_percent: "9.25",
    interest_payment_frequency: "Quarterly",
    maturity_date: "05-Mar-2035",
    issuer_type: "Corporate",
    ratings: [{ rating: "AA" }],
  },
];

export default function BondIssuePage() {
  // Example state values (you can replace with form or API data)
  const [issueSize, setIssueSize] = React.useState(5000000);
  const [couponRate, setCouponRate] = React.useState(7.5);
  const [tenure, setTenure] = React.useState(10);

  // Donut chart (total investment)
  const totalAmountOptions = useChart({
    labels: ['Investor A', 'Investor B', 'Investor C'],
    legend: { position: 'bottom' },
    tooltip: {
      y: {
        formatter: (val) => `₹${val.toLocaleString()}`,
      },
    },
  });

  const totalAmountSeries = [1200000, 900000, 600000];

  // Cost Breakdown chart
  const costBreakdownOptions = useChart({
    labels: [
      'Underwriting Fees',
      'Legal Fees',
      'Advisory Fees',
      'Listing Fees',
      'Other Charges',
    ],
    legend: { position: 'right' },
    tooltip: {
      y: {
        formatter: (val) => `₹${val.toLocaleString()}`,
      },
    },
  });

  const costBreakdownSeries = [400000, 250000, 150000, 100000, 50000];

  return (
    <Box sx={{ p: 3 }} >
      <Stack spacing={3}>
        <BondIssueParameters />
        <IssueInvestmentMatrics />
        <ScenarioComparison />
        <CostsBreakdown />
        <MarketComparisons bonds={mockBonds} />

      </Stack>
    </Box>
  );
}
