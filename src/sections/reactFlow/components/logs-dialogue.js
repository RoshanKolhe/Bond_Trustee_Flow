import {
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography,
    CircularProgress,
    Button
} from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import Iconify from "src/components/iconify";
import axiosInstance from "src/utils/axios";

export default function LogsProcessDialogue({ isOpen, handleCloseModal, processInstanceId, nodeName }) {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const limit = 20;
    const scrollRef = useRef(null);

    const fetchLogs = async (reset = false) => {
        setLoading(true);
        try {
            const res = await axiosInstance.post('/log-entries/logs-by-node', {
                processInstanceId,
                nodeName,
                skip: page * limit,
                limit,
            });
            const newLogs = res.data;
            setLogs(prev => reset ? newLogs : [...newLogs, ...prev]);
        } catch (err) {
            console.error("Error fetching logs:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchLogs(true);
            setPage(1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    const getLogColor = (type) => {
        switch (type) {
            case 0: return "#00BFFF"; // Info
            case 1: return "#FF3B3B"; // Error
            case 2: return "#00FF00"; // Success
            case 3: return "#FFD700"; // Warning
            default: return "#FFFFFF"; // Default
        }
    };

    return (
        <Dialog open={isOpen} onClose={() => {
            handleCloseModal();
            setPage(0);
        }} maxWidth="md" fullWidth>
            <DialogTitle sx={{
                backgroundColor: 'black',
                color: 'white',
                py: '14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Typography variant="subtitle1">Logs for {nodeName}</Typography>
                <IconButton 
                    onClick={() => {
                        handleCloseModal();
                        setPage(0);
                    }} 
                    sx={{ border: '1px solid white' }}
                >
                    <Iconify icon="mdi:close" color="white" />
                </IconButton>
            </DialogTitle>

            <DialogContent
                dividers
                sx={{
                    backgroundColor: 'black',
                    color: '#00FF00',
                    maxHeight: '60vh',
                    overflowY: 'auto',
                    fontFamily: 'monospace',
                    scrollbarWidth: 'none',
                    '&::-webkit-scrollbar': {
                        display: 'none', 
                    },
                }}
                ref={scrollRef}
            >
                {logs.slice().reverse().map((log, index) => (
                    <Typography
                        key={log.id || index}
                        sx={{
                            color: getLogColor(log.logType),
                            fontFamily: 'monospace',
                            fontSize: '0.875rem',
                            whiteSpace: 'pre-wrap',
                            mb: 1
                        }}
                    >
                        [{new Date(log.createdAt).toLocaleTimeString()}] {log.logsDescription}
                    </Typography>
                ))}
                {loading && <CircularProgress size={24} sx={{ mt: 2 }} />}
            </DialogContent>

            <Box p={2} display="flex" justifyContent="center" bgcolor="black">
                <Button
                    variant="outlined"
                    onClick={() => {
                        setPage(p => p + 1);
                        fetchLogs();
                    }}
                    disabled={loading}
                >
                    Load More
                </Button>
            </Box>
        </Dialog>
    );
}

LogsProcessDialogue.propTypes = {
    isOpen: PropTypes.bool,
    handleCloseModal: PropTypes.func,
    processInstanceId: PropTypes.number,
    nodeName: PropTypes.string
};
