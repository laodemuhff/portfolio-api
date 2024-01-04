var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var multer = require('multer');
var path = require('path');
var helmet = require('helmet');

require('dotenv').config();
require('./app/utils/response.util');
require('./app/utils/handler.util');

const app = express();
const indexRouter = require('./app/routers/index');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// security setup
const helmetConfig = require('./app/configs/helmet.config')[process.env.NODE_ENV];
app.use(helmet(helmetConfig));
app.disable('x-powered-by');
if (process.env.NODE_ENV != 'development') app.set('trust proxy', 1);

// generic setup
app.use(logger('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser(process.env.APP_SECRET));
app.use(express.static('./public'));
app.use('/', indexRouter);

// error handler
app.use(function (err, req, res, next) {
    let code = 500;

    if (err instanceof multer.MulterError) {
        err.message = `MulterError : ${err.message}`
        code = 400;
    }

    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    sendError(res, newError(err.message, err.status || code))
});

module.exports = app;