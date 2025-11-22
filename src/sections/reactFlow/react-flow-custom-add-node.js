import { Box } from "@mui/material"
import PropTypes from "prop-types"
// eslint-disable-next-line import/no-extraneous-dependencies
import { Handle, Position } from "reactflow"

export default function ReactFlowCustomAddNodeStructure({ data }) {
    return (
        <Box sx={{ mt: 6, display: 'flex', justifyContent: 'left' }}>
            {/* progress line box */}
            <Box
                sx={{
                    width: 140,
                    height: 250,    // keep it 250 for similar height with other nodes
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    // transform: 'rotate(45deg)',
                }}
            >
                {/* outer circle box */}
                <Box
                    sx={{
                        margin: '10px',
                        width: 140,
                        height: 140,
                        borderRadius: '50%',
                        border: '2px solid white',
                        boxShadow: '0 8px 12px rgba(0, 0, 0, 0.3)', // outer drop shadow
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        // transform: 'rotate(-45deg)',
                    }}
                >
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

                    {/* innner circle box */}
                    <Box
                        sx={{
                            width: 130,
                            height: 130,
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
                            sx={{ width: '50px' }}
                            component='img'
                            src={data.icon}
                            alt='document-proccess'
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

ReactFlowCustomAddNodeStructure.propTypes = {
    data: PropTypes.object,
}