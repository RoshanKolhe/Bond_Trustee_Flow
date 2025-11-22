import { Grid, IconButton, InputAdornment } from "@mui/material";
import { RHFTextField } from "src/components/hook-form";
import Iconify from "src/components/iconify";
import { useBoolean } from "src/hooks/use-boolean";

export default function FTPComponent() {
    const password = useBoolean();
    
    return (
        <>
            <Grid item xs={12} md={6}>
                <RHFTextField name='host' label='Host' />
            </Grid>

            <Grid item xs={12} md={6}>
                <RHFTextField name='path' label='Path' />
            </Grid>

            <Grid item xs={12} md={6}>
                <RHFTextField name='userName' label='User Name' />
            </Grid>

            <Grid item xs={12} md={6}>
                <RHFTextField
                    name="password"
                    label="Password"
                    type={password.value ? 'text' : 'password'}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={password.onToggle} edge="end">
                                    <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </Grid>
        </>
    )
}