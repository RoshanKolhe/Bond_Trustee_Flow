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
import JobListFields from "../locate-components/jobListComponents";

// Import our separated field groups

const modelOptions = [
  { label: "List", value: "list", isDisabled: false },
  { label: "Details", value: "detail", isDisabled: false },
];

export default function ReactFlowClassify({ data }) {
  const [isOpen, setIsOpen] = useState(false);
  const [logsOpen, setLogsOpen] = useState(false);

  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => setIsOpen(false);
  const handleOpenLogsModal = () => setLogsOpen(true);
  const handleCloseLogsModal = () => setLogsOpen(false);

const fieldSchema = Yup.object().shape({
  fieldName: Yup.string().required("Field name is required"),
  selector: Yup.string().required("Selector is required"),
  selectorType: Yup.string().required("Selector type is required"),
  attribute: Yup.string().when("selectorType", {
    is: (val) => val !== "list" && val !== "object",
    then: (schema) => schema.required("Attribute is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  children: Yup.array().of(
    Yup.lazy(() => fieldSchema)
  ).optional(),  // children allowed but not mandatory
});


// Now define the full schema
const newClassificationSchema = Yup.object().shape({
  mode: Yup.string().required("Mode is required"),
  selector: Yup.object().shape({
    name: Yup.string().required("Selector name is required"),
    selectorType: Yup.string().required("Selector type is required"),
  }),
  fields: Yup.array().of(fieldSchema), // top-level fields array
});



  const defaultValues = useMemo(
    () => ({
      mode: data.bluePrint?.mode || "",
      selector: data.bluePrint?.selector || { name: "", selectorType: "" },
      fields: data.bluePrint?.fields || [],
    }),
    [data]
  );

  const methods = useForm({
    resolver: yupResolver(newClassificationSchema),
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
    console.log("Escalation Matrix", formData);
    data.functions.handleBluePrintComponent(data.label, formData);
    handleCloseModal();
  });

  // Switch case for rendering correct fields
  const renderModeFields = (mode) => {
    switch (mode) {
      case "list":
        return <JobListFields />;

      case "detail":
        return <JobDetailsFields />;
      default:
        return null;
    }
  };

  return (
    <Stack sx={{ marginTop: 3, zIndex: 100000 }} spacing={1}>
      <ReactFlowCustomNodeStructure data={data} />
      <Typography variant="h5">3. {data.label}</Typography>
      {data?.isProcessInstance !== true && (
        <Button
          sx={{ width: "200px", color: "royalBlue", borderColor: "royalBlue" }}
          onClick={handleOpenModal}
          variant="outlined"
        >
          Add Mode
        </Button>
      )}
      {data?.isProcessInstance === true && (
        <Button
          sx={{ width: "200px", color: "royalBlue", borderColor: "royalBlue" }}
          variant="outlined"
          onClick={() => handleOpenLogsModal()}
        >
          View Logs
        </Button>
      )}

      {/* Dialog */}
      <CustomProcessDialogue
        isOpen={isOpen}
        handleCloseModal={handleCloseModal}
        title="Add Mode"
      >
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Grid container spacing={2}>
            {/* Mode selector */}
             <Grid item xs={12} md={12}>
              <RHFSelect name="mode" label="Select Mode">
                {modelOptions.map((model) => (
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
            <Grid item xs={12} md={12} sx={{ mt: 2  }}>
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

      {/* logs modal */}
      <LogsProcessDialogue
        isOpen={logsOpen}
        handleCloseModal={handleCloseLogsModal}
        processInstanceId={14}
        nodeName={data.label}
      />
    </Stack>
  );
}

ReactFlowClassify.propTypes = {
  data: PropTypes.object,
};
