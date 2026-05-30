'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CalendarCheck as CalendarCheckIcon } from '@phosphor-icons/react/dist/ssr/CalendarCheck';
import { CheckCircle as CheckCircleIcon } from '@phosphor-icons/react/dist/ssr/CheckCircle';
import type { EduquestUser } from '@/types/eduquest-user';

interface DailyCheckInTaskProps {
  eduquestUser: EduquestUser;
}

export function DailyCheckInTask({ eduquestUser }: DailyCheckInTaskProps): React.JSX.Element {
  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title="Daily Task"
        subheader="Check in once per day to earn points and build your streak."
        avatar={<CalendarCheckIcon fontSize="var(--icon-fontSize-md)" color="var(--mui-palette-primary-main)" />}
      />
      <CardContent>
        <Stack spacing={1}>
          <Stack spacing={1}>
            <Typography variant="body2" color="text.secondary">
              Check in once daily to earn +5 points.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Every 7-day streak gives +20 bonus points.
            </Typography>
          </Stack>
          <List disablePadding>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ width: '100%' }}>
              <CheckCircleIcon color="var(--mui-palette-success-main)" />
              <ListItemText
                primary="Check in"
                secondary={`Streak: ${String(eduquestUser.daily_checkin_streak)} day(s)`}
              />
              <Chip
                label='Done'
                color='success'
                size="small"
              />
            </Stack>
          </List>
          <Typography variant="caption" color="text.secondary">
            Resets daily at 00:00 SGT.
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
