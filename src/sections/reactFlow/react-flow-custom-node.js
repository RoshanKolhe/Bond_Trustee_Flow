import { Box, IconButton, Popover, Tooltip } from "@mui/material"
import PropTypes from "prop-types"
import { useState } from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { Handle, Position } from "reactflow"
import Iconify from "src/components/iconify";
import OperationSelectorModal from "./react-flow-operation-model";

export default function ReactFlowCustomNodeStructure({ data }){
    const [anchorEl, setAnchorEl] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [direction, setDirection] = useState(null);

    const handleMouseEnter = (e) => {
        if(data?.label?.toLowerCase() !== 'initialize' && (data?.isProcessInstance !== true)){
            setAnchorEl(e.currentTarget);
        }
    };

    const handleMouseLeave = () => {
        setAnchorEl(null);
    };

    const handleAddToLeft = () => {
        setIsOpen(true);
        setDirection('left');
    }

    const handleAddToRight = () => {
        setIsOpen(true);
        setDirection('right');
    }

    const handleSelect = (operation) => {
        if(direction === 'left'){
            data?.functions?.addToLeft(data.id, operation);
        }else if(direction === 'right'){
            data?.functions?.addToRight(data.id, operation);
        }
        handleClose();
    }

    const handleClose = () => {
        setIsOpen(false);
    }

    const handleDeleteNode = () => {
        data?.functions?.deleteNode(data.id, data.label);
    }

    const open = Boolean(anchorEl);

    return(
        <Box onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} sx={{ mt: 6, display: 'flex', justifyContent: 'left' }}>
            {/* Outgoing handle (right side) */}
            <Handle
                type="source"
                position={Position.Right}
                style={{ background: '#555' }}
            />
            {/* Incoming handle (left side)
            <Handle
                type="target"
                position={Position.Top}
                style={{ background: '#555' }}
            /> */}

            {/* Outgoing handle (right side) */}
            {/* <Handle
                type="source"
                position={Position.Bottom}
                style={{ background: '#555' }}
            /> */}
            {/* Incoming handle (left side) */}
            <Handle
                type="target"
                position={Position.Left}
                style={{ background: '#555' }}
            />

            {/* progress line box */}
            <Box
                sx={{
                width: 250,
                height: 250,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: 'rotate(45deg)',
                ...data.style
                }}
            >
                {/* outer circle box */}
                <Box
                    sx={{
                        margin: '10px',
                        width: 180,
                        height: 180,
                        borderRadius: '50%',
                        border: '2px solid white',
                        boxShadow: '0 8px 12px rgba(0, 0, 0, 0.3)', // outer drop shadow
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transform: 'rotate(-45deg)',
                    }}
                >

                    {/* innner circle box */}
                    <Box
                        sx={{
                        width: 170,
                        height: 170,
                        borderRadius: '50%',
                        backgroundColor: 'rgba(136, 136, 136, 0.20)', 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        color: '#fff',
                        }}
                    >
                        {/* image box */}
                        <Box
                            component='img'
                            src={data.icon}
                            alt='document-proccess'
                        />  
                    </Box>
                </Box>
            </Box>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleMouseLeave}
                anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
                }}
                transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
                }}
                disableRestoreFocus
                PaperProps={{ onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave }}
            >
                <Tooltip title="Add to Left" placement="top" arrow>
                    <IconButton onClick={() => handleAddToLeft()}>
                        <Iconify icon="ic:round-arrow-back" />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Add to Right" placement="top" arrow>
                    <IconButton onClick={() => handleAddToRight()}>
                        <Iconify icon="ic:round-arrow-forward" />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Delete" placement="top" arrow>
                    <IconButton color="error" onClick={() => handleDeleteNode()}>
                        <Iconify icon="mdi:delete" />
                    </IconButton>
                </Tooltip>
            </Popover>

            {/* Operation model */}
            <OperationSelectorModal open={isOpen} onClose={handleClose} onSelect={handleSelect} />
        </Box>
    )
}

ReactFlowCustomNodeStructure.propTypes = {
    data : PropTypes.object,
}