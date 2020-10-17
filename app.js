if(process.env.Node_ENV !== 'production') {
    require('dotenv').config()
  }
  
  const express = require('express')
  const app = express()
  const mongoose = require('mongoose');
  const bodyParser = require('body-parser')
  const methodOverride = require('method-override')
  const passport = require('passport');
  const flash = require('connect-flash');
  const session = require('express-session');
  
  
  const indexRouter = require('./routes/index')
  const albumRouter = require('./routes/albums')
  const photoRouter = require('./routes/photos')
  const userRouter = require('./routes/users')
  
  require('./config/passport')(passport);
  
  mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useFindAndModify: false, 
    useCreateIndex: true
  })
  const db = mongoose.connection
  db.on('error', error => console.error(error))
  db.once('open', () => console.log('Connected to Mongoose'))
  
  app.set('view engine', 'ejs')
  app.set('views', __dirname + '/views')
  app.use(methodOverride('_method'))
  app.use(express.static('public'))
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))
  
  app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );
  
  app.use(passport.initialize());
  app.use(passport.session());
  
  app.use(flash());
  
  app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });
  
  app.use(function(req, res, next){
    res.locals.currentUser = req.user; next();
   });
  
  app.use('/', indexRouter)
  app.use('/albums', albumRouter)
  app.use('/photos', photoRouter)
  app.use('/users', userRouter)
  
  
  app.listen(process.env.PORT || 3000)