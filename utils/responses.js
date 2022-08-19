const success = (res, data, msg, code = 200) => {
    return res.status(200).json({
        success: true,
        data,
        msg,
        code,
    });
};

const error = (res, msg, data = "", code = 400) => {
    return res.status(200).json({
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
