const petModel = require("../model/petModel")
const reader = require("xlsx")
const mongoose = require("mongoose")

const file = reader.readFile("dogData.xlsx")


// .....................function for validation..............................

const isValid = function (value) {
    if (typeof value == undefined || value == null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true
}


// .....................................1st API (create pet).......................................

const createPet = function (req, res) {

    const sheets = file.SheetNames

    let data = []
    for (let i = 0; i < sheets.length; i++) {
        const sheetData = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]])

        sheetData.forEach((a) => {
            data.push(a)
        });
    }

    petModel.insertMany(...data)
        .then(function () {
            res.status(201).json({ status: true, message: "pet created successfully" })
        }).catch(function (error) {
            res.status(400).json({ error: error })
        })
}

// ............................2nd API (fetch all pets data)....................................

const getAllPets = async function (req, res) {
    try {
        const allPets = await petModel.find({ isDeleted: false, deletedAt: null })
        if (allPets.length == 0) {
            return res.status(404).send({ status: false, message: 'No pet present !' });
        }
        return res.status(200).send({ status: true, message: 'successfully fetched all pets', data: allPets });
    }
    catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}


// ..........................3rd API(fetch specific pet detail by id).............................

const getPetById = async function (req, res) {
    try {
        let petId = req.params.petId;
        const petData = await petModel.find({ petId: petId, isDeleted: false })

        if (!petData) {
            return res.status(400).send({ status: false, msg: "Pet you are looking for has already been deleted" })
        }
        return res.status(200).send({ status: true, data: petData })
    }
    catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}

// ............................4th API (Update specific pet details).................................

const updatePet = async function (req, res) {
    try {
        let petId = req.params.petId
        let data = req.body
        let filter = {}
        let petToBeModified = await petModel.findById(petId)
        if (petToBeModified) {
            if (Object.keys(data) != 0) {

                if (petToBeModified.isDeleted == false) {

                    if (isValid(data.name)) {
                        filter['name'] = data.name
                    }
                    if (isValid(data.type)) {
                        filter['type'] = data.type
                    }
                    if (isValid(data.breed)) {
                        filter['breed'] = data.breed
                    }
                    if (isValid(data.age)) {
                        filter['age'] = data.age
                    }

                    let updatePet = await petModel
                        .findOneAndUpdate({ _id: petId }, { name: data.name, type: data.type, breed: data.breed, age: data.age }, { new: true })

                    return res.status(202).send({ Status: "pet updated successfully", updatePet })

                }
                else {
                    return res.status(400).send({ ERROR: " requested pet has been deleted" })
                }
            }
        }

    }
    catch (err) {
        return res.status(500).send({ ERROR: err.message })
    }
}

// ......................5th API(Delete specific pet by id).....................................

const deletePetById = async function (req, res) {

    try {
        let petId = req.params.petId

        if (petId) {

            let petToBeDeleted = await petModel.findOneAndUpdate({ _id: petId },
                { $set: { isDeleted: true, deletedAt: Date.now() } })

            return res.status(200).send({ Status: true, msg: "Requested pet has been deleted." })

        } else {
            return res.status(400).send({ ERROR: 'BAD REQUEST' })
        }
    }
    catch (err) {
        return res.status(500).send({ ERROR: err.message })
    }
}

module.exports.createPet = createPet
module.exports.getAllPets = getAllPets
module.exports.getPetById = getPetById
module.exports.updatePet = updatePet
module.exports.deletePetById = deletePetById