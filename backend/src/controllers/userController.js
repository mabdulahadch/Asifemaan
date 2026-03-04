// const userService = require("../services/userService");

/**
 * GET /api/users
 */
const getAllUsers = async (req, res, next) => {
    try {
        const { page, limit } = req.query;
        // const result = await userService.getAllUsers({ page, limit });

        res.status(200).json({
            success: true,
            // data: result,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/users/:id
 */
const getUserById = async (req, res, next) => {
    try {
        // const user = await userService.getUserById(req.params.id);

        res.status(200).json({
            success: true,
            // data: user,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * PUT /api/users/:id
 */
const updateUser = async (req, res, next) => {
    try {
        // const user = await userService.updateUser(req.params.id, req.body);

        res.status(200).json({
            success: true,
            message: "User updated successfully.",
            // data: user,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * DELETE /api/users/:id
 */
const deleteUser = async (req, res, next) => {
    try {
        // const result = await userService.deleteUser(req.params.id);

        res.status(200).json({
            success: true,
            // ...result,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
};
