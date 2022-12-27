
var mongoose = require('mongoose'),
modelName = 'user',
schemaDefinition = require('../../schema/User/' + modelName),
schemaInstance = mongoose.Schema(schemaDefinition),
modelInstance = mongoose.model(modelName, schemaInstance);

module.exports = modelInstance;