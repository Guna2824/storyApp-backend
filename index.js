console.log('Welcome to NodeJS!');

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./models/DB');
const Story = require('./models/Story');

const app = express();
const PORT = process.env.PORT || 5000; // Fallback port

// Middleware
app.use(cors());
app.use(express.json());

// Get all stories API
app.get('/getAllStories', async (req, res) => {
    try {
        const stories = await Story.find();
        res.status(200).json(stories);
        // console.log('Stories sent successfully');
    } catch (err) {
        console.error('Error fetching stories:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ✅ Add a new story API with validation
app.post('/addStory', async (req, res) => {
    const { title, author, varient, story } = req.body;

    // 🔹 Validation: Check if fields are empty
    if (!title || !author || !varient || !story) {
        return res.status(400).json({ error: 'All fields are required!' });
    }

    // 🔹 Validation: Ensure title, author, and story don't contain numbers
    const validateText = (text) => !/\b\d{10}\b/.test(text);
    if (!validateText(title) || !validateText(author) || !validateText(story)) {
        return res.status(400).json({ error: 'Title, Author, and Story must not contain numbers!' });
    }

    try {
        const newStory = new Story({ title, author, varient, story });
        await newStory.save();
        // console.log('Story added');
        res.status(201).json({ message: 'Story added successfully' });
    } catch (err) {
        console.error('Error adding story:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Increment sees count API
app.put('/sees', async (req, res) => {
    const { id } = req.body;
    try {
        const updatedStory = await Story.findByIdAndUpdate(
            id,
            { $inc: { sees: 1 } },
            { new: true } // Return the updated document
        );
        if (!updatedStory) {
            // console.log('Story not found');
            return res.status(404).json({ error: 'Story not found' });
        }
        res.status(200).json({ message: 'User visit recorded', story: updatedStory });
    } catch (err) {
        console.error('Error updating sees count:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Connect to DB and start server
connectDB();
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
