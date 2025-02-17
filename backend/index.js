const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

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

app.post('/utente', (req, res) => {
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

// Faccio partire il server sulla porta 3000
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});