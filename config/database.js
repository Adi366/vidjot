if (process.env.NODE_ENV === 'production') {
    module.exports = { mongoURI: 'mongodb://Aditya:neorando@ds119449.mlab.com:19449/vidjot-prod' }
} else {
    module.exports = { mongoURI: 'mongodb://localhost/vidjot-dev' }
}