const express = require('express');

const { protect } = require('../../middleware/auth');
const { check } = require('express-validator');
const {
  createPost,
  getPosts,
  getPost,
  deletePost,
  like,
  unlike,
  createComment,
  deleteComment,
} = require('../../controllers/posts');

const router = express.Router();
router
  .route('/')
  .post(
    protect,
    [check('text', 'Text is required').not().isEmpty()],
    createPost
  )
  .get(getPosts);
router.route('/:id').get(protect, getPost).delete(protect, deletePost);
router.route('/like/:id').put(protect, like);
router.route('/unlike/:id').put(protect, unlike);
router
  .route('/:post_id/comment')
  .put(
    protect,
    [check('text', 'Text is required').not().isEmpty()],
    createComment
  );
router.route('/:post_id/comment/:comment_id').delete(protect, deleteComment);

module.exports = router;
