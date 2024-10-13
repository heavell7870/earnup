export const catchAsync = (requestHandler) => {
    return async (req, res, next) => {
        try {
            await requestHandler(req, res, next)
        } catch (error) {
            next(error)
        }
    };
};