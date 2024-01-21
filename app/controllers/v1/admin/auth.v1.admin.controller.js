exports.getProfile = (req, res) => {
    try {
        const data = {
            name: 'La Ode Muhammad Farhan Fauzan',
            position: 'Senior Software Engineer'
        }
        return sendSuccess(res, 200, data);
    } catch (error) {
        return sendError(res, error);
    }
}