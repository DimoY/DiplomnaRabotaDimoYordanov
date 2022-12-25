var mongoose = require('mongoose'),
modelName = 'face',
schemaDefinition = require('../../schema/Face/' + modelName),
schemaInstance = mongoose.Schema(schemaDefinition),
modelInstance = mongoose.model(modelName, schemaInstance);

module.exports = modelInstance;