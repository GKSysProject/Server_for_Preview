const express = require('express');
const xlsx = require('xlsx');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3080;

app.use(cors());

app.get('/test', (req, res) => {
    const year = req.query.y;
    if (!year) {
        return res.status(400).json({ error: 'Year query parameter is required' });
    }

    const filePath = path.join(__dirname, `${year}.xlsx`);
    
    try {
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const jsonData = xlsx.utils.sheet_to_json(worksheet);

        const xAxis = jsonData.map(item => item.score);
        const series = jsonData.map(item => item.count);

        const responseData = {
            xAxis: xAxis,
            series: series
        };

        res.json(responseData);
    } catch (error) {
        res.status(500).json({ error: 'Error reading the Excel file' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
