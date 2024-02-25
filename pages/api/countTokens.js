// pages/api/countTokens.js
import openaiTokenCounter from 'openai-gpt-token-counter';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const messages = req.body.messages;
    
    // Assuming the tokenCount function is properly imported or defined here
    const tokenCount = (messages) => {
      return openaiTokenCounter.chat(messages, "gpt-4");
    };

    const totalTokenCount = tokenCount(messages);

    res.status(200).json({ totalTokenCount });
  } else {
    // Handle any non-POST requests
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
