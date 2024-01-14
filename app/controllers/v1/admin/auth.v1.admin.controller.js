exports.getProfile = (req, res) => {
    try {
        const data = {
            name: 'La Ode Muhammad Farhan Fauzan. S.Kom, M.Kom',
            position: 'Middle Software Engineer'
        }
        return sendSuccess(res, 200, data);
    } catch (error) {
        return sendError(res, error);
    }
}