'use strict';

/**
 * 
 * @author Sam Verschueren      <sam.verschueren@gmail.com>
 * @since  18 Jul. 2015
 */
 
// module dependencies
var Q = require('q'),
    _ = require('lodash');

// utility
var queryUtil = require('../utils/query');

/**
 * Creates a new delete item object that can then be used to built the entire
 * request.
 * 
 * @param {string}          table       The name of the table that should be queried.
 * @param {DOC.DynamoDB}    dynamodb    The dynamodb object that should be used to query to database.
 */
function DeleteItem(table, dynamodb) {
    this._dynamodb = dynamodb;
    this._params = {
        TableName: table
    };
};

/**
 * This method will initialize the request with the index query that has been provided.
 * 
 * @param  {object}     query           The query for the index to filter on.
 * @return {DeleteItem}                 The delete item object.
 */
DeleteItem.prototype.remove = function(query) {
    // Set the query as key
    this._params.Key = query;
    
    // Return the object so that it can be chained
    return this;
};

/**
 * This will create a conditional delete item object where the condition should be satisfied in order for the item to be
 * deleted.
 * 
 * @param  {object}     condition       A condition that must be satisfied in order for a conditional DeleteItem to succeed.
 * @return {DeleteItem}                 The query object.
 */
DeleteItem.prototype.where = function(condition) {
    // Parse the query
    var parsedQuery = queryUtil.parse(condition);
    
    // Add the parsed query attributes to the correct properties of the params object
    this._params.ConditionExpression = parsedQuery.ConditionExpression;
    this._params.ExpressionAttributeNames = _.assign({}, this._params.ExpressionAttributeNames, parsedQuery.ExpressionAttributeNames);
    this._params.ExpressionAttributeValues = _.assign({}, this._params.ExpressionAttributeValues, parsedQuery.ExpressionAttributeValues);
    
    // Return the query so that it can be chained
    return this;
};

/**
 * This method will execute the delete item request that was built up.
 * 
 * @return {Promise}        The promise object that resolves or rejects the promise if something went wrong.
 */
DeleteItem.prototype.exec = function() {
    var dynamodb = this._dynamodb,
        params = this._params;
    
    return Q.Promise(function(resolve, reject) {
        // Execute the correct method with the params that are built during the building process
        dynamodb.deleteItem(params, function(err, data) {
            if(err) {
                // Reject the promise if something went wrong
                return reject(err);
            }
            
            // Resolve if everything went well.
            resolve();
        });
    });
};

// Export the object
module.exports = DeleteItem;