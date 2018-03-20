const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


const { ensureAuthenticated } = require('../helpers/auth');


//load model
require('../Models/Idea');
const Idea = mongoose.model('ideas');


//Ideas index page
router.get('/', ensureAuthenticated, (req, res) => {

    Idea.find({ user: req.user.id })
        .sort({ date: 'desc' })
        .then(ideas => {
            res.render('ideas/index', {
                ideas: ideas
            });
        })
});

//Add Idea route
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('ideas/add');
});


//Edit Idea route
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            if (idea.user != req.user.id) {
                req.flash('error-msg', 'Not Authorized');
                res.redirect('/ideas');
            } else {
                res.render('ideas/edit', {
                    idea: idea
                });
            }
           
        });

});

//Edit form process
router.put('/:id', ensureAuthenticated, (req, res) => {

    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            //new values
            idea.title = req.body.title,
                idea.details = req.body.details

            idea.save()
                .then(idea => {
                    req.flash('success-msg', 'Video Idea Updated');
                    res.redirect('/ideas');
                }
                )
        });
});

//process Add form
router.post('/', ensureAuthenticated, (req, res) => {

    let errors = [];
    if (!req.body.title) {
        errors.push({ text: 'please enter the title' });
    }
    if (!req.body.details) {
        errors.push({ text: 'please enter the details' });
    }

    if (errors.length > 0) {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details,
            user: req.user.id
        }
        new Idea(newUser)
            .save()
            .then(idea => {
                req.flash('success-msg', 'Idea Added');
                res.redirect('/ideas')
            });
    }
});

//Delete idea
router.delete('/:id', ensureAuthenticated, (req, res) => {
    Idea.remove({ _id: req.params.id })
        .then(() => {
            req.flash('success-msg', 'Video Idea Deleted');
            res.redirect('/ideas');
        })

});




















module.exports = router;