const Task = require('../models/Task');
const mongoose = require('mongoose'); // Nécessaire pour l'agrégation

// Récupère toutes les tâches avec filtre (status) et triage (name)
const getTasks = async (req, res) => {
    try {
        const { status, sort } = req.query; // Récupère les paramètres de requête

        let query = {};
        // 1. FILTRE par statut
        if (status && ['En cours', 'Terminée'].includes(status)) {
            query.status = status;
        }

        let sortOptions = {};
        // 2. TRIAGE par nom
        if (sort === 'name') {
            sortOptions.name = 1; // Tri par ordre alphabétique croissant
        } else {
            sortOptions.createdAt = -1; // Tri par défaut : plus récent en premier
        }

        const tasks = await Task.find(query).sort(sortOptions);
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ success: false, error: 'Erreur lors de la récupération des tâches.' });
    }
};

// Récupère le décompte des tâches par statut (pour les statistiques)
const getTaskCount = async (req, res) => {
    try {
        // Pipeline d'agrégation pour compter rapidement les tâches par statut
        const counts = await Task.aggregate([
            {
                $group: {
                    _id: "$status", // Grouper par le champ 'status'
                    count: { $sum: 1 } // Compter les documents dans chaque groupe
                }
            }
        ]);

        // Mise en forme des résultats pour le frontend
        const result = {
            total: 0,
            enCours: 0,
            terminee: 0,
        };

        counts.forEach(item => {
            if (item._id === 'En cours') result.enCours = item.count;
            if (item._id === 'Terminée') result.terminee = item.count;
            result.total += item.count;
        });

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: 'Erreur lors du calcul des statistiques.' });
    }
};

// Ajout d'une nouvelle tâche
const createTask = async (req, res) => {
    try {
        const task = await Task.create(req.body);
        res.status(201).json({ success: true, data: task });
    } catch (error) {
        res.status(400).json({ success: false, error: 'Erreur de validation ou de création.' });
    }
};

// Mettre à jour le statut d'une tâche
const updateTaskStatus = async (req, res) => {
    try {
        // Utiliser findByIdAndUpdate pour une mise à jour efficace
        const task = await Task.findByIdAndUpdate(
            req.params.id, 
            { status: req.body.status },
            { new: true, runValidators: true } // new: true retourne la tâche mise à jour
        );

        if (!task) {
            return res.status(404).json({ success: false, error: 'Tâche non trouvée.' });
        }
        res.status(200).json({ success: true, data: task });
    } catch (error) {
        res.status(400).json({ success: false, error: 'Erreur de mise à jour.' });
    }
};

// Suppression d'une tâche
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).json({ success: false, error: 'Tâche non trouvée.' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Erreur de suppression.' });
    }
};


module.exports = {
    getTasks,
    getTaskCount,
    createTask,
    updateTaskStatus,
    deleteTask,
};