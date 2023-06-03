const conn = require('./connection');
const express = require('express');
var path = require('path');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('calculator');
});

app.post('/calculate', (req, res) => {
    const expression = req.body.expression;

    try {
        const result = eval(expression);
        res.json(result);

    } catch (error) {
        console.error('Error evaluating expression:', error);
    }
});

app.post('/store_data', (req, res) => {
    const { name, expression, result } = req.body;

    const query = 'INSERT INTO cal_res (name, expression, result) VALUES (?, ?, ?)';
    conn.query(query, [name, expression, result], (err, result) => {
        if (err) {
            console.error('Error saving data to the database:', err);
            return res.status(500).json({ error: 'Failed to save data.' });
        }

        return res.status(200).json({ message: 'Data saved successfully.' });
    });
});

app.get('/getData', function (req, res, next) {
    var Query = "select * from cal_res";
    conn.query(Query, function (err, rows) {
        if (err) throw err;
        res.send(rows);
    })
});

app.get('/deleteCal', (req, res) => {
    var id = req.query.id;
    var Query = `delete from cal_res where id="${id}"`;
    conn.query(Query, function (err) {
        if (err) throw err;
        res.send('Calculation Deleted')
    })
});

app.listen(3000, () => {
    console.log('Connected to server.....')
});