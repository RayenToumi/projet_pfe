const mongoose = require('mongoose');


module.exports.connectToMongoDB = async () => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.Url_MongoDB);
        console.log('Connected to Data base'); 
    } catch (err) {
        (err) => console.log(err.message)
    }
}