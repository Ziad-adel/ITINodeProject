const express = require('express');
const {
    create,
    login,
    getAll,
    editOne,
    findone,
    follow,
    unfollow,
    getfollowers,
    getfollowing,
} = require('../controllers/user');
const authMiddleware = require('../Middlewares/auth');
const User = require('../models/User');


const router = express.Router();

router.post('/', async(req, res, next) => {
    const { body } = req;
    try {
        const user = await create(body);
        res.json(user);
    } catch (e) {
        next(e);
    }
});

router.post('/login', async(req, res, next) => {
    const { body } = req;
    try {
        const user = await login(body);
        res.json(user);
    } catch (e) {
        next(e);
    }
});

router.get('/', async(req, res, next) => {
    try {
        const users = await getAll();
        res.json(users);
    } catch (e) {
        next(e);
    }
});

router.patch('/:id', async(req, res, next) => {
    const { params: { id }, body } = req;
    try {
        const users = await editOne(id, body);
        res.json(users);
    } catch (e) {
        next(e);
    }
});
router.post("/follow/:id", authMiddleware, (req, res, next) => {
    if (req.user.id === req.params.user_id) {
        return res.status(400).json({ alreadyfollow: "You cannot follow yourself" })
    }

    User.findById(req.params.id)
        .then(user => {
            console.log(user)
                // check if the requested user is already in follower list of other user then 

            if (user.followers.filter(follower =>
                    follower.user.toString() === req.user.id).length > 0) {
                return res.status(400).json({ alreadyfollow: "You already followed the user" })
            }

            user.followers.unshift({ user: req.user.id });
            user.save()
            User.findOne({ username: req.user.username })
                .then(user => {
                    console.log(user)
                    user.following.unshift({ user: req.params.user_id });
                    user.save().then(user => res.json(user))
                })
                .catch(err => res.status(404).json({ alradyfollow: "you already followed the user" }))
        })

})


router.put('/unfollow/:unfollowId', authMiddleware, (req, res) => {
    User.findByIdAndUpdate(req.params.unfollowId, {
        $pull: { followers: req.user._id }
    }, {
        new: true
    }, (err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        }
        User.findByIdAndUpdate(req.user._id, {
            $pull: { following: req.params.unfollowId }

        }, { new: true }).select("").then(result => {
            res.json(result)
        }).catch(err => {
            return res.status(422).json({ error: err })
        })

    })
});


module.exports = router;