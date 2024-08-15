const fs = require('fs');
const sax = require('sax');
const { format } = require('fast-csv');
const saxStream = sax.createStream(true);
// const writableStream = fs.createWriteStream('US_orders_2_29_1_day.csv');
const writableStream = fs.createWriteStream('customers_after_june_5.csv');

let currentElement = '';
let record = {};
let isRecordElement = false; // Adjust based on your XML structure
const records = [];
let currentObj = {}

// Initialize CSV stream
const csvStream = format({ headers: true });
csvStream.pipe(writableStream);

saxStream.on('opentag', node => {
    // Assuming <record> is your repeating element
    if (node.name === 'customer') {
        isRecordElement = true;
        record = {}; // Reset for a new record
    }
    currentElement = node.name;
    if (node.name === 'custom-attribute') {
        currentElement = node.attributes['attribute-id'];
        //console.log(JSON.stringify(node));  
       // console.log(currentElement);  
    }
});

saxStream.on('closetag', nodeName => {
    if (nodeName === 'customer') {
        isRecordElement = false;
        // Write the record to the CSV
       csvStream.write(record);
    }
});

saxStream.on('text', text => {
   // console.log('record ', text)
    if (text.trim() === '') return;
    if (isRecordElement) {
       // console.log(currentElement)
           // Assuming you're extracting 'column1' and 'column2', adjust as needed
        if (currentElement === 'subscriberKey' || currentElement === 'email' || currentElement === 'loyalty_regBrand' || currentElement === 'loyalty_id' ) {
            console.log(text.trim())
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

const readableStream = fs.createReadStream('customers_after_june_5_US.xml');
//const readableStream = fs.createReadStream('1.xml');
readableStream.pipe(saxStream);
