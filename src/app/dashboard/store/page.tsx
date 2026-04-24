"use client"

import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { StoreCard } from '@/components/dashboard/store/store-card';
import { TextField } from '@mui/material';
import MenuItem from '@mui/material/MenuItem/MenuItem';

export default function Page(): React.JSX.Element {
  const [sorting, setSorting] = React.useState("newest");
  
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
          <MenuItem value="newest">Recently Added</MenuItem>
          <MenuItem value="oldest">Oldest</MenuItem>
        </TextField>
      </Stack>

      <StoreCard name="Avatar" type={1} />
      <StoreCard name="Border" type={2} />
      <StoreCard name="Banner" type={3} />
    </Stack>
  );
}
