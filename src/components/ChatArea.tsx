import React, { useState, useRef, useEffect } from 'react';
import { Menu, Send, Zap, ChevronDown, Edit2, Trash2, X, Check, Brain, Cpu, Settings, AlertTriangle, LucideIcon, Paperclip, Mic } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import ReactMarkdown from 'react-markdown';
import { fetchAIResponse } from '../services/aiService';
import { Chat, Message } from '../hooks/useChats';

interface Engine {
  id: string;
  name: string;
  desc: string;
  icon: LucideIcon;
}

const ENGINES: Engine[] = [
  { id: 'neural-nexus', name: 'Neural Nexus', desc: 'Quantum Core v2.0', icon: Zap },
  { id: 'cerebral-prime', name: 'Cerebral Prime', desc: 'Advanced Reasoning v3.1', icon: Brain },
  { id: 'synapse-ultra', name: 'Synapse Ultra', desc: 'Creative Engine v4.0', icon: Cpu },
  { id: 'logic-core', name: 'Logic Core', desc: 'Fast Response v1.5', icon: Settings },
];

interface ChatAreaProps {
  activeChat: Chat | null;
  createNewChat: (initialMessage?: Message | null) => Chat;
  addMessage: (chatId: string, message: Message) => void;
  updateMessage: (chatId: string, messageId: string, newText: string) => void;
  deleteMessage: (chatId: string, messageId: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function ChatArea({
  activeChat,
  createNewChat,
  addMessage,
  updateMessage,
  deleteMessage,
  sidebarOpen,
  setSidebarOpen
}: ChatAreaProps) {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [engineDropdownOpen, setEngineDropdownOpen] = useState(false);
  const [selectedEngine, setSelectedEngine] = useState<Engine>(ENGINES[0]);
  const [editingMsgId, setEditingMsgId] = useState<string | null>(null);
  const [editMsgText, setEditMsgText] = useState('');
  const [deletingMsgId, setDeletingMsgId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const MAX_CHARS = 4000;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: uuidv4(),
      type: 'user',
      text: input,
      timestamp: new Date().toISOString()
    };

    let chatId = activeChat?.id;
    if (!chatId) {
      const newChat = createNewChat(userMessage);
      chatId = newChat.id;
    } else {
      addMessage(chatId, userMessage);
    }

    setInput('');
    setIsTyping(true);
    const aiText = await fetchAIResponse(userMessage.text, selectedEngine.name);
    const aiMessage: Message = {
      id: uuidv4(),
      type: 'ai',
      text: aiText,
      timestamp: new Date().toISOString()
    };
    addMessage(chatId, aiMessage);
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const startEditingMsg = (msg: Message) => {
    setEditingMsgId(msg.id);
    setEditMsgText(msg.text);
  };

  const saveEditMsg = (msgId: string) => {
    if (editMsgText.trim() && activeChat) {
      updateMessage(activeChat.id, msgId, editMsgText.trim());
    }
    setEditingMsgId(null);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white relative">
      {/* Header - Exact 67px height */}
      <header className="h-[67px] flex items-center px-4 border-b border-[#D1D5DB] bg-[#F8F9FA] gap-2 sm:gap-4">
        <button
          className="p-2 text-[#6B6B6B] hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu size={20} />
        </button>

        <div className="relative flex-1 sm:flex-none">
          {/* Engine Button - Responsive width */}
          <button
            className="flex items-center gap-2 px-3 py-2 w-full sm:w-[163.92px] h-[42px] bg-[#E5E7EB] hover:bg-gray-300 text-[#1A1A1A] rounded-lg text-xs font-normal transition-colors border border-[#D1D5DB]"
            onClick={() => setEngineDropdownOpen(!engineDropdownOpen)}
          >
            {/* Engine Icon Container */}
            <div className="w-6 h-6 bg-[#00A832] rounded-[6px] flex items-center justify-center text-white shadow-[0px_0px_21px_rgba(0,168,50,0.32)] flex-shrink-0">
              <selectedEngine.icon size={14} />
            </div>
            <span className="flex-1 text-left truncate">{selectedEngine.name}</span>
            <ChevronDown size={16} className="text-[#6B6B6B] flex-shrink-0" />
          </button>

          {engineDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-2">
              <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Select AI Engine</div>
              {ENGINES.map(engine => (
                <button
                  key={engine.id}
                  className="w-full flex items-start gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-left"
                  onClick={() => { setSelectedEngine(engine); setEngineDropdownOpen(false); }}
                >
                  <engine.icon size={18} className={`mt-0.5 ${selectedEngine.id === engine.id ? 'text-[#00A832]' : 'text-gray-400'}`} />
                  <div>
                    <div className={`text-sm font-medium ${selectedEngine.id === engine.id ? 'text-gray-900' : 'text-gray-700'}`}>{engine.name}</div>
                    <div className="text-xs text-gray-400">{engine.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto empty-state-bg">
        {!activeChat || activeChat.messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center">
            {/* Big Logo Icon */}
            <div className="w-20 h-20 bg-[#00A832] rounded-[16px] flex items-center justify-center mb-[24px] shadow-[0px_0px_58px_rgba(0,168,50,0.29)] flex-shrink-0">
              <Zap className="w-10 h-10 text-white fill-current" />
            </div>

            <div className="mb-[12px]">
              <h1 className="logo-text">DaivAI</h1>
            </div>

            <p className="text-[#6B6B6B] text-base font-normal leading-6 mb-[48px] max-w-sm">
              Ask me anything. I'm here to help.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[12px] w-full max-w-[413.56px]">
              {[
                { title: 'Code Help', desc: 'Debug and write better code' },
                { title: 'Explanations', desc: 'Understand complex topics' },
                { title: 'Creative Writing', desc: 'Generate content and ideas' },
                { title: 'Problem Solving', desc: 'Find solutions to challenges' },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex flex-col justify-center items-center px-[13px] py-3 bg-[#F1F3F5] border border-[#D1D5DB] rounded-[12px] hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="text-sm font-normal text-[#1A1A1A] mb-[4px]">{item.title}</div>
                  <div className="text-[12px] leading-4 text-[#6B6B6B]">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            {activeChat.messages.map((msg) => (
              <div
                key={msg.id}
                className="group flex items-start gap-3 px-4 sm:px-6 py-4 hover:bg-gray-50 border-b border-gray-100 transition-colors"
              >
                <div className="flex-shrink-0 mt-0.5">
                  {msg.type === 'ai' ? (
                    <div className="w-8 h-8 rounded-xl bg-[#00A832] text-white flex items-center justify-center">
                      <selectedEngine.icon size={16} />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-xl bg-gray-200 text-gray-500 flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-sm font-semibold text-[#1A1A1A]">
                      {msg.type === 'user' ? 'You' : selectedEngine.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="text-sm text-[#1A1A1A] leading-relaxed prose prose-sm max-w-none break-words">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                </div>

                {msg.type === 'user' && (
                  <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => startEditingMsg(msg)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 rounded transition-colors"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => setDeletingMsgId(msg.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 rounded transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-start gap-3 px-4 sm:px-6 py-4 border-b border-gray-100">
                <div className="w-8 h-8 rounded-xl bg-[#00A832] text-white flex items-center justify-center">
                  <selectedEngine.icon size={16} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-800 mb-2">{selectedEngine.name}</div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Footer Area - Input Area */}
      <div className="h-auto min-h-[127px] px-4 sm:px-8 lg:px-[76.5px] py-4 border-t border-[#D1D5DB] bg-white">
        <div className="w-full flex flex-col gap-2">
          {/* Input Box */}
          <div className="bg-[#F1F3F5] rounded-[12px] shadow-[0px_0px_0px_1px_#D1D5DB] flex flex-col p-[12px] min-h-[78px] input-focus-shadow transition-all duration-200">
            {/* Top Row: Icons + Textarea */}
            <div className="flex items-start gap-2 sm:gap-3 w-full">
              <button className="mt-1 flex items-center justify-center text-[#A0A0A0] hover:text-gray-600 transition-colors flex-shrink-0">
                <Paperclip size={18} />
              </button>

              <textarea
                value={input}
                onChange={(e) => { if (e.target.value.length <= MAX_CHARS) setInput(e.target.value); }}
                onKeyDown={handleKeyDown}
                placeholder={`Message ${selectedEngine.name}...`}
                className="flex-1 bg-transparent outline-none text-[#1A1A1A] text-sm resize-none mt-1 placeholder-[#6B6B6B]"
                rows={1}
              />

              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <button className="p-1 flex items-center justify-center text-[#A0A0A0] hover:text-gray-600 transition-colors">
                  <Mic size={18} />
                </button>
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className={`w-[30px] h-[30px] rounded-[8px] flex items-center justify-center transition-colors ${input.trim() ? 'bg-[#00A832] text-white shadow-md' : 'bg-[#E5E7EB] text-[#6B6B6B]'
                    }`}
                >
                  <Send size={16} />
                </button>
              </div>
            </div>

            {/* Bottom Row: Instructions + Counter */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3 gap-1">
              <span className="mono-text !text-[10px] sm:!text-[12px]">Press Enter to send, Shift+Enter for new line</span>
              <span className="mono-text !text-[10px] sm:!text-[12px]">{input.length} / {MAX_CHARS}</span>
            </div>
          </div>
        </div>

        <p className="mono-text text-center mt-2 !text-[10px] sm:!text-[12px]">
          AI can make mistakes. Consider checking important information.
        </p>
      </div>

      {/* Modals remain same logic but with rounded-[22px] from design if needed, keeping current as they are close */}
      {editingMsgId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center px-6 pt-6 pb-4">
              <h2 className="text-lg font-bold text-gray-900">Edit Message</h2>
              <button onClick={() => setEditingMsgId(null)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            <div className="px-6 pb-4">
              <textarea
                value={editMsgText}
                onChange={(e) => setEditMsgText(e.target.value)}
                placeholder="Enter your message..."
                className="w-full h-36 bg-gray-100 rounded-xl p-4 text-sm text-gray-800 placeholder-gray-400 resize-none focus:outline-none"
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-3 px-6 pb-6">
              <button
                onClick={() => setEditingMsgId(null)}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => saveEditMsg(editingMsgId)}
                className="px-5 py-2.5 text-sm font-medium text-white bg-[#00A832] hover:bg-green-600 rounded-lg transition-colors flex items-center gap-2"
              >
                <Check size={15} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {deletingMsgId && activeChat && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex justify-end px-4 pt-4">
              <button onClick={() => setDeletingMsgId(null)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            <div className="flex flex-col items-center text-center px-6 pb-6">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-4">
                <AlertTriangle size={22} strokeWidth={2} />
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Delete Message?</h2>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete this message? This action cannot be undone.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setDeletingMsgId(null)}
                  className="flex-1 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => { deleteMessage(activeChat.id, deletingMsgId); setDeletingMsgId(null); }}
                  className="flex-1 py-2.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
