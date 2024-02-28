const fs = require('fs');
const sax = require('sax');
const { format } = require('fast-csv');
const saxStream = sax.createStream(true);
const writableStream = fs.createWriteStream('prod_orders_2_28.csv');

let currentElement = '';
let record = {};
let isRecordElement = false; // Adjust based on your XML structure
const records = [];

// Initialize CSV stream
const csvStream = format({ headers: true });
csvStream.pipe(writableStream);

saxStream.on('opentag', node => {
    // Assuming <record> is your repeating element
    if (node.name === 'order') {
        isRecordElement = true;
        record = {}; // Reset for a new record
    }
    currentElement = node.name;
});

saxStream.on('closetag', nodeName => {
    if (nodeName === 'order') {
        isRecordElement = false;
        // Write the record to the CSV
        csvStream.write(record);
    }
});

saxStream.on('text', text => {
    if (text.trim() === '') return;
    if (isRecordElement) {
           // Assuming you're extracting 'column1' and 'column2', adjust as needed
        if (currentElement === 'original-order-no' || currentElement === 'order-date' || currentElement === 'shipping-method') {
            record[currentElement.toLowerCase()] = text.trim();
        }
    }
});

saxStream.on('end', () => {
    // End the CSV stream
    csvStream.end();
    console.log('XML to CSV conversion is complete.');
});

// Handle errors
saxStream.on('error', (e) => {
    console.error('Error:', e);
    // clear the error
    this._parser.error = null;
    this._parser.resume();
});

// Replace 'largefile.xml' with the path to your large XML file
//const readableStream = fs.createReadStream('2024-02-21-prod.xml');
const readableStream = fs.createReadStream('US_prod_orders_2_28_30_days.xml');
readableStream.pipe(saxStream);