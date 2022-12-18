const router = require('express').Router();
const { Post, Comment, User } = require('../models');
const withAuth = require('../utils/auth');

// GET route to display all posts on the dashboard
router.get('/', withAuth, async (req, res) => {
    try {
        // Query the database to get all posts created by the logged in user, including associated user data
        const userPostsData = await Post.findAll({
            where: {
                user_id: req.session.user_id
            },
            include: [{ model: User }]
        });

        // Serialize the data so it can be passed to the template
        const userPosts = userPostsData.map((post) => post.get({ plain: true }));

        // Render the dashboard template, passing in the serialized data and a flag for whether the user is logged in
        res.render('dashboard', {
            userPosts,
            loggedIn: req.session.loggedIn
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET route to display a single post for editing
router.get('/update/:id', withAuth, async (req, res) => {
    try {
        // Query the database to get the post, including associated user data
        const singlePostData = await Post.findByPk(req.params.id, {
            include: [{ model: User }],
        });

        // Serialize the post data
        const singlePost = singlePostData.get({ plain: true });

        // Render the edit-post template, passing in the serialized post data and a flag for whether the user is logged in
        res.render('edit-post', {
            ...singlePost,
            loggedIn: req.session.loggedIn
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
