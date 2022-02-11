const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const PORT = process.env.PORT || 4000

const app = express();

app.use(express.json());
app.use(cors());
DB__URL = process.env.MONGO__URL;

mongoose.connect(DB__URL).then(() => console.log("Connected to Mongo DataBase")).catch(console.error);

// Models
const Todo = require('./models/Todo');

app.get('/todos', async (req, res) => {
    try{
        const todos = await Todo.find();
        res.json(todos);
    }catch(err){console.error(err);}
});

app.post('/todo/new', (req, res) => {
    try {
        if (req.body.text === "") return;
        const todo = new Todo({
            text: req.body.text
        })
        todo.save();
        res.json(todo);
    }catch(err) {
        console.log("delete Err: " + err)
    }
});

app.delete('/todo/:id', async (req, res) => {
    try {
        result = await Todo.deleteOne({_id : req.params.id });
        res.json({result});
    }catch(err) {
        console.log("delete Err: " + err)
    }
});

app.get('/todo/complete/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        todo.complete = !todo.complete;
        todo.save();
        res.json(todo);
    } catch(err) {
        console.log("Complete Err: " + err)
    }
})

app.put('/todo/update/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        todo.text = req.body.text;
        todo.save();
        res.json(todo);
    }catch(err) {
        console.log("delete Err: " + err)
    }
});

app.listen(PORT, () => console.log(`listening on port ${PORT}`));