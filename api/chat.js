export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    const { message, systemPrompt } = req.body;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            max_tokens: 200,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message }
            ]
        })
    });

    const data = await response.json();
    res.status(response.status).json(data);
}