const mongoose = require('mongoose');

const { Schema } = mongoose;

const blogsSchema = new Schema({
    title: {
        type: String,
        maxLength: 256,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    author: {
        type: String,
    },
    tags: [String],
    blogsImg: {
        type: String,
        required: true,

    },
    createdDate: {
        type: Date,
        default: new Date().toISOString(),
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
});

const blogModel = mongoose.model('blog', blogsSchema);

module.exports = blogModel;