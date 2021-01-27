const express = require('express');
const router = express.Router();
const {check, body, validationResult} = require('express-validator')
const auth = require('../../middleware/auth')
const User = require ("../../models/User")
const Profile = require ('../../models/Profile');
const Post = require ('../../models/Posts');

// @route   POST api/Posts
// @desc    Create a Post
// @acess   Private
router.post('/', [auth, [
  check('text', "text is required").not().isEmpty()
]], async (req,res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {return res.status(400).json({errors: errors.array()})}

  try {
    const user = await User.findById(req.user.id).select('-password');

    const newPost = new Post ({text: req.body.text,name: user.name,
      avatar: user.avatar, user: req.user.id});
    const post = await newPost.save();
    
    res.json(post);
    
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error")
  }
});

// @route   GET api/Posts
// @desc    Get all Post
// @acess   Private
router.get('/', auth, async (req,res) => {
  try {
    const posts = await Post.find().sort({date: -1});
    res.json(posts);    
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error")
  }

});

// @route   GET api/Posts/:id
// @desc    Get a Post by id
// @acess   Private
router.get('/:id', auth, async (req,res) => {
  try {
    const post = await Post.findById(req.params.id);
    if(!post) {return res.status(404).json({msg: 'Post not found'})}
    res.json(post);    
  } catch (error) {
    console.error(error.message);
     if(error.kind === 'ObjectId') {return res.status(404).json({msg: 'Post not found'})}
    res.status(500).send("Server Error")
  }

});

// @route   DELETE api/Posts/:id
// @desc    Get a Post by id
// @acess   Private
router.delete('/:id', auth, async (req,res) => {
  try {
    const post = await Post.findById(req.params.id);
    //Check if post exists, then if loged in user matches post user, then remove
    if(!post) {return res.status(404).json({msg: 'Post not found'})}

    if (post.user.toString() !== req.user.id){ return res.status(401).json({msg: "User Not Authorized"})}

    await post.remove();

    res.json({msg: "Post removed"});    

  } catch (error) {
    console.error(error.message);
     if(error.kind === 'ObjectId') {return res.status(404).json({msg: 'Post not found'})}
    res.status(500).send("Server Error")
  }
});

// @route   PUT api/Posts/:id
// @desc    UPDATE a post
// @acess   Private
router.put('/:id', [auth, [
  check('text', "text is required").not().isEmpty()
]], async (req,res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {return res.status(400).json({errors: errors.array()})}
  try {
    const post = await Post.findById(req.params.id);
    //Check if post exists, then if loged in user matches post user, then remove
    if(!post) {return res.status(404).json({msg: 'Post not found'})}

    if (post.user.toString() !== req.user.id){ return res.status(401).json({msg: "User Not Authorized"})}
    post.text = req.body.text;
    await post.save();

    res.json(post);    

  } catch (error) {
    console.error(error.message);
     if(error.kind === 'ObjectId') {return res.status(404).json({msg: 'Post not found'})}
    res.status(500).send("Server Error")
  }
});

// @route   PUT api/Posts/like/:id
// @desc    Like a post
// @acess   Private
router.put ('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.like.filter(like => like.user.toString() === req.user.id).length > 0) { return res.status(401).json({msg: "Post Already Liked"})} 
    post.like.unshift({user: req.user.id});
    await post.save();
    res.json(post.like)
  } catch (error) {
    console.error(error.message);
    if(error.kind === 'ObjectId') {return res.status(404).json({msg: 'Post not found'})}
    res.status(500).send("Server Error")
  }
});

// @route   PUT api/Posts/unlike/:id
// @desc    Like a post
// @acess   Private
router.put ('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.like.filter(like => like.user.toString() === req.user.id).length === 0) { return res.status(401).json({msg: "Post not liked"})} 
    
    const removeIdx = post.like.map(like => like.user.toString()).indexOf(req.user.id);
    post.like.splice(removeIdx,1)

    await post.save();
    res.json(post.like);

  } catch (error) {
    console.error(error.message);
    if(error.kind === 'ObjectId') {return res.status(404).json({msg: 'Post not found'})}
    res.status(500).send("Server Error")
  }
});

// @route   PUT api/Posts/comment/:id
// @desc    Comment on a post
// @acess   Private

router.post('/comment/:id', [auth, [
  check('text', "text is required").not().isEmpty()
]], async (req,res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {return res.status(400).json({errors: errors.array()})}

  try {
    const user = await User.findById(req.user.id).select('-password');
    const post = await Post.findById(req.params.id);

    const newComment = {text: req.body.text,name: user.name,
      avatar: user.avatar, user: req.user.id};

    post.comments.unshift(newComment);  
    await post.save();
    
    res.json(post.comments);
    
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error")
  }
});

// @route   DELETE api/Posts/comment/:id/:comment_id
// @desc    Delete a comment on a post
// @acess   Private

router.delete ('/comment/:id/:comment_id', auth, async (req, res) =>{
  try {
    const post = await Post.findById(req.params.id);

    const comment = post.comments.find(comment => comment.id === req.params.comment_id);

    if (!comment) { return res.status(404).json({msg: "comment not found"})}

    //check user, only commenter or original poster can delete a comment
    const commentByUser = comment.user.toString() === req.user.id;
    const postByUser = post.user.toString() !== req.user.id
    if(commentByUser || postByUser) { 
      const removeIdx = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id);
      post.comments.splice(removeIdx,1)
      await post.save();
      res.json(post.comments);}
    else {
      return res.status(401).json({msg: "You cannot delete this comment"})

    }       
      
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error")
  }
});

// @route   PUT api/Posts/comment/:id/:comment_id
// @desc    update a comment
// @acess   Private

router.put ('/comment/:id/:comment_id', [auth, [
  check('text', "text is required").not().isEmpty()
]], async (req, res) =>{
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {return res.status(400).json({errors: errors.array()})}
    const post = await Post.findById(req.params.id);

    const comment = post.comments.find(comment => comment.id === req.params.comment_id);

    if (!comment) { return res.status(404).json({msg: "comment not found"})}

    //check user, only commenter or original poster can delete a comment
    const commentByUser = comment.user.toString() === req.user.id;
    const user = await User.findById(req.user.id).select('-password');
    if(commentByUser) { 
      const Idx = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id);
      const updatedComment = {text: req.body.text,name: user.name,
      avatar: user.avatar, user: req.user.id}
      post.comments.splice(Idx, 1, updatedComment) 
      await post.save();
      res.json(post.comments);}
    else {
      return res.status(401).json({msg: "You cannot update this comment"})

    }       
      
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error")
  }
});

module.exports = router;