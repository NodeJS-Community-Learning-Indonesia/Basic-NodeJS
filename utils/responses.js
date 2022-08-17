const success = (res, data, msg, code = 200) => {
    return res.status(code).json({
        success: true,
        data,
        msg,
        code,
    });
};

const error = (res, data, msg, code = 400) => {
    return res.status(code).json({
        success: false,
        data,
        msg,
        code,
    });
};

module.exports = {
    success,
    error,
};
