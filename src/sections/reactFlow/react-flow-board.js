/* eslint-disable no-shadow */
import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import { useSnackbar } from 'notistack';
// eslint-disable-next-line import/no-extraneous-dependencies
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
} from 'reactflow';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'reactflow/dist/style.css';
import { Box, Button } from '@mui/material';
// import axiosInstance from 'src/utils/axios';
// import { useGetBluePrint } from 'src/api/blue-print';
import OperationSelectorModal from './react-flow-operation-model';
import ReactFlowCustomNodeStructure from './react-flow-custom-node';
import { ReactFlowClassify, ReactFlowDeliver, ReactFlowExtract, ReactFlowIngestion, ReactFlowValidate } from './components';
import ReactFlowCustomAddNodeStructure from './react-flow-custom-add-node';

const nodeTypes = {
  custom: ReactFlowCustomNodeStructure,
  customAddNode: ReactFlowCustomAddNodeStructure,
  initialize: ReactFlowIngestion,
  locate: ReactFlowClassify,
  search: ReactFlowExtract,
  validate: ReactFlowValidate,
  deliver: ReactFlowDeliver,
}

const initialNodes = [
  {
    id: '1',
    type: 'initialize',
    data: {
      id: '1',
      label: 'Initialize',
      icon: '/assets/icons/document-process/ignestion.svg',
      style: {
        border: `5px solid #2DCA73`,
        borderRight: '5px solid white',
      },
    },
    position: { x: 0, y: 0 },
  },
  {
    id: '2',
    type: 'customAddNode',
    data: {
      id: '2',
      label: 'New Node',
      icon: '/assets/icons/document-process/add.svg',
      style: {
        border: '5px solid ',
        borderTop: '5px solid white',
        borderLeft: '5px solid white',
      }
    },   
    position: { x: 330, y: 0 },
  },
];

const initialEdges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    animated: true,
    style: { stroke: 'black' },
  },
  
];

export default function ReactFlowBoard({ isUnlock }) {
  const params = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = params;
  const [data, setData] = useState(null);
  // const { bluePrints, bluePrintsLoading } = useGetBluePrint(id);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [bluePrint, setBluePrint] = useState([]);
  const [presentNodes, setPresentNodes] = useState([]);
  const [borderDirection, setBorderDirection] = useState('down');
  const [showModal, setShowModal] = useState(false);
  const [lastNodeId, setLastNodeId] = useState(2);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  // useEffect(() => {
  //   if (bluePrints && !bluePrintsLoading) {
  //     if (bluePrints?.success) {
  //       setData(bluePrints?.data);
  //     }
  //   }
  // }, [bluePrints, bluePrintsLoading]);

  // useEffect(() => {
  //   if (data) {
  //     // setting bluePrint
  //     setBluePrint(data?.bluePrint);

  //     const newPresentNodes = data?.bluePrint.length > 0 ? data?.bluePrint.map((item) => item.nodeName) : [];
  //     setPresentNodes(newPresentNodes);

  //     // setting nodes
  //     const newNodes = data?.nodes?.length > 0 && data?.nodes.map((node) => ({
  //         ...node,
  //         data : {
  //           ...node.data,
  //           functions: {
  //             addToLeft: addNodeToLeft,
  //             addToRight: addNodeToRight,
  //             deleteNode,
  //             handleBluePrintComponent
  //           },
  //           bluePrint: data?.bluePrint?.find((item) => item.nodeName === node.data.label)?.component,
  //         }
  //       }));

  //     setNodes(newNodes || initialNodes);

  //     setLastNodeId(newNodes?.length || 2);

  //     setEdges(data?.edges || []);
  //   } else {
  //     // setting up the nodes...
  //     setNodes((prev) => [...prev, ...initialNodes.map((node) => (
  //       {
  //         ...node, data: {
  //           ...node.data,
  //           functions: {
  //             addToLeft: addNodeToLeft,
  //             addToRight: addNodeToRight,
  //             deleteNode,
  //             handleBluePrintComponent
  //           },
  //           bluePrint: bluePrint.find((item) => item.nodeName === node.data.label)?.component,
  //         }
  //       }))]);

  //     setLastNodeId(2);

  //     // setting up the edges...
  //     setEdges([{
  //       id: `e1-2`,
  //       source: `1`,
  //       target: `2`,
  //       animated: true,
  //       style: { stroke: 'black' },
  //     }])
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [data])

  // useEffect(() => {
  //   if (nodes && nodes.length > 0) {
  //     const filteredNodes = nodes.filter((node) => node.type !== 'customAddNode');

  //     setBluePrint((prev) => {
  //       const existingNames = new Set(prev.map(item => item.nodeName));

  //       const newBlueprintEntries = filteredNodes
  //         .filter((node) => !existingNames.has(node.data.label))
  //         .map((node) => ({
  //           nodeName: node.data.label,
  //           component: null,
  //         }));

  //       return [...prev, ...newBlueprintEntries];
  //     });
  //   }
  // }, [nodes]);

  const handleBluePrintComponent = (label, updatedComponent) => {
    setBluePrint((prev) => prev.map((node) => {
      if (node.nodeName === label) {
        return {
          ...node,
          component: updatedComponent
        }
      }
      return node;
    }))
  };

  const onNodeClick = (_, node) => {
    if (node.data.label.includes('New Node')) {
      setSelectedNodeId(node.id);
      setShowModal(true);
    }
  };

  console.log('present nodes', presentNodes);
  const addNewNode = (operation) => {
    // const newOpNodeId = `${lastNodeId + 1}`;
    const newOpCompNodeId = `${lastNodeId}`;
    const newAddNodeId = `${lastNodeId + 1}`;

    const clickedNode = nodes.find((n) => n.id === selectedNodeId);
    const baseX = clickedNode?.position?.x || 350;
    const baseY = 0;

    // Space layout
    const gapX = 100;
    const newOperationComponentNode = {
      id: newOpCompNodeId,
      type: operation.type,
      data: {
        id: newOpCompNodeId,
        label: `${operation.title}`,
        icon: operation.icon,
        style: borderDirection === 'up' ? {
          border: `5px solid ${operation.color}`,
          borderBottom: '5px dashed lightgray',
          borderRight: '5px dashed lightgray',
        } : {
          border: `5px solid ${operation.color}`,
          borderTop: '5px dashed lightgray',
          borderLeft: '5px dashed lightgray',
        },
        functions: {
          addToLeft: addNodeToLeft,
          addToRight: addNodeToRight,
          deleteNode,
          handleBluePrintComponent
        },
        bluePrint: bluePrint.find((item) => item.nodeName === operation?.title)?.component
      },
      position: { x: baseX - 20, y: baseY },
    };

    if (borderDirection === 'up') {
      setBorderDirection('down');
    } else {
      setBorderDirection('up');
    }

    const newAddNode = {
      id: newAddNodeId,
      type: 'customAddNode',
      data: {
        id: newAddNodeId,
        label: '➕ New Node',
        icon: '/assets/icons/document-process/add.svg',
        style: borderDirection === 'down' ? { 
          border: '5px solid #2DCA73',
          borderBottom: '5px solid white',
          borderRight: '5px solid white',
        } : {
          border: '5px solid #2DCA73',
          borderTop: '5px solid white',
          borderLeft: '5px solid white',
        },
      },
      position: { x: baseX + 165 * 2, y: baseY },
    };

    const newEdge = {
      id: `e${clickedNode?.id}-${newOpCompNodeId}`,
      source: `${clickedNode?.id}`,
      target: `${newOpCompNodeId}`,
      animated: true,
      style: { stroke: 'black' },
    };

    // const newCompEdge = {
    //   id: `e${newOpNodeId}-${newOpCompNodeId}`,
    //   source: `${newOpNodeId}`,
    //   target: `${newOpCompNodeId}`,
    //   animated: true,
    //   style: { stroke: 'black' },
    // };

    const addNewEdge = {
      id: `e${newOpCompNodeId}-${newAddNodeId}`,
      source: `${newOpCompNodeId}`,
      target: `${newAddNodeId}`,
      animated: true,
      style: { stroke: 'black' },
    };

    const lastEdge = {
      id: `e${lastNodeId - 1}-${newOpCompNodeId}`,
      source: `${lastNodeId - 1}`,
      target: `${newOpCompNodeId}`,
      animated: true,
      style: { stroke: 'black' },
    }

    setNodes((nds) =>
      nds
        .filter((n) => n.id !== selectedNodeId)
        .concat(newOperationComponentNode, newAddNode)
    );

    setEdges((eds) =>
      eds
        .filter((e) => e.target !== selectedNodeId)
        .concat(lastEdge, addNewEdge)
    );

    setPresentNodes((prev) => [...prev, newOperationComponentNode?.data?.label]);
    setLastNodeId((id) => id + 1);
    setSelectedNodeId(null);
    setShowModal(false);
  };

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // add node to left
  const addNodeToLeft = (id, operation) => {
    const targetId = Number(id);
    const gapX = 370;

    const currentNode = nodes?.find((node) => Number(node.id) === targetId);
    if (!currentNode) return;

    setEdges((currentEdges) => currentEdges.map((edge) => {
      const sourceNum = Number(edge.source);
      const targetNum = Number(edge.target);

      if (targetNum >= targetId) {
        return {
          ...edge,
          id: `e${sourceNum + 1}-${targetNum + 1}`,
          source: `${sourceNum + 1}`,
          target: `${targetNum + 1}`,
        };
      }
      return edge;
    }));

    setNodes((currentNodes) => {
      const incrementedNodes = currentNodes.map((node) => {
        const nodeIdNum = Number(node.id);
        if (nodeIdNum >= targetId) {
          const newId = nodeIdNum + 1;
          return {
            ...node,
            id: `${newId}`,
            data: {
              ...node.data,
              id: `${newId}`,
            },
            position: {
              x: node.position.x + gapX,
              y: node.position.y,
            },
          };
        }
        return node;
      });

      const newNode = {
        id: `${targetId}`,
        type: operation.type,
        data: {
          id: `${targetId}`,
          label: `${operation.title}`,
          icon: operation.icon,
          style:
            borderDirection === 'up'
              ? {
                border: `5px solid ${operation.color}`,
                borderBottom: '5px dashed lightgray',
                borderRight: '5px dashed lightgray',
              }
              : {
                border: `5px solid ${operation.color}`,
                borderTop: '5px dashed lightgray',
                borderLeft: '5px dashed lightgray',
              },
          functions: {
            addToLeft: addNodeToLeft,
            addToRight: addNodeToRight,
            deleteNode,
            handleBluePrintComponent
          },
          bluePrint: bluePrint.find((item) => item.nodeName === operation?.title)?.component
        },
        position: {
          x: currentNode.position.x,
          y: currentNode.position.y,
        },
      };

      const beforeNodes = incrementedNodes.filter((node) => Number(node.id) < targetId);
      const afterNodes = incrementedNodes.filter((node) => Number(node.id) >= targetId);

      return [...beforeNodes, newNode, ...afterNodes];
    });

    setEdges((prev) => [...prev, {
      id: `${Number(id) - 1}-e${id}`,
      source: `${Number(id) - 1}`,
      target: `${id}`,
      animated: true,
      style: { stroke: 'black' },
    }])

    setPresentNodes((prev) => [...prev, operation?.title]);

  };

  // add node to right
  const addNodeToRight = (id, operation) => {
    const targetId = Number(id);
    const gapX = 350; // horizontal gap for layout shift

    const currentNode = nodes?.find((node) => Number(node.id) === targetId);
    if (!currentNode) return;

    // Update edges: shift edges with source or target >= targetId + 1
    setEdges((currentEdges) =>
      currentEdges.map((edge) => {
        const sourceNum = Number(edge.source);
        const targetNum = Number(edge.target);

        if (sourceNum >= targetId + 1 || targetNum >= targetId + 1) {
          return {
            ...edge,
            id: `e${sourceNum + 1}-${targetNum + 1}`,
            source: `${sourceNum + 1}`,
            target: `${targetNum + 1}`,
            animated: true,
            style: { stroke: 'black' },
          };
        }
        return edge;
      })
    );

    setNodes((currentNodes) => {
      // Shift nodes with id >= targetId + 1
      const incrementedNodes = currentNodes.map((node) => {
        const nodeIdNum = Number(node.id);
        if (nodeIdNum >= targetId + 1) {
          const newId = nodeIdNum + 1;
          return {
            ...node,
            id: `${newId}`,
            data: { ...node.data, id: `${newId}` },
            position: {
              x: node.position.x + gapX,
              y: node.position.y,
            },
          };
        }
        return node;
      });

      // New node inserted to the right of targetId
      const newNodeId = targetId + 1;
      const newNode = {
        id: `${newNodeId}`,
        type: operation.type,
        data: {
          id: `${newNodeId}`,
          label: `${operation.title}`,
          icon: operation.icon,
          style:
            borderDirection === 'up'
              ? {
                border: `5px solid ${operation.color}`,
                borderBottom: '5px dashed lightgray',
                borderRight: '5px dashed lightgray',
              }
              : {
                border: `5px solid ${operation.color}`,
                borderTop: '5px dashed lightgray',
                borderLeft: '5px dashed lightgray',
              },
          functions: {
            addToLeft: addNodeToLeft,
            addToRight: addNodeToRight,
            deleteNode,
            handleBluePrintComponent
          },
          bluePrint: bluePrint.find((item) => item.nodeName === operation?.title)?.component
        },
        position: {
          x: currentNode.position.x + gapX,
          y: currentNode.position.y,
        },
      };

      // Place new node after the original node
      const beforeNodes = incrementedNodes.filter((node) => Number(node.id) <= targetId);
      const afterNodes = incrementedNodes.filter((node) => Number(node.id) > targetId);

      return [...beforeNodes, newNode, ...afterNodes];
    });

    // Add edge from original node to the new node
    setEdges((prev) => [
      ...prev,
      {
        id: `e${targetId}-${targetId + 1}`,
        source: `${targetId}`,
        target: `${targetId + 1}`,
        animated: true,
        style: { stroke: 'black' },
      },
    ]);

    setPresentNodes((prev) => [...prev, operation?.title]);
  };

  console.log('nodes', nodes);
  // delete node
  const deleteNode = (id, label) => {
    const deleteId = Number(id);    
    const gapX = 370;

    let prevNodeId = null;
    let nextNodeId = null;

    // Step 1: Determine prev and next nodes from edges
    setEdges((currentEdges) => {
      const filteredEdges = currentEdges.filter(edge => {
        const source = Number(edge.source);
        const target = Number(edge.target);

        if (target === deleteId) prevNodeId = source;
        if (source === deleteId) nextNodeId = target;

        return source !== deleteId && target !== deleteId;
      });

      // Step 2: If both neighbors exist, add a new edge between them
      if (prevNodeId !== null && nextNodeId !== null) {
        filteredEdges.push({
          id: `e${prevNodeId}-${nextNodeId}`,
          source: `${prevNodeId}`,
          target: `${nextNodeId}`,
          animated: true,
          style: { stroke: 'black' },
        });
      }

      // Step 3: Adjust remaining edge IDs
      const updatedEdges = filteredEdges.map(edge => {
        let sourceNum = Number(edge.source);
        let targetNum = Number(edge.target);

        if (sourceNum > deleteId) sourceNum -= 1;
        if (targetNum > deleteId) targetNum -= 1;

        return {
          ...edge,
          id: `e${sourceNum}-${targetNum}`,
          source: `${sourceNum}`,
          target: `${targetNum}`,
        };
      });

      return updatedEdges;
    });

    // Step 4: Remove node and shift remaining nodes
    setNodes((currentNodes) => {
      const filteredNodes = currentNodes.filter(node => Number(node.id) !== deleteId);

      return filteredNodes.map(node => {
        const nodeIdNum = Number(node.id);
        if (nodeIdNum > deleteId) {
          const newId = nodeIdNum - 1;
          return {
            ...node,
            id: `${newId}`,
            data: { ...node.data, id: `${newId}` },
            position: {
              x: node.position.x - gapX,
              y: node.position.y,
            },
          };
        }
        return node;
      });
    });

    setPresentNodes((prev) => prev.filter((node) => node !== label));
    setBluePrint((prev) => prev.filter((node) => node.nodeName !== label));

  };

  // handle empty components
  const handleEmptyComponents = () => {
    const emptyComponent = bluePrint.find((node) => node.component === null);
    return emptyComponent;
  }

  // submit blueprint
  // const handleSubmitBluePrint = async () => {
  //   try {
  //     const emptyComponent = handleEmptyComponents();
  //     if (emptyComponent) {
  //       enqueueSnackbar(`Please complete ${emptyComponent.nodeName} node`, { variant: 'error' });
  //       return;
  //     }
  //     const data = {
  //       bluePrint,
  //       nodes,
  //       edges,
  //       processesId: Number(id),
  //       isActive: true
  //     };

  //     const response = await axiosInstance.post('/blue-prints', data);
  //     if (response?.data) {
  //       enqueueSnackbar("Blue Print Saved", { variant: 'success' });
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     enqueueSnackbar(typeof error === 'string' ? error : error.error.message, {
  //       variant: 'error',
  //     });
  //   }
  // }

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
        <Button  variant='contained'>Save</Button>
      </Box>
      <ReactFlowProvider >
        <ReactFlow
          nodeTypes={nodeTypes}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onConnect={onConnect}
          defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
          nodesDraggable={isUnlock}
        //  attributionPosition={null as any} 
          fitView
          proOptions={{ hideAttribution: true }}
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow >
        {showModal && <OperationSelectorModal open={showModal} onSelect={addNewNode} onClose={() => setShowModal(false)} bluePrintNode = {presentNodes}/>}
      </ReactFlowProvider>
    </div>
  );
}

ReactFlowBoard.propTypes = {
  isUnlock: PropTypes.bool
}