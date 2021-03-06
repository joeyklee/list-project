require('dotenv').config();
module.exports = {
    PORT: process.env.PORT || 3030,
    JWT_KEY: process.env.JWT_KEY,
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/list-project',
    MAILER:{
        EMAIL: process.env.MAILER_EMAIL || 'test@example.com', 
        PASSWORD:process.env.MAILER_PASSWORD || 'secret',
        SERVICE: process.env.MAILER_SERVICE || 'Gmail',
        DEFAULT_ADDRESS: process.env.MAILER_ADDRESS || 'First Last <test@example.com>'
    }
}