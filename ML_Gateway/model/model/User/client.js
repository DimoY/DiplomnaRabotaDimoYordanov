
var mongoose = require('mongoose'),
modelName = 'client',
schemaDefinition = require('../../schema/User/' + modelName),
schemaInstance = mongoose.Schema(schemaDefinition),
modelInstance = mongoose.model(modelName, schemaInstance);

module.exports = modelInstance;