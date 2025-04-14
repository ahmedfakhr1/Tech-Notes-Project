const express = require('express');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to fetch and return note content
app.get('/api/fetch-note', async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).send('Missing url');
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36',
                'Accept': 'text/html'
            }
        });
        if (!response.ok) throw new Error('Failed to fetch');
        const text = await response.text();
        // Try to extract the main content from the note.sx page
        const match = text.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
        if (match) {
            res.send(match[1]);
        } else {
            // fallback: send the whole page if extraction fails
            res.send(text);
        }
    } catch (e) {
        console.error(e); // Log the error for debugging
        res.status(500).send('Could not fetch note content.');
    }
});

// Route for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});