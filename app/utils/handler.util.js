global.newError = (message, code, data = null) => {
    const error = new Error(message);
    error.code = code;
    error.data = data;

    return error;
}