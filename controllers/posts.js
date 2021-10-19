const { validationResult } = require('express-validator');
const User = require('../models/User');
const Post = require('../models/Post');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const validationResultHandler = require('../utils/validationResultHandler');

// @route   POST api/posts
// @desc    Create a post
// @access  private
exports.createPost = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(validationResultHandler(errors));
  }
  const user = await User.findById(req.user.id).select('-password');
  const post = new Post({
    user: req.user.id,
    text: req.body.text,
    name: user.name,
    avatar: user.avatar,
  });
  const savedPost = await post.save();
  res.json(savedPost);
});

// @route   GET api/posts
// @desc    Get all posts
// @access  Public
exports.getPosts = asyncHandler(async (req, res, next) => {
  const posts = await Post.find().sort({ date: -1 }); //-1 means descending
  console.log(posts);
  res.json(posts);
});

// @route   GET api/posts/:id
// @desc    Get post by id
// @access  private
exports.getPost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id).sort({ date: -1 }); //-1 means descending
  if (!post) {
    return next(new ErrorResponse('NotFoundError', 404, ['Post not found']));
  }
  res.json(post);
});

// @route   DELETE api/posts/:id
// @desc    Delete post by id
// @access  private
exports.deletePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return next(new ErrorResponse('NotFoundError', 404, ['Post not found']));
  }
  if (post.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse('AuthorizeError', 401, ['User not authorized'])
    );
  }
  await post.remove();
  res.json({ msg: 'post removed!!!' });
});

// @route   PUT api/posts/like/:id
// @desc    Update like to post
// @access  private
exports.like = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  // check if post has already been liked by current user
  const isLiked =
    post.likes.filter((like) => like.user.toString() === req.user.id).length >
    0;

  //length > 0 means that post is already liked
  if (isLiked) {
    return next(new ErrorResponse('LogicError', 400, ['Post already liked']));
  }
  post.likes.unshift({ user: req.user.id });
  await post.save();
  res.json(post.likes);
});

// @route   PUT api/posts/unlike/:id
// @desc    Update unlike to post
// @access  private
exports.unlike = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  // check if post has been liked by current user
  const isNotLiked =
    post.likes.filter((like) => like.user.toString() === req.user.id).length ==
    0;

  //length = 0 means that post isn't liked yet
  if (isNotLiked) {
    return next(
      new ErrorResponse('LogicError', 400, ['Post has not been liked yet'])
    );
  }
  const removeIndex = post.likes
    .map((like) => like.user.toString())
    .indexOf(req.user.id);
  post.likes.splice(removeIndex, 1);
  await post.save();
  res.json(post.likes);
});

// @route   POST api/posts/comment/:post_id
// @desc    Create a comment on a post
// @access  private
exports.createComment = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(validationResultHandler(errors));
  }
  const user = await User.findById(req.user.id).select('-password');
  const post = await Post.findById(req.params.post_id);
  const comment = {
    user: req.user.id,
    text: req.body.text,
    name: user.name,
    avatar: user.avatar,
  };
  post.comments.unshift(comment);
  const savedPost = await post.save();
  res.json(savedPost.comments);
});

// @route   DELETE api/posts/comment/:post_id/:comment_id
// @desc    Delete a comment on a post
// @access  private
exports.deleteComment = asyncHandler(async (req, res, next) => {
  //Get the post by id and check exists
  const post = await Post.findById(req.params.post_id);
  if (!post) {
    return next(new ErrorResponse('NotFoundError', 404, ['Post not found']));
  }
  //Pull out the comment and check exists
  const comment = post.comments.find((cmt) => cmt.id === req.params.comment_id);
  if (!comment) {
    return next(new ErrorResponse('NotFoundError', 404, ['Comment not found']));
  }
  //Check user authorization to delete
  if (comment.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse('AuthorizeError', 401, ['User not authorized'])
    );
  }
  //Delete comment
  const removeIndex = post.comments
    .map((cmt) => cmt.id)
    .indexOf(req.params.comment_id);
  post.comments.splice(removeIndex, 1);
  await post.save();
  res.json(post.comments);
});
