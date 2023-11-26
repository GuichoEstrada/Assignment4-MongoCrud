/********************************************************************************** 
 *ITE5315 – Assignment 4
 * I declare that this assignment is my own work in accordance with Humber Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source
 * (including web sites) or distributed to other students.
 *
 * Name: Luis Estrada Student ID: N01541627 Date: 11/24/2023
 * 
 * ********************************************************************************
 **/
// Import necessary modules for the application
// 'express' for creating node/express application
var express = require('express');
var mongoose = require('mongoose');
// Create instance of express
var app = express(); 
var path = require('path'); 
var database = require('./config/database');
var bodyParser = require('body-parser');    
// express-handlebars for view renders
const exphbs = require('express-handlebars'); 
// setting port number for app, otherwise use default port number 3000
const port = process.env.port || 3000; 

app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

mongoose.connect(database.url);
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
    console.log('Connected to MongoDB');
});

var CarSales = require('./models/car-sales');

// Template Engine Initialization
// Handlebars setup
const hbs = exphbs.create({
    extname: '.hbs',
    defaultLayout: 'main',
    helpers: {
        audirow: function (a, b, options) {
            return a.includes(b) ? 'highlight' : '';
        }
    }
});

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

// Routes
// Request handler for root route which renders index view with title
app.get('/', function (req, res) { 
    res.render('index', { title: 'Express' }); 
});

// Display all invoice data
app.get('/allData', async function(req, res) {
    try {
        const carsales = await CarSales.find().lean().exec();
        res.render('allData', { title: 'All Car Sales Data', sales: carsales });
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// Display specific invoice data
app.get('/allData/invoiceID/:index', async (req, res) => {
    // Extract the index parameter from the URL
    const index = req.params.index;
    try {
        // Find the record with the specified index
        // findOne returns a promise so we need to use await for proper handling
        const record = await CarSales.findOne({ 'InvoiceNo': index }).lean().exec();
        // If the record is found, render a view with the record data
        if (record) {
            res.render('invoiceID', { title: 'Invoice ID', invoice: record });
        } else {
            // If the record is not found, send a 404 status and message
            res.status(404).send('Invoice record not found!');
        }
    } catch (err) {
        // If there's an error parsing the JSON data, send a 500 status and message
        console.log('Error reading JSON data:', err);
        res.status(500).send('Error reading JSON data!');
    }
});
// Add new invoice
app.get('/newInvoice', (req, res) => {
    res.render('newInvoice');
});
app.post('/newInvoice', async (req, res) => {
    try {
        // Get form data
        const { InvoiceNo, 
                image, 
                Manufacturer, 
                Sales_in_thousands, 
                __year_resale_value, 
                Vehicle_type,
                Price_in_thousands,
                Engine_size,
                Horsepower,
                Wheelbase,
                Width,
                Length,
                Curb_weight,
                Fuel_capacity,
                Fuel_efficiency,
                Latest_launch,
                Power_perf_factor  
            } = req.body;

        // Create a new CarSales document
        const newInvoice = new CarSales({
            InvoiceNo: InvoiceNo,
            image : image,
            Manufacturer : Manufacturer,
            Sales_in_thousands : Sales_in_thousands,
            __year_resale_value : __year_resale_value,
            Vehicle_type : Vehicle_type,
            Price_in_thousands : Price_in_thousands,
            Engine_size : Engine_size,
            Horsepower : Horsepower,
            Wheelbase : Wheelbase,
            Width : Width,
            Length : Length,
            Curb_weight : Curb_weight,
            Fuel_capacity : Fuel_capacity,
            Fuel_efficiency : Fuel_efficiency,
            Latest_Launch : Latest_launch,
            Power_perf_factor : Power_perf_factor
        });

        // Save the new document to the database
        const savedInvoice = await newInvoice.save();
        // Handle the saved invoice data (example: log it)
        console.log('Saved Invoice:', savedInvoice);

        // Redirect to a success page or display a success message
        res.send('New Invoice saved!'); // Replace with the desired success route or page
    } catch (err) {
        // If there's an error, log it and send a 500 status and message
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Update existing invoice
app.put('/allData/updateInvoice/:index', async (req, res) => {
    const index = req.params.index;
    try {
        // Extract data from the form
        const { Manufacturer, Price_in_thousands } = req.body;
        // Find the existing invoice
        const record = await CarSales.findOne({ 'InvoiceNo': index });
        if (!record) {
            // If the invoice is not found, send a 404 status and message
            return res.status(404).send('Invoice not found!');
        }

        // Update the Manufacturer and Price_in_thousands fields
        record.Manufacturer = Manufacturer;
        record.Price_in_thousands = Price_in_thousands;
        console.log(record)

        // Save the updated invoice to the database
        console.log('Record before update:', record);

        await record.save();

        console.log('Record after update:', record);
        // Redirect to a success page or display a success message
        res.send('Existing Invoice updated!'); // Replace with the desired success route or page
    } catch (err) {
        // If there's an error, log it and send a 500 status and message
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Delete an existing invoice
app.delete('/allData/deleteInvoice/:index', async (req, res) => {
    try {
        const index = req.params.index;
        // Find the existing invoice by ID
        const record = await CarSales.findOne({ 'InvoiceNo': index });
        if (!record) {
            // If the invoice is not found, send a 404 status and message
            return res.status(404).send('Invoice not found!');
        }
        // Delete the existing invoice from the database
        console.log('Record before deletion:', record);

        await record.deleteOne();

        console.log('Record after deletion:', record);

        // Redirect to a success page or display a success message
        res.send('Invoice successfully deleted!'); // Replace with the desired success route or page
    } catch (err) {
        // If there's an error, log it and send a 500 status and message
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Error handler for requests to any other URL which renders error view
app.get('*', function (req, res) { 
    res.render('error', { title: 'Error', message: 'Wrong Route' }); 
}); 

// Port Listener for incoming requests
app.listen(port, () => { console.log(`Example app listening at http://localhost:${port}`) })