import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import hederaService from '../services/hederaService';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Paper,
  Divider
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

const HederaTopicChat = ({ topicId }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [newTopicId, setNewTopicId] = useState(topicId);

  useEffect(() => {
    if (newTopicId) {
      fetchMessages();
    }
  }, [newTopicId]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const result = await hederaService.getTopicMessages(newTopicId);
      if (result.success) {
        if (Array.isArray(result.messages)) {
          setMessages(result.messages);
        } else {
          console.warn('Unexpected messages format:', result);
          setMessages([]);
        }
        setError(null);
      } else {
        setError(result.error || 'Failed to fetch messages');
        setMessages([]);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(err.message);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTopic = async () => {
    try {
      setSending(true);
      const result = await hederaService.createTopic('Project Discussion Topic', true);
      if (result.success) {
        setNewTopicId(result.topicId);
        setError(null);
        // Show success message or notification
      } else {
        setError(result.error || 'Failed to create topic');
      }
    } catch (err) {
      console.error('Error creating topic:', err);
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      setSending(true);
      const result = await hederaService.submitMessage(newTopicId, message);
      if (result.success) {
        setMessage('');
        setError(null);
        // Fetch new messages after sending - with a small delay to allow consensus
        setTimeout(fetchMessages, 3000);
      } else {
        setError(result.error || 'Failed to send message');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const renderMessage = (msg, index) => {
    try {
      if (!msg) return null;
      
      // Try to decode the message content if it's base64 encoded
      let messageContent = msg.contents;
      if (typeof messageContent === 'string') {
        try {
          // Check if it looks like base64
          if (/^[A-Za-z0-9+/=]+$/.test(messageContent)) {
            const decoded = atob(messageContent);
            messageContent = decoded;
          }
        } catch (e) {
          console.warn('Failed to decode message content', e);
        }
      }

      const timestamp = msg.consensusTimestamp 
        ? new Date(
            typeof msg.consensusTimestamp === 'string' && msg.consensusTimestamp.includes('.')
              ? msg.consensusTimestamp 
              : Number(msg.consensusTimestamp) * 1000
          ).toLocaleString()
        : 'Unknown time';
      
      const sender = msg.payer || 'Unknown';

      return (
        <ListItem key={`${msg.consensusTimestamp}-${index}`} divider={index !== messages.length - 1}>
          <ListItemText
            primary={messageContent}
            secondary={`From: ${sender} | ${timestamp}`}
          />
        </ListItem>
      );
    } catch (error) {
      console.error('Error rendering message:', error, msg);
      return (
        <ListItem key={`error-${index}`} divider={index !== messages.length - 1}>
          <ListItemText
            primary="[Error displaying message]"
            secondary="There was an error displaying this message"
          />
        </ListItem>
      );
    }
  };

  if (!newTopicId) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            No discussion topic exists for this project
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateTopic}
            disabled={sending}
          >
            Create Discussion Topic
          </Button>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Box>
      </Container>
    );
  }

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Project Discussion Topic: {newTopicId}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          This is a permanent discussion thread stored on the Hedera public ledger.
          All messages are immutable and cryptographically verified.
        </Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={fetchMessages}
          sx={{ mr: 1 }}
        >
          Refresh Messages
        </Button>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle2" gutterBottom>
            Post a Message
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={sending || !user}
              multiline
              maxRows={3}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <LoadingButton
              variant="contained"
              onClick={handleSendMessage}
              loading={sending}
              disabled={!message.trim() || !user}
            >
              Send
            </LoadingButton>
          </Box>
          {!user && (
            <Alert severity="info" sx={{ mt: 1 }}>
              You need to be logged in to post messages
            </Alert>
          )}
        </CardContent>
      </Card>

      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Discussion Thread
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List>
            {messages.length > 0 ? (
              messages.map(renderMessage)
            ) : (
              <ListItem>
                <ListItemText
                  primary="No messages yet"
                  secondary="Be the first to contribute to this discussion!"
                />
              </ListItem>
            )}
          </List>
        )}
      </Paper>
    </Box>
  );
};

export default HederaTopicChat; 