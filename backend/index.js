const express = require('express'); //framework per creare server web con Node.js
const cors = require('cors'); //per abilitare le richieste CORS, utile per permettere al frontend di comunicare con il backend
const bodyParser = require('body-parser'); //per analizzare i dati inviati nelle richieste HTTP
const QUESTION = [
    {
        id: "name",
        question: "What is your name?",
        type:"text"
    },
    {
        id: "surname",
        question: "What is your surname?",
        type:"text"
    },
    {
        id: "birthday",
        question: "What is your birthday?",
        type:"date"
    },
    {
        id: "sex",
        question: "What is your sex?",
        type:"radio",
        options: ["Male", "Female", "I prefer not to specify it"]
    },
    {
        id: "skills",
        question: "What are your skills?",
        type: "checkbox",
        options: ["Programming", "Problem solving", "Design"]
    }
]           
//array QUESTION utilizzato per inviare un questionario al frontend
// Create an express app
const app = express(); //creazione di un'istanza dell'applicazione Express
const port = 3000;

let answers = [];

//MIDDLEWARE: funzioni che vengono eseguite prima di arrivare alle route
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true })), // per leggere i dati dal form


app.get('/questions', (req, res) => { //ricordati che l'url della fetch deriva da qui. Usi GET perchè vuoi prendere i dati dal backend e non postarli
    // console.log(req.body);
    // req.send('Utente creato');
    res.json(QUESTION);
});


//endpoint per salvare le risposte
app.post('/answers', (req, res) => {
    const { answers: userAnswers } = req.body;

    if (!userAnswers) {
        res.status(400).json({
            message: 'Data not entered'
        });
        return;
    }
    
    //aggiungi le risposte all'array
    answers.push(userAnswers);
    
    res.json({
        message: 'Answers saved successfully'
    });
});

//endpoint per ottenere le risposte per il riepilogone finale
app.get('/results', (req, res) => {
    if (answers.length === 0) {
        return res.status(404).json({ error: 'No results found' });
    }
    const lastAnswer = answers[answers.length - 1]; //prende l'ultima serie di risposte per lui continua ad accumularle
    res.json(lastAnswer);
});



// Faccio partire il server sulla porta 3000
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});