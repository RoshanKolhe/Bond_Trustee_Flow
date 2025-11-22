import { useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import {
  Grid,
  Button,
  MenuItem,
  Typography,
  Stack,
} from "@mui/material";
import { RHFTextField, RHFSelect } from "src/components/hook-form";

const selectorTypeOptions = [
  { label: "ID", value: "id" },
  { label: "Class", value: "class" },
  { label: "CSS", value: "css" },
  { label: "XPath", value: "xpath" },
  { label: "Placeholder", value: "placeholder" },
  { label: "List", value: "list" },
  { label: "Object", value: "object" },
];

const searchSelectorOptions = [
  { label: "ID", value: "id" },
  { label: "Class", value: "class" },
  { label: "CSS", value: "css" },
  { label: "XPath", value: "xpath" },
  { label: "Placeholder", value: "placeholder" },
  { label: "Role", value: "role" },
];

function generateRandomId() {
  return Math.random().toString(36).substring(2, 12);
}

function RenderFields({ name }) {
  const { control, watch, setValue } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name});
  const values = watch(name);

  useEffect(() => {
    if (!values || values.length === 0) {
      append({
        id: generateRandomId(),
        fieldName: "",
        selector: "",
        selectorType: "",
        attribute: "",
        children: [],
      });
    }
  }, [values, append]);

  const handleSelectorTypeChange = (index, value) => {
    const current = values[index];
    const updated = [...values];

    if (value === "list" || value === "object") {
      updated[index] = {
        ...current,
        selectorType: value,
        attribute: "",
        children:
          current.children.length > 0
            ? current.children
            : [
                {
                  id: generateRandomId(),
                  fieldName: "",
                  selector: "",
                  selectorType: "",
                  attribute: "",
                  children: [],
                },
              ],
      };
    } else {
      updated[index] = { ...current, selectorType: value };
    }

    setValue(name, updated, { shouldValidate: true });
  };

  return (
    <Grid container direction="column" spacing={2} sx={{ mt: 2 }}>
      {fields.map((field, index) => {
        const fieldPath = `${name}[${index}]`;
        const selectorType = values?.[index]?.selectorType;

        return (
          <Grid item xs={12} key={field.id} sx={{ p: 2, borderRadius: 1, backgroundColor: "#fafafa" }}>
            {/* Row of fields */}
            <Grid container spacing={2} alignItems="flex-start">
              <Grid item xs={12} sm={6} md={3}>
                <RHFTextField name={`${fieldPath}.fieldName`} label="Field Name" fullWidth />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <RHFTextField name={`${fieldPath}.selector`} label="Selector" fullWidth />
              </Grid>

              {/* Selector Type */}
              <Grid item xs={12} sm={6} md={3}>
                <RHFSelect
                  name={`${fieldPath}.selectorType`}
                  label="Selector Type"
                  onChange={(e) => handleSelectorTypeChange(index, e.target.value)}
                  fullWidth
                >
                  {selectorTypeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </RHFSelect>

                {/* Remove button */}
                {(!selectorType || selectorType === "list" || selectorType === "object") && (
                  <Button
                    onClick={() => remove(index)}
                    color="error"
                    size="small"
                    variant="outlined"
                    sx={{ mt: 1, ml: "auto", display: "block" }}
                  >
                    Remove
                  </Button>
                )}
              </Grid>

              {/* Attribute + Remove */}
              {selectorType && selectorType !== "list" && selectorType !== "object" && (
                <Grid item xs={12} sm={6} md={3}>
                  <RHFTextField name={`${fieldPath}.attribute`} label="Attribute" fullWidth />
                  <Button
                    onClick={() => remove(index)}
                    color="error"
                    size="small"
                    variant="outlined"
                    sx={{ mt: 1, ml: "auto", display: "block" }}
                  >
                    Remove
                  </Button>
                </Grid>
              )}
            </Grid>

            {/* Nested fields */}
            {(selectorType === "list" || selectorType === "object") && (
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Nested Fields
                </Typography>
                <RenderFields name={`${fieldPath}.children`} />
              </Grid>
            )}
          </Grid>
        );
      })}

      <Grid item>
        <Button
          variant="outlined"
          size="small"
          type="button" // 👈 prevents form submit
          onClick={() =>
            append({
              id: generateRandomId(),
              fieldName: "",
              selector: "",
              selectorType: "",
              attribute: "",
              children: [],
            })
          }
        >
          + Add Field
        </Button>
      </Grid>
    </Grid>
  );
}

export default function JobListFields() {
  return (
    <Grid container spacing={2}>
      {/* Parent Selector Section */}
      <Grid item xs={12}>
        <Typography variant="h6" sx={{ mt: 2 }}>
          Parent Selector
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
          <RHFTextField
            fullWidth
            name="selector.name"
            label="Selector Name"
            placeholder=".srp-jobtuple-wrapper .title"
          />
          <RHFSelect fullWidth name="selector.selectorType" label="Selector Type">
            {searchSelectorOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </RHFSelect>
        </Stack>
      </Grid>

      {/* Fields Section */}
      <Grid item xs={12}>
        <Typography variant="h6" sx={{ mt: 2 }}>
          Fields
        </Typography>
        <RenderFields name="fields" />
      </Grid>
    </Grid>
  );
}
