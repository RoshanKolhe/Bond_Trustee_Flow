import { useState } from "react";
import { settings } from "nprogress";
import { Box, Container, IconButton, Typography } from "@mui/material";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
import Iconify from "src/components/iconify";
import ReactFlowBoard from "../react-flow-board";

export default function ReactFlowView(){
    const [isUnlock, setIsUnlock] = useState(false);
    return(
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            <CustomBreadcrumbs
                heading="Extraction Flow"
                links={[{ name: 'Dashboard', href: '/' }]}
                // sx={{
                // mb: { xs: 1, md: 1 },
                // }}
            />
            <Box component='div' sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
                <Box component='div' sx={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <IconButton sx={{paddingLeft: '0px'}}>
                        <Iconify color='#292D32' icon="mdi:keyboard-backspace" width={24} />
                    </IconButton>
                    <Typography sx={{fontWeight: 'normal'}} variant="h5">Define Extraction Flow</Typography>
                </Box>

                <IconButton onClick={() => setIsUnlock(!isUnlock)}>
                    <Iconify width={28} icon={isUnlock ? 'eva:lock-outline' : 'eva:unlock-outline'} />
                </IconButton>
            </Box>

            <ReactFlowBoard isUnlock={isUnlock}/>
        </Container>
    )
}