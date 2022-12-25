module.exports = {
	face: [
        {
            face:[Number],
            createdAt:Date
        }
    ], 
    personName:{type:String,unique:true},
    hashedAt: Date
};