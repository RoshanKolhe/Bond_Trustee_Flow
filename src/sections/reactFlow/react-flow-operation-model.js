import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText
} from '@mui/material';
import PropTypes from 'prop-types';

const operations = [
  // {
  //   id: 1,
  //   title: 'image processing',
  //   description: 'Optimize images for analysis.',
  //   icon: '/assets/icons/document-process/process.svg',
  //   type: 'imageProcessing'
  // },
  {
    id: 3,
    title: 'Locate',
    description: 'Sort documents by type.',
    icon: '/assets/icons/document-process/classify.svg',
    type: 'locate',
    color: '#0AAFFF'
  },
  {
    id: 2,
    title: 'Search',
    description: 'Pull key data from documents.',
    icon: '/assets/icons/document-process/extract.svg',
    type: 'search',
    color: '#FFC113'
  },
  // {
  //   id: 4,
  //   title: 'External Data Sources',
  //   description: 'Link to third-party data.',
  //   icon: '/assets/icons/document-process/external-data-source.svg',
  //   type: 'default',
  // },
  // {
  //   id: 5,
  //   title: 'Validate',
  //   description: 'Ensure data accuracy.',
  //   icon: '/assets/icons/document-process/validate.svg',
  //   type: 'validate',
  //   color: '#ED63D2'
  // },
  // {
  //   id: 4,
  //   title: 'Deliver',
  //   description: 'Send documents or data.',
  //   icon: '/assets/icons/document-process/deliver.svg',
  //   type: 'deliver',
  //   color: '#7551E9'
  // },
  // {
  //   id: 7,
  //   title: 'Index Document',
  //   description: 'Tag for quick access.',
  //   icon: '/assets/icons/document-process/index-document.svg',
  //   type: 'default'
  // },
  // {
  //   id: 8,
  //   title: 'Document Query',
  //   description: 'Search documents easily.',
  //   icon: '/assets/icons/document-process/document-query.svg',
  //   type: 'default'
  // },
  // {
  //   id: 9,
  //   title: 'Integration Step',
  //   description: 'Connect external systems.',
  //   icon: '/assets/icons/document-process/integration-steps.svg',
  //   type: 'default'
  // },
  // {
  //   id: 10,
  //   title: 'AI Analyser',
  //   description: 'Analyze data with intelligent insights.',
  //   icon: '/assets/icons/document-process/ai-analyzer.svg',
  //   type: 'default'
  // },
];

export default function OperationSelectorModal({ onSelect, onClose, open, bluePrintNode }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const newData = operations.filter((opt) => !bluePrintNode?.includes(opt.title));
    setData(newData);
  }, [bluePrintNode, open])

  console.log('nodes already present', bluePrintNode)

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Select a Node</DialogTitle>
      <DialogContent dividers>
        <List>
          {data.map((operation) => (
            <ListItem key={operation.id} disablePadding sx={{ borderBottom: '1px solid lightgray' }}>
              <ListItemButton onClick={() => onSelect(operation)}>
                <ListItemAvatar>
                  <Avatar
                    src={operation.icon}
                    alt={operation.title}
                    sx={{ width: 32, height: 32 }}
                  />
                </ListItemAvatar>
                <ListItemText primary={operation.title} secondary={operation.description} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error">Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}

OperationSelectorModal.propTypes = {
  onSelect: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  bluePrintNode: PropTypes.array,
};
