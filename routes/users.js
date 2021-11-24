const User = require("../models/User");
const router = require('express').Router();
const bcrypt = require('bcrypt');


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
        const { password, updatedAt, ...other } = user._doc
        // return the stuff from 'other'
        res.status(200).json(other);
    } catch (err) {
        res.status(500).json(err);
    }
})

//follow user

router.put("/:id/follow", async (req, res) => {
    //if the user to be followed is not the user who is following
    if (req.body.userId !== req.params.id) {
        try {
            //user to be followed
            const user = await User.findById(req.params.id);
            //user who is following
            const currentUser = await User.findById(req.body.userId);
            //if the following user is not already following the user to be followed
            if (!user.followers.includes(req.body.userId)) {
                //add the followed user to the followers array
                await user.updateOne({ $push: { followers: req.body.userId } });
                //add the following user to the followings array
                await currentUser.updateOne({ $push: { followings: req.params.id } });
                res.status(200).json("You are now following")

            } else {
                res.status(403).json("You are already following this user!");
            }
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        //if the users are the same user, return error
        res.status(403).json("You can't follow yourself!");
    }
})

//unfollow user

module.exports = router

router.put("/:id/unfollow", async (req, res) => {
    //if the user to be followed is not the user who is following
    if (req.body.userId !== req.params.id) {
        try {
            //user to be followed
            const user = await User.findById(req.params.id);
            //user who is following
            const currentUser = await User.findById(req.body.userId);
            //if the following user is not already following the user to be followed
            if (user.followers.includes(req.body.userId)) {
                //add the followed user to the followers array
                await user.updateOne({ $pull: { followers: req.body.userId } });
                //add the following user to the followings array
                await currentUser.updateOne({ $pull: { followings: req.params.id } });
                res.status(200).json("You are no longer following")

            } else {
                res.status(403).json("You were not following this user!");
            }
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        //if the users are the same user, return error
        res.status(403).json("You can't unfollow yourself!");
    }
})