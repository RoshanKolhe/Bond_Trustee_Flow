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
import { useSnackbar } from 'src/components/snackbar';
import { useRouter, useSearchParams } from 'src/routes/hook';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import axiosInstance from 'src/utils/axios';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

export default function JwtRegisterTrusteeByMobileView() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [errorMsg, setErrorMsg] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [otp, setOtp] = useState(Array(4).fill(''));
  const [otpStarted, setOtpStarted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const otpRefs = useRef([]);

  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');

  const RegisterSchema = Yup.object().shape({
    mobileNo: Yup.string()
      .matches(/^[0-9]+$/, 'Only numbers allowed')
      .length(10, 'Mobile number must be 10 digits')
      .required('Mobile Number is required'),
  });

  const defaultValues = {
    mobileNo: '',
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    getValues,
    trigger,
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

  // ------------------------------------------------------
  // Send OTP using axiosInstance
  // ------------------------------------------------------
  const handleSendOtp = async () => {
    const valid = await trigger('mobileNo');
    if (!valid) return;

    const phone = getValues('mobileNo');

    try {
      const res = await axiosInstance.post('/auth/send-phone-otp', {
        phone,
        role: 'trustee',
      });

      enqueueSnackbar(res.data.message, { variant: 'success' });

      // save sessionId
      setSessionId(res.data.sessionId);
      localStorage.setItem('sessionId', res.data.sessionId);

      // reset OTP boxes
      setOtp(Array(4).fill(''));
      setOtpStarted(false);
      setIsOtpSent(true);
      startTimer();
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.message || 'Failed to send OTP', {
        variant: 'error',
      });
    }
  };

  const handleResendOtp = async () => {
    const phone = getValues('mobileNo');

    try {
      const res = await axiosInstance.post('/auth/send-phone-otp', {
        phone,
        role: 'trustee',
      });

      enqueueSnackbar('OTP resent successfully!', { variant: 'success' });

      setSessionId(res.data.sessionId);
      localStorage.setItem('sessionId', res.data.sessionId);

      setOtp(Array(4).fill(''));
      otpRefs.current[0]?.focus();

      // restart timer
      startTimer();
    } catch (err) {
      enqueueSnackbar('Failed to resend OTP', { variant: 'error' });
    }
  };

  // ------------------------------------------------------
  // Verify OTP using axiosInstance
  // ------------------------------------------------------
  const onSubmit = handleSubmit(async () => {
    const enteredOtp = otp.join('');

    if (enteredOtp.length !== 4) {
      setErrorMsg('Enter all 4 digits');
      return;
    }

    try {
      const res = await axiosInstance.post('/auth/verify-phone-otp', {
        sessionId,
        otp: enteredOtp,
      });

      enqueueSnackbar(res.data.message, { variant: 'success' });

      // go to email page
      router.push(paths.auth.jwt.registerEmail);
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.message || 'Invalid OTP', {
        variant: 'error',
      });
    }
  });

  // ------------------------------------------------------
  // OTP Input Logic (same as MultiStep modal)
  // ------------------------------------------------------
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

  // ------------------------------------------------------
  // Render OTP boxes
  // ------------------------------------------------------
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
        <Typography variant="h4">Create an account</Typography>

        <Stack direction="row" spacing={0.5}>
          <Typography variant="body2">Already have an account?</Typography>
          <Link href={paths.auth.jwt.login} component={RouterLink} variant="subtitle2">
            Sign in
          </Link>
        </Stack>
      </Stack>

      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Stack spacing={3}>
          {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

          <RHFTextField
            name="mobileNo"
            label="Phone Number"
            inputProps={{
              maxLength: 10,
              inputMode: 'numeric',
              pattern: '[0-9]*',
            }}
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, '');
            }}
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

          {isOtpSent && renderOtpBoxes}
          {isOtpSent && (
            <Typography textAlign="start" variant="body2" sx={{ mt: -1 }}>
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

      <Typography
        sx={{ color: 'text.secondary', mt: 2.5, typography: 'caption', textAlign: 'center' }}
      >
        By signing up, you agree to our{' '}
        <Link underline="always" color="text.primary">
          Terms of Service
        </Link>{' '}
        &{' '}
        <Link underline="always" color="text.primary">
          Privacy Policy
        </Link>
        .
      </Typography>
    </Card>
  );
}
