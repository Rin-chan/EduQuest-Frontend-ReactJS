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
import {DraggableBadge} from "@/components/dashboard/account/account-drag-and-drop";
import { colorsAvailable } from '@/constants';
import { Cosmetic } from '@/types/cosmetic';

export function AccountDetailsForm(): React.JSX.Element {
  const { eduquestUser, cosmetic, checkSession } = useUser();
  const nicknameRef = React.useRef<HTMLInputElement>(null);
  const [userPhoto, setUserPhoto] = React.useState<string | null>(null);
  const [showUserInitials, setShowUserInitials] = React.useState(false);
  const [userAvatarProps, setUserAvatarProps] = React.useState<UserAvatarProps>({
    name: '?',
  });
  const [submitStatus, setSubmitStatus] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [pictureList, setPictureList] = React.useState<Cosmetic[] | null>(null);
  const [borderList, setBorderList] = React.useState<Cosmetic[] | null>(null);
  const [bannerList, setBannerList] = React.useState<Cosmetic[] | null>(null);
  
  const [file, setFile] = React.useState<File | string | null>(null);
  const [color, setColor] = React.useState<string>('white');
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [borderOption, setBorderOption] = React.useState<number>(-1);
  const [bannerOption, setBannerOption] = React.useState<number>(-1);
  const [badgesSelected, setBadgesSelected] = React.useState<string[]>([]);

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
      try {
        logger.debug("User Avatar: ", cosmetic.profile_picture.filename);
        if (cosmetic.profile_picture.filename === '') {
          setShowUserInitials(true);
          setUserAvatarProps({
            name: formatName(eduquestUser.nickname),
            bgColor: 'var(--mui-palette-neutral-900)',
            textColor: "white",
          });
        } else {
          setUserPhoto(cosmetic.profile_picture.filename);
          setFile(cosmetic.profile_picture.filename);
          setShowUserInitials(false);
        }

        if (cosmetic.profile_background != '') {
          setColor(cosmetic.profile_background);
        }
        else {
          setColor('white');
        }
      } catch (error) {
        setShowUserInitials(true);
        setUserAvatarProps({
          name: formatName(eduquestUser.nickname),
          bgColor: 'var(--mui-palette-neutral-900)',
          textColor: "white",
        });
        logger.error('Error fetching user photo: ', error)
      }
    }
    else if (eduquestUser) {
      setShowUserInitials(true);
      setUserAvatarProps({
        name: formatName(eduquestUser.nickname),
        bgColor: 'var(--mui-palette-neutral-900)',
        textColor: "white",
      });
      setColor('white');
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

  const openAvatarEditChange = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
    setOpenAvatarEdit(true);
  }

  const closeAvatarEditChange = (): void => {
    setAnchorEl(null);
    setOpenAvatarEdit(false);
  }

  const openAvatarChange = (): void => {
    setOpenAvatar(true);
    closeAvatarEditChange();
  }

  const closeAvatarChange = (): void => {
    setOpenAvatar(false);
    setFile(null);
    setColor('white');
  }

  const submitAvatarChange = (): void => {
    // Save the avatar change (file or color) to the server here
    closeAvatarChange();
  }

  const openBackgroundChange = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
    setOpenBackground(true);
  }
  const closeBackgroundChange = async (): Promise<void> => {
    setOpenBackground(false);
    setAnchorEl(null);
    await refreshUser();
  }

  const submitBackgroundChange = (): void => {
    // Save the background change (file) to the server here
    closeBackgroundChange();
  }

  const openBorderChange = (): void => {
    setOpenBorder(true);
    setOpenAvatarEdit(false);
  }
  const closeBorderChange = (): void => {
    setOpenBorder(false);
  }

  const submitBorderChange = (): void => {
    // Save the border change (color) to the server here
    closeBorderChange();
    setBorderOption(-1);
  }

  const openBannerChange = (): void => {
    setOpenBanner(true);
  }
  const closeBannerChange = (): void => {
    setOpenBanner(false);
  }

  const submitBannerChange = (): void => {
    // Save the banner change (color) to the server here
    closeBannerChange();
    setBannerOption(-1);
  }

  const openBadgesChange = (): void => {
    setOpenBadges(true);
  }
  const closeBadgesChange = (): void => {
    setOpenBadges(false);
    setBadgesSelected([]);
  }

  const submitBadgesChange = (): void => {
    // Save the badges change (color) to the server here
    closeBadgesChange();
  }

  function moveBadge(dragIndex: number, hoverIndex: number): void {
    setBadgesSelected((prev) => {
      const updated = [...prev];

      const draggedItem = updated[dragIndex];

      updated.splice(dragIndex, 1);
      updated.splice(hoverIndex, 0, draggedItem);

      return updated;
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent style={{backgroundImage: `linear-gradient(to right, white, ${color}, white)`}}>
          <Grid container spacing={3}>
            <Grid sm={6} xs={12}>
              <Grid style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px', marginBottom: '64px' }}>
                <IconButton onClick={openAvatarEditChange}>
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
                      src="https://png.pngtree.com/png-vector/20250724/ourmid/pngtree-elegant-gold-circle-frame-png-image_16679818.webp"
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
                    {
                      showUserInitials ?
                        <UserAvatar size='48px' {...userAvatarProps}/>
                        : userPhoto ?
                        <Avatar
                          src={userPhoto}
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
              <Button
                variant="text"
                component="label"
              >
                <input
                    type="file"
                    id="file-upload"
                    name="file"
                    accept="image/*"
                    hidden
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        if (event.target.files && event.target.files.length > 0) {
                            setFile(event.target.files[0]);
                        }
                    }}
                />
                {file ? 
                  <Avatar
                    src={URL.createObjectURL(file)}
                    sx={{width: 48, height: 48}}
                  /> :
                  <Typography variant='body1'>Upload File</Typography>
                }
              </Button>
            </CardContent>

            <Divider orientation='vertical' flexItem/>

            <CardContent>
              <Typography variant="body1">Choose Preset</Typography>

              <Grid direction="row" container>
                <Grid sm={4} xs={8}>
	                  <IconButton onClick={() => { setFile(null); }}>
                    <UserAvatar {...userAvatarProps}/>
                  </IconButton>
                </Grid>

                {
                  userPhoto ?
                  <Grid sm={4} xs={8}>
                      <IconButton onClick={() => { setFile(userPhoto); }}>
                      <Avatar
                        src={userPhoto}
                        sx={{width: 48, height: 48}}
                      />
                    </IconButton>
                  </Grid>
                  : null
                }

                {
                  pictureList?.map((item: Cosmetic) => (
                    <Grid sm={4} xs={8}>
                        <IconButton onClick={() => { setColor('blue'); }}>
                        <Avatar sx={{ bgcolor: 'blue' }} />
                      </IconButton>
                    </Grid>
                  ))
                }
                <Grid sm={4} xs={8}>
	                  <IconButton onClick={() => { setColor('blue'); }}>
                    <Avatar sx={{ bgcolor: 'blue' }} />
                  </IconButton>
                </Grid>

                <Grid sm={4} xs={8}>
	                  <IconButton onClick={() => { setColor('yellow'); }}>
                    <Avatar sx={{ bgcolor: 'yellow' }} />
                  </IconButton>
                </Grid>

                <Grid sm={4} xs={8}>
	                  <IconButton onClick={() => { setColor('green'); }}>
                    <Avatar sx={{ bgcolor: 'green' }} />
                  </IconButton>
                </Grid>
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
                {
                  colorsAvailable.map((colorOption: string) => (
                    <Grid xs={2}>
                        <IconButton onClick={() => { setColor(colorOption); }}>
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
                  width: 64,
                  height: 64,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box
                  component="img"
                  src="https://png.pngtree.com/png-vector/20250724/ourmid/pngtree-elegant-gold-circle-frame-png-image_16679818.webp"
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
                {
                  showUserInitials ?
                    <UserAvatar size='48px' {...userAvatarProps}/>
                    : userPhoto ?
                    <Avatar
                      src={userPhoto}
                      sx={{width: 48, height: 48}}
                    /> : <UserIcon size={32} color="var(--mui-palette-primary-main)" />
                }
              </Box>
            </CardContent>

            <Divider orientation='vertical' flexItem/>

            <CardContent>
              <Typography variant="body1">Choose Border</Typography>

              <Grid direction="row" container spacing={3}>
                {
                  borderList?.map((item: Cosmetic) => (
                    <Grid sm={6} xs={12}>
                      <IconButton onClick={() => { setBorderOption(1); }}>
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
                            src="https://png.pngtree.com/png-vector/20250724/ourmid/pngtree-elegant-gold-circle-frame-png-image_16679818.webp"
                            sx={{
                              position: 'absolute',
                              width: 64,
                              height: 64,
                              top: 0,
                              left: 0,
                              pointerEvents: 'none',
                            }}
                          />
                          <Avatar sx={{width: 48, height: 48}}/>
                        </Box>
                      </IconButton>
                    </Grid>
                  ))
                }

                <Grid sm={6} xs={12}>
	                  <IconButton onClick={() => { setBorderOption(1); }}>
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
                        src="https://png.pngtree.com/png-vector/20250724/ourmid/pngtree-elegant-gold-circle-frame-png-image_16679818.webp"
                        sx={{
                          position: 'absolute',
                          width: 64,
                          height: 64,
                          top: 0,
                          left: 0,
                          pointerEvents: 'none',
                        }}
                      />
                      <Avatar sx={{width: 48, height: 48}}/>
                    </Box>
                  </IconButton>
                </Grid>

                <Grid sm={6} xs={12}>
	                  <IconButton onClick={() => { setBorderOption(2); }}>
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
                        src="https://png.pngtree.com/png-clipart/20230403/original/pngtree-circle-border-design-png-image_9024072.png"
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
              </Grid>
            </CardContent>
          </Card>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeBorderChange} variant="contained" color="error">Cancel</Button>
          <Button onClick={submitBorderChange} variant="contained" color="primary">Submit</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openBanner} onClose={closeBannerChange}>
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
                      backgroundImage: 'url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQic0vjbZ9kDfF0KQMCQso5MSaWTypoMte02w&s)', 
                      backgroundSize: 'cover', 
                      backgroundPosition: 'center', 
                      minHeight: '5em', 
                      minWidth: '10em',
                      border: '1px solid black'
                    }}
                    >
                      <Stack direction="row" sx={{padding: 2}}>
                          <Box>
                              <Avatar
                                  src="/assets/avatar-1.png"
                                  alt="Avatar of user 1"
                                  sx={{ 
                                    width: 64, 
                                    height: 64,
                                  }}
                              />
                          </Box>

                          <Stack direction="column" spacing={0} sx={{display: 'flex', paddingLeft: 3, justifyContent: 'center'}}>
                              <Typography variant="h4">Name</Typography>
                              <Stack direction="row" spacing={1} sx={{display: 'flex', alignItems: 'center'}}>
	                                  <img
                                          alt=""
	                                      width={25}
	                                      height={25}
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

              <Grid direction="row" container spacing={2}>
                <Grid>
	                  <Button onClick={() => { setBannerOption(1); }}>
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

                <Grid>
	                  <Button onClick={() => { setBannerOption(2); }}>
	                    <Grid 
	                      direction="row" 
                      sx={{
                        backgroundImage: 'url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQic0vjbZ9kDfF0KQMCQso5MSaWTypoMte02w&s)', 
                        backgroundSize: 'cover', 
                        backgroundPosition: 'center', 
                        minHeight: '5em', 
                        minWidth: '10em',
                        border: '1px solid black'
                      }}
	                      />
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeBannerChange} variant="contained" color="error">Cancel</Button>
          <Button onClick={submitBannerChange} variant="contained" color="primary">Submit</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openBadges} onClose={closeBadgesChange}>
        <DialogTitle>
            <Stack direction="row" sx={{ alignContent: 'space-between', justifyContent: 'space-between' }}>
            Change Badges
            <Button startIcon={<X fontSize="var(--icon-fontSize-md)" />} onClick={closeBadgesChange} />
            </Stack>
        </DialogTitle>
        <DialogContent>
          <Card sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <CardContent>
                <div>
                  {badgesSelected.map((badge, index) => (
                    <DraggableBadge
	                      key={`${badge}-${String(index)}`}
                      badge={badge}
                      index={index}
                      moveBadge={moveBadge}
                    />
                  ))}
                </div>
            </CardContent>

            <Divider orientation='vertical' flexItem/>

            <CardContent>
              <Typography variant="body1">Choose Badges</Typography>

              <Stack direction="row" spacing={2} sx={{marginTop: 2}}>
                <Button 
                  variant="text"
                  onClick={() => {
                    if (badgesSelected.includes('badge1')) {
                      setBadgesSelected(badgesSelected.filter(badge => badge !== 'badge1'));
                    } else {
                      setBadgesSelected([...badgesSelected, 'badge1']);
                    }
                  }}
                >
                  <Badge
                    badgeContent={
                      <Checkbox
                        checked={badgesSelected.includes('badge1')}
                      />
                    } 
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                  >
                    <Box 
                      component="img"
                      src="/assets/first_attempt_badge.svg"
                      sx={{
                        width: 64,
                        height: 64,
                      }}
                      />
                  </Badge>
                </Button>

                <Button 
                  variant="text"
                  onClick={() => {
                    if (badgesSelected.includes('badge2')) {
                      setBadgesSelected(badgesSelected.filter(badge => badge !== 'badge2'));
                    } else {
                      setBadgesSelected([...badgesSelected, 'badge2']);
                    }
                  }}
                >
                  <Badge
                    badgeContent={
                      <Checkbox
                        checked={badgesSelected.includes('badge2')}
                      />
                    } 
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                  >
                    <Box 
                      component="img"
                      src="/assets/full_attendance_badge.svg"
                      sx={{
                        width: 64,
                        height: 64,
                      }}
                      />
                  </Badge>
                </Button>
              </Stack>
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
