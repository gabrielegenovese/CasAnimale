const express = require("express");
const Prenotation = require("../models/Prenotation");
const Company = require("../models/Company");
const jwt = require("../services/jwtUtils");
const User = require("../models/User");
const { text } = require("express");
const router = express.Router();

function addHours(numOfHours, str) {
  var date = new Date(str);
  date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000);
  return date;
}

function dateOverlaps(a_start, a_end, b_start, b_end) {
  if (a_start < b_start && b_start < a_end) return true; // b starts in a
  if (a_start < b_end && b_end < a_end) return true; // b ends in a
  if (b_start < a_start && a_end < b_end) return true; // a in b
  return false;
}

function checkDateAndWorkingHours(d1, d2) {
  var date = new Date(d2.start);
  if (date.getHours() < d1.business_hours.start) return true;
  if (date.getHours() > d1.business_hours.end) return true;
  if (addHours(d2.duration, d2.start).getHours() > d1.business_hours.end)
    return true;
  return false;
}

async function isDateInWorkingHours(req, res) {
  const company = await Company.find({ _id: req.body.company });
  if (checkDateAndWorkingHours(company[0], req.body)) {
    res.json({
      message: "Error: the company is not open at this hour",
    });
    return true;
  }
  return false;
}

function isDurationNegative(req, res) {
  if (req.body.duration < 0) {
    res.json({
      message: "Error: negative duration",
    });
    return true;
  }
  return false;
}

async function arePrenotationsOverlaping(req, res) {
  const companyPrenotation = await Prenotation.find({
    company: req.body.company,
  });
  for (const p of companyPrenotation) {
    if (
      dateOverlaps(
        p.start,
        addHours(p.duration, p.start),
        req.body.start,
        addHours(req.body.duration, req.body.start)
      )
    ) {
      res.json({
        message: "Error: selected time overlaps with another reservation",
      });
      return true;
    }
  }
  return false;
}

async function isPlaceCorrect(req, res) {
  if (req.body.place === "online") return true;

  const company = await Company.find({ _id: req.body.company });
  const compCities = company[0].cities;

  const day = new Date(req.body.start);

  switch (day.getDay()) {
    case 1:
      if (compCities.monday !== req.body.place) {
        res.json({ message: "Choose the right place" });
        return false;
      }
      break;
    case 2:
      if (compCities.tuesday !== req.body.place) {
        res.json({ message: "Choose the right place" });
        return false;
      }
      break;
    case 3:
      if (compCities.wednesday !== req.body.place) {
        res.json({ message: "Choose the right place" });
        return false;
      }
      break;
    case 4:
      if (compCities.thursday !== req.body.place) {
        res.json({ message: "Choose the right place" });
        return false;
      }
      break;
    case 5:
      if (compCities.friday !== req.body.place) {
        res.json({ message: "Choose the right place" });
        return false;
      }
      break;
    default:
      res.json({ message: "something went wrong" });
      return false;
  }
  return true;
}

router.get("", async (req, res) => {
  try {
    const prenotation = await Prenotation.find(req.query);
    res.json(prenotation);
  } catch (e) {
    res.json({ message: e });
  }
});

/* Get all prenotation of a company using jwt */
router.get("/company", async (req, res) => {
  try {
    jwt.authenticateToken(req, res, cont);

    async function cont() {
      const prenotation = await Prenotation.find({ company: req.userid });
      res.json(prenotation);
    }
  } catch (e) {
    res.json({ message: e });
  }
});

/* Create a new prenotation */
router.put("/new", async (req, res) => {
  try {
    jwt.authenticateToken(req, res, cont);

    async function cont() {
      if (
        isDurationNegative(req, res) ||
        (await isDateInWorkingHours(req, res)) ||
        !(await isPlaceCorrect(req, res)) ||
        (await arePrenotationsOverlaping(req, res))
      ) {
        console.log("Somethig went wrong...");
        return;
      }

      const prenotation = new Prenotation({
        company: req.body.company,
        place: req.body.place,
        start: req.body.start,
        claimed: false,
        duration: req.body.duration,
        text: req.body.text,
        user: req.userid,
      });
      await prenotation.save();
      res.json({ message: "Prenotation created succesfully!" });
    }
  } catch (e) {
    res.json({ message: e });
  }
});

/* Delete a prenotation */
router.delete("/:id", async (req, res) => {
  try {
    jwt.authenticateToken(req, res, cont);

    async function cont() {
      const oldPr = await Prenotation.findById(req.params.id);
      const usr = await User.findById(oldPr.user);

      var msg =
        "The prenotation on " +
        oldPr.start.toISOString().substring(0, 10) +
        " in " +
        oldPr.place +
        " has been deleted!";

      usr.notification.push({
        content: msg,
        timestamp: new Date(),
        from: req.admin || req.userid,
        read: false,
      });

      var newNotification = usr.notification;
      
      await Prenotation.deleteOne({ _id: req.params.id });
      await User.findOneAndUpdate(
        { _id: oldPr.user },
        {
          notification: newNotification,
        }
      );
      res.json({ message: "Prenotation eliminated" });
    }
  } catch (e) {
    res.json({ message: e });
  }
});

/* Update prenotation's infos */
router.post("/update", async (req, res) => {
  try {
    jwt.authenticateToken(req, res, cont);

    async function cont() {
      const oldPr = await Prenotation.findById(req.body._id);
      const usr = await User.findById(oldPr.user);

      var msg =
        "The prenotation on " +
        oldPr.start.toISOString().substring(0, 10) +
        " in " +
        oldPr.place +
        " has been modified. Check your prenotations!";

      usr.notification.push({
        content: msg,
        timestamp: new Date(),
        from: req.admin ? "admin" : req.userid,
        read: false,
      });

      var newNotification = usr.notification;

      await Prenotation.findOneAndUpdate(
        { _id: req.body._id },
        {
          company: req.body.company,
          place: req.body.place,
          start: req.body.start,
          claimed: req.body.claimed,
          duration: req.body.duration,
          text: req.body.text,
          user: req.body.user,
        }
      );

      await User.findOneAndUpdate(
        { _id: oldPr.user },
        {
          notification: newNotification,
        }
      );
      res.json({ message: "Update done!" });
    }
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
