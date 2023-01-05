module.exports = {
	face: [
        {
            face:[Number],
            createdAt:Date,
            pictureAt:String
        }
    ], 
    personName:{type:String,unique:true},
    hashedAt: Date
};