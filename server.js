const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const apiKey = 'YOUR KEY';
const pageId = 'YOUR ID';
const metricId = 'YOUR ID';
const apiBase = 'https://api.statuspage.io/v1';
const url = apiBase + '/pages/' + pageId + '/metrics/' + metricId + '/data.json';
const authHeader = { 'Authorization': 'OAuth ' + apiKey };
const options = { method: 'POST', headers: authHeader };

app.post('/ping', (req, res) => {
    const ping = req.body.ping;
    const epochInSeconds = Math.floor(new Date() / 1000);
    const data = {
        timestamp: epochInSeconds,
        value: ping,
    };

    console.log('Sending request to:', url);
    console.log('Using headers:', authHeader);
    console.log('Data being sent:', data);

    const request = https.request(url, options, function (response) {
        let responseData = '';
        response.on("data", function (chunk) {
            responseData += chunk;
        });
        response.on("end", function () {
            console.log('Response status code:', response.statusCode);
            console.log('Response message:', response.statusMessage);
            console.log('Response data:', responseData);

            if (response.statusCode === 401) {
                const genericError = "Error encountered. Please ensure that your page code and authorization key are correct.";
                console.error(genericError);
                return res.status(401).send(genericError);
            } else if (response.statusCode >= 400) {
                console.error('Error from API:', responseData);
                return res.status(response.statusCode).send(responseData);
            }
            
            console.log("Submitted ping: " + ping);
            res.status(200).send("Ping submitted successfully");
        });
        response.on("error", (error) => {
            console.error(`Error caught: ${error.message}`);
            res.status(500).send(`Error: ${error.message}`);
        });
    });

    request.write(JSON.stringify({ data: data }));
    request.end();
});

app.listen(3000, () => {
    console.log('Node.js server is listening on port 3000');
});
