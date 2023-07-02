const express = require("express");
const router = express.Router();
const {
  getAllJobs,
  updateJob,
  deleteJob,
  getJob,
  createJob,
} = require("../controllers/main");

router.route("/").get(getAllJobs).post(createJob);
router.route("/:id").patch(updateJob).delete(deleteJob).get(getJob);

module.exports = router;
