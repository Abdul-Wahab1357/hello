const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the portfolio.html file
app.get('/portfolio.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'portfolio.html'));
});

// Serve the portfolio.json file
app.get('/portfolio-data', (req, res) => {
    fs.readFile(path.join(__dirname, 'portfolio.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.json(JSON.parse(data));
    });
});

// Add new item to portfolio.json
app.post('/add-item', (req, res) => {
    const newItem = req.body;

    // Read the existing data from portfolio.json
    fs.readFile(path.join(__dirname, 'portfolio.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            return res.status(500).send('Internal Server Error');
        }

        const jsonData = JSON.parse(data);
        jsonData.items.push(newItem);

        // Write the updated data back to portfolio.json
        fs.writeFile(path.join(__dirname, 'portfolio.json'), JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Error writing to JSON file:', err);
                return res.status(500).send('Internal Server Error');
            }

            res.send('Item added successfully');
        });
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
