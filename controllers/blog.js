const Blog = require('../models/Blog');

const create = (blog) => Blog.create(blog);

const getAll = (query) => Blog.find(query).exec();

const getById = (id) => Blog.findById(id).exec();

const editOne = (id, body) => Blog.findByIdAndUpdate(id, body, { new: true }).exec();
const deleteBlog = (id) => Blog.findByIdAndRemove(id).exec();
const getByTitle = (query) => Blog.find(query).exec();
const getByTags = (query) => Blog.find(query).exec();
const getByAuthor = (query) => Blog.find(query).exec();
const getNewest = () => Blog.find({}).sort([
    ['createdDate', -1]
]).exec();
module.exports = {
    create,
    getAll,
    getById,
    editOne,
    deleteBlog,
    getByTitle,
    getByAuthor,
    getByTags,
    getNewest,

};