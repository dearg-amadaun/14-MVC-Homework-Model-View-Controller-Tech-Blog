const express = require('express')
const router = express.Router()
const { Post, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', (req, res) => {
    Post.findAll({
        attributes: ['id', 'title', 'created_at', 'content'],
        order: [['created_at', 'DESC']],
        include: [
        {
          model: Comment,
          attributes: ['id', 'comment', 'user_id', 'post_id', 'created_at'],
          include: {
            model: User,
            attributes: ['username']
          }
        }, {
          model: User,
          attributes: ['username']
        },
      ]
    })
      .then(dbPostData => res.json(dbPostData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

  router.get('/:id', (req, res) => {
    Post.findOne({
      where: {
        id: req.params.id
      },
      attributes: ['id', 'title', 'created_at', 'content'],
      include: [
        {
          model: User,
          attributes: ['username']
        }, {
          model: Comment,
          attributes: ['id', 'comment', 'user_id', 'post_id', 'created_at'],
          include: {
            model: User,
            attributes: ['username']
          }
        }
      ]
    })
      .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post with this id' });
          return;
        }
        res.json(dbPostData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

router.post('/', withAuth, async (req, res) => {
    await Post.create({
      title: req.body.title,
      content: req.body.content,
      user_id: req.session.user_id
    })
      .then(dbPostData => res.json(dbPostData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

router.put('/:id', withAuth, (req, res) => {
    Post.update({
        title: req.body.title,
        content: req.body.content
      },
      {
        where: {
          id: req.params.id
        }
      })
      .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post with this id' });
          return;
        }
        res.json(dbPostData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

  router.delete('/:id', withAuth, async (req, res) => {
    try {
      const dbPostData = await Post.destroy({
        where: {
          id: req.params.id,
        },
      });
  
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with that id!' });
        return;
      }
  
      res.status(200).json(dbPostData);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  module.exports = router;