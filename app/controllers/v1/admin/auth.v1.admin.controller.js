exports.getProfile = (req, res) => {
    try {
        const data = {
            name: 'Mr. La Ode Muhammad Farhan Fauzan',
            position: 'Middle Software Engineer'
        }
        return sendSuccess(res, 200, data);
    } catch (error) {
        return sendError(res, error);
    }
}