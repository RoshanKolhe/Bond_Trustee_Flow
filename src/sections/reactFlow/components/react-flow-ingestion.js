import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import CryptoJS from 'crypto-js';
import * as Yup from 'yup';
// eslint-disable-next-line import/no-extraneous-dependencies
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Button, Grid, MenuItem, Stack, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
// eslint-disable-next-line import/no-extraneous-dependencies
import FormProvider, { RHFSelect, RHFTextField } from "src/components/hook-form";
import ReactFlowCustomNodeStructure from "../react-flow-custom-node";
import { FTPComponent, HTTPComponent } from "../ingestion-components";
import CustomProcessDialogue from "./components-dialogue";
import LogsProcessDialogue from "./logs-dialogue";

export default function ReactFlowIngestion({ data }) {
    const [isOpen, setIsOpen] = useState(false);
    const [logsOpen, setLogsOpen] = useState(false);

    const NewInitializeSchema = Yup.object().shape({
       url: Yup.string().required('Url is required'),

     });
     
    const defaultValues = useMemo(
        () => ({
            url: data.bluePrint?.url || '',
        }),
        [data]
    );

    const methods = useForm({
        resolver: yupResolver(NewInitializeSchema),
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
    console.log("Url", formData);
    data.functions?.handleBluePrintComponent?.(data.label, formData);
    handleCloseModal();
  });


    useEffect(() => {
        reset(defaultValues);
    }, [defaultValues, reset]);

    // Open modal
    const handleOpenModal = () => {
        setIsOpen(true);
    };

    // Close modal
    const handleCloseModal = () => {
        setIsOpen(false);
    }

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
            <Typography variant='h5'>1. {data.label}</Typography>
            {(data?.isProcessInstance !== true) && <Button sx={{ width: '200px', color: 'royalBlue', borderColor: 'royalBlue' }} variant='outlined' onClick={() => handleOpenModal()}>Add Url</Button>}
            {(data?.isProcessInstance === true) && <Button sx={{ width: '200px', color: 'royalBlue', borderColor: 'royalBlue' }} variant='outlined' onClick={() => handleOpenLogsModal()}>View Logs</Button>}
            <CustomProcessDialogue
                isOpen={isOpen}
                handleCloseModal={handleCloseModal}
                title='Add Url'
            >
                <FormProvider methods={methods} onSubmit={onSubmit}>
                     <Grid item xs={12} md={12}>
                                <RHFTextField name='url' label='URL' />
                            </Grid>
                    {(data?.isProcessInstance !== true) && <Stack alignItems="flex-end" sx={{ mt: 3, display: 'flex', gap: '10px' }}>
                        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                            Add
                        </LoadingButton>
                    </Stack>}
                </FormProvider>
            </CustomProcessDialogue>

            {/* logs modal */}
            <LogsProcessDialogue isOpen={logsOpen} handleCloseModal={handleCloseLogsModal} processInstanceId={14} nodeName={data.label} />
        </Stack>
    )
}

ReactFlowIngestion.propTypes = {
    data: PropTypes.object
}