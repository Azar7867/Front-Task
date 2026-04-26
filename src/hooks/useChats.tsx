import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface Message {
  id: string;
  type: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
}

export function useChats() {
  const [chats, setChats] = useState<Chat[]>(() => {
    const saved = localStorage.getItem('daivai-chats');
    if (saved) {
      try {
        return JSON.parse(saved) as Chat[];
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('daivai-chats', JSON.stringify(chats));
  }, [chats]);

  const activeChat = chats.find(chat => chat.id === activeChatId) || null;

  const createNewChat = (initialMessage: Message | null = null): Chat => {
    const newChat: Chat = {
      id: uuidv4(),
      title: initialMessage ? getShortTitle(initialMessage.text) : 'New Chat',
      messages: initialMessage ? [initialMessage] : []
    };

    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    return newChat;
  };

  const deleteChat = (chatId: string): void => {
    setChats(prev => prev.filter(chat => chat.id !== chatId));
    if (activeChatId === chatId) {
      setActiveChatId(null);
    }
  };

  const updateChatTitle = (chatId: string, newTitle: string): void => {
    setChats(prev => prev.map(chat =>
      chat.id === chatId ? { ...chat, title: newTitle } : chat
    ));
  };

  const addMessage = (chatId: string, message: Message): void => {
    setChats(prev => prev.map(chat => {
      if (chat.id !== chatId) return chat;

      let updatedTitle = chat.title;
      if (chat.messages.length === 0 && message.type === 'user') {
        updatedTitle = getShortTitle(message.text);
      }

      return {
        ...chat,
        title: updatedTitle,
        messages: [...chat.messages, message]
      };
    }));
  };

  const updateMessage = (chatId: string, messageId: string, newText: string): void => {
    setChats(prev => prev.map(chat => {
      if (chat.id !== chatId) return chat;

      return {
        ...chat,
        messages: chat.messages.map(msg =>
          msg.id === messageId ? { ...msg, text: newText } : msg
        )
      };
    }));
  };

  const deleteMessage = (chatId: string, messageId: string): void => {
    setChats(prev => prev.map(chat => {
      if (chat.id !== chatId) return chat;

      return {
        ...chat,
        messages: chat.messages.filter(msg => msg.id !== messageId)
      };
    }));
  };

  const getShortTitle = (text: string): string => {
    if (text.length <= 30) return text;
    return text.substring(0, 30) + '...';
  };

  return {
    chats,
    activeChatId,
    setActiveChatId,
    activeChat,
    createNewChat,
    deleteChat,
    updateChatTitle,
    addMessage,
    updateMessage,
    deleteMessage
  };
}
