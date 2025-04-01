import { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaRobot, FaUser, FaSpinner, FaLeaf, FaWind, FaSun, FaChartLine } from 'react-icons/fa';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([
    'What is a green bond?',
    'Analyze infrastructure projects',
    'How do I build an investment portfolio?',
    'Show me investment options'
  ]);
  const messagesEndRef = useRef(null);

  // Simulate initial greeting from the agent when component mounts
  useEffect(() => {
    const initialMessage = {
      sender: 'agent',
      text: "Hello! I'm StakeMate, your AI investment assistant for infrastructure projects. How can I help you today?",
      timestamp: new Date().toISOString(),
      actions: [
        { type: 'SUGGEST_TOPIC', payload: 'What is a green bond?' },
        { type: 'SUGGEST_TOPIC', payload: 'Analyze projects' },
        { type: 'SUGGEST_TOPIC', payload: 'Build a portfolio' }
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
    // Basic intent recognition for handling user queries
    let response = "";
    let actions = [];
    
    // Check for green bond question
    if (input.toLowerCase().includes('green bond') || input.toLowerCase().includes('what is a green')) {
      response = "A green bond is a fixed-income financial instrument designed specifically to fund projects with positive environmental benefits. Let me explain with a real-world example:\n\nThe Nairobi Securities Exchange (NSE) Wind Farm project in Kenya issued green bonds to finance their 310 MW wind power facility. This project reduces Kenya's carbon emissions by approximately 380,000 tons annually by generating clean electricity that displaces fossil fuel alternatives.\n\nThe bond offers investors:\n• 8.2% fixed annual return\n• ESG impact certification\n• Tax incentives from the Kenyan government\n• Liquidity through the NSE secondary market\n\nWould you like me to analyze this project's financial metrics or explain more about green bonds?";
      actions = [
        { type: 'SUGGEST_TOPIC', payload: 'Show NSE project metrics' },
        { type: 'SUGGEST_TOPIC', payload: 'Green bond benefits' },
        { type: 'SUGGEST_TOPIC', payload: 'Compare to other investments' }
      ];
    }
    // Check for project analysis request
    else if (input.toLowerCase().includes('analyze') || input.toLowerCase().includes('metrics') || input.toLowerCase().includes('compare') || input.toLowerCase().includes('nse project')) {
      response = "I've analyzed three tokenized infrastructure projects for you. Here's the breakdown:\n\n1. NSE Wind Farm (Kenya)\n   • ESG Score: 92/100 (Excellent)\n   • Expected Annual ROI: 8.2%\n   • Risk Level: Medium (48/100)\n   • Minimum Investment: $500\n\n2. Mombasa Solar Array\n   • ESG Score: 88/100 (Very Good)\n   • Expected Annual ROI: 9.8%\n   • Risk Level: Medium-High (62/100)\n   • Minimum Investment: $1,000\n\n3. Nairobi Water Infrastructure\n   • ESG Score: 81/100 (Good)\n   • Expected Annual ROI: 7.5%\n   • Risk Level: Low (32/100)\n   • Minimum Investment: $250\n\nWould you like me to simulate portfolio allocations or recommend an investment strategy based on these options?";
      actions = [
        { type: 'SUGGEST_TOPIC', payload: 'Simulate a portfolio' },
        { type: 'SUGGEST_TOPIC', payload: 'Compare risk profiles' },
        { type: 'SUGGEST_TOPIC', payload: 'How to invest' }
      ];
    }
    // Check for portfolio simulation
    else if (input.toLowerCase().includes('portfolio') || input.toLowerCase().includes('simulate') || input.toLowerCase().includes('build')) {
      response = "I've simulated a $10,000 portfolio allocation across the three infrastructure projects based on your risk profile:\n\n• NSE Wind Farm: $4,000 (40%)\n• Mombasa Solar Array: $3,000 (30%)\n• Nairobi Water: $3,000 (30%)\n\nProjected Annual Return: 8.5%\nBlended Risk Score: Medium (47/100)\nESG Impact Rating: Very High (88/100)\n\nAI Recommendation: Consider reallocating $1,000 from the Solar Array to the Water Infrastructure project to reduce overall portfolio risk while maintaining strong returns and ESG impact.\n\nWould you like to adjust this allocation or proceed with an investment?";
      actions = [
        { type: 'SUGGEST_TOPIC', payload: 'Accept recommendation' },
        { type: 'SUGGEST_TOPIC', payload: 'Adjust allocation' },
        { type: 'SUGGEST_TOPIC', payload: 'Invest now' }
      ];
    } 
    // Check for investment
    else if (input.toLowerCase().includes('invest') || input.toLowerCase().includes('buy') || input.toLowerCase().includes('purchase') || input.toLowerCase().includes('accept')) {
      response = "I've processed your $5,000 investment in the NSE Wind Farm project through the Hedera Token Service (HTS). Here's the transaction summary:\n\n• Token ID: 0.0.28551945\n• Quantity: 50 tokens @ $100/token\n• Transaction ID: 0.0.23546821\n• HashScan Link: https://hashscan.io/testnet/transaction/0.0.23546821\n• Status: Confirmed\n\nYour investment is now live on the Hedera network. The smart contract will automatically distribute quarterly returns to your connected wallet. Your first distribution is expected on August 30, 2023.\n\nWould you like to view your complete portfolio or explore additional investment opportunities?";
      actions = [
        { type: 'SUGGEST_TOPIC', payload: 'View my portfolio' },
        { type: 'SUGGEST_TOPIC', payload: 'Explore more projects' },
        { type: 'SUGGEST_TOPIC', payload: 'Set up alerts' }
      ];
    }
    else if (input.toLowerCase().includes('risk')) {
      response = "Understanding risk is important for infrastructure investments. Each project has different risk factors including regulatory, construction, operational, and financial risks. Would you like me to explain a specific type of risk or analyze the risk profile of a particular project?";
      actions = [
        { type: 'SHOW_RISK_ASSESSMENT', payload: {} },
        { type: 'SUGGEST_TOPIC', payload: 'Regulatory risks' },
        { type: 'SUGGEST_TOPIC', payload: 'Financial risks' }
      ];
    } 
    else if (input.toLowerCase().includes('token') || input.toLowerCase().includes('blockchain')) {
      response = "Tokenization uses blockchain technology to represent ownership in infrastructure assets. This makes it possible to invest in smaller portions of large projects, improving accessibility and liquidity. Hedera's secure ledger ensures all transactions and ownership records are transparent and immutable. Would you like to learn more about how this works?";
      actions = [
        { type: 'SHOW_EDUCATIONAL_CONTENT', payload: { topic: 'tokenization' } }
      ];
    }
    else {
      response = "That's an interesting question. Would you like to learn more about green bonds, explore available infrastructure projects, or get personalized investment recommendations? I'm here to help with whatever you need.";
      actions = [
        { type: 'SUGGEST_TOPIC', payload: 'What is a green bond?' },
        { type: 'SUGGEST_TOPIC', payload: 'Analyze projects' },
        { type: 'SUGGEST_TOPIC', payload: 'Build a portfolio' }
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
    if (lastResponse.includes('green bond')) {
      return [
        'Show me green bond projects',
        'Compare with traditional bonds',
        'What are the tax benefits?'
      ];
    } else if (lastResponse.includes('analyzed three')) {
      return [
        'Simulate a portfolio',
        'Tell me more about the NSE wind farm',
        'Which has the lowest risk?'
      ];
    } else if (lastResponse.includes('portfolio allocation')) {
      return [
        'Accept this allocation',
        'Make it more conservative',
        'Invest $5000 now'
      ];
    } else if (lastResponse.includes('investment in the NSE Wind Farm')) {
      return [
        'View my complete portfolio',
        'Set up automatic investments',
        'Tell me about Hedera consensus'
      ];
    } else if (lastResponse.includes('risk')) {
      return [
        'Tell me about regulatory risks',
        'How do I assess project risk?',
        'Show me low-risk projects'
      ];
    } else {
      return [
        'What is a green bond?',
        'Analyze infrastructure projects',
        'How do I build a portfolio?',
        'Show me investment options'
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