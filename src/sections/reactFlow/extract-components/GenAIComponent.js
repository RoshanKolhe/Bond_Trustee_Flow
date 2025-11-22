import { Grid, Button } from "@mui/material";
import { useFieldArray, useFormContext } from "react-hook-form";
import { RHFTextField } from "src/components/hook-form";
import PropTypes from "prop-types";
import { useEffect } from "react";

export default function GenAIComponent({ namePrefix }) {
    const { control, getValues } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        name: namePrefix,
    });

    // Auto-append one field if empty
    useEffect(() => {
        const currentFields = getValues(namePrefix);
        if (!currentFields || currentFields.length === 0) {
            append({ prompt: null, variableName: null });
        }
    }, [namePrefix, append, getValues]);

    return (
        <>
            {fields.map((field, index) => (
                <Grid sx={{mb: '10px'}} container spacing={2} key={field.id}>
                    <Grid item xs={5}>
                        <RHFTextField name={`${namePrefix}[${index}].prompt`} label="Prompt" />
                    </Grid>
                    <Grid item xs={5}>
                        <RHFTextField name={`${namePrefix}[${index}].variableName`} label="Variable Name" />
                    </Grid>
                    <Grid item xs={2}>
                        <Button onClick={() => remove(index)} color="error">
                            Remove
                        </Button>
                    </Grid>
                </Grid>
            ))}
            <Button onClick={() => append({ prompt: '', variableName: '' })}>Add Field</Button>
        </>
    );
};

GenAIComponent.propTypes = {
    namePrefix: PropTypes.string.isRequired,
};
