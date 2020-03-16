const mongoose = require('mongoose')
const express = require('express')
const auth = require('../middlewares/auth')
const User = require('../models/User')

const router = express.Router()

router.post('/', async (req, res) => {
    try {
        const user = new User(req.body)
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).json({user, token})
    }
    catch(err) {
        res.status(400).send({message: err})
    }
})


router.post('/login', async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body

        const user = await User.findByCredentials(email, password)
        if (!user) {
            return res.status(401).send({
                message: 'Неверный логин или пароль'
            })
        }
        const token = await user.generateAuthToken()
        res.send({
            user,
            token
        })
    } catch (err) {
        res.status(500).json({message: 'Ошибка авторизации'})
    }
})

router.get('/me', auth, (req, res) => {
    res.send(req.user)
})

router.get('/me/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token != req.token
        })
        await req.user.save()
        res.send()
    }
    catch(err) {
        res.status(500).json({message: err})
    }
})

router.get('/all',async (req,res) => {
    try {
        const users = await User.find({}).select(['name', 'surname', 'email', 'isAdmin'])
        if(users.length) {
            res.status(200).json(users)
        }
        else {
            res.status(404).json({message: 'Пользователи не найдены'})
        }
    }
    catch(err) {
        res.status(500).json({message: err})
    }
})

router.delete('/:userId', async(req, res) => {
    try {
        const id = req.params.userId;
        const deletedUser = await User.remove({
            _id: id
        })
        if (deletedUser) {
            res.status(200).json(deletedUser)
        } else {
            res.status(404).json({
                message: "Неверный id пользователя"
            });
        }
    }
    catch(err) {
        res.status(500).json({message: err})
    }
})

router.post('/rated-resume', async(req,res) => {
    try {
        const userId = req.body.userId
        const resumeInfo = {
            id: req.body.resumeId,
            status: req.body.status
        }

        await User.findOneAndUpdate({_id: userId}, {$push: {approvedResume: resumeInfo}})
        res.status(200).json({message: 'Резюме успешно добавлено'})
    }
    catch(err) {
        res.status(500).json({message: err})
    }
})

module.exports = router
