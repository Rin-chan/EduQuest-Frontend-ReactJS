import Card from '@mui/material/Card/Card';
import Typography from '@mui/material/Typography/Typography';
import Grid from '@mui/material/Grid/Grid';
import Box from '@mui/material/Box/Box';
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar/Avatar";

interface AccountPopupProps {
  userId: number;
}

export function AccountPopup({ userId }: AccountPopupProps): React.JSX.Element {
    return (
        <Card sx={{minWidth: '20em'}}>
            <Stack
                divider={
                    <Box
                        sx={(theme) => ({
                        border: `1px solid ${'#000000'}`,
                        ...theme.applyStyles('dark', {
                            border: `1px solid ${'#000000'}`,
                        }),
                        })}
                    />
                    }
                spacing={0}
            >
                <Grid direction="row" md={6} xs={12} sx={{backgroundImage: 'url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQic0vjbZ9kDfF0KQMCQso5MSaWTypoMte02w&s)', backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '5em'}} >
                    <Stack direction="row" sx={{padding: 2}}>
                        <Box
                            sx={{
                                position: 'relative',
                                width: 100,
                                height: 100,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Avatar
                                src={`/assets/avatar-1.png`}
                                alt={`Avatar of user ${userId}`}
                                sx={{
                                    width: 70,
                                    height: 70
                                }}
                            />
                            <Box
                                component="img"
                                src={'https://png.pngtree.com/png-vector/20250724/ourmid/pngtree-elegant-gold-circle-frame-png-image_16679818.webp'}
                                sx={{
                                    position: 'absolute',
                                    width: 100,
                                    height: 100,
                                    top: 0,
                                    left: 0,
                                    pointerEvents: 'none',
                                    zIndex: 1,
                                }}
                            />
                        </Box>

                        <Stack direction="column" spacing={0} sx={{display: 'flex', paddingLeft: 3, justifyContent: 'center'}}>
                            <Typography variant="h4">Name</Typography>
                            <Stack direction="row" spacing={1} sx={{display: 'flex', alignItems: 'center'}}>
                                <Box
                                    component="img"
                                    src={`/assets/first_attempt_badge.svg`}
                                    sx={{
                                        width: 40,
                                        height: 40,
                                    }}
                                />
                            </Stack>
                        </Stack>
                    </Stack>
                </Grid>

                <Grid md={6} xs={12} sx={{minHeight: '5em', padding: 1}} >
                    <Typography variant="body1">User {userId}</Typography>
                </Grid>
            </Stack>
        </Card>
    );
}