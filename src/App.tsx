import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import { useChats } from './hooks/useChats';

function App() {
  const chatManager = useChats();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-full bg-white text-gray-800 font-sans overflow-hidden">
      <Sidebar
        chats={chatManager.chats}
        activeChatId={chatManager.activeChatId}
        setActiveChatId={chatManager.setActiveChatId}
        createNewChat={chatManager.createNewChat}
        deleteChat={chatManager.deleteChat}
        updateChatTitle={chatManager.updateChatTitle}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      <ChatArea
        activeChat={chatManager.activeChat}
        createNewChat={chatManager.createNewChat}
        addMessage={chatManager.addMessage}
        updateMessage={chatManager.updateMessage}
        deleteMessage={chatManager.deleteMessage}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
    </div>
  );
}

export default App;
