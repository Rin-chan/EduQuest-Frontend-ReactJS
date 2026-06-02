"use client";
import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Unstable_Grid2';
import { useUser } from '@/hooks/use-user';
import {UserAvatar, type UserAvatarProps} from "@/components/auth/user-avatar";
import {logger} from "@/lib/default-logger";
import Avatar from "@mui/material/Avatar";
import {FloppyDisk as FloppyDiskIcon} from "@phosphor-icons/react/dist/ssr/FloppyDisk";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Points from "../../../../public/assets/point.svg";
import Stack from "@mui/material/Stack";
import FormLabel from "@mui/material/FormLabel";
import {TextField} from "@mui/material";
import {User as UserIcon} from "@phosphor-icons/react/dist/ssr/User";
import {updateEduquestUser} from "@/api/services/eduquest-user";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Popover from '@mui/material/Popover/Popover';
import { X } from "@phosphor-icons/react";
import CircleIcon from '@mui/icons-material/Circle';
import Box from "@mui/material/Box";
import Badge from '@mui/material/Badge';
import Checkbox from '@mui/material/Checkbox';
import { Image } from '@/types/image';
import { Cosmetic, CosmeticType } from '@/types/cosmetic';
import { updateUserCosmetic } from '@/api/services/eduquest-user';
import { EduquestUserCosmeticResult } from '@/types/eduquest-user';
import {useTheme} from '@mui/material/styles';
import { getUserCourseBadgesByUser } from '@/api/services/badge';
import type { UserCourseBadge } from '@/types/user-course-badge';
import { Badge as BadgeType } from '@/types/badge';

/*
------------------------------------------
Color options for user background
------------------------------------------
*/
export const colorsAvailable = [
    "#ffadad",
    "#ffd6a5",
    "#fdffb6",
    "#caffbf",
    "#9bf6ff",
    "#a0c4ff",
    "#bdb2ff",
    "#ffc6ff"
];

const emptyImage: Image = {
  id: -1,
  name: "",
  filename: ""
}

const emptyCosmetic: Cosmetic = {
  id: -1,
  name: "",
  type: CosmeticType.Picture,
  image: emptyImage,
  cost: 0,
}

const emptyResult: EduquestUserCosmeticResult = {
    profile_picture: emptyCosmetic,
    profile_background: "",
    profile_border: emptyCosmetic,
    banner: emptyCosmetic,
    displayed_badges: [],
    about_me: "",
    owns: []
}

export function AccountDetailsForm(): React.JSX.Element {
  const dragItemIndex = React.useRef<number | null>(null);
  const dragOverIndex = React.useRef<number | null>(null);

  const theme = useTheme();
  const { eduquestUser, cosmetic, checkSession } = useUser();
  const nicknameRef = React.useRef<HTMLInputElement>(null);
  const [showUserInitials, setShowUserInitials] = React.useState<boolean>(false);
  const [userAvatarProps, setUserAvatarProps] = React.useState<UserAvatarProps>({
    name: '?',
  });
  const [submitStatus, setSubmitStatus] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [draftCosmetic, setDraftCosmetic] = React.useState<EduquestUserCosmeticResult>(emptyResult);
  const [avatarList, setAvatarList] = React.useState<Cosmetic[]>([]);
  const [borderList, setBorderList] = React.useState<Cosmetic[]>([]);
  const [bannerList, setBannerList] = React.useState<Cosmetic[]>([]);
  const [badgeList, setBadgeList] = React.useState<UserCourseBadge[]>([]);
  
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [badgesSelected, setBadgesSelected] = React.useState<BadgeType[]>([]);

  const [openAvatarEdit, setOpenAvatarEdit] = React.useState(false);
  const [openAvatar, setOpenAvatar] = React.useState(false);
  const [openBackground, setOpenBackground] = React.useState(false);
  const [openBorder, setOpenBorder] = React.useState(false);
  const [openBanner, setOpenBanner] = React.useState(false);
  const [openBadges, setOpenBadges] = React.useState(false);

  const refreshUser = async (): Promise<void> => {
    if (checkSession) {
      await checkSession();
    }
  };

  const backgroundStyle = React.useMemo(() => {
    const color =
      draftCosmetic?.profile_background !== ""
        ? draftCosmetic?.profile_background
        : theme.palette.background.paper;
        
    return {
      backgroundImage: `linear-gradient(to right, ${theme.palette.background.paper}, ${color}, ${theme.palette.background.paper})`
    };
  }, [draftCosmetic?.profile_background, theme]);

  function formatName(name: string | undefined): string {
    if (!name) return '';
    // Remove the starting and ending #
    return name.replace(/^#|#$/g, '')
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (nicknameRef.current?.value) {
      const updatedNickname = {
        nickname: nicknameRef.current?.value,
      };
      if (eduquestUser) {
        try {
          const response = await updateEduquestUser(eduquestUser.id.toString(), updatedNickname);
          logger.debug('Update Success:', response);
          setSubmitStatus({ type: 'success', message: 'Update Successful' });
          await refreshUser();
        } catch (error) {
          logger.error('Update Failed:', error);
        }
      }
    }
  };

  const setUserData = React.useCallback(async (): Promise<void> => {
    if (eduquestUser && cosmetic) {
      setUserAvatarProps({
        name: formatName(eduquestUser.nickname),
        bgColor: 'var(--mui-palette-neutral-900)',
        textColor: "white",
      });
      console.log(cosmetic)
      try {
        if (cosmetic.profile_picture === undefined || cosmetic.profile_picture.image.filename === '') {
          setShowUserInitials(true);
        } else {
          setShowUserInitials(false);
        }
      } catch (error) {
        setShowUserInitials(true);
        logger.error('Error fetching user photo: ', error)
      }

      setDraftCosmetic(cosmetic);
      setBadgesSelected(cosmetic.displayed_badges);
      setAvatarList(cosmetic.owns.filter(item => item.type == CosmeticType.Picture))
      setBorderList(cosmetic.owns.filter(item => item.type == CosmeticType.Border))
      setBannerList(cosmetic.owns.filter(item => item.type == CosmeticType.Banner))
      setBadgeList(await getUserCourseBadgesByUser(eduquestUser.id.toString()));
    }
    else if (eduquestUser) {
      setShowUserInitials(true);
      setUserAvatarProps({
        name: formatName(eduquestUser.nickname),
        bgColor: 'var(--mui-palette-neutral-900)',
        textColor: "white",
      });
      setBadgeList(await getUserCourseBadgesByUser(eduquestUser.id.toString()));
    }
  }, [cosmetic, eduquestUser]);

  React.useEffect(() => {
    const fetchData = async (): Promise<void> => {
      await setUserData();
    }
    fetchData().catch((error: unknown) => {
      logger.error('Failed to fetch data', error);
    });
  }, [eduquestUser, setUserData]);

  // Handlers for Avatar Edit Popover
  const openAvatarEditChange = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
    setOpenAvatarEdit(true);
  }

  const closeAvatarEditChange = (): void => {
    setAnchorEl(null);
    setOpenAvatarEdit(false);
  }

  // Handlers for Avatar Change Dialog
  const openAvatarChange = (): void => {
    setOpenAvatar(true);
    closeAvatarEditChange();
  }

  const closeAvatarChange = async (): Promise<void> => {
    setOpenAvatar(false);
    await refreshUser();
  }

  const updateAvatarChange = (fileImage: Cosmetic | null): void => {
    setDraftCosmetic(prev => {
      if (!prev) return prev; 
      
      let image: Cosmetic = emptyCosmetic;

      if (fileImage != null) {
          image = fileImage;
          setShowUserInitials(false);
      }
      else {
        setShowUserInitials(true);
      }

      return {
        ...prev, 
        profile_picture: image, 
      }; 
    }); 
  }

  const submitAvatarChange = async (): Promise<void> => {
    await updateUserCosmetic(draftCosmetic);
    closeAvatarChange();
  }

  // Handlers for Background Change Popover
  const openBackgroundChange = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
    setOpenBackground(true);
  }
  const closeBackgroundChange = async (): Promise<void> => {
    setOpenBackground(false);
    setAnchorEl(null);
    await refreshUser();
  }

  const updateBackgroundColor = (colorOption: string): void => { 
    setDraftCosmetic(prev => {
      if (!prev) return prev; 
      
      return {
        ...prev, 
        profile_background: colorOption, 
      }; 
    }); 
  };

  const submitBackgroundChange = async (): Promise<void> => {
    await updateUserCosmetic(draftCosmetic);
    setOpenBackground(false);
    setAnchorEl(null);
  }

  // Handlers for Border Change Dialog
  const openBorderChange = (): void => {
    setOpenBorder(true);
    setOpenAvatarEdit(false);
  }

  const closeBorderChange = (): void => {
    setOpenBorder(false);
  }

  const updateBorderChange = (fileImage: Cosmetic | null): void => {
    setDraftCosmetic(prev => {
      if (!prev) return prev; 
      
      let image: Cosmetic = emptyCosmetic;

      if (fileImage != null) {
          image = fileImage;
      }

      return {
        ...prev, 
        profile_border: image, 
      }; 
    }); 
  }

  const submitBorderChange = async (): Promise<void> => {
    await updateUserCosmetic(draftCosmetic);
    closeBorderChange();
  }

  // Handlers for Banner Change Dialog
  const openBannerChange = (): void => {
    setOpenBanner(true);
  }

  const closeBannerChange = (): void => {
    setOpenBanner(false);
  }

  const updateBannerChange = (fileImage: Cosmetic | null): void => {
    setDraftCosmetic(prev => {
      if (!prev) return prev; 
      
      let image: Cosmetic = emptyCosmetic;

      if (fileImage != null) {
          image = fileImage;
      }

      return {
        ...prev, 
        banner: image, 
      }; 
    }); 
  }

  const submitBannerChange = async (): Promise<void> => {
    await updateUserCosmetic(draftCosmetic);
    closeBannerChange();
  }

  // Handlers for Badges Change Dialog
  const openBadgesChange = (): void => {
    setOpenBadges(true);
  }
  const closeBadgesChange = (): void => {
    setOpenBadges(false);
  }

  const submitBadgesChange = async (): Promise<void> => {
    await updateUserCosmetic({
      ...draftCosmetic,
      displayed_badges: badgesSelected
    });
    closeBadgesChange();
  }

  const moveBadge = (from: number, to: number) => {
    setBadgesSelected((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(from, 1);
      updated.splice(to, 0, moved);
      return updated;
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent style={backgroundStyle}>
          <Grid container spacing={3}>
            <Grid sm={6} xs={12}>
              <Grid style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px', marginBottom: '64px' }}>
                <IconButton onClick={openAvatarEditChange}>
                  <Box
                    sx={{
                      position: 'relative',
                      width: 72,
                      height: 72,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {
                      draftCosmetic.profile_border?.image.filename ?
                      <Box
                        component="img"
                        src={`/assets/${draftCosmetic.profile_border.image.filename}`}
                        sx={{
                          position: 'absolute',
                            width: 72,
                            height: 72,
                            top: 0,
                            left: 0,
                            pointerEvents: 'none',
                            zIndex: 1,
                        }}
                      />
                      : null
                    }

                    {
                      showUserInitials ?
                        <UserAvatar size='48px' {...userAvatarProps}/>
                        : draftCosmetic.profile_picture?.image?.filename ?
                        <Avatar
                          src={`/assets/${draftCosmetic.profile_picture?.image.filename}`}
                          sx={{width: 48, height: 48}}
                        /> : <UserIcon size={32} color="var(--mui-palette-primary-main)" />
                    }
                    </Box>
                </IconButton>

                <Grid style={{ display: 'flex', flexDirection: 'column'}}>
                  <Typography variant="overline">Profile</Typography>
                  <Button variant="contained" onClick={openBadgesChange}>Badges</Button>
                </Grid>
              </Grid>

              <Grid style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
                <Button variant="contained" onClick={openBackgroundChange}>Change Background</Button>
                <Button variant="contained" onClick={openBannerChange}>Change Banner</Button>
              </Grid>
            </Grid>

            <Grid sm={6} xs={12}>
              <Typography variant="overline" color="text.secondary">Display of profile</Typography>
            </Grid>
          </Grid>
        </CardContent>

        <Divider/>
        {eduquestUser ? (
          <CardContent>
            <Grid container spacing={3}>
              <Grid sm={6} xs={12}>
                <Typography variant="overline" color="text.secondary">ID</Typography>
                <Typography variant="body2">{eduquestUser.id} </Typography>
              </Grid>
              <Grid sm={6} xs={12}>
                <FormControl>
                  <FormLabel htmlFor="nickname">Nickname</FormLabel>
                  <TextField
                    defaultValue={eduquestUser.nickname}
                    inputRef={nicknameRef}
                    placeholder="Your nickname will be displayed to other users."
                    variant='outlined'
                    size='small'
                  />
                </FormControl>
              </Grid>

              <Grid sm={6} xs={12}>
                <Typography variant="overline" color="text.secondary">First Name</Typography>
                <Typography variant="body2">{eduquestUser.first_name} </Typography>
              </Grid>
              <Grid sm={6} xs={12}>
                <Typography variant="overline" color="text.secondary">Last Name</Typography>
                <Typography variant="body2">{eduquestUser.last_name} </Typography>
              </Grid>
              <Grid sm={6} xs={12}>
                <Typography variant="overline" color="text.secondary">Username</Typography>
                <Typography variant="body2">{eduquestUser.username} </Typography>
              </Grid>
              <Grid sm={6} xs={12}>
                <Typography variant="overline" color="text.secondary">Email address</Typography>
                <Typography variant="body2">{eduquestUser.email} </Typography>
              </Grid>
              <Grid sm={6} xs={12}>
                <Typography variant="overline" color="text.secondary">Total points</Typography>
                <Stack direction="row" spacing='6px' sx={{ alignItems: 'center' }}>
                  <Typography variant="body2">{Math.round(eduquestUser.current_points * 100) / 100}</Typography>
                  <Points height={18}/>
                </Stack>
              </Grid>
              <Grid sm={6} xs={12}>
                <Typography variant="overline" color="text.secondary">Last login</Typography>
                <Typography variant="body2">
                  {new Date(eduquestUser.last_login).toLocaleDateString("en-SG", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}
                </Typography>
              </Grid>
              <Grid sm={6} xs={12}>
                <Typography variant="overline" color="text.secondary">Updated at</Typography>
                <Typography variant="body2">
                  {new Date(eduquestUser.updated_at).toLocaleDateString("en-SG", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}
                </Typography>
              </Grid>
              <Grid sm={6} xs={12}>
                <Typography variant="overline" color="text.secondary">Is superuser</Typography>
                <Typography variant="body2">{eduquestUser.is_superuser ? "Yes" : "No"} </Typography>
              </Grid>
              <Grid sm={6} xs={12}>
                <Typography variant="overline" color="text.secondary">Is active</Typography>
                <Typography variant="body2">{eduquestUser.is_active ? "Yes" : "No"} </Typography>
              </Grid>
              <Grid sm={6} xs={12}>
                <Typography variant="overline" color="text.secondary">Is staff</Typography>
                <Typography variant="body2">{eduquestUser.is_staff ? "Yes" : "No"} </Typography>
              </Grid>

            </Grid>
          </CardContent>
        ) : null}

        <CardActions sx={{justifyContent: 'flex-end'}}>
          <Button startIcon={<FloppyDiskIcon/>} type="submit" variant="contained">Update</Button>
        </CardActions>
      </Card>
      {submitStatus ? <Alert severity={submitStatus.type} sx={{ marginTop: 2 }}>
        {submitStatus.message}
      </Alert> : null}

      <Popover
          id={openAvatarEdit ? 'simple-popover' : undefined}
          open={openAvatarEdit}
          anchorEl={anchorEl}
          onClose={closeAvatarEditChange}
          anchorOrigin={{
              vertical: 'center',
              horizontal: 'left',
          }}
      >
          <Stack direction="row" sx={{ justifyContent: 'flex-end', padding: 1 }}>
            <Button variant="text" onClick={openAvatarChange}>Avatar</Button>
            <Divider orientation='vertical' flexItem sx={{ marginX: 1 }}/>
            <Button variant="text" onClick={openBorderChange}>Border</Button>
          </Stack>
      </Popover>

      <Dialog open={openAvatar} onClose={closeAvatarChange}>
        <DialogTitle>
            <Stack direction="row" sx={{ alignContent: 'space-between', justifyContent: 'space-between' }}>
            Change Avatar
            <Button startIcon={<X fontSize="var(--icon-fontSize-md)" />} onClick={closeAvatarChange} />
            </Stack>
        </DialogTitle>
        <DialogContent>
          <Card sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <CardContent>
              <Box
                sx={{
                  position: 'relative',
                  width: 64,
                  height: 64,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {
                  showUserInitials ?
                    <UserAvatar size='48px' {...userAvatarProps}/>
                    : draftCosmetic.profile_picture?.image?.filename ?
                    <Avatar
                      src={`/assets/${draftCosmetic.profile_picture.image.filename}`}
                      sx={{width: 48, height: 48}}
                    /> : <UserIcon size={32} color="var(--mui-palette-primary-main)" />
                }
              </Box>
            </CardContent>

            <Divider orientation='vertical' flexItem/>

            <CardContent>
              <Typography variant="body1">Choose Preset</Typography>

              <Grid direction="row" container>
                <Grid sm={4} xs={8}>
	                <IconButton onClick={() => { updateAvatarChange(null); }} sx={(draftCosmetic.profile_picture?.image.name == null || draftCosmetic.profile_picture?.image.name == '') ? {backgroundColor : theme.palette.action.selected} : null}>
                    <UserAvatar {...userAvatarProps}/>
                  </IconButton>
                </Grid>

                {
                  avatarList.map((item: Cosmetic) => (
                    <Grid key={item.type + item.id} sm={4} xs={8}>
                      <IconButton key={item.type + item.id} onClick={() => { updateAvatarChange(item)  }} sx={(draftCosmetic.profile_picture?.image.name != null && item.image.id === draftCosmetic.profile_picture?.image?.id) ? {backgroundColor : theme.palette.action.selected} : null}>
                        <Avatar
                          alt={item.image.filename}
                          src={`/assets/${item.image.filename}`}
                        />
                      </IconButton>
                    </Grid>
                  ))
                }
              </Grid>
            </CardContent>
          </Card>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAvatarChange} variant="contained" color="error">Cancel</Button>
          <Button onClick={submitAvatarChange} variant="contained" color="primary">Submit</Button>
        </DialogActions>
      </Dialog>

      <Popover
          id={openBackground ? 'simple-popover' : undefined}
          open={openBackground}
          anchorEl={anchorEl}
          onClose={closeBackgroundChange}
          anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
          }}
      >
          <Card>
            <CardContent>
              <Grid direction="row" container>
                <Grid xs={2}>
                    <IconButton onClick={() => { updateBackgroundColor('theme.palette.background.paper')}}>
                    <CircleIcon htmlColor={theme.palette.background.paper} fontSize="large" />
                  </IconButton>
                </Grid>
                {
                  colorsAvailable.map((colorOption: string) => (
                    <Grid key={colorOption} xs={2}>
                        <IconButton onClick={() => { updateBackgroundColor(colorOption)}}>
                        <CircleIcon htmlColor={colorOption} fontSize="large" />
                      </IconButton>
                    </Grid>
                  ))
                }
              </Grid>
              
              <Stack direction="row" sx={{ justifyContent: 'flex-end', marginTop: 2 }}>
                <Button variant="contained" onClick={submitBackgroundChange}>Submit</Button>
              </Stack>
            </CardContent>
          </Card>
      </Popover>

      <Dialog open={openBorder} onClose={closeBorderChange}>
        <DialogTitle>
            <Stack direction="row" sx={{ alignContent: 'space-between', justifyContent: 'space-between' }}>
            Change Border
            <Button startIcon={<X fontSize="var(--icon-fontSize-md)" />} onClick={closeBorderChange} />
            </Stack>
        </DialogTitle>
        <DialogContent>
          <Card sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <CardContent>
              <Box
                sx={{
                  position: 'relative',
                  width: 72,
                  height: 72,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {
                  draftCosmetic.profile_border?.image?.filename ?
                  <Box
                    component="img"
                    src={`/assets/${draftCosmetic.profile_border.image.filename}`}
                    sx={{
                      position: 'absolute',
                      width: 72,
                      height: 72,
                      top: 0,
                      left: 0,
                      pointerEvents: 'none',
                      zIndex: 1,
                    }}
                  />
                  : null
                }

                {
                  showUserInitials ?
                    <UserAvatar size='48px' {...userAvatarProps}/>
                    : draftCosmetic.profile_picture?.image?.filename ?
                    <Avatar
                      src={`/assets/${draftCosmetic.profile_picture.image.filename}`}
                      sx={{width: 48, height: 48}}
                    /> : <UserIcon size={32} color="var(--mui-palette-primary-main)" />
                }
              </Box>
            </CardContent>

            <Divider orientation='vertical' flexItem/>

            <CardContent>
              <Typography variant="body1">Choose Border</Typography>

              <Grid direction="row" container spacing={3}>
                <Grid sm={4} xs={8}>
                  <IconButton onClick={() => { updateBorderChange(null); }} sx={(draftCosmetic.profile_border?.image.name == null || draftCosmetic.profile_border?.image.name == '') ? {backgroundColor : theme.palette.action.selected} : null}>
                    <Box
                      sx={{
                        position: 'relative',
                        width: 64,
                        height: 64,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      >
                      <Avatar sx={{width: 48, height: 48}}/>
                    </Box>
                  </IconButton>
                </Grid>

                {
                  borderList?.map((item: Cosmetic) => (
                    <Grid key={item.type + item.id} sm={4} xs={8}>
                      <IconButton onClick={() => { updateBorderChange(item); }} sx={(draftCosmetic.profile_border?.image.name != null && draftCosmetic.profile_border?.image.id == item.image.id) ? {backgroundColor : theme.palette.action.selected} : null}>
                        <Box
                          sx={{
                            position: 'relative',
                            width: 64,
                            height: 64,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                          >
                          <Box
                            component="img"
                            src={`/assets/${item.image.filename}`}
                            sx={{
                              position: 'absolute',
                              width: 64,
                              height: 64,
                              top: 0,
                              left: 0,
                              pointerEvents: 'none',
                              zIndex: 1,
                            }}
                          />
                          <Avatar sx={{width: 48, height: 48}}/>
                        </Box>
                      </IconButton>
                    </Grid>
                  ))
                }
              </Grid>
            </CardContent>
          </Card>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeBorderChange} variant="contained" color="error">Cancel</Button>
          <Button onClick={submitBorderChange} variant="contained" color="primary">Submit</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openBanner} onClose={closeBannerChange} fullWidth maxWidth="md">
        <DialogTitle>
            <Stack direction="row" sx={{ alignContent: 'space-between', justifyContent: 'space-between' }}>
            Change Banner
            <Button startIcon={<X fontSize="var(--icon-fontSize-md)" />} onClick={closeBannerChange} />
            </Stack>
        </DialogTitle>
        <DialogContent>
          <Card sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <CardContent>
              <Stack>
                  <Grid 
                    direction="row" 
                    md={6} 
                    xs={12} 
                    sx={{
                      backgroundImage: draftCosmetic?.banner?.image.filename ?
                        `url(/assets/${draftCosmetic.banner.image.filename})`
                        : null, 
                      backgroundSize: 'cover', 
                      backgroundPosition: 'center', 
                      minHeight: '5em', 
                      minWidth: '10em',
                      border: '1px solid black'
                    }}
                    >
                      <Stack direction="row" sx={{padding: 2}}>
                          <Box>
                              {
                                showUserInitials ?
                                  <UserAvatar size='48px' {...userAvatarProps}/>
                                  : draftCosmetic.profile_picture?.image?.filename ?
                                  <Avatar
                                    src={`/assets/${draftCosmetic.profile_picture?.image.filename}`}
                                    sx={{width: 48, height: 48}}
                                  /> : <UserIcon size={32} color="var(--mui-palette-primary-main)" />
                              }
                          </Box>

                          <Stack direction="column" spacing={0} sx={{display: 'flex', paddingLeft: 3, justifyContent: 'center'}}>
                              <Typography variant="h5">{eduquestUser?.nickname}</Typography>
                              <Stack direction="row" spacing={1} sx={{display: 'flex', alignItems: 'center'}}>
                                  <Box
                                    width={25}
                                    height={25}
                                    borderRadius="50%"
                                  />
                              </Stack>
                          </Stack>
                      </Stack>
                  </Grid>
              </Stack>
            </CardContent>

            <Divider orientation='vertical' flexItem/>

            <CardContent>
              <Typography variant="body1">Choose Banner</Typography>

              <Grid direction="row" container spacing={3}>
                <Grid xs={12} sm={6} md={5}>
	                  <Button onClick={() => { updateBannerChange(null); }} sx={(draftCosmetic.banner?.image.name == null || draftCosmetic.banner?.image.name == '') ? {backgroundColor : theme.palette.action.selected} : null}>
	                    <Grid 
	                      direction="row"
                        sx={{
                          backgroundImage: '', 
                          backgroundSize: 'cover', 
                          backgroundPosition: 'center', 
                          minHeight: '5em', 
                          minWidth: '10em',
                          border: '1px solid black'
                        }}
	                      />
                  </Button>
                </Grid>

                {
                  bannerList?.map((item: Cosmetic) => (
                    <Grid key={item.type + item.id} xs={12} sm={6} md={5}>
                      <Button onClick={() => { updateBannerChange(item); }} sx={(draftCosmetic.banner?.image.name != null && draftCosmetic.banner?.image.id == item.image.id) ? {backgroundColor : theme.palette.action.selected} : null}>
                        <Grid
	                        direction="row" 
                          sx={{
                            backgroundImage: `url(/assets/${item.image.filename})`, 
                            backgroundSize: 'cover', 
                            backgroundPosition: 'center', 
                            minHeight: '5em', 
                            minWidth: '10em',
                            border: '1px solid black'
                          }}
	                      />
                      </Button>
                    </Grid>
                  ))
                }
              </Grid>
            </CardContent>
          </Card>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeBannerChange} variant="contained" color="error">Cancel</Button>
          <Button onClick={submitBannerChange} variant="contained" color="primary">Submit</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openBadges} onClose={closeBadgesChange} fullWidth maxWidth="md">
        <DialogTitle>
            <Stack direction="row" sx={{ alignContent: 'space-between', justifyContent: 'space-between' }}>
            Change Badges
            <Button startIcon={<X fontSize="var(--icon-fontSize-md)" />} onClick={closeBadgesChange} />
            </Stack>
        </DialogTitle>
        <DialogContent>
          <Card sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <CardContent>
              <Typography variant="overline">Displayed Badges (Drag to reorder)</Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 2,
                }}
              >
                {badgesSelected.map((badge, index) => (
                  <Box
                    key={badge.id}
                    draggable
                    onDragStart={() => {
                      dragItemIndex.current = index;
                    }}
                    onDragEnter={() => {
                      dragOverIndex.current = index;
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                    }}
                    onDragEnd={() => {
                      const from = dragItemIndex.current;
                      const to = dragOverIndex.current;

                      if (from === null || to === null || from === to) return;

                      moveBadge(from, to);

                      dragItemIndex.current = null;
                      dragOverIndex.current = null;
                    }}
                    sx={{
                      width: 64,
                      height: 64,
                      cursor: "grab",
                      "&:active": { cursor: "grabbing" },
                    }}
                  >
                    <Typography variant="caption" sx={{ textAlign: 'center' }}>{index + 1}</Typography>
                    <Box
                      component="img"
                      src={`/assets/${badge.image.filename}`}
                      sx={{ width: 64, height: 64 }}
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>

            <Divider orientation='vertical' flexItem/>

            <CardContent>
              <Typography variant="body1">Choose Badges</Typography>

              <Grid direction="row" container spacing={3}>
                {
                  badgeList?.map((item) => (
                    <Grid key={'Badge' + item.id} xs={12} sm={6} md={4}>
                      <Button
                        key={item.id}
                        variant="text"
                        onClick={() => {
                          if (badgesSelected.some(badge => badge.id === item.badge.id)) {
                            setBadgesSelected(badgesSelected.filter(badge => badge.id !== item.badge.id));
                          } else {
                            setBadgesSelected([...badgesSelected, item.badge]);
                          }
                        }}
                      >
                        <Badge
                          badgeContent={
                            <Checkbox
                              checked={badgesSelected.some(badge => badge.id === item.badge.id)}
                            />
                          } 
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                          }}
                        >
                          <Box 
                            component="img"
                            src={`/assets/${item.badge.image.filename}`}
                            sx={{
                              width: 64,
                              height: 64,
                            }}
                            />
                        </Badge>
                      </Button>
                    </Grid>
                  ))
                }
                </Grid>
            </CardContent>
          </Card>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeBadgesChange} variant="contained" color="error">Cancel</Button>
          <Button onClick={submitBadgesChange} variant="contained" color="primary">Submit</Button>
        </DialogActions>
      </Dialog>
    </form>
  );
}
