const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const asyncSign = promisify(jwt.sign);

const User = require('../models/User');

const create = (user) => User.create(user);

const login = async({ username, password }) => {
    // get user from DB
    const user = await User.findOne({ username }).exec();
    if (!user) {
        throw Error('UN_AUTHENTICATED');
    }
    const isVaildPass = user.validatePassword(password);
    if (!isVaildPass) {
        throw Error('UN_AUTHENTICATED');
    }
    const token = await asyncSign({
        username: user.username,
        id: user.id,
    }, 'SECRET_MUST_BE_COMPLEX', { expiresIn: '1d' });
    return {...user.toJSON(), token };
    // match input password with user data using bcrypt
};

const getAll = () => User.find({}).exec();

const editOne = (id, data) => User.findByIdAndUpdate(id, data, { new: true }).exec();
const findone = (id) => User.findById(id).exec();
const follow = (userid, followid) => {
    User.findByIdAndUpdate(userid, { $addToSet: { following: followid } }, { new: true }).exec()
    User.findByIdAndUpdate(followid, { $addToSet: { follower: userid } }, { new: true }).exec()

    return ("status:followed")
}
const unfollow = (userid, followid) => {
    User.findByIdAndUpdate(userid, { $pull: { following: followid } }, { new: true }).exec()
    User.findByIdAndUpdate(followid, { $pull: { follower: userid } }, { new: true }).exec()
    return ("status:unfollowe")
}
const getfollowers = async(id) => {
    const { followers } = await getById(id)
    return User.find().where('_id').in(followers).exec();
}
const getfollowing = async(id) => {
    const { following } = await getById(id)
    return User.find().where('_id').in(following).exec();
}
module.exports = {
    create,
    login,
    getAll,
    editOne,
    findone,
    follow,
    unfollow,
    getfollowers,
    getfollowing,
};