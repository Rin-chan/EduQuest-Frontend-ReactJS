"use client"

import * as React from 'react';
import { useState, useEffect, useMemo } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { StoreCard } from '@/components/dashboard/store/store-card';
import { TextField } from '@mui/material';
import MenuItem from '@mui/material/MenuItem/MenuItem';
import { getAllCosmetic } from '@/api/services/cosmetic';
import type { Cosmetic } from '@/types/cosmetic';
import { CosmeticType } from '@/types/cosmetic';

export default function Page(): React.JSX.Element {
  const [sorting, setSorting] = useState<string>('latest');
  const [list, setList] = useState<Cosmetic[] | null>(null);

  useEffect(() => {
    getAllCosmetic().then((response) => {
      setList(response.filter((res) => res.purchaseable))
    })
    .catch(() => { return; })
  }, [])

  const sortedList = useMemo(() => {
    if (!list) return null;

    const copy = [...list];

    if (sorting === 'ascending') {
      return copy.sort((a, b) => a.cost - b.cost);
    }

    if (sorting === 'descending') {
      return copy.sort((a, b) => b.cost - a.cost);
    }

    return copy;
  }, [list, sorting]);
  
  return (
    <Stack spacing={3}>
      <Stack direction="row" sx={{justifyContent: 'right', alignItems: 'center'}} spacing={1}>
        <Typography variant="body1">Sorted By</Typography>

        <TextField
          select
          size="small"
          variant="outlined"
          value={sorting}
          onChange={(e) => {
            setSorting(e.target.value);
          }}
        >
          <MenuItem value='latest'>Latest</MenuItem>
          <MenuItem value='ascending'>Price: Low to High</MenuItem>
          <MenuItem value='descending'>Price: High to Low</MenuItem>
        </TextField>
      </Stack>

      <StoreCard name="Picture" list={sortedList ? sortedList.filter(function pictureFunc(cosmetic) {
        return cosmetic.type === CosmeticType.Picture;
      }) : null}/>
      <StoreCard name="Border" list={sortedList ? sortedList.filter(function borderFunc(cosmetic) {
        return cosmetic.type === CosmeticType.Border;
      }) : null}/>
      <StoreCard name="Banner" list={sortedList ? sortedList.filter(function bannerFunc(cosmetic) {
        return cosmetic.type === CosmeticType.Banner;
      }) : null}/>
    </Stack>
  );
}
