const router = require('express').Router();
const { Post, Comment, User } = require('../../models');
const withAuth = require('../../utils/auth');

// GET route to display all posts on homepage
router.get('/', async (req, res) => {
    try {
        // Query the database to get all posts, including associated user data
        const allPostsData = await Post.findAll({
            include: [ { model: User } ],
        });

        // Serialize the data so it can be passed to the template
        const allPosts = allPostsData.map((post) => post.get({ plain: true }));

        // Render the all-posts template, passing in the serialized data and a flag for whether the user is logged in
        res.render('all-posts', {
            allPosts,
            loggedIn: req.session.loggedIn
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET route to display a single post with its comments
router.get('/post/:id', withAuth, async (req, res) => {
    try {
        // Query the database to get all comments for the post, including associated user and post data
        const commentsData = await Comment.findAll({
            where: {
                post_id: req.params.id 
            },
            include: [ { model: User }, { model: Post }]
        });

        // Query the database to get the post, including associated user data
        const singlePostData = await Post.findByPk(req.params.id, {
            include: [ { model: User } ],
        });
        
        // Serialize the post data
        const singlePost = singlePostData.get({ plain: true });

        // Serialize the comments data
        const comments = commentsData.map((comment) => comment.get({ plain: true }));

        // Render the single-post template, passing in the serialized post and comments data, as well as a flag for whether the user is logged in
        res.render('single-post', {
            ...singlePost,
            comments,
            loggedIn: req.session.loggedIn
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET route to display the login page
router.get('/login', (req, res) => {
    // Redirect to the homepage if the user is already logged in
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    // Otherwise, render the login template
    res.render('login');
});

// GET route to display the signup page
router.get('/signup', (req, res) => {
    // Redirect to the homepage if the user is already logged in
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    // Otherwise, render the signup template
    res.render
('signup');
});

module.exports = router;
