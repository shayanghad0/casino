import React, { useState, useRef, useEffect } from 'react';
import { useGame } from '../store/GameStore';

export default function Chat() {
  const { state, sendChatMessage } = useGame();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.chatMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    sendChatMessage(message);
    setMessage('');
  };

  return (
    <div className="chat-panel">
      <div className="chat-header">
        💬 Live Chat
        <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 'auto' }}>
          {state.chatMessages.length} messages
        </span>
      </div>
      <div className="chat-messages">
        {state.chatMessages.map(msg => (
          <div key={msg.id} className={`chat-message ${msg.type}`}>
            {msg.type !== 'system' && (
              <span className="chat-username">{msg.username}:</span>
            )}
            <span>{msg.message}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form className="chat-input-area" onSubmit={handleSend}>
        <input
          className="chat-input"
          placeholder="Type a message..."
          value={message}
          onChange={e => setMessage(e.target.value)}
          maxLength={200}
        />
        <button type="submit" className="chat-send-btn">Send</button>
      </form>
    </div>
  );
}
