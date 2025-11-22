// 
import { Grid, Button, MenuItem, Typography, Stack } from "@mui/material";
import { useFieldArray, useFormContext } from "react-hook-form";
import { RHFTextField, RHFSelect } from "src/components/hook-form";
import { useEffect } from "react";

// Dropdown options for selector types
const searchSelectorOptions = [
    { label: "ID", value: "id" },
    { label: "Class", value: "class" },
    { label: "CSS", value: "css" },
    { label: "XPath", value: "xpath" },
    { label: "Placeholder", value: "placeholder" },
    { label: "Role", value: "role" },
];

export default function JobDetailsFields() {
    const { control, getValues } = useFormContext();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "fieldsArray",
    });

    // Auto-append one field if empty
    useEffect(() => {
        const currentFields = getValues("fieldsArray");
        if (!currentFields || currentFields.length === 0) {
            append({ fieldName: "", selector: "", attribute: "" });
        }
    }, [append, getValues]);

    return (
        <Grid  spacing={2}>
            {/* Selector Section */}
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
                <Typography variant="subtitle1" sx={{ mb: 1, mt: 2 }}>
                    Fields
                </Typography>
            </Grid>
            {fields.map((field, index) => (
                <Grid
                    container
                    spacing={2}
                    key={field.id}
                    sx={{ mb: 2 }}
                    alignItems="center"
                >
                    <Grid item xs={12} md={4}>
                        <RHFTextField
                            fullWidth
                            name={`fieldsArray[${index}].fieldName`}
                            label="Field Name"


                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <RHFTextField
                            fullWidth
                            name={`fieldsArray[${index}].selector`}
                            label="Selector"


                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <RHFTextField
                            fullWidth
                            name={`fieldsArray[${index}].attribute`}
                            label="Attribute"


                        />
                    </Grid>
                    <Grid item xs={12} md={1} sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button
                            onClick={() => remove(index)}
                            color="error"
                            size="small"
                            sx={{ whiteSpace: "nowrap" }}
                        >
                            Remove
                        </Button>
                    </Grid>
                </Grid>
            ))}

            <Grid item xs={12}>
                <Button
                    variant="outlined"
                    onClick={() =>
                        append({ fieldName: "", selector: "", attribute: "" })
                    }
                >
                    Add Field
                </Button>
            </Grid>
        </Grid>
    );
}


