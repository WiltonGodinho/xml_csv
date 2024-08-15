const fs = require('fs');
const { stringify } = require('querystring');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();


// Read XML from file
fs.readFile('2024-02-21-prod.xml', (err, data) => {
    if (err) throw err;
    // Parse XML to JS Obj
    parser.parseString(data, (err, result) => {
        if (err) throw err;

        // Assuming XML has a root element that contains elements named 'object' (adjust as needed)
        const objects = result.orders.order || [];

        console.log(stringify(objects[0]['currency']))

        // Define CSV content
        let csvContent = "original-order-no,order-date,shipping-method\n"; // Adjust field names

        // Loop through objects and append data to CSV string
        objects.forEach(obj => {
            // Adjust these lines to match the structure of your XML and the fields you want
            const field1 = obj['original-order-no'][0];
            const field2 = obj['order-date'][0];
            const field3 = obj['shipments'][0]['shipment'][0]['shipping-method'][0];

            //const field3 = obj.[0];

            // Append line to CSV content
            csvContent += `${field1},${field2},${field3}\n`;
        });

        // Write CSV to file
        fs.writeFile('output.csv', csvContent, (err) => {
            if (err) throw err;
            console.log('CSV file has been saved.');
        });
    });
});
