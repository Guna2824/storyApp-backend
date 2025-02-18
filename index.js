console.log('Welcome NodeJS!');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./models/DB');
const Story = require('./models/Story');

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());


// all story get API
app.get('/getAllStories', async(req, res)=>{
    try{
        const response = await Story.find();
        res.status(200).send(response);
        console.log('stories send success')
    } catch (err){
        res.status(500).send('Internal Error');
        console.log(err);
    } 
})


// story add API
app.post('/addStory', async(req, res)=>{
    const {title, author, varient, story} = req.body;
    try{
        const newStory = new Story({
            title,
            author,
            varient,
            story
        })
        await newStory.save();
        res.status(201).send('story added');
        console.log('story added');
    } catch (err) {
        res.status(400).send('Bad request');
        console.log(err);
    }
})


// add sees list API
app.put('/sees', async (req, res) => {
    const { id } = req.body; // Extract `id` from the request body
    try {
        // Find the story by ID
        const story = await Story.findById(id);
        if (!story) {
            res.status(404).send('Story not found');
            console.log('Story not found');
        } else {
            // Increment the `sees` field using `$inc`
            await Story.findByIdAndUpdate(id, { $inc: { sees: 1 } });
            res.status(200).send('User visit recorded');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});




connectDB();

app.listen(PORT, ()=>{
    console.log(`server running on http://localhost:${PORT}`)
})