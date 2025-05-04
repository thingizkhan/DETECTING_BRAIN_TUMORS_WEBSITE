import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  useTheme,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
} from '@mui/material';
import {
  Science as ScienceIcon,
  Psychology as PsychologyIcon,
  Storage as StorageIcon,
  Computer as ComputerIcon,
  Cloud as CloudIcon,
  Star as StarIcon,
  Dataset as DatasetIcon,
  Build as BuildIcon,
  Biotech as BiotechIcon,
  Assessment as AssessmentIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';

const Home: React.FC = () => {
  const theme = useTheme();

  return (
    <Box sx={{ py: 8 }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'var(--hero-gradient)',
          color: 'var(--text-light)',
          py: 12,
          mb: 8,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            animation: 'pulse 4s infinite',
          }}
        />
        <Container maxWidth="lg">
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom 
            align="center"
            className="fade-in"
            sx={{ 
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
            }}
          >
            AI-Powered Glioblastoma Treatment Planning
          </Typography>
          <Typography 
            variant="h5" 
            align="center" 
            className="fade-in"
            sx={{ 
              maxWidth: 800, 
              mx: 'auto',
              mb: 4,
              opacity: 0.9,
            }}
          >
            Revolutionizing glioblastoma treatment through non-invasive MGMT methylation prediction using advanced MRI analysis
          </Typography>
          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              className="gradient-button"
              sx={{ mt: 2 }}
            >
              Get Started
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* Introduction */}
        <Box sx={{ mb: 8 }} className="fade-in">
          <Typography variant="h4" gutterBottom className="section-title">
            Introduction
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card className="card-hover">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ScienceIcon sx={{ color: 'var(--primary-main)', mr: 1 }} />
                    <Typography variant="h6" gutterBottom>
                      The Challenge
                    </Typography>
                  </Box>
                  <Typography>
                    Glioblastoma, the most aggressive primary brain tumor, requires precise treatment planning. 
                    Current methods for determining MGMT methylation status involve invasive procedures, 
                    causing patient discomfort and potential complications.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card className="card-hover">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PsychologyIcon sx={{ color: 'var(--secondary-main)', mr: 1 }} />
                    <Typography variant="h6" gutterBottom>
                      Our Solution
                    </Typography>
                  </Box>
                  <Typography>
                    We've developed an AI-based system that predicts MGMT methylation status directly from MRI scans, 
                    eliminating the need for invasive tests while maintaining high accuracy and reliability.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* How It Works */}
        <Box sx={{ mb: 8 }} className="fade-in">
          <Typography variant="h4" gutterBottom className="section-title">
            How It Works
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card className="card-hover">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <DatasetIcon sx={{ color: 'var(--accent-blue)', mr: 1 }} />
                    <Typography variant="h6" gutterBottom>
                      Dataset
                    </Typography>
                  </Box>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <StorageIcon sx={{ color: 'var(--accent-blue)' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="RSNA-MICCAI Radiogenomic Classification Dataset"
                        secondary="Multi-modal MRI sequences: T1w, T1wCE, T2w, FLAIR"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <AssessmentIcon sx={{ color: 'var(--accent-blue)' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="MGMT Status Labels"
                        secondary="Methylated vs. unmethylated classification"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card className="card-hover">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <BuildIcon sx={{ color: 'var(--accent-teal)', mr: 1 }} />
                    <Typography variant="h6" gutterBottom>
                      Preprocessing
                    </Typography>
                  </Box>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <ComputerIcon sx={{ color: 'var(--accent-teal)' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Image Processing"
                        secondary="Skull stripping, normalization, and modality stacking"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <BuildIcon sx={{ color: 'var(--accent-teal)' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Data Augmentation"
                        secondary="Flips, rotations, zooms, and intensity shifts"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card className="card-hover">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PsychologyIcon sx={{ color: 'var(--accent-green)', mr: 1 }} />
                    <Typography variant="h6" gutterBottom>
                      Model
                    </Typography>
                  </Box>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <ScienceIcon sx={{ color: 'var(--accent-green)' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="3D CNN Architecture"
                        secondary="Processes volumetric MRI data efficiently"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <BuildIcon sx={{ color: 'var(--accent-green)' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Optimization"
                        secondary="Bayesian hyperparameter search with Keras Tuner"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <AssessmentIcon sx={{ color: 'var(--accent-green)' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Interpretability"
                        secondary="Grad-CAM for visual explanation of predictions"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card className="card-hover">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AssessmentIcon sx={{ color: 'var(--accent-cyan)', mr: 1 }} />
                    <Typography variant="h6" gutterBottom>
                      Prediction & Evaluation
                    </Typography>
                  </Box>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <CloudIcon sx={{ color: 'var(--accent-cyan)' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Output"
                        secondary="Probability scores for methylation status"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <AssessmentIcon sx={{ color: 'var(--accent-cyan)' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Metrics"
                        secondary="AUC, accuracy, precision, and recall evaluation"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* System Architecture */}
        <Box sx={{ mb: 8 }} className="fade-in">
          <Typography variant="h4" gutterBottom className="section-title">
            System Architecture
          </Typography>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              background: 'var(--card-gradient)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at 50% 50%, rgba(25,118,210,0.05) 0%, transparent 50%)',
                animation: 'pulse 4s infinite',
              }}
            />
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <ComputerIcon sx={{ fontSize: 40, color: 'var(--primary-main)', mb: 2 }} />
                  <Typography variant="h6">Frontend</Typography>
                  <Typography>React-based interface</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <StorageIcon sx={{ fontSize: 40, color: 'var(--secondary-main)', mb: 2 }} />
                  <Typography variant="h6">Backend</Typography>
                  <Typography>Flask API with 3D CNN</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <CloudIcon sx={{ fontSize: 40, color: 'var(--accent-teal)', mb: 2 }} />
                  <Typography variant="h6">Deployment</Typography>
                  <Typography>Nginx + Gunicorn + SSL</Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Box>

        {/* Key Contributions */}
        <Box sx={{ mb: 8 }} className="fade-in">
          <Typography variant="h4" gutterBottom className="section-title">
            Key Contributions
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card className="card-hover">
                <CardContent>
                  <StarIcon sx={{ color: 'var(--primary-main)', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Clinical Support Tool
                  </Typography>
                  <Typography>
                    First-step decision support system for glioblastoma treatment planning
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card className="card-hover">
                <CardContent>
                  <BiotechIcon sx={{ color: 'var(--secondary-main)', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Non-Invasive Prediction
                  </Typography>
                  <Typography>
                    Accurate prediction of treatment-sensitive tumors without invasive procedures
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card className="card-hover">
                <CardContent>
                  <ScienceIcon sx={{ color: 'var(--accent-teal)', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Clinical Integration
                  </Typography>
                  <Typography>
                    End-to-end system ready for seamless integration into clinical workflows
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* Documentation Download Section */}
      <Container maxWidth="md" sx={{ mb: 8 }}>
        <Card 
          className="card-hover fade-in"
          sx={{ 
            background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--secondary-light) 50%, var(--accent-teal) 100%)',
            p: 4,
            textAlign: 'center',
            color: 'white',
            '& .MuiTypography-root': {
              color: 'white'
            }
          }}
        >
          <Typography variant="body1" sx={{ mb: 4, maxWidth: 600, mx: 'auto', opacity: 0.9 }}>
            Access our comprehensive project documentation to learn more about the technical details, 
            methodology, and research findings.
          </Typography>
          <Button
            variant="contained"
            size="large"
            className="gradient-button"
            component="a"
            href="/capstone_project_presentation.pdf"
            download="capstone_project_presentation.pdf"
            startIcon={<AssessmentIcon />}
            sx={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(5px)',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.3)'
              }
            }}
          >
            Download Documentation
          </Button>
        </Card>
      </Container>
    </Box>
  );
};

export default Home; 