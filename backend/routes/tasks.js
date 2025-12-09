const express = require('express');
const router = express.Router();
const { 
    getTasks, 
    getTaskCount, 
    createTask, 
    updateTaskStatus, 
    deleteTask 
} = require('../controllers/taskController');

// /api/tasks
router.route('/')
    .get(getTasks) // GET avec filtres/triage
    .post(createTask); // CREATE

// /api/tasks/count
router.get('/count', getTaskCount); // STATS

// /api/tasks/:id
router.route('/:id')
    .put(updateTaskStatus) // UPDATE 
    .delete(deleteTask); // DELETE

module.exports = router;