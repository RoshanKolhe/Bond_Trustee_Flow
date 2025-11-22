import { useEffect, useMemo, useState } from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import PropTypes from "prop-types";
import {
    Button,
    Grid,
    MenuItem,
    Stack,
    Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import FormProvider, { RHFSelect, RHFTextField } from "src/components/hook-form";

import ReactFlowCustomNodeStructure from "../react-flow-custom-node";
import CustomProcessDialogue from "./components-dialogue";
import LogsProcessDialogue from "./logs-dialogue";

// Selector type dropdown options
const searchSelectorOptions = [
    { label: "ID", value: "id" },
    { label: "Class", value: "class" },
    { label: "CSS", value: "css" },
    { label: "XPath", value: "xpath" },
    { label: "Placeholder", value: "placeholder" },
    { label: "Role", value: "role" },
];

// Validation schema


export default function ReactFlowExtract({ data }) {
    const [isOpen, setIsOpen] = useState(false);
    const [logsOpen, setLogsOpen] = useState(false);

    const NewSearchSchema = Yup.object().shape({
    // searchText: Yup.string().required("Search text is required"),
    selector: Yup.object().shape({
        name: Yup.string().required("Selector name is required"),
        selectorType: Yup.string().required("Selector type is required"),
    }),
});

    // Default values from blueprint
    const defaultValues = useMemo(
        () => ({
            // searchText: data?.bluePrint?.searchText || "",
            selector: {
                name: data?.bluePrint?.selector?.name || "",
                selectorType: data?.bluePrint?.selector?.selectorType || "",
            },
        }),
        [data]
    );

    const methods = useForm({
        resolver: yupResolver(NewSearchSchema),
        defaultValues,
    });
    
    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = handleSubmit(async (formData) => {
        console.log("Form Data:", formData);
        data.functions.handleBluePrintComponent(data.label, { ...formData });
        handleCloseModal();
    });

    useEffect(() => {
        reset(defaultValues);
    }, [defaultValues, reset]);

    const handleOpenModal = () => setIsOpen(true);
    const handleCloseModal = () => setIsOpen(false);

    return (
        <Stack sx={{ marginTop: 3 }} spacing={1}>
            <ReactFlowCustomNodeStructure data={data} />
            <Typography variant="h5">2. {data.label}</Typography>

            {data?.isProcessInstance !== true ? (
                <Button
                    sx={{ width: "200px", color: "royalBlue", borderColor: "royalBlue" }}
                    variant="outlined"
                    onClick={handleOpenModal}
                >
                    Search Here
                </Button>
            ) : (
                <Button
                    sx={{ width: "200px", color: "royalBlue", borderColor: "royalBlue" }}
                    variant="outlined"
                    onClick={() => setLogsOpen(true)}
                >
                    View Logs
                </Button>
            )}

            {/* Search Dialog */}
            <CustomProcessDialogue
                title="Search"
                isOpen={isOpen}
                handleCloseModal={handleCloseModal}
            >
                <FormProvider methods={methods} onSubmit={onSubmit}>
                    <Grid container spacing={2}>
                        {/* Selector Name and Selector Type side by side */}
                        <Grid item xs={12} md={6}>
                            <RHFTextField
                                name="selector.name"
                                label="Selector Name"
                                placeholder="Enter skills / designations / companies"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <RHFSelect
                                name="selector.selectorType"
                                label="Selector Type"
                                fullWidth
                            >
                                {searchSelectorOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </RHFSelect>
                        </Grid>
                    </Grid>

                    <Stack
                        alignItems="flex-end"
                        sx={{ mt: 3, display: "flex", gap: "10px" }}
                    >
                        <LoadingButton
                            type="submit"
                            variant="contained"
                            loading={isSubmitting}
                        >
                            Save
                        </LoadingButton>
                    </Stack>
                </FormProvider>
            </CustomProcessDialogue>

            {/* Logs modal */}
            <LogsProcessDialogue
                isOpen={logsOpen}
                handleCloseModal={() => setLogsOpen(false)}
                processInstanceId={14}
                nodeName={data.label}
            />
        </Stack>
    );
}

ReactFlowExtract.propTypes = {
    data: PropTypes.object,
};
