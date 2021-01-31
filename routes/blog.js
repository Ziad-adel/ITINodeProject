const express = require('express');
const {
    create,
    getAll,
    getById,
    editOne,
    deleteBlog,
    getByAuthor,
    getByTags,
    getByTitle,
} = require('../controllers/blog');

const router = express.Router();

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }

})

const upload = multer({ storage: storage })



router.post('/', upload.single('blogsImg'), async(req, res, next) => {
    const { body, user: { id, firstName, lastName }, file: { path } } = req;

    try {
        console.log(req.file)
        const blog = await create({...body, userId: id, author: firstName + ' ' + lastName, blogsImg: path });
        debugger;
        console.log(req)
        res.json(blog);

    } catch (e) {
        debugger
        next(e);
    }
});
router.get('/', async(req, res, next) => {
    const { user: { id } } = req;
    try {
        debugger
        const blogs = await getAll({ userId: id });
        res.json(blogs);
        debugger
    } catch (e) {
        next(e);
    }
});
router.patch('/:id', async(req, res, next) => {
    const { params: { id }, body } = req;
    try {
        const blog = await editOne(id, body);
        res.json(blog);
    } catch (e) {
        next(e);
    }
});
router.get('/:id', async(req, res, next) => {
    const { params: { id }, body } = req;
    try {
        const blog = await getById(id, body);
        res.json(blog);
    } catch (e) {
        next(e);
    }
});
router.delete('/:id', async(req, res, next) => {
    const { params: { id }, body } = req;
    try {
        const blog = await deleteBlog(id, body);
        res.json(blog);
    } catch (e) {
        next(e);
    }
});
router.get('/author/:author', async(req, res, next) => {
    const { params: { author }, body } = req;
    try {
        debugger
        const blog = await getByAuthor({ author: author });
        res.json(blog);
    } catch (e) {
        next(e);
    }
});
router.get('/tags/:tags', async(req, res, next) => {
    const { params: { tags }, body } = req;
    try {
        debugger
        const blog = await getByTags({ tags: tags });
        res.json(blog);
    } catch (e) {
        next(e);
    }
});
router.get('/titles/:title', async(req, res, next) => {
    const { params: { title }, body } = req;
    try {
        debugger
        const blog = await getByTitle({ title: title });
        res.json(blog);
    } catch (e) {
        next(e);
    }
});

module.exports = router;