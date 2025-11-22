import { Button, FormControl, FormControlLabel, Radio, RadioGroup, Stack, Typography } from "@mui/material";
import { useMemo, useEffect, useState } from "react";
import PropTypes from "prop-types";
import * as Yup from 'yup';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router";
import { paths } from "src/routes/paths";
import { useParams } from "src/routes/hook";
import ReactFlowCustomNodeStructure from "../react-flow-custom-node";
import LogsProcessDialogue from "./logs-dialogue";

export default function ReactFlowValidate({ data }) {
    const navigate = useNavigate();
    const params = useParams();
    const { id } = params;
    const [logsOpen, setLogsOpen] = useState(false);

    const newValidationSchema = Yup.object().shape({
        method: Yup.string().required('Validation method is required')
    });

    const defaultValues = useMemo(
        () => ({
            method: data.bluePrint?.method || 'human',
        }),
        [data]
    );

    const methods = useForm({
        resolver: yupResolver(newValidationSchema),
        defaultValues,
    });

    const {
        reset,
        watch,
        control,
        setValue,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const values = watch();
    console.log('values', values);

    const onSubmit = handleSubmit(async (formData) => {
        console.log(formData);
        data.functions.handleBluePrintComponent(data.label, { ...formData });
    })

    useEffect(() => {
        if (values.method) {
            onSubmit();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values.method]);

    useEffect(() => {
        reset(defaultValues);
    }, [defaultValues, reset]);

    // Open logs modal
    const handleOpenLogsModal = () => {
        setLogsOpen(true);
    };

    // Close logs modal
    const handleCloseLogsModal = () => {
        setLogsOpen(false);
    }

    return (
        <Stack sx={{ marginTop: 3 }} spacing={1}>
            <ReactFlowCustomNodeStructure data={data} />
            <Typography variant='h5'>4. {data.label}</Typography>

            <FormControl component="fieldset">
                <Typography variant="h5">
                    Validation Type
                </Typography>
                <RadioGroup
                    row
                    name="method"
                    value={values.method}
                    onChange={(e) => setValue('method', e.target.value)}
                    sx={{
                        display: 'flex',
                        alignItems: 'left',
                        flexDirection: 'column'
                    }}
                >
                    <FormControlLabel sx={{ pointerEvents: data?.isProcessInstance === true ? 'none' : '' }} value="human" control={<Radio />} label="Human Validation" />
                    <FormControlLabel sx={{ pointerEvents: data?.isProcessInstance === true ? 'none' : '' }} value="auto" control={<Radio />} label="Auto Validation" />
                    {data?.isProcessInstance === true && (
                        <Button
                            sx={{ width: "200px", color: "royalBlue", borderColor: "royalBlue" }}
                            variant="outlined"
                            onClick={() => navigate(paths.dashboard.processesInstance.extractedDocs(id))}
                        >
                            Extracted Documents
                        </Button>
                    )}
                </RadioGroup>
            </FormControl>
            {(data?.isProcessInstance === true) && <Button sx={{ width: '200px', color: 'royalBlue', borderColor: 'royalBlue' }} variant='outlined' onClick={() => handleOpenLogsModal()}>View Logs</Button>}

            {/* logs modal */}
            <LogsProcessDialogue isOpen={logsOpen} handleCloseModal={handleCloseLogsModal} processInstanceId={14} nodeName={data.label} />
        </Stack>
    )
}

ReactFlowValidate.propTypes = {
    data: PropTypes.object
}