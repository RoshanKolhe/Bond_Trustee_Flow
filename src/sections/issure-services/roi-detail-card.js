import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, IconButton, Divider } from '@mui/material';
import { Icon } from '@iconify/react';

export default function RoiDetailCard({ onClose }) {
  const [open, setOpen] = useState(true);

  const cardData = {
    title: "What’s Inside the Bonds Estimation ?",
    sections: [
      {
        icon: <Icon icon="mdi:trending-up" width={24} height={24} color="#10b981" />,
        title: 'Instant Investment Metrics',
        description:
          'Enter your financials (revenue, borrowings) and see your projected returns, costs, and key investment metrics calculated automatically.',
      },
      {
        icon: <Icon icon="mdi:scale-balance" width={24} height={24} color="#3b82f6" />,
        title: 'Scenario & Market Comparison',
        description:
          'Compare different bond scenarios and benchmark your issuance against similar active bonds in the market to find the perfect fit.',
      },
      {
        icon: <Icon icon="mdi:sparkles" width={24} height={24} color="#f59e0b" />,
        title: 'AI-Powered Recommendations',
        description:
          'Our system analyzes your data to provide smart, actionable recommendations to optimize your bond issuance strategy.',
      },
    ],
  };

  if (!open) return null;

  return (
    <Card
      sx={{
        maxWidth: 500,
        width: '100%',
        borderRadius: 3,
        boxShadow: 3,
        position: 'relative',
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 12,
          top: 12,
          color: '#666',
        }}
      >
        <Icon icon="mdi:close" width={24} height={24} />
      </IconButton>

      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h4"
          component="h2"
          sx={{
            color: '#0288d1',
            fontWeight: 700,
            textAlign: 'center',
            mb: 4,
            pr: 4,
          }}
        >
          {cardData.title}
        </Typography>

        {cardData.sections.map((section, index) => (
          <React.Fragment key={index}>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Box sx={{ flexShrink: 0, mt: 0.5 }}>{section.icon}</Box>
              <Box>
                <Typography
                  variant="h6"
                  component="h3"
                  sx={{
                    fontWeight: 600,
                    mb: 1,
                    color: '#1a1a1a',
                  }}
                >
                  {section.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#666',
                    lineHeight: 1.6,
                  }}
                >
                  {section.description}
                </Typography>
              </Box>
            </Box>
            {index < cardData.sections.length - 1 && <Divider sx={{ my: 3 }} />}
          </React.Fragment>
        ))}
      </CardContent>
    </Card>
  );
}
