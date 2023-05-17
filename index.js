const express =         require('express');
const mongoose =        require('mongoose');
const dotenv =          require('dotenv').config();
const app =             express();
const PORT =            5000;
const expressLayouts =  require('express-ejs-layouts');
const connectDB =       require('./config/database');
const session =         require('express-session');
const methodOverride =  require('method-override');
const connect_Flash =   require('connect-flash');
const nodemailer =      require('nodemailer');
const custumFlash =     require('./config/flashMiddleWare');
const passport =        require('passport');
const localPassport =   require('./config/passport-local');
const handlors =        require('./handelors/notfoundroutes');
const MongoStore =      require('connect-mongo');
const fs =              require('fs');
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }));
app.use(expressLayouts);
app.set('layout extractStyles' , true);
app.set('layout extractScripts' , true);
app.use(express.static('public')); 
app.set('view engine','ejs');
app.set('views','views');


function checkUploadsDirectory() {
  const directoryPath = './uploads/images/uploaded_images';
  if (fs.existsSync(directoryPath)) {
  } else {
    fs.mkdirSync(directoryPath);
  }
};
checkUploadsDirectory();

app.use('/uploads',express.static(__dirname + '/uploads')); // uploding img files
app.use(session({
    name:'EmailAuth',
    secret:'thisissecret',
    saveUninitialized: false,
    resave: false,
    cookie:{
        maxAge:(1000 * 60 * 100)
    },
    store: MongoStore.create(  // Mongo store is used to store session cookie in the DATABASE
    { 
        mongoUrl : process.env.MONGO_URL,
        autoRemove: 'disabled'//I dont want to remove session cookies automatically
    }, function(err){
    if(err){console.log('Error while trying to establish the connection and store session cookie:', err); return;}
    console.log('connect-mongo setup okay'); return;
   })
}));


app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(connect_Flash());
app.use(custumFlash.setFlash);

app.use((err, req, res, next) => {
    // Mongoose error handling
    if (err.name === 'MongoError' || err.name === 'MongoNetworkError' || err.name === 'MongoServerSelectionError' || err.name === 'connect ETIMEDOUT' ) {
      // Handle Mongoose errors and render 404 page
      return res.render('404',{
        title: '404 Page Not Found'
      }); //  '404.ejs' file for the error page
    } else if(err.name === 'Error' || err.name === 'getaddrinfo') {
        return res.render('404',{
            title: '404 Page Not Found'
        });
    }else {
      // Pass the error to the next middleware in the stack
      next(err);
    };
});
app.use('/',require('./routers'));
app.get('*', handlors.notFound);
connectDB.ConnectDB().then(() => {
    app.listen(PORT, () =>{
        console.log(`Server Successfull Connected With the Port : ${PORT}`);
    });
});