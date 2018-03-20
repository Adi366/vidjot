const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const methodOverride = require('method-override'); 
const passport = require('passport');
 

const app = express();

//Routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//Config passport
require('./config/passport')(passport);

//config database
const db = require('./config/database');

//static folder
app.use(express.static(path.join(__dirname,'public')));

//connect to database
mongoose.connect(db.mongoURI)
    .then(() => console.log("MongoDb connected"))
    .catch(err => console.log(err));


//handelbars middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Method override middleware
app.use(methodOverride('_method'));

//Express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  }))

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//flash middleware
 app.use(flash());

 //Global Variable
 app.use(function(req,res,next){
    res.locals.success_msg = req.flash('success-msg');
    res.locals.error_msg = req.flash('error-msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
 });

//Index route
app.get('/', (req, res) => {
    const title = 'Welcome'
    res.render('index', {
        title: title
    });
});

//About route
app.get('/about', (req, res) => {
    res.render('about');
});

//Use Idea routes
app.use('/ideas',ideas);

//Use Users route
app.use('/users',users);


const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server started at ${port}`);
})