import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiService, { portfolioService } from '../services/api';
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
  CircularProgress
} from '@mui/material';

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
    // Prevent duplicate submissions
    if (investing) return;
    
    setInvesting(true);
    setError(null);
    
    try {
      // Use portfolioService.simulateInvestment to simulate an investment
      const result = await portfolioService.simulateInvestment(
        user.id,
        project.id,
        parseFloat(investmentAmount)
      );

      if (result.success) {
        setInvestmentSuccess({
          amount: result.amount,
          tokenAmount: result.tokenAmount,
          investorAccountId: result.investorAccountId || user.hederaAccountId,
          treasuryAccountId: result.treasuryAccountId,
          transactionIds: result.transactionIds,
          status: 'COMPLETED',
          timestamp: result.startDate
        });
        setShowInvestDialog(false);
        
        // Refresh token info
        if (project.tokenId) {
          const tokenData = await apiService.getTokenInfo(project.tokenId);
          setTokenInfo(tokenData);
        }
        
        // Show success message
        setTimeout(() => {
          // Navigate to portfolio page after 2 seconds so user can see success message
          navigate('/portfolio');
        }, 2000);
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
          <Grid sm={12} lg={8}>
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
                    Start Date: {project.timeline?.startDate ? new Date(project.timeline.startDate).toLocaleDateString() : 'Not set'}
                  </Typography>
                  <Typography variant="body2">
                    Estimated Completion: {project.timeline?.estimatedCompletionDate ? new Date(project.timeline.estimatedCompletionDate).toLocaleDateString() : 'Not set'}
                  </Typography>

                  <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                    ESG Metrics
                  </Typography>
                  <Typography variant="body2">
                    Environmental Impact: {project.esgMetrics?.environmentalImpact || 'Not available'}
                  </Typography>
                  <Typography variant="body2">
                    Social Benefit: {project.esgMetrics?.socialBenefit || 'Not available'}
                  </Typography>
                  <Typography variant="body2">
                    Jobs Created: {project.esgMetrics?.jobsCreated || 0}
                  </Typography>
                  <Typography variant="body2">
                    Carbon Reduction: {project.esgMetrics?.carbonReduction || 0} tons CO2/year
                  </Typography>
                </CardContent>
              ) : (
                <CardContent>
                  {project.discussionTopicId ? (
                    <HederaTopicChat topicId={project.discussionTopicId} />
                  ) : (
                    <Typography variant="body1" color="text.secondary">
                      No discussion topic has been created for this project yet.
                    </Typography>
                  )}
                </CardContent>
              )}
            </Card>
          </Grid>

          <Grid sm={12} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Investment Details
                </Typography>
                <Typography variant="body2">
                  Expected Return: {project.financials?.expectedReturn || 0}%
                </Typography>
                <Typography variant="body2">
                  Total Budget: ${(project.financials?.totalBudget || 0).toLocaleString()}
                </Typography>
                <Typography variant="body2">
                  Funding Secured: ${(project.financials?.fundingSecured || 0).toLocaleString()}
                </Typography>
                <Typography variant="body2">
                  Minimum Investment: ${(project.investmentMetrics?.minInvestmentAmount || 0).toLocaleString()}
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
                <Typography variant="subtitle1" fontWeight="bold">
                  Investment Simulation Successful!
                </Typography>
                <Typography variant="body2">
                  Successfully invested ${investmentSuccess.amount} HBAR (simulated)
                </Typography>
                <Typography variant="body2">
                  Received {investmentSuccess.tokenAmount} {tokenInfo?.symbol || 'tokens'} (simulated)
                </Typography>
                <Box sx={{ mt: 1, p: 1, bgcolor: 'rgba(0, 0, 0, 0.03)', borderRadius: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    Transaction Details:
                  </Typography>
                  <Typography variant="body2">
                    Status: {investmentSuccess.status}
                  </Typography>
                  {investmentSuccess.investorAccountId && (
                    <Typography variant="body2">
                      Investor Account: {investmentSuccess.investorAccountId}
                    </Typography>
                  )}
                  {investmentSuccess.treasuryAccountId && (
                    <Typography variant="body2">
                      Treasury Account: {investmentSuccess.treasuryAccountId}
                    </Typography>
                  )}
                  {investmentSuccess.timestamp && (
                    <Typography variant="body2">
                      Timestamp: {new Date(investmentSuccess.timestamp).toLocaleString()}
                    </Typography>
                  )}
                </Box>
                <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                  Note: Transactions are simulated. In a production environment, actual Hedera transactions would be executed.
                </Typography>
              </Alert>
            )}
          </Grid>
        </Grid>
      </Box>

      <Dialog open={showInvestDialog} onClose={() => setShowInvestDialog(false)}>
        <DialogTitle>Invest in {project.name}</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Simulation Mode:</strong> Investments are simulated using your Hedera account. 
              {user?.hederaAccountId ? (
                <Typography component="span" fontWeight="medium">
                  {" "}Your Hedera Account ID: {user.hederaAccountId}
                </Typography>
              ) : (
                " No Hedera account ID detected. The operator account will be used."
              )}
            </Typography>
          </Alert>
          
          <TextField
            autoFocus
            margin="dense"
            label="Investment Amount (HBAR)"
            type="number"
            fullWidth
            value={investmentAmount}
            onChange={(e) => setInvestmentAmount(e.target.value)}
            inputProps={{ min: project.investmentMetrics?.minInvestmentAmount || 0 }}
          />
          
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
              {error.includes('INVALID_SIGNATURE') && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  This error usually occurs when trying to transfer HBAR from an account that the application doesn't have the private key for.
                </Typography>
              )}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowInvestDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleInvestmentSubmit}
            disabled={
              investing ||
              !investmentAmount ||
              parseFloat(investmentAmount) < (project.investmentMetrics?.minInvestmentAmount || 0)
            }
            startIcon={investing ? <CircularProgress size={20} color="inherit" /> : null}
          >
            Confirm Investment
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProjectDetail;