import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSend,
  FiUser,
  FiCpu,
  FiRefreshCw,
  FiAlertCircle,
  FiCheckCircle,
  FiZap,
  FiHelpCircle,
  FiArrowRight,
} from 'react-icons/fi';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import aiService from '../../services/aiService';
import { useAuth } from '../../context/AuthContext';

const PROMPT_SUGGESTIONS = [
  'How can I improve my placement chances?',
  'Which DSA topics should I prioritize for technical rounds?',
  'What projects should I build for product companies?',
  'Create a 30-day placement preparation plan.',
  'How should I prepare for behavioral interview questions?',
];

const Mentor = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello ${user?.name || 'there'}! 👋 I am your **PlacementIQ AI Career Mentor** powered by local machine intelligence.\n\nI have access to your current profile, skill scores, and prediction data. How can I assist with your placement journey, coding preparation, or interview strategy today?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [ollamaStatus, setOllamaStatus] = useState(null);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const chatEndRef = useRef(null);

  // Check Ollama status on mount
  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      setCheckingStatus(true);
      const status = await aiService.getStatus();
      setOllamaStatus(status);
    } catch (err) {
      setOllamaStatus({ available: false, error: err.message });
    } finally {
      setCheckingStatus(false);
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await aiService.chat(newMessages);
      if (response?.message) {
        setMessages((prev) => [...prev, response.message]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        'Unable to reach AI Career Mentor. Please verify Ollama is running.';
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `⚠️ **Service Notice:** ${errMsg}`,
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: `Chat session reset. Ask me anything about DSA, internships, resume tips, or company criteria!`,
      },
    ]);
  };

  // Simple Markdown renderer for bullet points, bolding, and code snippets
  const renderFormattedContent = (content) => {
    if (!content) return null;
    const lines = content.split('\n');

    return (
      <div className="space-y-1.5 text-sm leading-relaxed">
        {lines.map((line, idx) => {
          if (line.startsWith('### ')) {
            return (
              <h4 key={idx} className="font-bold text-base text-dark-900 dark:text-white mt-3 mb-1">
                {line.replace('### ', '')}
              </h4>
            );
          }
          if (line.startsWith('## ')) {
            return (
              <h3 key={idx} className="font-bold text-lg text-dark-900 dark:text-white mt-4 mb-2">
                {line.replace('## ', '')}
              </h3>
            );
          }
          if (line.startsWith('# ')) {
            return (
              <h2 key={idx} className="font-extrabold text-xl text-dark-900 dark:text-white mt-4 mb-2">
                {line.replace('# ', '')}
              </h2>
            );
          }
          if (line.startsWith('- ') || line.startsWith('* ')) {
            const parsedText = parseInlineFormatting(line.replace(/^[-*]\s+/, ''));
            return (
              <div key={idx} className="flex items-start space-x-2 pl-2">
                <span className="text-primary-500 font-bold mt-1 text-xs">•</span>
                <span className="flex-1">{parsedText}</span>
              </div>
            );
          }
          if (/^\d+\.\s/.test(line)) {
            const match = line.match(/^(\d+\.)\s+(.*)/);
            return (
              <div key={idx} className="flex items-start space-x-2 pl-2">
                <span className="text-primary-500 font-bold text-xs mt-0.5">{match[1]}</span>
                <span className="flex-1">{parseInlineFormatting(match[2])}</span>
              </div>
            );
          }
          if (line.trim() === '') {
            return <div key={idx} className="h-1" />;
          }
          return <p key={idx}>{parseInlineFormatting(line)}</p>;
        })}
      </div>
    );
  };

  const parseInlineFormatting = (text) => {
    // Process bold **text** and inline `code`
    const parts = [];
    const regex = /(\*\*.*?\*\*|`.*?`)/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      const token = match[0];
      if (token.startsWith('**') && token.endsWith('**')) {
        parts.push(
          <strong key={match.index} className="font-semibold text-dark-900 dark:text-white">
            {token.slice(2, -2)}
          </strong>
        );
      } else if (token.startsWith('`') && token.endsWith('`')) {
        parts.push(
          <code
            key={match.index}
            className="px-1.5 py-0.5 rounded bg-dark-100 dark:bg-dark-800 text-primary-600 dark:text-primary-400 text-xs font-mono"
          >
            {token.slice(1, -1)}
          </code>
        );
      }
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    return parts.length > 0 ? parts : text;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto flex flex-col h-[calc(100vh-8.5rem)]">
      {/* Top Header & Status Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-dark-900 dark:text-white tracking-tight">
              AI Career Mentor
            </h1>
            <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-primary-100 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800/40">
              Intelligence Engine
            </span>
          </div>
          <p className="text-xs text-dark-500 dark:text-dark-400 mt-1">
            Personalized placement coaching grounded in your academic metrics, skills, and predictions.
          </p>
        </div>

        {/* Engine Status Badge */}
        <div className="flex items-center space-x-2 text-xs">
          {checkingStatus ? (
            <span className="text-dark-400 flex items-center">
              <FiRefreshCw className="animate-spin mr-1.5" /> Checking AI status...
            </span>
          ) : ollamaStatus?.available ? (
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/40">
              <FiCheckCircle className="h-3.5 w-3.5 text-green-500" />
              <span className="font-medium">Ollama Online ({ollamaStatus.configuredModel})</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40">
              <FiAlertCircle className="h-3.5 w-3.5 text-amber-500" />
              <span className="font-medium">Ollama Offline (port 11434)</span>
            </div>
          )}

          <button
            onClick={handleClearChat}
            className="p-1.5 text-dark-400 hover:text-dark-700 dark:hover:text-dark-200 rounded-lg border border-dark-200 dark:border-dark-800 transition-smooth"
            title="Reset Chat"
          >
            <FiRefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Main Chat Conversation Container */}
      <Card className="flex-1 flex flex-col overflow-hidden p-0 border border-dark-200 dark:border-dark-800 glass-panel shadow-sm">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((msg, index) => {
              const isUser = msg.role === 'user';
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-xs ${
                      isUser
                        ? 'bg-gradient-to-tr from-primary-600 to-indigo-500 shadow-md shadow-primary-500/20'
                        : msg.isError
                        ? 'bg-amber-500'
                        : 'bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-md shadow-indigo-500/20'
                    }`}
                  >
                    {isUser ? <FiUser /> : <FiCpu />}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm ${
                      isUser
                        ? 'bg-primary-600 text-white shadow-sm'
                        : msg.isError
                        ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800/40'
                        : 'bg-dark-50 dark:bg-dark-900/60 text-dark-800 dark:text-dark-100 border border-dark-100 dark:border-dark-800/50'
                    }`}
                  >
                    {isUser ? (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      renderFormattedContent(msg.content)
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Typing Indicator */}
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3"
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shrink-0 text-xs">
                <FiCpu className="animate-pulse" />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-dark-50 dark:bg-dark-900/60 border border-dark-100 dark:border-dark-800/50 flex items-center space-x-1.5">
                <span className="text-xs text-dark-500 dark:text-dark-400 font-medium">
                  Mentor is reasoning...
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-bounce" />
                <span
                  className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-bounce"
                  style={{ animationDelay: '0.15s' }}
                />
                <span
                  className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-bounce"
                  style={{ animationDelay: '0.3s' }}
                />
              </div>
            </motion.div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Suggested Prompts (Chips) */}
        <div className="px-4 py-2 border-t border-dark-100 dark:border-dark-800/50 bg-dark-50/50 dark:bg-dark-950/30 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-semibold text-dark-400 uppercase tracking-wider shrink-0 flex items-center">
            <FiZap className="mr-1 text-primary-500" /> Prompts:
          </span>
          {PROMPT_SUGGESTIONS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              disabled={loading}
              className="px-2.5 py-1 text-xs whitespace-nowrap rounded-full bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 text-dark-600 dark:text-dark-300 hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-smooth cursor-pointer disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Textarea Bar */}
        <div className="p-3 sm:p-4 border-t border-dark-200 dark:border-dark-800 bg-white dark:bg-dark-950/80">
          <div className="flex items-center space-x-2">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about DSA preparation, resume critiques, mock interview tactics, or placement strategies..."
              className="flex-1 resize-none bg-dark-50 dark:bg-dark-900/60 border border-dark-200 dark:border-dark-800 rounded-xl px-4 py-2.5 text-sm text-dark-900 dark:text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
            <Button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="h-10 px-4 rounded-xl flex items-center justify-center shrink-0"
            >
              <FiSend className={loading ? 'opacity-0' : 'h-4 w-4'} />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Mentor;
