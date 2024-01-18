exports.getProfile = (req, res) => {
    try {
        const data = {
            name: 'Prof. Dr. La Ode Muhammad Farhan Fauzan',
            position: 'Middle Software Engineer'
        }
        return sendSuccess(res, 200, data);
    } catch (error) {
        return sendError(res, error);
    }
}