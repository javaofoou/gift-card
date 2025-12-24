// // routes/admin.js
// const express = require("express");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const Admin = require("../models/Admin");
// const GiftCard = require("../models/GiftCard");
// const adminAuth = require("../middleware/auth");
// const Settings = require("../models/Settings");

 
// const router = express.Router();

// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   const admin = await Admin.findOne({ email });
//   if (!admin) {
//     return res.status(401).json({ message: "Invalid credentials" });
//   }

//   const isMatch = await bcrypt.compare(password, admin.password);
//   if (!isMatch) {
//     return res.status(401).json({ message: "Invalid credentials" });
//   }

//   const token = jwt.sign({ id: admin._id, role: "admin"
//    }, process.env.JWT_SECRET, {
//     expiresIn: "2h"
//   });

//   res.json({ token });
// });


// // // Get all gift cards
// // router.get("/cards", auth, async (req, res) => {
// //   try {
// //     const cards = await GiftCard.find();
// //     console.log(cards);
// //     res.json(cards);
// //   } catch (err) {
// //     res.status(500).json({ message: "Server Error" });
// //   }
// // });

// // TEMP TEST (REMOVE AFTER)
// router.get("/cards", adminAuth,async (req, res) => {
//   const cards = await GiftCard.find();
//   res.json(cards);
// });


// // Update individual card balance
// router.put("/cards/:id", adminAuth,async (req, res) => {
//   const { balance } = req.body;
//   try {
//     const card = await GiftCard.findById(req.params.id);
//     if (!card) return res.status(404).json({ message: "Card not found" });

//     card.balance = balance;
//     await card.save();
//     res.json({ message: "Balance updated", card });
//   } catch (err) {
//     res.status(500).json({ message: "Server Error" });
//   }
// });

// // Update default balance
// router.put("/settings/default-balance", adminAuth, async (req, res) => {
//   const { defaultBalance } = req.body;
//   try {
//     let settings = await Settings.findOne();
//     if (!settings) {
//       settings = new Settings({ defaultBalance });
//     } else {
//       settings.defaultBalance = defaultBalance;
//     }
//     await settings.save();
//     res.json({ message: "Default balance updated", defaultBalance: settings.defaultBalance });
//   } catch (err) {
//     res.status(500).json({ message: "Server Error" });
//   }
// });
// module.exports = router;

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const connectDB = require("../lib/db");
const Admin = require("../models/Admin");
const GiftCard = require("../models/GiftCard");
const Settings = require("../models/Settings");
const adminAuth = require("../middleware/auth");

const router = express.Router();

/**
 * ADMIN LOGIN
 */
router.post("/login", async (req, res) => {
  try {
    await connectDB(process.env.MONGO_URL); // ✅ important

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not set");
    }

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({ success: true, token });

  } catch (err) {
    console.error("ADMIN LOGIN ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * GET ALL GIFT CARDS
 */
router.get("/cards", adminAuth, async (req, res) => {
  try {
    await connectDB(process.env.MONGO_URL); // ✅ important

    const cards = await GiftCard.find();
    res.json({ success: true, cards });

  } catch (err) {
    console.error("GET CARDS ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * UPDATE CARD BALANCE
 */
router.put("/cards/:id", adminAuth, async (req, res) => {
  try {
    await connectDB(process.env.MONGO_URL); // ✅ important

    const { balance } = req.body;

    const card = await GiftCard.findById(req.params.id);
    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    card.balance = Number(balance);
    await card.save();

    res.json({ success: true, message: "Balance updated", card });

  } catch (err) {
    console.error("UPDATE CARD ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * UPDATE DEFAULT BALANCE
 */
router.put("/settings/default-balance", adminAuth, async (req, res) => {
  try {
    await connectDB(process.env.MONGO_URL); // ✅ important

    const { defaultBalance } = req.body;

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({ defaultBalance });
    } else {
      settings.defaultBalance = defaultBalance;
    }

    await settings.save();

    res.json({
      success: true,
      message: "Default balance updated",
      defaultBalance: settings.defaultBalance
    });

  } catch (err) {
    console.error("SETTINGS ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;

