if (process.env.NODE_ENV === 'production') {
    module.exports = { mongoURI: 'mongodb://Adi366:mlab@366@ds119449.mlab.com:19449/vidjot-prod' }
} else {
    module.exports = { mongoURI: 'mongodb://localhost/vidjot-dev' }
}