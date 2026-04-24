"use client"

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import {Button, Stack} from "@mui/material";
import { StoreEnlarge } from './store-enlarge';

interface StoreCardProps {
  name: string;
  type: number;
  sorting?: number;
}

export function StoreCard({ name, type, sorting }: StoreCardProps): React.JSX.Element {
    const [buyOpen, setBuyOpen] = React.useState(false);
    const [buyID, setBuyID] = React.useState(-1);

    const handleBuy = (id: number): void => {
        setBuyOpen(true);
        setBuyID(id);
    }

    return (
    <Stack spacing={1}>
        <Typography variant="h4">{name}</Typography>
        <Card>
          <CardContent sx={{pb: '16px'}}>
            <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 2, maxWidth: '15vw'}}>
                <img
                    src={`/assets/avatar-1.png`}
                    style={{ borderRadius: '50%', width: '100%', height: 'auto' }}
                />

                <Stack sx={{ paddingTop: 2, alignItems: 'center' }}>
                    <Typography variant="h5">Man</Typography>
                    <Typography variant="body1">5 stars</Typography>
                    <Button variant="contained" color="neon" sx={{ mt: 1 }} onClick={() => handleBuy(1)}>
                        Buy
                    </Button>
                </Stack>
            </Card>
          </CardContent>
        </Card>

        <StoreEnlarge id={buyID} open={buyOpen} setOpen={setBuyOpen} />
    </Stack>
  );
}
