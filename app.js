const express = require('express')
const config = require('./utils/config')

const app = express()
const cors = require('cors')
const notesRouter = require('./controllers/blogs')
const mongoose = require('mongoose')




const mongoUrl = config.MONGODB_URI

mongoose.connect(mongoUrl)
    .then(()=>{
        console.log('connected to MongoDB')
    })
    .catch(error => {
        console.log('error connecting to MongoDB:', error.message)
    })

app.use(cors())
app.use(express.json())
app.use('/api/blogs',notesRouter)

module.exports = app