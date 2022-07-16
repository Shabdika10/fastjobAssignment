const express = require('express');
const router = express.Router();


const petController = require('../controller/petController');


router.post('/api/pet', petController.createPet);
router.get('/api/pet',petController.getAllPets)
router.get('/api/pet/:petId',petController.getPetById)
router.patch('/api/pet/:petId',petController.updatePet)
router.delete('/api/pet/:petId',petController.deletePetById)


module.exports = router;