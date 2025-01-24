const express = require("express");
const { check } = require("express-validator");
const { validationResut } = require("express-validator");
const auth = require("../Middleware/authMiddleware")
const { registerUser, loginUser, updateUser, getUser, deleteUser } = require("../Controllers/user.controller");

const router = express.Router();

router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("mobile", "invalid moblile number").isLength({min:10}),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be atleast 6 characters").isLength({
      min: 6,
    }),
  ],
  registerUser
);

router.post("/login", [
  check("email", "Please include a valid email").isEmail(),
  check("password", "Password is required").exists(),
],loginUser);

router.put("/update-user",
    auth,
    [
        //validate fields if they are only present in the request

        check('name').optional().not().isEmpty().withMessage("Username is required"),
        check('email').optional().isEmail().withMessage("Please include a valid email"),
        check('mobile').optional().isLength({min:10}).withMessage("plase include a valid number")
    ],
        // call the updateUser controller function
        updateUser

)

router.get("/getUser",auth,getUser)

router.delete('/delete-user',auth, deleteUser);



module.exports = router;
