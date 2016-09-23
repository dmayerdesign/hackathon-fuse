const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
	authorId: {type: String},
	title: {type: String, index: true},
	content: {type: String, index: true},
	featuredImage: String,
	likes: Number,
	org: {type: String, index: true},
	dateCreated: {type: Date, default: Date.now()},
	imageBucket: String
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;