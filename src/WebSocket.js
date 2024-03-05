import React, { useEffect } from 'react';

const WebSocketComponent = () => {
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8765');
    
    ws.onopen = () => {
      console.log('WebSocket connected');
    };
    
    ws.onmessage = (event) => {
      console.log('Received message:', event.data);
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    ws.onclose = () => {
      console.log('WebSocket closed');
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div>
      {/* Your component's UI */}
    </div>
  );
};

export default WebSocketComponent;
