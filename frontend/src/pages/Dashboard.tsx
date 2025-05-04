import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  TextField,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Alert,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  Person as PersonIcon,
  Upload as UploadIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';

interface Report {
  id: number;
  filename: string;
  result: string;
  timestamp: string;
}

interface UserProfile {
  name: string;
  email: string;
}

interface PasswordForm {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

interface UploadForm {
  gender: string;
  dateOfBirth: string;
  consent: boolean;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
  });
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [uploadForm, setUploadForm] = useState<UploadForm>({
    gender: '',
    dateOfBirth: '',
    consent: false,
  });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  useEffect(() => {
    fetchUserProfile();
    fetchReports();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/auth/profile');
      setProfile(response.data);
    } catch (error) {
      toast.error('Failed to fetch profile');
    }
  };

  const fetchReports = async () => {
    try {
      const response = await api.get('/results');
      setReports(response.data);
    } catch (error) {
      toast.error('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const validateUpload = () => {
    const errors: string[] = [];
    if (!selectedFile) errors.push('Please select a file to upload');
    if (!uploadForm.gender) errors.push('Please select patient gender');
    if (!uploadForm.dateOfBirth) errors.push('Please enter date of birth');
    if (!uploadForm.consent) errors.push('Please accept the consent terms');
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmitReport = async () => {
    if (!validateUpload()) return;

    setUploadStatus('uploading');
    try {
      const formData = new FormData();
      formData.append('file', selectedFile!);
      formData.append('gender', uploadForm.gender);
      formData.append('dateOfBirth', uploadForm.dateOfBirth);

      await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadStatus('success');
      toast.success('File uploaded successfully. Prediction process has started.');
      setSelectedFile(null);
      setUploadForm({
        gender: '',
        dateOfBirth: '',
        consent: false,
      });
      fetchReports();
    } catch (error) {
      setUploadStatus('error');
      toast.error('Failed to upload report');
    } finally {
      setUploadStatus('idle');
    }
  };

  const handleProfileUpdate = async () => {
    try {
      await api.put('/auth/profile', {
        name: profile.name,
        email: profile.email
      });
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handlePasswordChange = async () => {
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordForm.new_password.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }

    try {
      await api.put('/auth/password', passwordForm);
      toast.success('Password changed successfully');
      setOpenPasswordDialog(false);
      setPasswordForm({
        old_password: '',
        new_password: '',
        confirm_password: '',
      });
    } catch (error) {
      toast.error('Failed to change password');
    }
  };

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    setViewDialogOpen(true);
  };

  const handleDeleteReport = async (reportId: number) => {
    try {
      await api.delete(`/results/${reportId}`);
      setReports(reports.filter(report => report.id !== reportId));
      toast.success('Report deleted successfully');
    } catch (error) {
      toast.error('Failed to delete report');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatPatientInfo = (gender: string, age: number) => {
    if (!gender || !age) return 'N/A';
    return `${gender.charAt(0).toUpperCase() + gender.slice(1)}, ${age} years`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'completed':
        return 'success';
      case 'failed':
        return 'error';
      default:
        return 'info';
    }
  };

  const renderProfileSection = () => (
    <Card className="card-hover fade-in">
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            sx={{
              bgcolor: 'var(--primary-main)',
              width: 56,
              height: 56,
              mr: 2,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            <PersonIcon />
          </Avatar>
          <Typography variant="h5" sx={{ color: 'var(--primary-main)' }}>Profile Settings</Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Name"
              value={profile.name}
              InputProps={{
                readOnly: true,
              }}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              value={profile.email}
              InputProps={{
                readOnly: true,
              }}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={() => setOpenPasswordDialog(true)}
              className="gradient-button"
            >
              Change Password
            </Button>
          </Grid>
        </Grid>
      </CardContent>
      <Alert severity="info" sx={{ mb: 4 }}>
          <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
            About This Platform
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            This platform is an academic research tool designed to assist in the analysis of brain MRI scans using artificial intelligence. Our primary focus is on advancing medical research and improving diagnostic capabilities.
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Data Privacy & Security:</strong>
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText 
                primary="• We only process and store brain MRI images for analysis purposes"
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="• No personal information is stored beyond what is necessary for account management"
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="• All data processing is conducted in a secure, HIPAA-compliant environment"
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="• Research findings are anonymized and used solely for academic purposes"
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
          </List>
        </Alert>
    </Card>
  );

  const renderUploadSection = () => (
    <Card className="card-hover fade-in">
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            sx={{
              bgcolor: 'var(--secondary-main)',
              width: 56,
              height: 56,
              mr: 2,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            <UploadIcon />
          </Avatar>
          <Typography variant="h5" sx={{ color: 'var(--secondary-main)' }}>Upload Report</Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
              Upload Instructions
            </Typography>
            <Typography variant="body2">
              Please upload a ZIP or NIfTI file (.nii, .nii.gz, or .zip) that contains the following four MRI sequences:
            </Typography>
            <List dense>
              <ListItem>• T1w</ListItem>
              <ListItem>• T1wCE</ListItem>
              <ListItem>• T2w</ListItem>
              <ListItem>• FLAIR</ListItem>
            </List>
            <Typography variant="body2">
              Make sure all images belong to the same patient and have the same dimensions.
            </Typography>
          </Alert>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Patient Gender</InputLabel>
                <Select
                  value={uploadForm.gender}
                  onChange={(e) => setUploadForm({ ...uploadForm, gender: e.target.value })}
                  label="Patient Gender"
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Date of Birth"
                type="date"
                value={uploadForm.dateOfBirth}
                onChange={(e) => setUploadForm({ ...uploadForm, dateOfBirth: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <input
              accept="*"
              style={{ display: 'none' }}
              id="report-upload"
              type="file"
              onChange={handleFileUpload}
            />
            <label htmlFor="report-upload">
              <Button
                variant="contained"
                component="span"
                startIcon={<UploadIcon />}
                className="gradient-button"
                sx={{ mb: 2 }}
              >
                Select File
              </Button>
            </label>
            {selectedFile && (
              <Typography sx={{ ml: 2, display: 'inline' }}>
                {selectedFile.name}
              </Typography>
            )}
          </Box>

          <Box sx={{ mt: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={uploadForm.consent}
                  onChange={(e) => setUploadForm({ ...uploadForm, consent: e.target.checked })}
                />
              }
              label={
                <Typography variant="body2">
                  I confirm that I am authorized to upload this medical data and agree to its use for AI analysis purposes. 
                  The data will be stored securely and used only for diagnostic and academic purposes.
                </Typography>
              }
            />
          </Box>

          {validationErrors.length > 0 && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {validationErrors.map((error, index) => (
                <Typography key={index} variant="body2">
                  • {error}
                </Typography>
              ))}
            </Alert>
          )}

          {uploadStatus === 'uploading' && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress />
              <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                Uploading and processing your file...
              </Typography>
            </Box>
          )}

          {uploadStatus === 'success' && (
            <Alert severity="success" sx={{ mt: 2 }}>
              <Typography variant="body2">
                Your file has been uploaded successfully. The prediction process has started. 
                You will be notified once it is complete. You can view this result under the My Reports section.
              </Typography>
            </Alert>
          )}

          <Button
            variant="contained"
            onClick={handleSubmitReport}
            disabled={uploadStatus === 'uploading'}
            className="gradient-button"
            sx={{ mt: 3 }}
          >
            {uploadStatus === 'uploading' ? (
              <>
                <CircularProgress size={24} sx={{ mr: 1 }} />
                Uploading...
              </>
            ) : (
              'Upload Report'
            )}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  const renderReportsSection = () => (
    <Card className="card-hover fade-in">
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            sx={{
              bgcolor: 'var(--accent-teal)',
              width: 56,
              height: 56,
              mr: 2,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            <HistoryIcon />
          </Avatar>
          <Typography variant="h5" sx={{ color: 'var(--accent-teal)' }}>My Reports</Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid rgba(0,0,0,0.1)' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Filename</TableCell>
                  <TableCell>Upload Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {report.filename}
                      </Typography>
                    </TableCell>
                    <TableCell>{formatDate(report.timestamp)}</TableCell>
                    <TableCell>
                      <Chip
                        label={report.result}
                        color={getStatusColor(report.result)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleViewReport(report)}
                        color="primary"
                        size="small"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteReport(report.id)}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );

  const renderViewDialog = () => (
    <Dialog
      open={viewDialogOpen}
      onClose={() => setViewDialogOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        Report Details
        <IconButton
          onClick={() => setViewDialogOpen(false)}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {selectedReport && (
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  File Information
                </Typography>
                <Typography variant="body1">
                  Filename: {selectedReport.filename}
                </Typography>
                <Typography variant="body1">
                  Upload Date: {formatDate(selectedReport.timestamp)}
                </Typography>
                <Typography variant="body1">
                  Status: {selectedReport.result}
                </Typography>
              </Grid>

              {selectedReport.result.toLowerCase() === 'pending' && (
                <Grid item xs={12}>
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <CircularProgress size={40} />
                    <Typography variant="body1" sx={{ mt: 2 }}>
                      Analysis in progress...
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        {selectedReport?.result.toLowerCase() !== 'pending' && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              // Implement PDF download
              toast.info('PDF download will be implemented');
            }}
          >
            Download PDF
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );

  const renderPasswordDialog = () => (
    <Dialog
      open={openPasswordDialog}
      onClose={() => setOpenPasswordDialog(false)}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          background: 'var(--neutral-light)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: 'var(--primary-main)',
          color: 'white',
          fontWeight: 'bold',
          borderRadius: '16px 16px 0 0',
        }}
      >
        Change Password
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Box className="fade-in">
          <TextField
            fullWidth
            label="Current Password"
            type="password"
            value={passwordForm.old_password}
            onChange={(e) => setPasswordForm({ ...passwordForm, old_password: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={passwordForm.new_password}
            onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Confirm New Password"
            type="password"
            value={passwordForm.confirm_password}
            onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
            sx={{ mb: 2 }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button 
          onClick={() => setOpenPasswordDialog(false)}
          sx={{ mr: 1 }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handlePasswordChange}
          className="gradient-button"
          disabled={!passwordForm.old_password || !passwordForm.new_password || !passwordForm.confirm_password}
        >
          Change Password
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Box
        className="fade-in"
        sx={{
          width: 280,
          bgcolor: 'var(--neutral-light)',
          borderRight: '1px solid var(--neutral-main)',
          py: 3,
          boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease',
        }}
      >
        <Box sx={{ px: 2, mb: 4 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'var(--text-primary)',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            Dashboard
          </Typography>
        </Box>
        <List>
          {[
            { id: 'profile', icon: <PersonIcon />, text: 'Profile Settings', color: 'var(--primary-main)' },
            { id: 'upload', icon: <UploadIcon />, text: 'Upload Report', color: 'var(--secondary-main)' },
            { id: 'reports', icon: <HistoryIcon />, text: 'My Reports', color: 'var(--accent-teal)' },
          ].map((item) => (
            <ListItem
              key={item.id}
              button
              onClick={() => setActiveSection(item.id)}
              className="fade-in"
              sx={{
                bgcolor: activeSection === item.id ? `${item.color}20` : 'transparent',
                '&:hover': { 
                  bgcolor: `${item.color}10`,
                },
                transition: 'all 0.3s ease',
                mb: 1,
                borderRadius: '0 20px 20px 0',
              }}
            >
              <ListItemIcon>
                <Avatar
                  sx={{
                    bgcolor: item.color,
                    width: 36,
                    height: 36,
                    transition: 'all 0.3s ease',
                  }}
                >
                  {item.icon}
                </Avatar>
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  sx: {
                    fontWeight: activeSection === item.id ? 'bold' : 'normal',
                    color: activeSection === item.id ? item.color : 'var(--text-primary)',
                    transition: 'all 0.3s ease',
                  },
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Main Content */}
      <Box 
        sx={{ 
          flex: 1, 
          p: 3,
          background: 'linear-gradient(135deg, var(--neutral-light) 0%, var(--neutral-lighter) 100%)',
        }}
      >
        <Container maxWidth="lg">
          <Box 
            className="fade-in"
            sx={{
              animation: 'fadeIn 0.5s ease-in-out',
            }}
          >
            {activeSection === 'profile' && renderProfileSection()}
            {activeSection === 'upload' && renderUploadSection()}
            {activeSection === 'reports' && renderReportsSection()}
          </Box>
        </Container>
      </Box>

      {/* Dialogs */}
      {renderViewDialog()}
      {renderPasswordDialog()}
    </Box>
  );
};

export default Dashboard; 