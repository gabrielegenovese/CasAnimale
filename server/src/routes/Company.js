const express = require("express");
const Company = require("../models/Company");
const jwt = require("../services/jwrUtils");
const router = express.Router();

/* Get all company list with query */
router.get("", async (req, res) => {
  try {
    const companies = await Company.find(req.query);
    var comp = [];
    companies.forEach((c) =>
      comp.push({
        _id: c._id,
        name: c.name,
        type: c.type,
        photo: c.photo,
        description: c.description,
        cost_per_hour: c.cost_per_hour,
        owner: c.owner,
        cities: c.cities,
        prenotation: c.prenotation,
        business_hours: c.business_hours,
        main_pets: c.main_pets,
        study_info: c.study_info,
        professional_experience: c.professional_experience,
        actual_jobs: c.actual_jobs,
        photo: c.photo,
      })
    );
    res.json(comp);
  } catch (e) {
    res.json({ message: e });
  }
});

/* Get an company's information with token (with email and passwd) */
router.get("/getInfo", async (req, res) => {
  try {
    jwt.authenticateToken(req, res, cont);

    async function cont() {
      const company = await Company.find({ _id: req.userid });
      res.json(company);
    }
  } catch (e) {
    res.json({ message: e });
  }
});

/* Get an company's information by id (without email and passwd) */
router.get("/:id", async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    res.json({
      _id: company._id,
      name: company.name,
      type: company.type,
      photo: company.photo,
      description: company.description,
      cost_per_hour: company.cost_per_hour,
      owner: company.owner,
      cities: company.cities,
      prenotation: company.prenotation,
      business_hours: company.business_hours,
      main_pets: company.main_pets,
      study_info: company.study_info,
      professional_experience: company.professional_experience,
      actual_jobs: company.actual_jobs,
      photo: company.photo,
    });
  } catch (e) {
    res.json({ message: e });
  }
});

/* Create a new company */
router.put("/new", async (req, res) => {
  try {
    const company = new Company({
      name: req.body.name,
      type: req.body.type,
      photo: req.body.photo,
      description: req.body.description,
      cost_per_hour: req.body.cost_per_hour,
      owner: req.body.owner,
      cities: req.body.cities,
      business_hours: req.body.business_hours,
      email: req.body.email,
      password: req.body.password,
      main_pets: req.body.main_pets,
      study_info: req.body.study_info,
      professional_experience: c.professional_experience,
      actual_jobs: req.body.actual_jobs,
      photo: req.body.photo,
    });
    await company.save();
    res.json({ message: "New company created!" });
  } catch (e) {
    res.json({ message: e });
  }
});

/* Delete a company */
router.delete("/:id", async (req, res) => {
  try {
    jwt.authenticateToken(req, res, cont);

    async function cont() {
      const removedCompany = await Company.findById(req.params.id);
      if (req.userid == removedCompany.owner) {
        // TODO da testare
        const msg = await Company.deleteOne({ _id: req.params.id });
        res.json(msg);
      }
    }
  } catch (e) {
    res.json({ message: e });
  }
});

/* Update company's infos */
router.post("/update", async (req, res) => {
  try {
    const updatedCompany = await Company.findOneAndUpdate(
      { _id: req.body.company_id },
      {
        name: req.body.name,
        type: req.body.type,
        photo: req.body.photo,
        description: req.body.description,
        cost_per_hour: req.body.cost_per_hour,
        owner: req.body.owner,
        cities: req.body.cities,
        prenotation: req.body.prenotation,
        email: req.body.email,
        password: req.body.password,
        main_pets: req.body.main_pets,
        study_info: req.body.study_info,
        professional_experience: req.body.professional_experience,
        actual_jobs: req.body.actual_jobs,
        photo: req.body.actual_jobs,
      }
    );
    res.json(updatedCompany);
  } catch (e) {
    res.json({ message: e });
  }
});

module.exports = router;
