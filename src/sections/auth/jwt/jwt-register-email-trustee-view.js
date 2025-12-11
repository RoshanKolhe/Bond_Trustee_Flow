import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useState, useRef } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import { Button, Card, Grid, TextField } from '@mui/material';
import { useRouter, useSearchParams } from 'src/routes/hook';
import { useSnackbar } from 'src/components/snackbar';
import axiosInstance from 'src/utils/axios';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

export default function JwtRegisterTrusteeByEmailView() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const redirectBasedOnProgress = async (sessionId) => {
    try {
      const res = await axiosInstance.get(`/trustee-profiles/kyc-progress/${sessionId}`);

      const progress = res?.data?.currentProgress || [];
      const profile = res?.data?.profile;

      console.log('CURRENT PROGRESS:', progress);

      if (profile?.usersId) {
        sessionStorage.setItem('trustee_user_id', profile.usersId);
      }

      if (profile?.id) {
        sessionStorage.setItem('trustee_profile_id', profile.id);
      }

      if (!progress.includes('trustee_kyc')) {
        router.push(paths.auth.kyc.kycBasicInfo);
        return;
      }

      router.push(paths.auth.kyc.trusteeKyc);
      return;

    } catch (err) {
      console.error('KYC Progress Fetch Error:', err);
      enqueueSnackbar('Unable to fetch KYC progress', { variant: 'error' });

      router.push(paths.kycBasicInfo);
    }
  };

  const [errorMsg, setErrorMsg] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState(Array(4).fill(''));
  const [otpStarted, setOtpStarted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const otpRefs = useRef([]);

  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');

  const RegisterSchema = Yup.object().shape({
    email: Yup.string().email('Enter a valid email').required('Email is required'),
  });

  const defaultValues = {
    email: '',
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    trigger,
    getValues,
  } = methods;

  const startTimer = () => {
    setTimer(60);
    setCanResend(false);

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOtp = async () => {
    const validEmail = await trigger('email');
    if (!validEmail) return;

    const sessionId = localStorage.getItem('sessionId');
    const email = getValues('email');

    if (!sessionId) {
      setErrorMsg('Session expired. Please verify phone again.');
      return;
    }

    try {
      const res = await axiosInstance.post('/auth/send-email-otp', {
        sessionId,
        email,
      });

      enqueueSnackbar(res.data.message || 'OTP Sent!', { variant: 'success' });

      setOtp(Array(4).fill(''));
      setOtpStarted(false);
      setIsOtpSent(true);
      startTimer();
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || 'Failed to send OTP');
    }
  };

  const handleResendOtp = async () => {
    const email = getValues('email');
    const sessionId = localStorage.getItem('sessionId');

    try {
      await axiosInstance.post('/auth/send-email-otp', { sessionId, email });

      enqueueSnackbar('OTP resent successfully!', { variant: 'success' });

      setOtp(Array(4).fill(''));
      otpRefs.current[0]?.focus();

      startTimer();
    } catch (err) {
      setErrorMsg('Failed to resend OTP');
    }
  };

  const onSubmit = handleSubmit(async () => {
    const sessionId = localStorage.getItem('sessionId');
    const enteredOtp = otp.join('');

    if (enteredOtp.length !== 4) {
      setErrorMsg('Enter all 4 digits');
      return;
    }

    if (!sessionId) {
      setErrorMsg('Session expired. Please verify your phone again.');
      return;
    }

    try {
      const res = await axiosInstance.post('/auth/verify-email-otp', {
        sessionId,
        otp: enteredOtp,
      });

      enqueueSnackbar(res.data.message || 'Email Verified!', { variant: 'success' });

      await redirectBasedOnProgress(sessionId);
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || 'Invalid OTP');
    }
  });

  // -------------------------------------------------------
  // OTP INPUT LOGIC (same as phone)
  // -------------------------------------------------------
  const handleOtpChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      if (value && !otpStarted) {
        const cleared = Array(4).fill('');
        cleared[index] = value;
        setOtp(cleared);
        setOtpStarted(true);
        if (index < 3) otpRefs.current[index + 1]?.focus();
        return;
      }

      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 3) otpRefs.current[index + 1]?.focus();
    }
  };

  // -------------------------------------------------------
  // OTP BOXES UI (copy from phone)
  // -------------------------------------------------------
  const renderOtpBoxes = (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      {otp.map((digit, i) => (
        <Grid item xs={3} key={i}>
          <TextField
            value={digit}
            onChange={(e) => handleOtpChange(i, e.target.value)}
            inputRef={(el) => (otpRefs.current[i] = el)}
            onKeyDown={(e) => {
              if (e.key === 'Backspace' && !otp[i] && i > 0) {
                otpRefs.current[i - 1]?.focus();
              }
            }}
            inputProps={{
              maxLength: 1,
              style: { textAlign: 'center', fontSize: '1.5rem' },
            }}
          />
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Card sx={{ p: 3 }}>
      <Stack spacing={2} sx={{ mb: 3 }}>
        <Typography variant="h4">Basic Details</Typography>

        <Stack direction="row" spacing={0.5}>
          <Typography variant="body2">Important updates will be sent to this email</Typography>
        </Stack>
      </Stack>

      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Stack spacing={3}>
          {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

          {/* Email Field */}
          <RHFTextField
            name="email"
            label="Email"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <LoadingButton
                    variant="text"
                    size="small"
                    onClick={handleSendOtp}
                    disabled={isOtpSent}
                  >
                    {isOtpSent ? 'OTP Sent' : 'Send OTP'}
                  </LoadingButton>
                </InputAdornment>
              ),
            }}
          />

          {/* OTP Boxes */}
          {isOtpSent && renderOtpBoxes}

          {/* RESEND TIMER */}
          {isOtpSent && (
            <Typography variant="body2" textAlign="start">
              {!canResend ? (
                <>
                  Resend OTP after <b>{timer}</b> seconds
                </>
              ) : (
                <>
                  Didn't receive OTP?{' '}
                  <Button variant="text" onClick={handleResendOtp}>
                    Resend OTP
                  </Button>
                </>
              )}
            </Typography>
          )}

          {/* VERIFY BUTTON */}
          <LoadingButton
            fullWidth
            color="inherit"
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
            disabled={!isOtpSent}
          >
            Verify
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Card>
  );
}
