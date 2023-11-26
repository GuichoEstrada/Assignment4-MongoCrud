/********************************************************************************** 
 * ITE5315 – Assignment 4
 * I declare that this assignment is my own work in accordance with Humber Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source
 * (including web sites) or distributed to other students.*
 * Name: Luis Carlo Estrada Student ID: N01541627 Date: 11/23/2023
 **********************************************************************************/
// load mongoose since we need it to define a model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
SalesSchema = new Schema({
    InvoiceNo : String,
    image : String,
    Manufacturer : String,
    class : String,
    Sales_in_thousands : Number,
    __year_resale_value : Number,
    Vehicle_type : String,
    Price_in_thousands : Number,
    Engine_size : Number,
    Horsepower : Number,
    Wheelbase : Number,
    Width : Number,
    Length : Number,
    Curb_weight : Number,
    Fuel_capacity : Number,
    Fuel_efficiency : Number,
    Latest_Launch : String,
    Power_perf_factor : Number
});
module.exports = mongoose.model('car-sales', SalesSchema, 'car-sales');
