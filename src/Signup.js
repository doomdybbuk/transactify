// src/Signup.js
import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Container,
  Alert,
  Link,
  TextField,
} from '@mui/material';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import { auth } from './firebase';
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import logo from './assets/logo.png'; // Import your logo

const Signup = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [expandForm, setExpandForm] = useState(false);
  const [OTP, setOTP] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const setUpRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        'recaptcha-container',
        {
          size: 'invisible',
          callback: (response) => {
            // reCAPTCHA solved
          },
        },
        auth
      );
    }
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    if (phoneNumber === '' || phoneNumber.length < 10) {
      setError('Please enter a valid phone number!');
      return;
    }
    setError('');
    setUpRecaptcha();
    const appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, '+' + phoneNumber, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setExpandForm(true);
      })
      .catch((error) => {
        console.log(error);
        setError(error.message);
      });
  };

  const handleOTPSubmit = (e) => {
    e.preventDefault();
    if (OTP.length !== 6) {
      setError('Please enter a valid 6-digit OTP!');
      return;
    }
    setError('');
    const confirmationResult = window.confirmationResult;
    confirmationResult
      .confirm(OTP)
      .then((result) => {
        // User signed up successfully.
        const user = result.user;
        console.log('User signed up successfully:', user);
        // Redirect to Login page
        navigate('/login');
      })
      .catch((error) => {
        console.log(error);
        setError('Invalid OTP. Please try again.');
      });
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          mt: 5,
          p: 4,
          boxShadow: 5,
          borderRadius: 3,
          textAlign: 'center',
          background: 'linear-gradient(135deg, #1a237e 30%, #0d47a1 90%)',
          color: '#ffffff',
        }}
      >
        <img src={logo} alt="Transactify Logo" style={{ width: '80px', marginBottom: '20px' }} />
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontFamily: 'Poppins', fontWeight: 600 }}
        >
          Transactify
        </Typography>
        <Typography variant="subtitle1" gutterBottom sx={{ fontFamily: 'Poppins' }}>
          Sign up with your phone number
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <form onSubmit={expandForm ? handleOTPSubmit : handleSignUpSubmit}>
          {!expandForm && (
            <>
              <PhoneInput
                country={'us'}
                value={phoneNumber}
                onChange={(phone) => setPhoneNumber(phone)}
                inputStyle={{
                  width: '100%',
                  height: '50px',
                  fontSize: '16px',
                  borderRadius: '8px',
                }}
                buttonStyle={{ borderRadius: '8px 0 0 8px' }}
                dropdownStyle={{ borderRadius: '8px' }}
                specialLabel=""
                containerStyle={{ marginTop: '20px' }}
              />
              <div id="recaptcha-container"></div>
              <Button
                variant="contained"
                fullWidth
                type="submit"
                sx={{
                  mt: 3,
                  backgroundColor: '#ff6f00',
                  color: '#ffffff',
                  height: '50px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  borderRadius: '8px',
                  '&:hover': {
                    backgroundColor: '#ff8f00',
                  },
                }}
              >
                Send OTP
              </Button>
              <Typography variant="body2" sx={{ mt: 3, fontFamily: 'Poppins' }}>
                Already have an account?{' '}
                <Link href="/login" underline="hover" sx={{ color: '#ffcc80' }}>
                  Login here
                </Link>
              </Typography>
            </>
          )}
          {expandForm && (
            <>
              <Typography
                variant="body1"
                gutterBottom
                sx={{ mt: 2, fontFamily: 'Poppins' }}
              >
                Enter the OTP sent to your phone
              </Typography>
              <TextField
                variant="outlined"
                fullWidth
                placeholder="Enter OTP"
                value={OTP}
                onChange={(e) => setOTP(e.target.value)}
                sx={{
                  mt: 2,
                  input: { color: '#ffffff' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#ffffff',
                    },
                    '&:hover fieldset': {
                      borderColor: '#ffcc80',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#ffcc80',
                    },
                  },
                }}
                InputProps={{
                  style: { color: '#ffffff' },
                }}
              />
              <Button
                variant="contained"
                fullWidth
                type="submit"
                sx={{
                  mt: 3,
                  backgroundColor: '#ff6f00',
                  color: '#ffffff',
                  height: '50px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  borderRadius: '8px',
                  '&:hover': {
                    backgroundColor: '#ff8f00',
                  },
                }}
              >
                Verify OTP
              </Button>
            </>
          )}
        </form>
      </Box>
    </Container>
  );
};

export default Signup;
