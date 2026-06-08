"use client"

import * as React from 'react';
import { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import {Button, Stack} from "@mui/material";
import { StoreEnlarge } from './store-enlarge';
import type { Cosmetic } from '@/types/cosmetic';
import { CosmeticType } from '@/types/cosmetic';
import { useUser } from '@/hooks/use-user';

interface StoreCardProps {
  name: string;
  list: Cosmetic[] | null;
}

export function StoreCard({ name, list }: StoreCardProps): React.JSX.Element {
    const { cosmetic } = useUser();
    const [buyOpen, setBuyOpen] = useState(false);
    const [buyCosmetic, setBuyCosmetic] = useState<Cosmetic | null>(null);

    const handleBuy = (cosmeticItem: Cosmetic): void => {
        setBuyOpen(true);
        setBuyCosmetic(cosmeticItem);
    }

    return (
        <Stack spacing={1}>
            <Typography variant="h4">{name}</Typography>

            <Card>
                <CardContent sx={{ pb: '16px', display: 'flex', flexWrap: 'wrap', justifyContent: 'left', overflowX: 'scroll' }}>
                    <Stack direction="row">
                        {
                        list?.map((cosmeticItem: Cosmetic) => (
                            <Card key={cosmeticItem.id} sx={{ display: 'block', width: 260, minHeight: 320, marginleft: 2, marginRight: 2, overflow: 'hidden', padding: 1 }}>
                                {
                                    name.toString() === CosmeticType.Picture.toString() ?
                                    <CardMedia
                                        component="img"
                                        alt="Store item preview"
                                        src={`/assets/${cosmeticItem.image.filename}`}
                                        style={{ borderRadius: '50%', width: '100%', height: 'auto' }}
                                    />
                                    :
                                    <CardMedia
                                        component="img"
                                        alt="Store item preview"
                                        src={`/assets/${cosmeticItem.image.filename}`}
                                        style={{  width: '100%', height: 'auto' }}
                                    />
                                }
                    
                                <Stack sx={{ alignItems: 'center' }}>
                                    <Typography noWrap textAlign='center' variant="h5" sx={{ width: '14vw' }}>{cosmeticItem.name}</Typography>
                                    <Typography variant="body1">{cosmeticItem.cost} points</Typography>
                                    <Button 
                                        variant="contained" 
                                        color="primary" sx={{ mt: 1 }} 
                                        onClick={() => {handleBuy(cosmeticItem)}}
                                        disabled={cosmetic?.owns?.some((owned) => owned.id === cosmeticItem.id) ?? false}
                                        >
                                        Buy
                                    </Button>
                                </Stack>
                            </Card>
                        ))}
                    </Stack>
                </CardContent>
            </Card>

            <StoreEnlarge cosmetic={buyCosmetic} open={buyOpen} setOpen={setBuyOpen} />
        </Stack>
    );
}
