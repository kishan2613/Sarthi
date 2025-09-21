import React, { useState } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Stack,
  CardMedia,
  Paper,
  Slide,
} from '@mui/material';
import { Camera, Image as ImageIcon, SearchCheck, SearchX, UploadCloud, FileWarning } from 'lucide-react';
import { motion } from 'framer-motion';

// Enhanced theme specifically for dashboard
const dashboardTheme = createTheme({
  palette: {
    primary: { main: '#2F80ED' },        // Blue accent replacing orange
    secondary: { main: '#0288D1' },
    background: {
      default: '#121212',                // Dark black background
      paper: '#1E1E1E',                  // Slightly lighter dark for paper/card
    },
    success: { main: '#2A9D8F' },
    warning: { main: '#F2C94C' },        // Soft yellow for warnings
    error: { main: '#EB5757' },
    text: {
      primary: '#E1E1E1',
      secondary: '#A0A0A0',
      light: '#FFFFFF',
    },
    grey: {
      50: '#FAFAFA',
      100: '#2A2A2A',
      200: '#3A3A3A',
      300: '#4A4A4A',
    },
  },
  typography: {
    fontFamily: `'Poppins', 'Roboto', sans-serif`,
    h1: { fontWeight: 700, fontSize: '2.5rem' },
    h2: { fontWeight: 600, fontSize: '1.75rem' },
    h3: { fontWeight: 600, fontSize: '1.5rem' },
    h4: { fontWeight: 500, fontSize: '1.25rem' },
    h5: { fontWeight: 500, fontSize: '1.1rem' },
    h6: { fontWeight: 500, fontSize: '1rem' },
    body1: { fontFamily: `'Roboto', sans-serif`, fontWeight: 400 },
    body2: { fontFamily: `'Roboto', sans-serif`, fontWeight: 400, fontSize: '0.875rem' },
    button: { fontWeight: 600, textTransform: 'none', fontSize: '0.95rem' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          padding: '12px 28px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.9)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 6px 16px rgba(47, 128, 237, 0.6)', // blue glow on hover
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow:
            '0 1px 3px rgba(0,0,0,0.9), 0 1px 2px rgba(47, 128, 237, 0.3)',
          border: '1px solid rgba(47, 128, 237, 0.15)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(47, 128, 237, 0.6)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          padding: '32px',
          backgroundColor: '#1E1E1E',
          boxShadow: '0 4px 16px rgba(0,0,0,0.9)',
        },
      },
    },
  },
});


// Main App Component
const CameraComponent = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Using public placeholder images for a premium look and reliable display.
  const cameraImages = [
    '/camera/img1.jpg',
    '/camera/img2.jpg',
    '/camera/img3.jpg',
  ];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const maxFileSize = 10 * 1024 * 1024; // 10 MB

    if (file) {
      if (file.size > maxFileSize) {
        setError(`File size exceeds the limit of ${maxFileSize / (1024 * 1024)} MB.`);
        setUploadedFile(null);
        setPreviewUrl(null);
        setResult(null);
        return;
      }
      setUploadedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setError(null);
      setIsProcessing(false);
    }
  };

  const handleRunDetection = async () => {
    if (!uploadedFile) {
      setError('Please upload an image first.');
      return;
    }

    setIsProcessing(true);
    setResult(null);
    setError(null);

    // Create a FormData object to send the file as multipart/form-data
    const formData = new FormData();
    formData.append('imageData', uploadedFile);

    try {
      const response = await fetch('http://localhost:5000/api/recognition/compare-faces', {
        method: 'POST',
        // The browser will automatically set the 'Content-Type' header to 'multipart/form-data'
        // when a FormData object is used, so we don't need to set it manually.
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
        if (response.status === 404) {
          errorMessage = "No images found in the target folder on the server.";
        } else if (response.status === 400) {
          errorMessage = "The uploaded file is corrupt or invalid.";
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setIsProcessing(false);

      if (data.status === 'error') {
        setError(data.message);
      } else if (data.match) {
        setResult({
          matchFound: true,
          matchImage: data.result.matchedImage,
          similarity: data.result.similarity,
        });
      } else {
        setResult({ matchFound: false });
      }
    } catch (err) {
      console.error('Error during API call:', err);
      setIsProcessing(false);
      setError(`An error occurred: ${err.message}`);
    }
  };

  return (
    <ThemeProvider theme={dashboardTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: 'background.default',
          p: { xs: 2, md: 6 },
        }}
      >
        <Container maxWidth="xl">
          {/* Main Title */}
          <Typography
            variant="h2"
            component="h1"
            align="center"
            gutterBottom
            sx={{ color: 'text.primary', mb: 6 }}
          >
            Real-Time Security Dashboard
          </Typography>

          {/* Camera Feeds Section */}
          <Paper elevation={2} sx={{ mb: 4, p: { xs: 2, md: 3 } }}>
            <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
              Live Camera Feeds
            </Typography>
            <Grid container spacing={{ xs: 2, md: 4 }}>
              {cameraImages.map((image, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent sx={{ textAlign: 'center', p: 2 }}>
                      <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} mb={2}>
                        <Camera color={dashboardTheme.palette.secondary.main} size={20} />
                        <Typography variant="h6">Camera {index + 1}</Typography>
                      </Stack>
                      <CardMedia
                        component="img"
                        image={image}
                        alt={`Camera ${index + 1} Feed`}
                        sx={{ borderRadius: '8px', height: { xs: 150, sm: 200, md: 110 }, objectFit: 'cover' }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>

          <Grid container spacing={4} mt={4}>
            {/* Upload and Detection Section */}
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ height: '100%' }}>
                <Typography variant="h4" component="h2" gutterBottom>
                  Upload Image for Detection
                </Typography>
                <Typography variant="body1" color="text.secondary" mb={3}>
                  Select a person's image to scan against the live camera feeds.
                </Typography>
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  style={{ display: 'none' }}
                  id="image-upload-button"
                  onChange={handleFileUpload}
                />
                <label htmlFor="image-upload-button">
                  <Button variant="contained" component="span" startIcon={<ImageIcon />} sx={{ mb: 3, width: '100%' }}>
                    Upload Image
                  </Button>
                </label>

                <Slide direction="up" in={previewUrl !== null} mountOnEnter unmountOnExit>
                  <Box sx={{ mt: 2, mb: 3 }}>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      Uploaded Image Preview:
                    </Typography>
                    <CardMedia
                      component="img"
                      image={previewUrl}
                      alt="Uploaded Preview"
                      sx={{ borderRadius: '12px', maxHeight: 300, width: '100%', objectFit: 'contain' }}
                    />
                  </Box>
                </Slide>
                
                {error && (
                  <Stack alignItems="center" spacing={1} p={1} sx={{ bgcolor: 'error.main', color: 'text.light', borderRadius: '8px', mb: 2 }}>
                    <FileWarning />
                    <Typography variant="body2" align="center" sx={{ fontWeight: 'bold' }}>
                      {error}
                    </Typography>
                  </Stack>
                )}

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 3 }}
                  onClick={handleRunDetection}
                  disabled={!uploadedFile || isProcessing}
                >
                  {isProcessing ? <CircularProgress size={24} color="inherit" /> : 'Run Detection'}
                </Button>
              </Paper>
            </Grid>

            {/* Results Section */}
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Typography variant="h4" component="h2" gutterBottom>
                  Detection Results
                </Typography>
                <Typography variant="body1" color="text.secondary" mb={3} align="center">
                  The results of the face detection will appear below.
                </Typography>

                {isProcessing && (
                  <Stack alignItems="center" spacing={3} sx={{ py: 4, px: 2 }}>
                    <CircularProgress size={60} color="primary" />
                    <Typography variant="h6" color="text.secondary">
                      Scanning camera feeds...
                    </Typography>
                  </Stack>
                )}
                
                {result && result.matchFound && (
                  <Stack alignItems="center" spacing={3} p={3}>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    >
                      <SearchCheck color={dashboardTheme.palette.success.main} size={64} />
                    </motion.div>
                    <Typography variant="h5" color="success" align="center">
                      Match Found!
                    </Typography>
                    <Typography variant="body1" color="text.primary" align="center">
                      Detected with a similarity of {result.similarity}.
                    </Typography>
                    <CardMedia
                      component="img"
                      image={result.matchImage}
                      alt="Detected Person"
                      sx={{ borderRadius: '16px', maxHeight: 300, width: '100%', objectFit: 'contain' }}
                    />
                  </Stack>
                )}

                {result && !result.matchFound && (
                  <Stack alignItems="center" spacing={3} p={3}>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    >
                      <SearchX color={dashboardTheme.palette.warning.main} size={64} />
                    </motion.div>
                    <Typography variant="h5" color="warning" align="center">
                      No Match Found.
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                      The uploaded image was not detected in any of the camera feeds.
                    </Typography>
                  </Stack>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default CameraComponent;
