import { Grid } from "@mui/material";
import { RHFTextField } from "src/components/hook-form";

export default function HTTPComponent(){
    return(
        <Grid item xs={12} md={12}>
            <RHFTextField name='url' label='URL' />
        </Grid>
    )
}