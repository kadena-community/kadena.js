'use client';
import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

const Home = () => {
  const [response, setResponse] = useState('');
  const handleSend = async () => {
    const res = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        prompt: 'navigate to preview.wallet.kadena.io.',
      }),
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => res.json());

    setResponse(res);
  };

  return (
    <div>
      <button type="button" onClick={handleSend}>
        send2
      </button>

      <h2>Response</h2>
      {response}
    </div>
  );
};

export default Home;
