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
import type { Cosmetic } from '@/types/cosmetic';
import { CosmeticType } from '@/types/cosmetic';
import { useUser } from '@/hooks/use-user';
import { useState, useEffect } from 'react';
import { buyCosmeticId } from '@/api/services/cosmetic';

interface StoreEnlargeProps {
    cosmetic: Cosmetic | null;
    open: boolean;
    setOpen: (open: boolean) => void;
}

export function StoreEnlarge({cosmetic, open, setOpen}: StoreEnlargeProps): React.JSX.Element {
    const { eduquestUser, checkSession } = useUser();
    const [ disabled, setDisabled ] = useState<boolean>(true);

    useEffect(() => {
        if (eduquestUser && cosmetic) {
            if (eduquestUser.current_points > cosmetic.cost) {
                setDisabled(false);
            }
            else {
                setDisabled(true);
            }
        }
    }, [open, eduquestUser, cosmetic]);

    const handleClose = (): void => {
        setOpen(false);
    };

    const handleSubmit = async (): Promise<void> => {
        if (cosmetic) {
            await buyCosmeticId(cosmetic);
            await checkSession?.();
        }
        handleClose();
    };

    return (
        <React.Fragment>
        {
            cosmetic ?
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>
                        <Stack direction="row" sx={{ alignContent: 'space-between', justifyContent: 'space-between' }}>
                        <Typography noWrap variant="h2">{cosmetic.name}</Typography>
                        <Button startIcon={<X fontSize="var(--icon-fontSize-md)" />} onClick={handleClose} />
                        </Stack>
                    </DialogTitle>

                    <DialogContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 2, minWidth: '60vw' }}>
                            {
                                cosmetic.type === CosmeticType.Picture ?
                                <Box
                                    component="img"
                                    alt="Store item preview"
                                    src={`/assets/${cosmetic.image.filename}`}
                                    sx={{ borderRadius: '50%', width: '100%', height: 'auto' }}
                                />
                                :
                                <Box
                                    component="img"
                                    alt="Store item preview"
                                    src={`/assets/${cosmetic.image.filename}`}
                                    sx={{ width: '100%', height: 'auto' }}
                                />
                            }
                            <Typography variant="body1" sx={{paddingTop: 2}}>
                                {cosmetic.cost} stars
                            </Typography>
                        </Box>
                    </DialogContent>

                    <DialogActions sx={{ alignContent: 'center', justifyContent: 'center' }}>
                    <Button onClick={handleSubmit} variant="contained" color="primary" disabled={disabled}>
                        Buy
                    </Button>
                    </DialogActions>
                </Dialog>
            : null
        }
        </React.Fragment>
  );
}
