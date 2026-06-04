import * as React from 'react';
import Card from '@mui/material/Card/Card';
import Typography from '@mui/material/Typography/Typography';
import Grid from '@mui/material/Grid/Grid';
import Box from '@mui/material/Box/Box';
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar/Avatar";
import {UserAvatar, type UserAvatarProps} from "@/components/auth/user-avatar";
import {User as UserIcon} from "@phosphor-icons/react/dist/ssr/User";
import type { EduquestUserCosmeticResult, EduquestUser} from "@/types/eduquest-user";
import type { Badge } from '@/types/badge';
import TextField from '@mui/material/TextField';
import { updateUserCosmetic } from '@/api/services/eduquest-user';
import Button from '@mui/material/Button';

interface AccountPopupProps {
    eduquestUser: EduquestUser | null;
    cosmetic: EduquestUserCosmeticResult| null;
    editable?: boolean;
    draftCosmetic?: EduquestUserCosmeticResult | null;
    setDraftCosmetic?: React.Dispatch<React.SetStateAction<EduquestUserCosmeticResult>> | null;
}

export function AccountPopup({eduquestUser, cosmetic, editable=false, draftCosmetic=null, setDraftCosmetic=null}: AccountPopupProps): React.JSX.Element {
    const [showUserInitials, setShowUserInitials] = React.useState<boolean>(false);
    const [userAvatarProps, setUserAvatarProps] = React.useState<UserAvatarProps>({
    name: '?',
    });
    const [success, setSuccess] = React.useState<boolean>(false);

    React.useEffect(() => {
        setUserAvatarProps({
            name: formatName(eduquestUser?.nickname),
            bgColor: 'var(--mui-palette-neutral-900)',
            textColor: "white",
        });

        if (eduquestUser) {
            if (cosmetic?.profile_picture === undefined || cosmetic.profile_picture === null) {
                setShowUserInitials(true);
            } else {
                setShowUserInitials(false);
            }
        }
    }, [eduquestUser, cosmetic])

    function formatName(name: string | undefined): string {
        if (!name) return '';
        // Remove the starting and ending #
        return name.replace(/^#|#$/g, '')
    }

    const resetAboutMe = (): void => {
        if (setDraftCosmetic && cosmetic) {
            setDraftCosmetic(prev => {
                if (!prev) return prev; 
                return {
                ...prev, 
                about_me: cosmetic.about_me, 
                }; 
            }); 
        }
        setSuccess(false);
    }

    const updateAboutMe = (event: React.ChangeEvent<HTMLInputElement>): void => {
        if (setDraftCosmetic) {
            setDraftCosmetic(prev => {
                if (!prev) return prev; 
                return {
                    ...prev, 
                    about_me: event.target.value, 
                }; 
            }); 
        }
        setSuccess(false);
    }

    const submitAboutMe = async (): Promise<void> => {
        if (draftCosmetic) {
            await updateUserCosmetic(draftCosmetic);
            setSuccess(true);
        }
        else {
            setSuccess(false)
        }
    }

    return (
        <Card sx={{ width: '25em' }}>
            <Stack
                divider={
                    <Box
                        sx={(theme) => ({
                        border: '1px solid #000000',
                        ...theme.applyStyles('dark', {
                            border: '1px solid #000000',
                        }),
                        })}
                    />
                    }
                spacing={0}
            >
                <Grid direction="row" md={6} xs={12} sx={{backgroundImage: cosmetic?.banner?.image ? `url(/assets/${cosmetic?.banner.image.filename})` : '', backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '5em'}} >
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
                            <Box>
                                {
                                showUserInitials ?
                                    <UserAvatar size='70px' {...userAvatarProps}/>
                                : cosmetic?.profile_picture?.image?.filename ?
                                    <Avatar
                                    src={`/assets/${cosmetic.profile_picture?.image.filename}`}
                                    sx={{width: 70, height: 70}}
                                    /> : <UserIcon size={70} color="var(--mui-palette-primary-main)" />
                                }
                            </Box>
                            {
                                cosmetic?.profile_border?.image ?
                                    <Box
                                        component="img"
                                        src={`/assets/${cosmetic?.profile_border.image.filename}`}
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
                                : null
                            }
                        </Box>

                        <Stack direction="column" spacing={0} sx={{display: 'flex', paddingLeft: 3, justifyContent: 'center'}}>
                            <Typography variant="h4">{eduquestUser?.nickname}</Typography>
                            <Stack direction="row" spacing={1} sx={{display: 'flex', alignItems: 'center'}}>
                                {
                                    cosmetic?.displayed_badges.map((badge: Badge) => (
                                        <Box
                                            key={badge.id.toString()}
                                            component="img"
                                            src={`/assets/${badge.image.filename}`}
                                            sx={{
                                                width: 40,
                                                height: 40,
                                            }}
                                        />
                                    ))
                                }
                            </Stack>
                        </Stack>
                    </Stack>
                </Grid>

                <Grid md={6} xs={12} sx={{minHeight: '5em', padding: 1}} >
                {
                    editable && draftCosmetic && setDraftCosmetic ?
                        <Grid>
                            <TextField
                                multiline
                                rows={3}
                                value={draftCosmetic.about_me}
                                onChange={updateAboutMe}
                                fullWidth
                                inputProps={{ maxLength: 128 }}
                            />
                            <Stack direction='row' justifyContent='right' spacing={1}>
                                <Button onClick={resetAboutMe} variant="contained" color="error">Reset</Button>
                                <Button onClick={submitAboutMe} variant="contained" color="primary">Submit</Button>
                            </Stack>
                            {success ? <Typography variant='caption' color='green'>Successfully saved</Typography> : null}
                        </Grid>
                    :
                        <Typography variant="body1">{cosmetic?.about_me}</Typography>
                }
                </Grid>
            </Stack>
        </Card>
    );
}