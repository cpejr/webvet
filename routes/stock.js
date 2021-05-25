const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const Kit = require("../models/kit");
const Counter = require("../models/counter");
const Toxin = require("../models/toxin");

/* GET home page. */

function dynamicSort(property) {
  var sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a, b) {
    /* next line works with strings and numbers,
     * and you may want to customize it to your needs
     */
    var result =
      a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
    return result * sortOrder;
  };
}

router.get("/", auth.isAuthenticated, async function (req, res) {
  let promises = [
    Kit.getAllForStock(),
    Kit.getAllArchived(0, KITS_PER_PAGE),
    Kit.countAvailableWorkmaps(),
    Counter.getEntireKitStocks(),
  ];

  const [resultActiveKits, resultDisabledKits, reqSumAmounts, kitStocks] =
    await Promise.all(promises);

  reqSumAmounts.forEach((sum, index) => {
    let stockIndex = kitStocks.findIndex(
      (element) => element.sigle === sum._id
    );
    let indKit = kitStocks[stockIndex];
    reqSumAmounts[index] = {
      ...sum,
      auxId: indKit._id,
      minStock: indKit.minStock,
      name: indKit.name,
    };
  });

  const sumAmounts = reqSumAmounts.sort((a, b) =>
    a.name > b.name ? 1 : b.name > a.name ? -1 : 0
  );

  let number_of_pages = 0;
  if (resultDisabledKits.length > 0) {
    number_of_pages = Math.ceil(
      resultDisabledKits[0].totalCount / KITS_PER_PAGE
    );
  }
  number_of_pages++;

  const oneDay = 24 * 60 * 60 * 1000;
  const now = Date.now();

  let activeKits = resultActiveKits.map((kit) => processKit(kit));
  activeKits = activeKits.sort(dynamicSort("kitType"));

  let disabledKits = [];
  if (resultDisabledKits.length > 0) {
    disabledKits = resultDisabledKits[0].kits.map((kit) => processKit(kit));
  }

  function processKit(kit) {
    const exp = new Date(kit.expirationDate);

    let diffDays = Math.ceil((exp - now) / oneDay);

    if (diffDays > 90) kit.color = "Green";
    else if (diffDays >= 30) kit.color = "Yellow";
    else kit.color = "Red";

    kit.date = kit.expirationDate.getDate();
    kit.month = kit.expirationDate.getMonth();
    kit.year = kit.expirationDate.getFullYear();
    return kit;
  }

  res.render("stock/index", {
    title: "Kits",
    disabledKits,
    activeKits,
    number_of_pages,
    layout: "layoutDashboard.hbs",
    sumAmounts,
    ...req.session,
  });
});

router.get("/archived", async (req, res) => {
  let page = req.query.page;

  res.send((await Kit.getAllArchived(page, KITS_PER_PAGE))[0].kits);
});

router.post("/setstock", auth.isAuthenticated, async function (req, res) {
  try {
    const obj = req.body;
    let kitstocks = [];
    Object.keys(obj).forEach((toxinId) => {
      obj[toxinId] !== "" &&
        kitstocks.push({ _id: toxinId, minStock: obj[toxinId] });
    });
    await Counter.setKitStocks(kitstocks);
    res.redirect("/stock");
  } catch (err) {
    console.log("🚀 ~ file: stock.js ~ line 108 ~ error", err);
    res.redirect("/error");
  }
});

router.get("/edit/:id", auth.isAuthenticated, function (req, res) {
  function setTwoCharacters(string) {
    return string.length <= 1 ? "0" + string : string;
  }
  Kit.getById(req.params.id)
    .then((kit) => {
      const exp = kit.expirationDate;
      kit.time = `${exp.getFullYear()}-${setTwoCharacters(
        exp.getMonth().toString()
      )}-${setTwoCharacters(exp.getDate().toString())}`;
      res.render("stock/edit", {
        title: "Edit Kit",
        layout: "layoutDashboard.hbs",
        kit,
        ...req.session,
      });
    })
    .catch((error) => {
      console.warn(error);
      res.redirect("/error");
    });
});

router.post("/edit/:id", auth.isAuthenticated, function (req, res) {
  const kit = req.body;
  Kit.update(req.params.id, kit)
    .then((response) => {
      req.flash("success", "Kit alterado com sucesso.");
      res.redirect(`/stock/edit/${req.params.id}`);
    })
    .catch((error) => {
      console.warn(error);
      res.redirect("/error");
    });
});

router.get("/new", auth.isAuthenticated, async function (req, res) {
  try {
    const ToxinSiglas = await Toxin.getAll();
    res.render("stock/newkit", {
      title: "Novo Kit",
      layout: "layoutDashboard.hbs",
      ...req.session,
      ToxinSiglas,
      allKitTypes,
    });
  } catch (err) {
    console.log("🚀 ~ file: stock.js ~ line 138 ~ err", err);
    res.redirect("/error");
  }
});

router.post("/new", auth.isAuthenticated, async function (req, res) {
  const { kit } = req.body;

  try {
    const alreadyExists = await Kit.checkIfAlreadyExists(
      kit.toxinId,
      kit.kitType
    );

    if (!alreadyExists) {
      await Kit.create(kit);
      req.flash("success", "Kit adicionado com sucesso.");
      res.redirect("/stock");
    } else {
      req.flash(
        "danger",
        "Já existe um kit com esse código e mesmo tipo cadastrado"
      );
      res.redirect("/stock");
    }
  } catch (err) {
    res.redirect("/error");
  }
});

router.post("/delete/:id", auth.isAuthenticated, function (req, res) {
  Kit.delete(req.params.id)
    .then(() => {
      res.redirect("/stock");
    })
    .catch((error) => {
      console.warn(error);
      res.redirect("/error");
    });
});

router.post("/toggleActive/:toxinId/:kitType", async function (req, res) {
  const { toxinId, kitType } = req.params;
  await Kit.setActive(toxinId, kitType);

  return res.send(await Kit.getActiveWithSamples(toxinId));
});

router.get("/getAllActive", async function (req, res) {
  return res.send(await Kit.getAllActive());
});

module.exports = router;
