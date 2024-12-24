// Este archivo solo define el esquema de moongoose para los blogs

const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: String,
    url: { type: String, required: true },
    //if likes don't exist in the request then the schema add likes propertys with value 0
    likes: { type: Number, default: 0 },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Blog', blogSchema)
