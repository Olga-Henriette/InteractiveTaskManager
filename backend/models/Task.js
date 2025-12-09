const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Le nom de la tâche est requis'],
        trim: true,
        maxlength: [100, 'Le nom ne peut excéder 100 caractères']
    },
    status: {
        type: String,
        enum: ['En cours', 'Terminée'],
        default: 'En cours',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Task', TaskSchema);