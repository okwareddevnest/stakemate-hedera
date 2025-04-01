import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { projectService } from '../services/api';
import hederaService from '../services/hederaService';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  InputAdornment,
  Alert,
  Stepper,
  Step,
  StepLabel,
  FormHelperText,
  CircularProgress,
  Snackbar
} from '@mui/material';
import { FaCheckCircle, FaExclamationTriangle, FaArrowLeft, FaArrowRight, FaSave } from 'react-icons/fa';

const projectTypes = [
  'Transportation',
  'Energy',
  'Water',
  'Telecom',
  'Housing',
  'Healthcare',
  'Education',
  'Digital',
  'Other'
];

const environmentalImpactOptions = [
  'very negative',
  'negative',
  'neutral',
  'positive',
  'very positive'
];

const socialBenefitOptions = [
  'low',
  'medium',
  'high',
  'very high'
];

const CreateProject = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [tokenCreationStatus, setTokenCreationStatus] = useState(null);
  const [topicCreationStatus, setTopicCreationStatus] = useState(null);
  const [alert, setAlert] = useState(null);
  
  // Form state
  const [projectData, setProjectData] = useState({
    name: '',
    symbol: '',
    type: 'Transportation',
    location: '',
    description: '',
    timeline: {
      startDate: '',
      estimatedCompletionDate: ''
    },
    financials: {
      expectedReturn: 0,
      totalBudget: 0,
      fundingSecured: 0
    },
    esgMetrics: {
      environmentalImpact: 'positive',
      socialBenefit: 'high',
      jobsCreated: 0,
      carbonReduction: 0
    },
    investmentMetrics: {
      minInvestmentAmount: 1000
    },
    treasuryAccountId: user?.hederaAccountId || import.meta.env.VITE_HEDERA_TREASURY_ID
  });

  const steps = [
    'Basic Information',
    'Financial Details', 
    'ESG Metrics',
    'Review & Submit'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setProjectData({
        ...projectData,
        [section]: {
          ...projectData[section],
          [field]: value
        }
      });
    } else {
      setProjectData({
        ...projectData,
        [name]: value
      });
    }
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    const numericValue = parseFloat(value) || 0;
    
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setProjectData({
        ...projectData,
        [section]: {
          ...projectData[section],
          [field]: numericValue
        }
      });
    } else {
      setProjectData({
        ...projectData,
        [name]: numericValue
      });
    }
  };

  const validateCurrentStep = () => {
    switch (activeStep) {
      case 0:
        return (
          projectData.name.trim() !== '' && 
          projectData.symbol.trim() !== '' &&
          projectData.type.trim() !== '' &&
          projectData.location.trim() !== '' &&
          projectData.description.trim() !== ''
        );
      case 1:
        return (
          projectData.financials.expectedReturn > 0 &&
          projectData.financials.totalBudget > 0 &&
          projectData.timeline.startDate !== '' &&
          projectData.timeline.estimatedCompletionDate !== ''
        );
      case 2:
        return (
          projectData.esgMetrics.jobsCreated > 0 &&
          projectData.esgMetrics.carbonReduction > 0 &&
          projectData.investmentMetrics.minInvestmentAmount > 0
        );
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setActiveStep((prevStep) => prevStep + 1);
    } else {
      setError('Please fill all required fields before proceeding');
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setTokenCreationStatus('Creating project token...');
    
    try {
      // Create project on the backend
      const createdProject = await projectService.createProject(projectData);
      
      if (createdProject) {
        const tokenMessage = createdProject.tokenId 
          ? `Token created: ${createdProject.tokenId}${createdProject.simulated ? ' (Simulated)' : ''}`
          : 'Token creation skipped';
          
        const topicMessage = createdProject.discussionTopicId 
          ? `Discussion topic created: ${createdProject.discussionTopicId}${createdProject.simulated ? ' (Simulated)' : ''}`
          : 'Topic creation skipped';
        
        setTokenCreationStatus(tokenMessage);
        setTopicCreationStatus(topicMessage);
        
        // Show success alert before redirecting
        setAlert({
          show: true,
          severity: 'success',
          message: `Project "${createdProject.name}" created successfully!`
        });
        
        // Redirect to the project page
        setTimeout(() => {
          navigate(`/projects/${createdProject.id}`);
        }, 2000);
      }
    } catch (err) {
      console.error('Error creating project:', err);
      
      let errorMessage = 'Failed to create project';
      if (err.message) {
        errorMessage += `: ${err.message}`;
      }
      
      // If it's a signature error, provide more helpful guidance
      if (err.message && err.message.includes('INVALID_SIGNATURE')) {
        errorMessage = 'Failed to create token: Invalid signature. Check your Hedera account credentials or enable simulation mode.';
      }
      
      setError(errorMessage);
      
      // Show error alert
      setAlert({
        show: true,
        severity: 'error',
        message: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Project Name"
                name="name"
                value={projectData.name}
                onChange={handleInputChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Token Symbol (2-5 letters)"
                name="symbol"
                value={projectData.symbol}
                onChange={handleInputChange}
                margin="normal"
                helperText="This will be the symbol for your project token"
                inputProps={{ maxLength: 5 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Project Type</InputLabel>
                <Select
                  value={projectData.type}
                  name="type"
                  onChange={handleInputChange}
                  label="Project Type"
                >
                  {projectTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Location"
                name="location"
                value={projectData.location}
                onChange={handleInputChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Project Description"
                name="description"
                value={projectData.description}
                onChange={handleInputChange}
                margin="normal"
                multiline
                rows={4}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Expected Return (%)"
                name="financials.expectedReturn"
                type="number"
                value={projectData.financials.expectedReturn}
                onChange={handleNumberChange}
                margin="normal"
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Total Budget"
                name="financials.totalBudget"
                type="number"
                value={projectData.financials.totalBudget}
                onChange={handleNumberChange}
                margin="normal"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Funding Secured"
                name="financials.fundingSecured"
                type="number"
                value={projectData.financials.fundingSecured}
                onChange={handleNumberChange}
                margin="normal"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Minimum Investment Amount"
                name="investmentMetrics.minInvestmentAmount"
                type="number"
                value={projectData.investmentMetrics.minInvestmentAmount}
                onChange={handleNumberChange}
                margin="normal"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Start Date"
                name="timeline.startDate"
                type="date"
                value={projectData.timeline.startDate}
                onChange={handleInputChange}
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Estimated Completion Date"
                name="timeline.estimatedCompletionDate"
                type="date"
                value={projectData.timeline.estimatedCompletionDate}
                onChange={handleInputChange}
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Environmental Impact</InputLabel>
                <Select
                  value={projectData.esgMetrics.environmentalImpact}
                  name="esgMetrics.environmentalImpact"
                  onChange={handleInputChange}
                  label="Environmental Impact"
                >
                  {environmentalImpactOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Social Benefit</InputLabel>
                <Select
                  value={projectData.esgMetrics.socialBenefit}
                  name="esgMetrics.socialBenefit"
                  onChange={handleInputChange}
                  label="Social Benefit"
                >
                  {socialBenefitOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Jobs Created"
                name="esgMetrics.jobsCreated"
                type="number"
                value={projectData.esgMetrics.jobsCreated}
                onChange={handleNumberChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Carbon Reduction (tons CO2/year)"
                name="esgMetrics.carbonReduction"
                type="number"
                value={projectData.esgMetrics.carbonReduction}
                onChange={handleNumberChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Treasury Account ID"
                name="treasuryAccountId"
                value={projectData.treasuryAccountId}
                onChange={handleInputChange}
                margin="normal"
                helperText="Hedera account ID that will receive the funds (defaults to your account)"
              />
            </Grid>
          </Grid>
        );
      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Project Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1">Basic Details</Typography>
                <Typography>Name: {projectData.name}</Typography>
                <Typography>Symbol: {projectData.symbol}</Typography>
                <Typography>Type: {projectData.type}</Typography>
                <Typography>Location: {projectData.location}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1">Financial Details</Typography>
                <Typography>Expected Return: {projectData.financials.expectedReturn}%</Typography>
                <Typography>Total Budget: ${projectData.financials.totalBudget.toLocaleString()}</Typography>
                <Typography>Funding Secured: ${projectData.financials.fundingSecured.toLocaleString()}</Typography>
                <Typography>
                  Min Investment: ${projectData.investmentMetrics.minInvestmentAmount.toLocaleString()}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1">Timeline</Typography>
                <Typography>
                  Start: {new Date(projectData.timeline.startDate).toLocaleDateString()}
                </Typography>
                <Typography>
                  Completion: {new Date(projectData.timeline.estimatedCompletionDate).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1">ESG Metrics</Typography>
                <Typography>Environmental Impact: {projectData.esgMetrics.environmentalImpact}</Typography>
                <Typography>Social Benefit: {projectData.esgMetrics.socialBenefit}</Typography>
                <Typography>Jobs Created: {projectData.esgMetrics.jobsCreated}</Typography>
                <Typography>Carbon Reduction: {projectData.esgMetrics.carbonReduction} tons CO2/year</Typography>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1">Hedera Integration</Typography>
              <Alert severity="info" sx={{ mt: 1, mb: 2 }}>
                <Typography component="div">
                  <strong>Mode:</strong> {import.meta.env.VITE_ENABLE_SIMULATION === 'true' ? 'Simulation (no actual transactions)' : 'Production'}
                </Typography>
              </Alert>
              <Typography>
                <strong>Important:</strong> Creating this project will:
              </Typography>
              <ul>
                <li>Create a fungible token on Hedera with symbol {projectData.symbol}</li>
                <li>Create a discussion topic on Hedera for this project</li>
                <li>Set the treasury account to: {projectData.treasuryAccountId || import.meta.env.VITE_HEDERA_TREASURY_ID}</li>
              </ul>
            </Box>
            
            {tokenCreationStatus && (
              <Alert severity="info" sx={{ mt: 2 }}>
                {tokenCreationStatus}
              </Alert>
            )}
            
            {topicCreationStatus && (
              <Alert severity="info" sx={{ mt: 2 }}>
                {topicCreationStatus}
              </Alert>
            )}
          </Box>
        );
      default:
        return null;
    }
  };

  if (!user) {
    return (
      <Container maxWidth="md">
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h5" gutterBottom align="center">
            Please log in to create a project
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/login')}
            >
              Log In
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h4" gutterBottom align="center">
          Create New Infrastructure Project
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          {renderStepContent(activeStep)}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            {activeStep > 0 && (
              <Button onClick={handleBack} disabled={isSubmitting}>
                Back
              </Button>
            )}
            
            {activeStep < steps.length - 1 ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                disabled={!validateCurrentStep()}
              >
                Next
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={isSubmitting}
                startIcon={isSubmitting && <CircularProgress size={20} />}
              >
                {isSubmitting ? 'Creating Project...' : 'Create Project'}
              </Button>
            )}
          </Box>
        </form>
      </Paper>
      <Snackbar
        open={alert?.show}
        autoHideDuration={6000}
        onClose={() => setAlert({ ...alert, show: false })}
      >
        <Alert onClose={() => setAlert({ ...alert, show: false })} severity={alert?.severity}>
          {alert?.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CreateProject; 