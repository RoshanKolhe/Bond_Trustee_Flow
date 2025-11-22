import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import {
  Button,
  Grid,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import FormProvider, { RHFSelect } from "src/components/hook-form";
import ReactFlowCustomNodeStructure from "../react-flow-custom-node";
import CustomProcessDialogue from "./components-dialogue";
import LogsProcessDialogue from "./logs-dialogue";

import JobDetailsFields from "../locate-components/jobDetailsComponents";
import DatabaseComponents from "../deliver-components/database";

// Deliver options
const deliverOptions = [
  { label: "Database", value: "database", isDisabled: false },
  { label: "API", value: "api", isDisabled: false },
];

// Yup validation schemas
const deliverSchemas = {
  database: Yup.object().shape({
    model: Yup.string().required("Model is required"),
    mapping: Yup.object().required("Field mapping is required"),
  }),
  api: Yup.object().shape({
    endpoint: Yup.string().url("Invalid URL").required("Endpoint is required"),
    headers: Yup.string().nullable(),
    payload: Yup.object().required("Payload mapping is required"),
  }),
};

export default function ReactFlowDeliver({ data }) {
  const [isOpen, setIsOpen] = useState(false);
  const [logsOpen, setLogsOpen] = useState(false);

  // default values
  const defaultValues = useMemo(
    () => ({
      mode: data.bluePrint?.mode || "",
      model: data.bluePrint?.model || "",
      mapping: data.bluePrint?.mapping || {},
      endpoint: data.bluePrint?.endpoint || "",
      headers: data.bluePrint?.headers || "",
      payload: data.bluePrint?.payloadMapping || {},
    }),
    [data]
  );

  const methods = useForm({
    resolver: yupResolver(deliverSchemas[defaultValues.mode] || Yup.object()),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const onSubmit = handleSubmit(async (formData) => {
    console.log("Deliver Node FormData:", formData);
    data.functions.handleBluePrintComponent(data.label, formData);
    setIsOpen(false);
  });


  const renderModeFields = (mode) => {
    switch (mode) {
      case "database":
        return <DatabaseComponents/>;
      case "api":
        return <JobDetailsFields />;
      default:
        return null;
    }
  };

  return (
    <Stack sx={{ marginTop: 3, zIndex: 100000 }} spacing={1}>
      <ReactFlowCustomNodeStructure data={data} />
      <Typography variant="h5">4. {data.label}</Typography>

      {data?.isProcessInstance !== true && (
        <Button
          sx={{ width: "200px", color: "royalBlue", borderColor: "royalBlue" }}
          onClick={() => setIsOpen(true)}
          variant="outlined"
        >
          Add Destination
        </Button>
      )}

      {data?.isProcessInstance === true && (
        <Button
          sx={{ width: "200px", color: "royalBlue", borderColor: "royalBlue" }}
          variant="outlined"
          onClick={() => setLogsOpen(true)}
        >
          View Logs
        </Button>
      )}

      {/* Modal for Deliver config */}
      <CustomProcessDialogue
        isOpen={isOpen}
        handleCloseModal={() => setIsOpen(false)}
        title="Add Destination"
      >
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Grid container spacing={2}>
            {/* Mode select */}
            <Grid item xs={12} md={12}>
              <RHFSelect name="mode" label="Select Deliver">
                {deliverOptions.map((model) => (
                  <MenuItem
                    disabled={model.isDisabled}
                    key={model.value}
                    value={model.value}
                  >
                    {model.label}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Grid>

            {/* Dynamic fields */}
            <Grid item xs={12} md={12} sx={{ mt: 2 }}>
              {renderModeFields(values.mode)}
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
              Add
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

ReactFlowDeliver.propTypes = {
  data: PropTypes.object,
};
