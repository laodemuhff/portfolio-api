exports.getProfile = (req, res) => {
    try {
        const data = {
            name: 'Muhammad Nursalli',
            position: 'DevOps Engineer'
        }
        return sendSuccess(res, 200, data);
    } catch (error) {
        return sendError(res, error);
    }
}