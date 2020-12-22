var express = require("express");
var router = express.Router();

router.get("/", (req, res) => {
  res.render("printtemplate", {
    ...req.session,
  });
});

module.exports = router;
