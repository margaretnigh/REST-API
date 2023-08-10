const express = require('express');
const router = express.Router();
const Subscriber = require('../models/subscriber');


// Getting all subscribers
router.get('/', async (req, res) => {
    try {
        const subscribers = await Subscriber.find();
        res.json(subscribers);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

// Getting one subscriber
router.get('/:id', getSubscriber, (req, res) => {
    res.json(req.subscriber);
});

// Creating a new subscriber
router.post('/', async (req, res) => {
    const subscriber = new Subscriber({
        name: req.body.name,
        subscribedToChannel: req.body.subscribedToChannel
    })
    try {
        const newSubscriber = await subscriber.save();
        res.status(201).json(newSubscriber);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});

// Updating a subscriber
router.patch('/:id', getSubscriber, async (req, res) => {
    if (req.body.name != null) {
        res.subscriber.name = req.body.name;
    }
    if (req.body.subscribedToChannel != null) {
        res.subscriber.subscribedToChannel = req.subscriber.save();
    }
    try {
        const updatedSubscriber = await res.subscriber.save();
        res.json(updatedSubscriber);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});

// Delete a subscriber
router.delete('/:id', getSubscriber, async (req, res) => {
    try {
        await res.subscriber.remove();
        res.json({message: 'Deleted subscriber'});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

//middleware
async function getSubscriber(req, res, next) {
    let subscriber
    try {
        subscriber = await Subscriber.findById(req.params.id);
        //if subscriber doesnt exist
        if (subscriber == null) {
            return res.status(404).json({message: 'Cannot find subscriber'});
        }
    } catch (err) {
        return res.status(500).json({message: err.message});
    }
    res.subscriber = subscriber;
    next();
}


module.exports = router;