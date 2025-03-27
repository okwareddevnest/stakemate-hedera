import { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaRobot, FaUser, FaSpinner } from 'react-icons/fa';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([
    'How do infrastructure projects work?',
    'What are the risks in infrastructure investing?',
    'Tell me about tokenization',
    'How can I build a diversified portfolio?'
  ]);
  const messagesEndRef = useRef(null);

  // Simulate initial greeting from the agent when component mounts
  useEffect(() => {
    const initialMessage = {
      sender: 'agent',
      text: "Hello! I'm StakeMate, your AI investment assistant for infrastructure projects. How can I help you today?",
      timestamp: new Date().toISOString(),
      actions: [
        { type: 'SUGGEST_TOPIC', payload: 'Learn about investing' },
        { type: 'SUGGEST_TOPIC', payload: 'Explore projects' },
        { type: 'SUGGEST_TOPIC', payload: 'Get recommendations' }
      ]
    };
    setMessages([initialMessage]);
  }, []);

  // Auto-scroll to the bottom of chat when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inputValue.trim()) {
      return;
    }

    // Add user message to chat
    const userMessage = {
      sender: 'user',
      text: inputValue,
      timestamp: new Date().toISOString()
    };
    
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // Simulate API call to get agent response
      // In production, this would call your backend API
      setTimeout(() => {
        const agentResponse = simulateAgentResponse(inputValue);
        setMessages((prevMessages) => [...prevMessages, agentResponse]);
        setIsLoading(false);
        
        // Update suggestions based on the context
        setSuggestions(generateSuggestions(agentResponse.text));
      }, 1000);
    } catch (error) {
      console.error('Error getting response:', error);
      setIsLoading(false);
      
      // Add error message
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: 'agent',
          text: "I'm sorry, I encountered an error while processing your request. Please try again.",
          timestamp: new Date().toISOString(),
          isError: true
        }
      ]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const userMessage = {
      sender: 'user',
      text: suggestion,
      timestamp: new Date().toISOString()
    };
    
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const agentResponse = simulateAgentResponse(suggestion);
      setMessages((prevMessages) => [...prevMessages, agentResponse]);
      setIsLoading(false);
      
      // Update suggestions
      setSuggestions(generateSuggestions(agentResponse.text));
    }, 1000);
  };

  // Simulate agent response based on input
  // In production, this would be replaced by an actual API call
  const simulateAgentResponse = (input) => {
    // Simple pattern matching for demonstration
    let response = "";
    let actions = [];
    
    if (input.toLowerCase().includes('risk')) {
      response = "Understanding risk is important for infrastructure investments. Each project has different risk factors including regulatory, construction, operational, and financial risks. Would you like me to explain a specific type of risk or analyze the risk profile of a particular project?";
      actions = [
        { type: 'SHOW_RISK_ASSESSMENT', payload: {} },
        { type: 'SUGGEST_TOPIC', payload: 'Regulatory risks' },
        { type: 'SUGGEST_TOPIC', payload: 'Financial risks' }
      ];
    } 
    else if (input.toLowerCase().includes('portfolio') || input.toLowerCase().includes('diversif')) {
      response = "Building a diversified portfolio is a smart approach. For infrastructure investments, you might want to consider a mix of energy, transportation, digital, and social infrastructure projects. Each sector responds differently to economic conditions. Would you like me to suggest a diversification strategy based on your risk profile?";
      actions = [
        { type: 'ANALYZE_PORTFOLIO', payload: {} },
        { type: 'SUGGEST_TOPIC', payload: 'Portfolio allocation' }
      ];
    }
    else if (input.toLowerCase().includes('token') || input.toLowerCase().includes('blockchain')) {
      response = "Tokenization uses blockchain technology to represent ownership in infrastructure assets. This makes it possible to invest in smaller portions of large projects, improving accessibility and liquidity. Hedera's secure ledger ensures all transactions and ownership records are transparent and immutable. Would you like to learn more about how this works?";
      actions = [
        { type: 'SHOW_EDUCATIONAL_CONTENT', payload: { topic: 'tokenization' } }
      ];
    }
    else if (input.toLowerCase().includes('project') || input.toLowerCase().includes('invest')) {
      response = "I can help you explore various infrastructure projects. Are you interested in a specific sector like energy, transportation, water, or digital infrastructure? Each sector has different risk and return profiles.";
      actions = [
        { type: 'LIST_PROJECTS', payload: { limit: 5 } },
        { type: 'SUGGEST_TOPIC', payload: 'Energy projects' },
        { type: 'SUGGEST_TOPIC', payload: 'Transportation projects' }
      ];
    }
    else {
      response = "That's an interesting question. Would you like to learn more about infrastructure investing, explore available projects, or get personalized recommendations? I'm here to help with whatever you need.";
      actions = [
        { type: 'SUGGEST_EXPLORATION', payload: {} }
      ];
    }
    
    return {
      sender: 'agent',
      text: response,
      timestamp: new Date().toISOString(),
      actions: actions
    };
  };

  // Generate context-aware suggestions
  const generateSuggestions = (lastResponse) => {
    if (lastResponse.includes('risk')) {
      return [
        'Tell me about regulatory risks',
        'How do I assess project risk?',
        'Show me low-risk projects'
      ];
    } else if (lastResponse.includes('portfolio')) {
      return [
        'What allocation do you recommend?',
        'Show my current portfolio',
        'How can I optimize for returns?'
      ];
    } else if (lastResponse.includes('token')) {
      return [
        'How secure is tokenization?',
        'What is the minimum investment?',
        'Show me tokenized projects'
      ];
    } else {
      return [
        'Tell me about ESG investing',
        'What projects are available?',
        'How much can I expect to earn?',
        'What are the investment steps?'
      ];
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      <div className="flex-none">
        <h1 className="text-2xl font-bold">StakeMate AI Assistant</h1>
        <p className="text-gray-600 mb-4">
          Ask me anything about infrastructure investing or projects
        </p>
      </div>
      
      {/* Chat messages */}
      <div className="flex-grow overflow-y-auto bg-gray-50 rounded-lg p-4 mb-4">
        <div className="flex flex-col space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.sender === 'user'
                    ? 'bg-primary text-white rounded-br-none'
                    : message.isError
                    ? 'bg-red-100 text-red-800 rounded-bl-none'
                    : 'bg-white border border-gray-200 shadow-sm rounded-bl-none'
                }`}
              >
                <div className="flex items-center mb-1">
                  <div className="mr-2">
                    {message.sender === 'user' ? (
                      <FaUser className="text-white h-4 w-4" />
                    ) : (
                      <FaRobot className="text-primary h-4 w-4" />
                    )}
                  </div>
                  <div className="text-xs opacity-70">
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
                <div className="text-sm whitespace-pre-wrap">{message.text}</div>
                
                {/* Render action buttons for agent messages */}
                {message.sender === 'agent' && message.actions && message.actions.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.actions
                      .filter(action => action.type === 'SUGGEST_TOPIC')
                      .map((action, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSuggestionClick(action.payload)}
                          className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full hover:bg-gray-200 transition-colors"
                        >
                          {action.payload}
                        </button>
                      ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 rounded-bl-none max-w-[80%] flex items-center space-x-2">
                <FaSpinner className="animate-spin h-4 w-4 text-primary" />
                <span className="text-sm text-gray-500">StakeMate is thinking...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Suggestions */}
      <div className="flex-none mb-4">
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="bg-gray-100 text-gray-800 text-sm px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
      
      {/* Input form */}
      <div className="flex-none">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            disabled={isLoading}
            placeholder="Type your message here..."
            className="input flex-grow"
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="btn btn-primary flex items-center justify-center"
          >
            <FaPaperPlane className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface; 