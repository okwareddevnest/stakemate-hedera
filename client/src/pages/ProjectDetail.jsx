import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import HederaTopicChat from '../components/HederaTopicChat';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  LinearProgress,
  TextField,
  Typography,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [investing, setInvesting] = useState(false);
  const [showInvestDialog, setShowInvestDialog] = useState(false);
  const [tokenInfo, setTokenInfo] = useState(null);
  const [investmentSuccess, setInvestmentSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await apiService.getProjectById(id);
        setProject(data);
        
        if (data.tokenId) {
          const tokenData = await apiService.getTokenInfo(data.tokenId);
          setTokenInfo(tokenData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleInvestmentSubmit = async () => {
    setInvesting(true);
    setError(null);
    
    try {
      const result = await apiService.processInvestment(
        user.id,
        project.id,
        parseFloat(investmentAmount)
      );

      if (result.success) {
        setInvestmentSuccess({
          amount: investmentAmount,
          tokenAmount: result.tokenAmount,
          transactionIds: result.transactionIds
        });
        setShowInvestDialog(false);
        
        // Refresh token info
        if (project.tokenId) {
          const tokenData = await apiService.getTokenInfo(project.tokenId);
          setTokenInfo(tokenData);
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setInvesting(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ width: '100%', mt: 4 }}>
          <LinearProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!project) {
    return (
      <Container>
        <Alert severity="info" sx={{ mt: 4 }}>
          Project not found
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Button onClick={() => navigate('/projects')} sx={{ mb: 2 }}>
          Back to Projects
        </Button>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ mb: 3 }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={activeTab} onChange={handleTabChange}>
                  <Tab label="Overview" />
                  <Tab label="Discussion" />
                </Tabs>
              </Box>
              {activeTab === 0 ? (
                <CardContent>
                  <Typography variant="h4" gutterBottom>
                    {project.name}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    {project.type} | {project.location}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {project.description}
                  </Typography>

                  <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                    Project Timeline
                  </Typography>
                  <Typography variant="body2">
                    Start Date: {new Date(project.timeline.startDate).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2">
                    Estimated Completion: {new Date(project.timeline.estimatedCompletionDate).toLocaleDateString()}
                  </Typography>

                  <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                    ESG Metrics
                  </Typography>
                  <Typography variant="body2">
                    Environmental Impact: {project.esgMetrics.environmentalImpact}
                  </Typography>
                  <Typography variant="body2">
                    Social Benefit: {project.esgMetrics.socialBenefit}
                  </Typography>
                  <Typography variant="body2">
                    Jobs Created: {project.esgMetrics.jobsCreated}
                  </Typography>
                  <Typography variant="body2">
                    Carbon Reduction: {project.esgMetrics.carbonReduction} tons CO2/year
                  </Typography>
                </CardContent>
              ) : (
                <CardContent>
                  <HederaTopicChat topicId={project.discussionTopicId} />
                </CardContent>
              )}
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Investment Details
                </Typography>
                <Typography variant="body2">
                  Expected Return: {project.financials.expectedReturn}%
                </Typography>
                <Typography variant="body2">
                  Total Budget: ${project.financials.totalBudget.toLocaleString()}
                </Typography>
                <Typography variant="body2">
                  Funding Secured: ${project.financials.fundingSecured.toLocaleString()}
                </Typography>
                <Typography variant="body2">
                  Minimum Investment: ${project.investmentMetrics.minInvestmentAmount.toLocaleString()}
                </Typography>

                {tokenInfo && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Token Information
                    </Typography>
                    <Typography variant="body2">
                      Token ID: {project.tokenId}
                    </Typography>
                    <Typography variant="body2">
                      Symbol: {tokenInfo.symbol}
                    </Typography>
                    <Typography variant="body2">
                      Total Supply: {tokenInfo.totalSupply}
                    </Typography>
                    <Typography variant="body2">
                      Circulating Supply: {tokenInfo.circulatingSupply}
                    </Typography>
                  </Box>
                )}

                {user && (
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => setShowInvestDialog(true)}
                  >
                    Invest Now
                  </Button>
                )}

                {!user && (
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => navigate('/login')}
                  >
                    Login to Invest
                  </Button>
                )}
              </CardContent>
            </Card>

            {investmentSuccess && (
              <Alert severity="success" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  Successfully invested ${investmentSuccess.amount} HBAR
                </Typography>
                <Typography variant="body2">
                  Received {investmentSuccess.tokenAmount} {tokenInfo?.symbol || 'tokens'}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  HBAR Transaction: {investmentSuccess.transactionIds.hbar}
                </Typography>
                <Typography variant="body2">
                  Token Transaction: {investmentSuccess.transactionIds.token}
                </Typography>
              </Alert>
            )}
          </Grid>
        </Grid>
      </Box>

      <Dialog open={showInvestDialog} onClose={() => setShowInvestDialog(false)}>
        <DialogTitle>Invest in {project.name}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Investment Amount (HBAR)"
            type="number"
            fullWidth
            value={investmentAmount}
            onChange={(e) => setInvestmentAmount(e.target.value)}
            inputProps={{ min: project.investmentMetrics.minInvestmentAmount }}
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowInvestDialog(false)}>Cancel</Button>
          <LoadingButton
            loading={investing}
            onClick={handleInvestmentSubmit}
            variant="contained"
            disabled={
              !investmentAmount ||
              parseFloat(investmentAmount) < project.investmentMetrics.minInvestmentAmount
            }
          >
            Confirm Investment
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProjectDetail;