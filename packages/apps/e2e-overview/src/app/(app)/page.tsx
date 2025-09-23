'use client';
import { useChat } from '@ai-sdk/react';
import ReactMarkdown from 'react-markdown';

const Home = () => {
  const handleSend = async () => {
    const res = await fetch('http://localhost:3002/automate', {
      method: 'POST',
      body: JSON.stringify({
        command:
          'navigate to preview.wallet.kadena.io. Wait for 10 seconds till the loading state is gone and the warning is visible, click the warning away and accept cookies. and create a profile.',
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
