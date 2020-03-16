const mongoose = require('mongoose')


const RatedResumeSchema = mongoose.Schema({
    _id : {
        type: mongoose.Schema.Types.ObjectId
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    approvedResume: {
        type: [{
            resumeId: Number,
            status: Boolean
        }],
        default : [],
        required: true
    }
})



const RatedResume = mongoose.model('RatedResume', RatedResumeSchema)
module.exports = RatedResume
