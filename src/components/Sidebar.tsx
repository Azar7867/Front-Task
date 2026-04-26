import React, { useState } from 'react';
import { MessageSquare, Edit2, Trash2, Plus, X, Check, Zap, AlertTriangle, MoreHorizontal, User, Settings, HelpCircle, LogOut } from 'lucide-react';
import { Chat, Message } from '../hooks/useChats';

interface SidebarProps {
  chats: Chat[];
  activeChatId: string | null;
  setActiveChatId: (id: string) => void;
  createNewChat: (initialMessage?: Message | null) => Chat;
  deleteChat: (chatId: string) => void;
  updateChatTitle: (chatId: string, newTitle: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

function getRelativeDate(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export default function Sidebar({
  chats,
  activeChatId,
  setActiveChatId,
  createNewChat,
  deleteChat,
  updateChatTitle,
  isOpen,
  setIsOpen
}: SidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const startEditing = (chat: Chat) => {
    setEditingId(chat.id);
    setEditTitle(chat.title);
  };

  const saveEdit = (id: string) => {
    if (editTitle.trim()) updateChatTitle(id, editTitle.trim());
    setEditingId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') saveEdit(id);
    if (e.key === 'Escape') setEditingId(null);
  };

  const chatToDelete = chats.find(c => c.id === deletingId);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/20 z-20 md:hidden" onClick={() => setIsOpen(false)} />
      )}

      <div
        className={`fixed md:static inset-y-0 left-0 z-30 bg-[#f5f5f5] border-r border-gray-200 flex flex-col transform transition-transform duration-300 ${isOpen ? 'translate-x-0 w-80' : '-translate-x-full md:translate-x-0 md:w-0 md:hidden'
          }`}
        style={{ width: isOpen ? '320px' : undefined }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4">
          <span className="sidebar-logo">
            <span className="text-green-500">Daiv</span>
            <span className="text-gray-900">AI</span>
          </span>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-md transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* New Chat */}
        <div className="px-[16.5px] pb-4">
          <button
            onClick={() => createNewChat()}
            className="w-[287px] h-[48px] flex items-center justify-center gap-2 bg-[#00A832] hover:bg-green-700 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            <Plus size={18} />
            New Chat
          </button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto px-3 py-1 space-y-0.5">
          {chats.map(chat => (
            <div
              key={chat.id}
              className={`group relative flex items-start gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${activeChatId === chat.id ? 'bg-white shadow-sm border border-[#00A8324D]' : 'hover:bg-gray-200/60 border border-transparent'
                }`}
              onClick={() => setActiveChatId(chat.id)}
            >
              <MessageSquare
                size={16}
                className={`flex-shrink-0 mt-0.5 ${activeChatId === chat.id ? 'text-green-500' : 'text-gray-400'}`}
              />

              {editingId === chat.id ? (
                <div className="flex-1 flex items-center gap-1" onClick={e => e.stopPropagation()}>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, chat.id)}
                    className="flex-1 min-w-0 bg-white border border-green-400 px-1.5 py-0.5 rounded text-xs outline-none"
                    autoFocus
                  />
                  <button onClick={() => saveEdit(chat.id)} className="p-0.5 text-green-600 hover:bg-green-50 rounded">
                    <Check size={13} />
                  </button>
                  <button onClick={() => setEditingId(null)} className="p-0.5 text-gray-400 hover:bg-gray-100 rounded">
                    <X size={13} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-800 truncate leading-snug">{chat.title}</div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {chat.messages.length > 0
                        ? getRelativeDate(chat.messages[chat.messages.length - 1].timestamp)
                        : 'Today'}
                    </div>
                  </div>

                  <div
                    className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 flex-shrink-0"
                    onClick={e => e.stopPropagation()}
                  >
                    <button
                      onClick={() => startEditing(chat)}
                      className="p-1 text-gray-400 hover:text-gray-600 rounded"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => setDeletingId(chat.id)}
                      className="p-1 text-gray-400 hover:text-red-500 rounded"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}

          {chats.length === 0 && (
            <div className="text-center text-gray-400 text-xs py-8">No chats yet</div>
          )}
        </div>

        {/* User Section */}
        <div className="relative px-3 py-3 border-t border-gray-200">
          {userMenuOpen && (
            <div className="absolute bottom-full left-3 right-3 mb-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              {[
                { icon: User, label: 'My Account', color: 'text-gray-700', iconColor: 'text-gray-500' },
                { icon: Zap, label: 'Upgrade Plan', color: 'text-green-500', iconColor: 'text-green-500' },
                { icon: Settings, label: 'Settings', color: 'text-gray-700', iconColor: 'text-gray-500' },
                { icon: HelpCircle, label: 'Help & Support', color: 'text-gray-700', iconColor: 'text-gray-500' },
                { icon: LogOut, label: 'Log Out', color: 'text-red-500', iconColor: 'text-red-500' },
              ].map(({ icon: Icon, label, color, iconColor }, i, arr) => (
                <button
                  key={label}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors text-left ${i < arr.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                  onClick={() => setUserMenuOpen(false)}
                >
                  <Icon size={18} className={iconColor} />
                  <span className={`text-sm font-medium ${color}`}>{label}</span>
                </button>
              ))}
            </div>
          )}

          <div
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-200/60 cursor-pointer transition-colors"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
          >
            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
              U
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-800">User</div>
              <div className="text-xs text-gray-400 truncate">user@daivai.com</div>
            </div>
            <button className="p-1 text-gray-400 flex-shrink-0">
              <MoreHorizontal size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Chat Modal */}
      {deletingId && chatToDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl flex flex-col items-center text-center relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setDeletingId(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-4">
              <AlertTriangle size={22} strokeWidth={2} />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Delete Chat?</h2>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete{' '}
              <span className="text-green-500 font-semibold">"{chatToDelete.title}"</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => setDeletingId(null)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => { deleteChat(chatToDelete.id); setDeletingId(null); }}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium text-sm rounded-xl transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
