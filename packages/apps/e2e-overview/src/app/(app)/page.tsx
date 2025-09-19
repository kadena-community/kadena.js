'use client';
import { useChat } from '@ai-sdk/react';
import ReactMarkdown from 'react-markdown';

const Home = () => {
  const handleSend = async () => {
    const res = await fetch('http://localhost:3002/automate', {
      method: 'POST',
      body: JSON.stringify({
        command: 'navigate to google.com. and search for kittens.',
      }),
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => res.json());

    console.log(res);
  };

  return (
    <div>
      <button type="button" onClick={handleSend}>
        send2
      </button>
    </div>
  );
};

export default Home;
