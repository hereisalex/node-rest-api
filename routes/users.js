const User = require("../models/User");
const router = require('express').Router();
const bcrypt = require('bcrypt');
//do all our user stuff inside this router


//update user
router.put('/:id', async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (err) {
                return res.status(500).json(err);
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            res.status(200).json('Account has been updated');
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("You can only update your own account!");
    }
});
//delete user
router.delete('/:id', async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json('Account has been deleted');
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("You can only delete your own account!");
    }
});
//get user
router.get("/:id", async (req, res) => {
    try {
        // look up user by user id 
        const user = await User.findById(req.params.id);
        // seperate 'other' from password, updated at (we don't need those)
        const { password, updatedAt, ...other} = user._doc
        // return the stuff from 'other'
        res.status(200).json(other);
    } catch (err) {
        res.status(500).json(err);
    }
})
//follow user
//unfollow user

module.exports = router

