'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/use-user';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

import { authClient } from '@/lib/auth/client';
import { logger } from '@/lib/default-logger';
import { updateEduQuestConsent } from '@/api/services/eduquest-user';

interface ConsentFormProps {
  error1: string | null;
}

export function ConsentForm({ error1 }: ConsentFormProps): React.JSX.Element {
    const theme = useTheme();
    const router = useRouter();
    const { checkSession, eduquestUser } = useUser();
    const [checked, setChecked] = React.useState<boolean>(false);

    const onDownload = () => {
        const link = document.createElement("a");
        link.download = `Website_Download.pdf`;
        link.href = "/Website_Download.pdf";
        link.click();
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked);
    };

    const onAgree = React.useCallback(
        async (): Promise<void> => {
            if (eduquestUser) {
                await updateEduQuestConsent();
            }
            else {
                logger.error('User not found');
                return;
            }

            // Refresh the auth state
            await checkSession?.();
            router.refresh();
        },
            [checkSession, router]
    );

    const onCancel = React.useCallback(async (): Promise<void> => {
        try {
          const { error } = await authClient.signOutMsal();
    
          if (error) {
            logger.error('Sign out error', error);
            return;
          }
    
          // Refresh the auth state
          await checkSession?.();
    
          // UserProvider, for this case, will not refresh the router and we need to do it manually
          router.refresh();
          // After refresh, AuthGuard will handle the redirect
        } catch (err) {
          logger.error('Sign out error', err);
        }
    }, [checkSession, router]);

    return (
        <Stack spacing={2} >
            { error1 ? <Alert severity="error">{error1}</Alert>
                : null
            }

            <Typography align="center" variant="h6" sx={{ fontWeight: 'bold' }}>
                Study Information Sheet
            </Typography>
            <Stack px={3} sx={{ p: 1, maxHeight: '15vh', overflow: 'auto', border: '1px solid gray', borderRadius: 1, backgroundColor: theme.palette.background.default }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>REMOTE INFORMED CONSENT & TERMS OF USE</Typography>
                <br/>

                <Stack direction="row">
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>IRB Reference number:&nbsp;</Typography>
                    <Typography variant="body2">IRB-2026-847</Typography>
                </Stack>
                <Stack direction="row">
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Study Title:&nbsp;</Typography>
                    <Typography variant="body2">AI For Mathematics, EduQuest</Typography>
                </Stack>
                <Stack direction="row">
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Principal Investigator & Contact Details:&nbsp;</Typography>
                    <Typography variant="body2">Ong Chin Ann, chinann.ong@ntu.edu.sg</Typography>
                </Stack>
                <br/>

                <Stack>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Introduction</Typography>
                    <Typography variant="body2">You are invited to join our research study. Please read and understand this information sheet carefully. We will explain the study, answer your questions, and provide a Consent Form to sign when you are ready. You will receive a copy to take home.</Typography>
                    <br/>
                    <Typography variant="body2">You are invited because you are currently studying MH1100 Calculus I in AY2026/2027</Typography>
                    <br/>
                    <Typography variant="body2">This research aims to investigate the effectiveness of using large language models (LLM) in education through generating self-study quizzes, providing feedback based on their answers as well as the effectiveness of gamification in education. By understanding the effectiveness and limitations of the current state of LLM and gamification in education, more and better planning can be done to improve education.</Typography>
                    <br/>
                    <Typography variant="body2">We plan to recruit 300 participants from MH1100 Calculus I, School of Physics and Mathematical Sciences, NTU over a period of August 2026 to October 2026.</Typography>
                </Stack>
                <br/>

                <Stack>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Procedures</Typography>
                    <Typography variant="body2">During classroom sessions, students will participate using Wooclap, to record their answers and log their attendance for that session.</Typography>
                    <Typography variant="body2">Afterward, students can access EduQuest, and participate in the self-generating quiz feature, called Quest. Students will try to attempt at least one quest.</Typography>
                    <br/>
                    <Typography variant="body2">If you decide to join our study, you will be asked to participate in Wooclap and EduQuest. Your participation will last approximately 3 months. The study will involve lectures and tutorials visits.</Typography>
                    <br/>
                    <Typography variant="body2">If you participate, this is what will happen: Exclusive quizzes will be generated for Wooclap, allow you to experience a wider variety of questions and improve your understanding. You will have to attend the lectures and tutorials to obtain this benefit. EduQuest will allow you to study at your own time and pace, and help you improve your understanding of the topic, anytime, anywhere.</Typography>
                </Stack>
                <br/>

                <Stack>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Voluntary Participation and Participant’s Rights</Typography>
                    <Typography variant="body2">Your participation in this study is entirely voluntary. You can withdraw at any time without giving a reason. Your decision to withdraw or not participate will not affect any benefits you are otherwise entitled to. If you choose to stop participating, please inform the researchers. Research data collected until the time of your withdrawal will be kept and analysed to enable a comprehensive evaluation of the study.</Typography>
                    <br/>
                    <Typography variant="body2">The investigators may stop your participation at any time if it is in your best interests, or if you do not follow the study instructions. </Typography>
                    <br/>
                    <Typography variant="body2">If any new information arises (including but not limited to serious adverse events, or changes in research plans) that may affect your willingness to continue participation, the Principal Investigator (or their representative) will promptly inform you (or your Legally Acceptable Representative, if relevant) and seek further consent if required.</Typography>
                    <br/>
                    <Typography variant="body2">Minors are allowed to consent to this study.</Typography>
                    <Typography variant="body2">If minors reach 21 years old during the study, they will be contacted for further consent to continue participation.</Typography>
                </Stack>
                <br/>

                <Stack>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Risks and Discomforts</Typography>
                    <Typography variant="body2">You may experience discomfort as your scores obtained during the Wooclap sessions will be shown to your tutorial group and the cohort. However, you can choose to be anonymous by changing your nickname.</Typography>
                    <Typography variant="body2">Your midterm grades will also be collected for this study, however none of your identifying informatinos are stored. Only the mean, median, upper-quartile and lower-quartile information will be collected at the end of the study.</Typography>
                </Stack>
                <br/>

                <Stack>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Benefits</Typography>
                    <Typography variant="body2">Students participating in this can benefit from having a support team that will ensure the quiz generating is functional and relevant compared to generating quizzes on their own. Not only that, as the website includes multiple gamification features, students may feel more motivated to practice compared to without having this website.</Typography>
                </Stack>
                <br/>

                <Stack>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Compensation</Typography>
                    <Typography variant="body2">Your participation in this study will involve the collection, use and disclosure of data in an individually-identifiable form (or “Personal Data”). “Personal Data” means data about you / your child / your ward, which makes you / your child / your ward identifiable from (i) such data, and/or from (ii) other information which we have or likely have access to. This includes written, visual, video, and audio data/recordings.</Typography>
                    <br/>
                    <Typography variant="body2">Personal Data and data collected for this study will be kept confidential and stored for a minimum of 10 years in a secure environment within Azure PostgreSQL. Access will be restricted to the Principal Investigator, study team members, and School Administrators. Your records, to the extent of the applicable laws and regulations, will not be made publicly available, in accordance with the NTU Privacy Statement.</Typography>
                    <br/>
                    <Typography variant="body2">However, government ministries, or regulatory agencies, and the NTU Institutional Review Board will be granted direct access to your Personal Data to check study procedures and data, without making any of your information public. Your Personal Data may be shared with government bodies when acquisitioned by law or when ordered to do so by a court or legislations. </Typography>
                    <br/>
                    <Typography variant="body2">By signing the Informed Consent Form attached, you (or your Legally Acceptable Representative, if relevant) agree and consent to the: (i) collection, access to, use and storage of your Personal Data and research data, and (ii) disclosure to, and use and storage by, authorised service providers and relevant third parties, whether located in Singapore or overseas, for the purposes of this study or future research studies.</Typography>
                    <br/>
                    <Typography variant="body2">Data collected are the property of NTU. In the event of any publication regarding this study, only de-identified research data will be used. Such de-identified research data may also be deposited in a publicly-accessible data repository (such as the Digital Repository of NTU). </Typography>
                    <br/>
                    <Typography variant="body2">Any research data containing your Personal Data that is collected for the purposes described in this Study Information Sheet and Consent Form will be stored in Singapore. </Typography>
                    <br/>
                    <Typography variant="body2">Any individually-identifiable data obtained during the course of this study will be stored and used only for the purposes of this study. Your Personal Data will not be used for future research, unless otherwise consented by you in the accompanying Consent Form.</Typography>
                </Stack>
                <br/>

                <Stack>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Whom to Contact if You Have Questions</Typography>
                    <Typography variant="body2">If you have any questions, complaints, or feedback about this research, or in the event of any injuries during the study, please contact the Principal Investigator, Ong Chin Ann, chinann.ong@ntu.edu.sg, or the Student Investigator, Tang Nian Ci, TA0002CI@e.ntu.edu.sg.</Typography>
                    <br/>
                    <Typography variant="body2">The study has undergone ethics approval by the NTU Institutional Review Board. If you want an independent opinion to address concerns, questions, complaints, or feedback; or require information regarding your rights as a research participant, please contact:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', textDecoration: 'underline' }}>NTU Institutional Review Board</Typography>
                    <Typography variant="body2">Research Integrity and Ethics Office</Typography>
                    <Typography variant="body2">Blk N1.2, B1-02A</Typography>
                    <Typography variant="body2">62 Nanyang Drive</Typography>
                    <Typography variant="body2">Singapore 637459</Typography>
                    <Typography variant="body2">Email: irb@ntu.edu.sg, Tel: 6904 1293</Typography>
                </Stack>
            </Stack>



            <Typography align="center" variant="h6" sx={{ fontWeight: 'bold' }}>
                Informed Consent Form
            </Typography>
            <Stack px={3} sx={{ p: 1, maxHeight: '15vh', overflow: 'auto', border: '1px solid gray', borderRadius: 1, backgroundColor: theme.palette.background.default }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>INFORMED CONSENT FORM</Typography>
                <br/>

                <Typography variant="body2">I voluntarily consent to take part in this research study. I have fully read, discussed, and understood the purpose and procedures of this study as stated in the Study Information Sheet attached to this consent form.  My questions concerning the study have been answered to my satisfaction, and I acknowledge that I am participating in this study of my own free will. </Typography>
                <br/>
                <Typography variant="body2">I understand that I may withdraw my consent and stop participating in the study at any time without giving any reasons, and without penalty.</Typography>
                <br/>
                <Typography variant="body2">By participating in this research study, I confirm that I consent to the collection, use and disclosure of my Personal Data for the purposes set out in the Study Information Sheet. </Typography>
                <br/>
                <Typography variant="body2">I agree that I will be contacted for additional consent, including but not limited to changes in the proposed research, serious adverse events that would lead to a change in the proposed research, the development of capacity by minors to make decisions, and any other circumstances which is specific to this research study.</Typography>


                <Stack>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Consent for Storage in Data Repositories and Linking of Data for Future Research</Typography>
                    
                    <Typography variant="body2" sx={{ fontWeight: 'bold', textDecoration: 'underline' }}>Data Repositories</Typography>
                    <Typography variant="body2">Research data about you, collected during this study, will be securely stored in a data repository(s) Azure PostgreSQL indefinitely, so that it may be used by other researchers for future research - i.e., for any research question which may be similar or unrelated to the current study. This means other researchers may request access to the data stored in the repository, to conduct further analysis and interpretations that could lead to new insights, discoveries, and scientific progress. </Typography>
                    <br/>
                    <Typography variant="body2">It is important to note that your data will be de-identified before storing it in a repository – i.e., any personally identifying information will be removed and/or encrypted to protect your privacy.</Typography>
                    <br/>

                    <Typography variant="body2" sx={{ fontWeight: 'bold', textDecoration: 'underline' }}>Data Linkage</Typography>
                    <Typography variant="body2">Additionally, research data about you may be linked with other sources for future research. These sources include but are not limited to data from: research you had took part in; other data repositories, databases, or registries; electronic health records; government records etc… Linking allows future research to connect/combine your data from multiple data sources to analyze it as a whole, and thus enable researchers to see the larger picture and understand their discoveries better.</Typography>
                    <br/>
                    <Typography variant="body2">Linking your data requires the use of unique information like your full name or national identification number. However, measures will be taken to safeguard the privacy and confidentiality of your data during the linkage ¬– e.g., personally identifying information (like national identification number) will be removed and/or encrypted, and a code will be used in place to protect your identity.</Typography>
                    <br/>
                    <Typography variant="body2">Allowing your research data to be: stored in a data repository; and linked to other data sources, for future research by other researchers, is completely voluntary. You can say “No” and still take part in this study. </Typography>
                    <br/>
                    <Typography variant="body2">You can change your mind about the storing and/or linking of your data at any time by informing the investigators. However, any data that has already been shared and/or linked for new research will not be affected, and the information from that research may still be used.</Typography>
                    <br/>
                    <Typography variant="body2">NOTE: By signing this consent form, you agree that research data (which cannot be used to re-identify you) can be used in the study’s publication, and that includes putting it on the Digital Repository of NTU (DR-NTU). Your choices below will not change this agreement.</Typography>
                    <br/>
                    <Typography variant="body2">Please print a copy of this consent form for your records, if you so desire.</Typography>
                </Stack>
            </Stack>

            <Button
                id="signIn"
                fullWidth
                variant="outlined"
                onClick={onDownload}
            >
                Download Consent
            </Button>

            <br/>
            
            <Stack direction="row" sx={{ backgroundColor: theme.palette.background.default }}>
                <FormControlLabel
                    label="I have read and understood the above consent form. I certify that I am an NTU student, and by clicking the next button to enter the survey, I indicate my willingness to voluntarily take part in the study."
                    control={
                        <Checkbox
                            checked={checked}
                            onChange={handleChange}
                        />
                    }
                />
            </Stack>

            <Stack spacing={2} direction='row'>
                <Button
                    id="signIn"
                    fullWidth
                    disabled={!checked}
                    variant="contained"
                    onClick={onAgree}
                >
                    Agree and Continue
                </Button>
                <Button
                    id="signIn"
                    fullWidth
                    variant="contained"
                    onClick={onCancel}
                    color="error"
                >
                    I do not wish to participate in this study.
                </Button>
            </Stack>
        </Stack>
  );
}
