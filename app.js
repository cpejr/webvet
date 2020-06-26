require('dotenv').config();

const express = require('express');
const exphbs = require('express-handlebars');

const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const firebase = require('firebase');
const admin = require('firebase-admin');
const flash = require('express-flash');
const session = require('express-session');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const stockRouter = require('./routes/stock');
const queueRouter = require('./routes/queue');
const expandingdivsRouter = require('./routes/expandingDivs');
const userRouter = require('./routes/user');
const cardsAdminRouter = require('./routes/cardsAdmin');
const homeAdminRouter = require('./routes/homeAdmin');
const searchRouter = require('./routes/search');
const analystRouter = require('./routes/analyst');
const recordRouter = require('./routes/record');
const sampleRouter = require('./routes/sample');
const requisitionRouter = require('./routes/requisition');
const profileRouter = require('./routes/profile');
const allkitsRouter = require('./routes/allkits');
const printtemplateRouter = require('./routes/printtemplate');
const calibrationcurvesRouter = require('./routes/calibrationcurves');
const allcalibratorsRouter = require('./routes/allcalibrators');
const allsamplesRouter = require('./routes/allsamples');
const previousmapRouter = require('./routes/previousmap');
const sampleresultRouter = require('./routes/sampleresult');
const reportRouter = require('./routes/report');
const statisticsRouter = require('./routes/statistics');
const covenantRouter = require('./routes/covenant');
const app = express();

/**
 * Globals
 */
ToxinasSigla = ['AFLA', 'DON', 'FBS', 'OTA', 'T2', 'ZEA'];
ToxinasFull = ['aflatoxina', 'deoxinivalenol', 'fumonisina', 'ocratoxina', 't2toxina', 'zearalenona'];
ToxinasFormal = ['Aflatoxinas', 'Deoxinivalenol', 'Fumonisina', 'Ocratoxina A', 'T-2 toxina', 'Zearalenona'];
ToxinasAll = [];

for (let i = 0; i < ToxinasFull.length; i++) {
  ToxinasAll[i] = {
    Full: ToxinasFull[i],
    Sigla: ToxinasSigla[i],
    Formal: ToxinasFormal[i]
  }
}


/**
 *  Database setup
 */

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_SERVER}/${process.env.MONGO_DATABASE}?${process.env.MONGO_OPTIONS}`, { useNewUrlParser: true });
mongoose.connection.on('error', console.error.bind(console, 'connection error: '));
mongoose.connection.once('open', () => {
  console.log('Database connect!');
});

/**
 * firebase setup
 */
const config = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID
};
firebase.initializeApp(config);

const serviceAccont = {
  type: process.env.ADMIN_TYPE,
  project_id: process.env.ADMIN_PROJECT_ID,
  private_key_id: process.env.ADMIN_PRIVATE_KEY_ID,
  private_key: process.env.ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.ADMIN_CLIENT_EMAIL,
  client_id: process.env.ADMIN_CLIENT_ID,
  auth_uri: process.env.ADMIN_AUTH_URI,
  token_uri: process.env.ADMIN_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.ADMIN_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.ADMIN_CLIENT_X509_CERT_URL,
}
admin.initializeApp({
  credential: admin.credential.cert(serviceAccont),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

/**
 * Express-handlebars setup 
 */
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', exphbs({
  defaultLayout: 'layout',
  extname: '.hbs',
  partialsDir: 'views/partials',
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  helpers: {
    // Here we're declaring the #section that appears in layout/layout.hbs
    section(name, options) {
      if (!this._sections) this._sections = {};
      this._sections[name] = options.fn(this);
      return null;
    },
    // Compare logic
    compare(lvalue, rvalue, options) {
      if (arguments.length < 3) {
        throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
      }

      const operator = options.hash.operator || '==';
      const operators = {
        '==': function (l, r) { return l == r; },
        '===': function (l, r) { return l === r; },
        '!=': function (l, r) { return l != r; },
        '<': function (l, r) { return l < r; },
        '>': function (l, r) { return l > r; },
        '<=': function (l, r) { return l <= r; },
        '>=': function (l, r) { return l >= r; },
        'typeof': function (l, r) { return typeof l == r; }
      }
      if (!operators[operator]) {
        throw new Error(`Handlerbars Helper 'compare' doesn't know the operator ${operator}`);
      }
      const result = operators[operator](lvalue, rvalue);
      if (result) {
        return options.fn(this);
      }
      return options.inverse(this);
    },
    for(from, to, incr, block) {
      var accum = '';
      for (var i = from; i < to; i += incr)
        accum += block.fn(i);
      return accum;
    },
    round(value, decimalPlaces) {
      if (value !== null && value !== undefined)
        return value.toFixed(decimalPlaces);
      else
        return null;
    }
  }
}));

/**
 * Arquivos estáticos e estilos
 */
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));


app.use(logger('dev'));
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(session({
  secret: 'some-private-cpe-key',
  resave: true,
  saveUninitialized: true
}));
app.use(flash());
// app.use(methodOverride('_method'));



/**
 * Express setup 
 */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/expandingDivs', expandingdivsRouter);
app.use('/cardsAdmin', cardsAdminRouter);
app.use('/queue', queueRouter);
app.use('/requisition', requisitionRouter);
app.use('/stock', stockRouter);
app.use('/user', userRouter);
app.use('/homeAdmin', homeAdminRouter);
app.use('/search', searchRouter);
app.use('/analyst', analystRouter);
app.use('/sample', sampleRouter);
app.use('/record', recordRouter);
app.use('/profile', profileRouter);
app.use('/allkits', allkitsRouter);
app.use('/printtemplate', printtemplateRouter);
app.use('/calibrationcurves', calibrationcurvesRouter);
app.use('/allcalibrators', allcalibratorsRouter);
app.use('/allsamples', allsamplesRouter)
app.use('/report', reportRouter);
app.use('/previousmap', previousmapRouter);
app.use('/sampleresult', sampleresultRouter);
app.use('/statistics', statisticsRouter);
app.use('/covenant', covenantRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
