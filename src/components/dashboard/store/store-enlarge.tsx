"use client";

import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from "@mui/material/Stack";
import { X } from "@phosphor-icons/react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography/Typography';

interface StoreEnlargeProps {
    id: number;
    open: boolean;
    setOpen: (open: boolean) => void;
}

export function StoreEnlarge({id, open, setOpen}: StoreEnlargeProps): React.JSX.Element {
    const [goals, setGoals] = React.useState(null);

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = () => {
        handleClose();
    };

    return (
    <React.Fragment>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
            <Stack direction="row" sx={{ alignContent: 'space-between', justifyContent: 'space-between' }}>
                {id} Temporary Text
            <Button startIcon={<X fontSize="var(--icon-fontSize-md)" />} onClick={handleClose}></Button>
            </Stack>
        </DialogTitle>

        <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 2, minWidth: '15vw' }}>
                <img
                    src={`/assets/avatar-1.png`}
                    style={{ borderRadius: '50%', width: '100%', height: 'auto' }}
                />
                <Typography variant="body1" sx={{paddingTop: 2}}>
                    5 stars
                </Typography>
            </Box>
        </DialogContent>

        <DialogActions sx={{ alignContent: 'center', justifyContent: 'center' }}>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Buy
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}