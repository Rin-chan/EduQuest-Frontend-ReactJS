"use client";

import * as React from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from "@mui/material/Stack";
import { X } from "@phosphor-icons/react";
import { Typography } from '@mui/material';
import {useTheme} from "@mui/material/styles";
import {useUser} from "@/hooks/use-user";
import {logger} from "@/lib/default-logger";
import {importTestScore} from '@/api/services/test-score';
import Alert from "@mui/material/Alert";
import {Loading} from "@/components/dashboard/loading/loading";

interface ImportDataFormProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    courseGroupId: string;
}

export function ImportDataForm({open, setOpen, courseGroupId}: ImportDataFormProps): React.JSX.Element {
    const { eduquestUser} = useUser();
    const theme = useTheme();
    const [name, setName] = React.useState<String>('');
    const [file, setFile] = React.useState<File | null>(null);
    const [weightage, setWeightage] = React.useState<number>(100);

    const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});
    const [submitStatus, setSubmitStatus] = React.useState< { type: 'success' | 'error'; message: unknown } | null>(null);
    const [isProcessing, setIsProcessing] = React.useState(false);

    const getErrorMessage = (error: unknown): string => {
        if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status;
        if (statusCode === 400) {
            return 'Quest import failed. Please upload a valid .xlsx file.';
        }
        if (statusCode === 401 || statusCode === 403) {
            return 'You are not authorized to import this quest.';
        }
        if (statusCode && statusCode >= 500) {
            return 'Quest import failed due to a server issue. Please try again later.';
        }
        return 'Quest import failed. Please try again.';
        }
        return 'Quest import failed. Please try again.';
    };
    
    const handleClose = (): void => {
        setOpen(false);
    };

    const handleSubmit = async (): Promise<void> => {
        setSubmitStatus(null);
        const missingFields: string[] = [];
        const nextErrors: Record<string, string> = {};

        if (!name) {
            missingFields.push('Name');
            nextErrors.name = 'Name is required';
        }
        if (!weightage) {
            missingFields.push('Weightage');
            nextErrors.weightage = 'Weightage is required';
        }
        if (!file) {
            missingFields.push('External Report File');
            nextErrors.file = 'External Report File is required';
        }
        if (!eduquestUser) {
            missingFields.push('User Session');
            nextErrors.user = 'User Session is required';
        }

        if (missingFields.length > 0) {
            setSubmitStatus({
                type: 'error',
                message: `Please complete required fields.`
            });
            setFormErrors(nextErrors);
            return;
        }
        setFormErrors({});

        // Type narrowing guard for strict null checks
        if (!file || !eduquestUser) {
            setSubmitStatus({ type: 'error', message: 'Missing required fields.' });
            return;
        }

        const formData = new FormData();
        formData.append('name', name.toString());
        formData.append('weightage', weightage.toString());
        formData.append('user_id', eduquestUser?.id.toString());
        formData.append('course_group_id', courseGroupId);

        try {
            formData.append('file', file);
    
            const response = await importTestScore(formData);
            logger.debug('Upload Success, Test Score data: ', response);
            setSubmitStatus({type: 'success', message: 'Quest Import Successful'});
        } catch (error: unknown) {
            logger.error('Failed to import test scores', error);
            setSubmitStatus({type: 'error', message: getErrorMessage(error)});
        } finally {
            setIsProcessing(false);
        }

        handleClose();
    };

    return (
    <React.Fragment>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
            <Stack direction="row" sx={{ alignContent: 'space-between', justifyContent: 'space-between' }}>
                <Typography variant="h4">Add Test Results</Typography>
            <Button startIcon={<X fontSize="var(--icon-fontSize-md)" />} onClick={handleClose}></Button>
            </Stack>
        </DialogTitle>
        <DialogContent>
            <Stack direction='column' spacing={2}>
                <Stack sx={{ m:2 }}>
                    <Typography variant="h5">File Name</Typography>
                    <TextField
                        required
                        margin="dense"
                        fullWidth
                        variant="standard"
                        id="name"
                        value={name}
                        error={Boolean(formErrors.name)}
                        helperText={formErrors.name}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setName(event.target.value);
                        }}
                    />
                </Stack>

                <Stack sx={{ m:2 }}>
                    <Typography variant="h5">Upload File</Typography>
                    <Button
                    variant="contained"
                    component="label"
                    >
                    Upload File
                    <input
                        type="file"
                        id="file-upload"
                        name="file"
                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                        hidden
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            if (event.target.files && event.target.files.length > 0) {
                                setFile(event.target.files[0]);
                            }
                        }}
                    />
                    </Button>
                    <Typography variant="body1">{file ? file.name : 'No file selected'}</Typography>
                    <Typography variant="body1" color={theme.palette.error.main}>{formErrors.file || ""}</Typography>
                </Stack>

                <Stack sx={{ m:2 }}>
                    <Typography variant="h5">Weightage &#40;For leaderboard calculation&#41;</Typography>
                    <TextField
                        required
                        margin="dense"
                        fullWidth
                        variant="standard"
                        id="weightage"
                        value={weightage}
                        type="number"
                        error={Boolean(formErrors.weightage)}
                        helperText={formErrors.weightage || ''}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setWeightage(parseInt(event.target.value));
                        }}
                    />
                </Stack>

                {submitStatus ?
                    <Alert severity={submitStatus.type} sx={{ mt: 4 }}>
                        {String(submitStatus.message)}
                    </Alert> : null}
            
                {isProcessing ? <Loading text="Processing File..." /> : null}
            </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}