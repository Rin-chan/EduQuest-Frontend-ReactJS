import {styled} from "@mui/material/styles";
import LinearProgress, {linearProgressClasses, type LinearProgressProps} from "@mui/material/LinearProgress";
import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Points from "../../../../public/assets/point.svg"
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import { paths } from "@/paths";

export const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? 'primary' : 'primary',
  },
}));

export const BorderLinearProgressSlim = styled(LinearProgress)(({ theme }) => ({
  height: 6,
  borderRadius: 3,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 3,
    backgroundColor: theme.palette.mode === 'light' ? 'primary' : 'primary',
  },
}));


export function LinearProgressWithLabel(props: LinearProgressProps & { value: number, status: string }): React.JSX.Element {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {props.status}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {`${Math.round(props.value).toString()}%`}
          </Typography>
        </Box>

        <BorderLinearProgress variant="determinate" {...props} />
      </Box>
    </Box>
  );
}


export function LinearProgressForLevel(
  props: LinearProgressProps & { value: number; level: string; absValue: number }
): React.JSX.Element {
  const { absValue, level, value, ...rest } = props; // Destructure to exclude `absValue`

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="body2" color="text.secondary">
            {level}
          </Typography>
          <Tooltip
            title={
              <Typography fontSize="inherit">
                Points: {Math.round(absValue * 100) / 100}
              </Typography>
            }
            placement="bottom"
            arrow
          >
            <Stack direction="row" spacing={0.5} alignItems="center" onClick={() => {
              window.location.href = paths.dashboard.store;
            }}>
              <Typography variant="body2" color="text.secondary">
                {Math.round(absValue)}
              </Typography>
              <Points height={18} />
            </Stack>
          </Tooltip>
        </Box>
        <Tooltip
          title={
            <Stack>
              <Typography fontSize="inherit">
                Points are calculated based on the highest number of points achieved in every quest.
              </Typography>
            </Stack>
          }
          placement="bottom"
          arrow
        >
          {/* Pass only necessary props to BorderLinearProgress */}
          <BorderLinearProgress variant="determinate" value={value} {...rest} />
        </Tooltip>
      </Box>
    </Box>
  );
}

export function LinearProgressSlim(props: LinearProgressProps & { value: number, text: string }): React.JSX.Element {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 0.5 }}>

          <Stack direction="row" spacing='6px' alignItems="center">
            <Typography variant="body2" color="text.secondary" >
              {props.text}
            </Typography>
            <Points height={18}/>
          </Stack>
        </Box>

        <BorderLinearProgressSlim variant="determinate" {...props} />
      </Box>
    </Box>
  );
}
