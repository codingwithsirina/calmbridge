import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());
app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer YOUR_OPENAI_API_KEY`
        },
        body: JSON.stringify({
            model: 'gpt-4',
            messages: [
                { role: 'system', content: 'You are a friendly virtual friend for kids.' },
                { role: 'user', content: userMessage }
            ]
        })
    });

    const data = await response.json();
    res.json({ reply: data.choices[0].message.content });
});

app.listen(3000, () => console.log('Server running on port 3000'));