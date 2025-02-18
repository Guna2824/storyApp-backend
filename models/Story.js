const mongoose = require('mongoose');


const storySchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
    },
    author : {
        type : String,
        required : true,
    },
    varient : {
        type : String,
        required : true,
    },
    story : {
        type : String,
        required : true,
    },
    time : {
        type : Date,
        default : Date.now
    },
    sees : {
        type : Number,
        default : 0,
    }
})


module.exports = mongoose.model('story', storySchema);