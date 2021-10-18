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
  .get(protect, getPosts);
router.route('/:id').get(protect, getPost).delete(protect, deletePost);
router.route('/like/:id').put(protect, like);
router.route('/unlike/:id').put(protect, unlike);
router
  .route('/comment/:post_id')
  .put(
    protect,
    [check('text', 'Text is required').not().isEmpty()],
    createComment
  );
router.route('/comment/:post_id/:comment_id').delete(protect, deleteComment);

module.exports = router;
