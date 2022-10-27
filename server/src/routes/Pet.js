const express = require("express");
const Pet = require("../models/Pet");
const jwt = require("../services/jwrUtils");
const router = express.Router();

/* Get all pet list */
router.get("", async (req, res) => {
  try {
    const pets = await Pet.find(req.query);
    res.json(pets);
  } catch (e) {
    res.json({ message: e });
  }
});

/* Get a pet by id */
router.get("/:id", async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    res.json(pet);
  } catch (e) {
    res.json({ message: e });
  }
});

/* Create a new pet */
router.put("/newPet", async (req, res) => {
  try {
    jwt.authenticateToken(req, res, cont);

    async function cont() {
      const product = new Product({
        name: req.body.name,
        species: req.body.species,
        owner: req.userid, // id of user
      });
      await product.save();
      res.json({ message: "New pet created!" });
    }
  } catch (e) {
    res.json({ message: e });
  }
});

/* Delete a pet */
router.delete("/:id", async (req, res) => {
  try {
    jwt.authenticateToken(req, res, cont);

    async function cont() {
      const removedPet = await Pet.findById(req.params.id);
      if (req.userid == removedPet.owner) {
        // TODO da testare
        const msg = await Post.deleteOne({ _id: req.params.id });
        res.json(msg);
      }
    }
  } catch (e) {
    res.json({ message: e });
  }
});

/* Update pet's infos */
router.post("/update", async (req, res) => {
  try {
    const updatedPet = await Post.findOneAndUpdate(
      { _id: req.body.pet_id },
      {
        name: req.body.name,
        species: req.body.species,
        owner: req.userid,
      }
    );
    res.json(updatedPet);
  } catch (e) {
    res.json({ message: e });
  }
});

module.exports = router;