import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import {CardMedia} from "@mui/material";
import { UserOtherBadge } from '@/types/user-other-badge';


interface OtherBadgeCardProps {
  otherBadges?: UserOtherBadge[];
}

export function OtherBadgeCard({ otherBadges = [] }: OtherBadgeCardProps): React.JSX.Element {
  return (
    <Box>
      <Grid container spacing={4}>
        {otherBadges.map((otherBadge) => (
          <Grid key={otherBadge.id} lg={3} md={4} xs={12}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
              className="card"
            >
                {/* Badge Image */}
                <CardMedia
                  component="img"
                  alt={otherBadge.badge.image.name}
                  image={`/assets/${otherBadge.badge.image.filename}`}
                  className="badge"
                />

                {/* Card Content */}
                <CardContent sx={{ flex: 1, '&:last-child': { paddingBottom: 1 } }}>
                  {/* Badge Name */}
                  <Typography variant="h6" mb={3} align="center">
                    {otherBadge.badge.name}
                  </Typography>
                </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
