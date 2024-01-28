exports.getProfile = (req, res) => {
    try {
        const data = {
            name: 'La Ode Muh. Farhan Fauzan',
            position: 'Software Engineer'
        }
        return sendSuccess(res, 200, data);
    } catch (error) {
        return sendError(res, error);
    }
}