const path = require('path');
const { Sequelize } = require('../models');
const { AxiosError } = require('axios');

global.GLOBAL_APP_ROOT = path.resolve(__dirname);
global.GLOBAL_APP_URL = process.env.APP_URL;
global.GLOBAL_API_URL = process.env.BASE_URL;

const responseSuccess = (res, code, data) => {
    switch (code) {
        case 200:
            res.status(200).send({
                code,
                data
            });
            break;
        case 201:
            res.status(201).send({
                code,
                data
            });
            break;
        case 202:
            res.status(202).send({
                code,
                data
            });
            break;
        case 203:
            res.status(203).send({
                code,
                data
            });
            break;
        case 204:
            res.status(204).send({
                code,
                data
            });
            break;
        case 205:
            res.status(205).send({
                code,
                data
            });
            break;
        case 206:
            res.status(206).send({
                code,
                data
            });
            break;
        default:
            res.status(200).send({
                code,
                data
            });
            break;
    }
};

const responseRequestError = (res, code, message, data = null) => {
    code = code.toString();

    switch (true) {
        case (code.includes(401)):
            res.status(401).send({
                code: code ?? 401,
                message,
                ...(data && { data })
            });
            break;
        case (code.includes(403)):
            res.status(403).send({
                code: code ?? 403,
                message,
                ...(data && { data })
            });
            break;
        case (code.includes(404)):
            res.status(404).send({
                code: code ?? 404,
                message,
                ...(data && { data })
            });
            break;
        case (code.includes(409)):
            res.status(409).send({
                code: code ?? 409,
                message,
                ...(data && { data })
            });
            break;
        case (code.includes(422)):
            res.status(422).send({
                code: code ?? 422,
                message,
                ...(data && { data })
            });
            break;
        default:
            res.status(400).send({
                code: code ?? 400,
                message,
                ...(data && { data })
            });
            break;
    }
};

const responseServerError = (res, code, message, error) => {
    code = code?.toString();

    switch (true) {
        case (code?.includes(503)):
            res.status(503).send({
                code: code ?? 503,
                message,
                ...(Boolean(error) && { data: error }),
            });
            break;
        default:
            res.status(500).send({
                code: code ?? 500,
                message: message ?? 'Internal service error',
                error
            });
    }
};

global.sendSuccess = (res, code, data) => {
    return responseSuccess(res, code, data);
}

global.sendError = (res, error) => {
    let parsedErrorCode = error.code?.toString().split('-')[0];

    if (Boolean(error.code) && ((parsedErrorCode >= 400 && parsedErrorCode < 500))) {
        return responseRequestError(res, error.code, error.message, error.data ?? null);
    }

    if (error instanceof Sequelize.BaseError) {
        let errorCode;
        switch (true) {
            case (error instanceof Sequelize.DatabaseError):
                errorCode = '500-A001';
                break;
            case (error instanceof Sequelize.ConnectionError):
                errorCode = '500-A002';
                break;
            default:
                errorCode = '500-A000';
        }

        return process.env.NODE_ENV == 'development' ?
            responseServerError(res, errorCode, error.message, error) :
            process.env.NODE_ENV == 'staging' ?
                responseServerError(res, errorCode, error.message) :
                responseServerError(res, errorCode, 'Internal server error');
    }

    if (error instanceof AxiosError) {
        console.log('raw error axios: ', error);
        console.log('response : ', error?.response?.data);
        return responseServerError(res, '503-A000', 'Service unavailable');
    }

    if (error.code == 'ENOENT') {
        return responseServerError(res, '500-B001', 'Internal service error');
    }

    if (parsedErrorCode == 503) {
        return responseServerError(res, error.code, error.message, error.data);
    }

    return process.env.NODE_ENV == 'development' ?
        responseServerError(res, error.code, error.message, error) :
        process.env.NODE_ENV == 'staging' ?
            responseServerError(res, error.code, error.message) :
            responseServerError(res, '500-0000', 'Internal service error');
}