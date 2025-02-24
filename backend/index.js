const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const QUESTION = [
    {
        id: "name",
        question: "What is your name?",
        type:"text"
    },
    {
        id: "birthday",
        question: "What is your birthday?",
        type:"date"
    },
    {
        id: "color",
        question: "What is your favourite color?",
        type: "color"
    }
]

// Create an express app
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true })), // per leggere i dati dal form


// Definizione delle varie route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/utente', (req, res) => {
    res.send('Ciao Utente');
});

app.post('/utente', (req, res) => { //ricordati che l'url della fetch deriva da qui
    // console.log(req.body);
    // req.send('Utente creato');
    const {name} = req.body;
    if (!name) {
        //res.status(400).send('Nome non inserito');
        res.status(400).json({
            message: 'Nome non inserito' //a differenza di prima in cui visualizzavamo il messaggio solo nel backend, in questo modo creiamo un file json da mostrare nel frontend?
        });
        return;
    }
    //res.send(`Ciao ${name} sei nel backend`);
    res.json({
        message: `Ciao ${name} sei nel backend`
    });
});


app.post('/questions', (req, res) => { //ricordati che l'url della fetch deriva da qui
    // console.log(req.body);
    // req.send('Utente creato');
    QUESTION = req.body;
    res.json(QUESTION);
});

// Faccio partire il server sulla porta 3000
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});