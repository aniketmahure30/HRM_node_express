require("dotenv").config();  // it will take details form .evn file that will keep data safer and hidden to others

module.exports = {
    PORT: process.env.PORT,
    MONGODB_URL : process.env.MONGODB_URL,
    GMAIL_USERNAME : process.env.GMAIL_USERNAME
}