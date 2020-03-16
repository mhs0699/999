const express = require('express')
const RatedResume = require('../models/RatedResume')
const mongoose = require('mongoose')

const router = express.Router()

router.post('/', async (req, res) => {
    try {
        const userId = req.body.userId
        const resumeInfo = {
            resumeId: req.body.resumeId,
            status: req.body.status
        }

        const usersResume = await RatedResume.findOne({userId: userId})
        console.log(usersResume)
        if (usersResume) {
            console.log(userId, resumeInfo)
            const result = await RatedResume.findOneAndUpdate({userId: userId}, {
                $push: {
                    approvedResume: resumeInfo
                }
            })
            res.status(200).json({message: result})
        } else {
            const user = new RatedResume({
                _id: new mongoose.Types.ObjectId(),
                userId: userId,
                approvedResume: [
                    {
                        resumeId: req.body.resumeId,
                        status: req.body.status
                    }
                ]
            })
            const result = await user.save()
            res.status(201).json(result)
        }
    } catch (err) {
        res.status(500).json({message: err})
    }
})

router.get("/:userId", async (req, res) => {
    try {
        const id = req.params.userId;
        const usersResume = await RatedResume.findOne({userId: id})
        if (usersResume) {
            res.status(200).json(usersResume);
        } else {
            res.status(404).json({
                message: "Ничего не найдено"
            });
        }
    } catch (err) {
        res.status(500).json({message: err})
    }
})

module.exports = router
