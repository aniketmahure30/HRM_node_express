// router level middleware

const { Router } = require("express");
const multer = require("multer");  //use it for collect multiple data
const EmpSchema = require("../Model/Employee");
const { ensureAuthenticated } = require("../helper/auth_helper");

const router = Router();

//? load multer middlewares
let { storage } = require("../middlewares/multer");
const upload = multer({ storage: storage });

/*
 @ HTTP GET METHOD
    @ACCESS PUBLIC 
    @URL employee/home
*/

router.get("/home", async (req, res) => {
  let payload = await EmpSchema.find({}).lean();
  res.render("../views/home", { title: "Home Page", payload });
});

/*
 @ HTTP GET METHOD
    @ACCESS PRIVATE
    @URL employees/create-emp
*/

router.get("/create-emp", (req, res) => {
  res.render("../views/employees/create-emp", { title: "Create Employee" });
});


// ! =========  Fetch data form MongoDB database=========

/*
 @ HTTP GET METHOD
    @ACCESS PUBLIC 
    @URL employees/employeeProfile
*/

router.get("/:id", async (req, res) => {       // (:)= slug to access particalur data form user
  let payload = await EmpSchema.findOne({ _id: req.params.id }).lean();    //params is used to fectch data from database 
  res.render("../views/employees/employeeProfile", { payload });
//   console.log(payload);
});

/*
 @ HTTP GET METHOD
    @ACCESS PRIVATE 
    @URL employees/edit-Emp
*/

router.get("/edit-emp/:id", async (req, res) => {
  let editPayload = await EmpSchema.findOne({ _id: req.params.id }).lean();
  res.render("../views/employees/editEmp", { editPayload });
});

/*=================  END ALL GET METHOD ================== */

//=================  STARTs ALL POST METHOD ================== /
/*
 @ HTTP POST METHOD
    @ACCESS PRIVATE
    @URL employees/create-emp
*/
// router.post("/create-emp", async (req, res) => {

//   let payload = await req.body;
//   let data = await EmpSchema.create(payload);
// //    res.send({ data, text: "successfully created" });
//     res.send(`data Successfully saved`)
//     console.log(data);
// });

/*
 @ HTTP POST METHOD
    @ACCESS PRIVATE
    @URL employees/create-emp
*/
router.post("/create-emp", upload.single("emp_photo"), async (req, res) => {
  let payload = {
    emp_name: req.body.emp_name,
    emp_id: req.body.emp_id,
    emp_salary: req.body.emp_salary,
    emp_edu: req.body.emp_edu,
    emp_gender: req.body.emp_gender,
    emp_exp: req.body.emp_exp,
    emp_des: req.body.emp_des,
    emp_location: req.body.emp_location,
    emp_email: req.body.emp_email,
    emp_phone: req.body.emp_phone,
    emp_skills: req.body.emp_skills,
    emp_photo: req.file,
  };

  let data = await EmpSchema.create(payload);
     req.flash("SUCCESS_MESSAGE","Employee Created Successfully") // to display alert flash msg after emp is created
  res.redirect("/employee/home", 302, { data });
  // console.log(data);
});

/=================  ENDS ALL POST METHOD ================== /;




/*''''''''''''   PUT request START HERE''''''''''''''''''''''' */

/*
 @ HTTP PUTMETHOD
    @ACCESS PRIVATE
    @URL employees/edit-emp
*/

router.put("/edit-emp/:id", upload.single("emp_photo"), async (req, res) => {
  EmpSchema.findOne({ _id: req.params.id })
    .then(editEmp => {
      //old                   new
      (editEmp.emp_photo = req.file),
        (editEmp.emp_id = req.body.emp_id),
        (editEmp.emp_name = req.body.emp_name),
        (editEmp.emp_salary = req.body.emp_salary),
        (editEmp.emp_edu = req.body.emp_edu),
        (editEmp.emp_exp = req.body.emp_exp),
        (editEmp.emp_email = req.body.emp_email),
        (editEmp.emp_phone = req.body.emp_phone),
        (editEmp.emp_gender = req.body.emp_gender),
        (editEmp.emp_des = req.body.emp_des),
        (editEmp.emp_skills = req.body.emp_skills),
        (editEmp.emp_location = req.body.emp_location),
        // update data in Database
        editEmp.save().then(_ => {
          req.flash("SUCCESS_MESSAGE", "successfully Database Updated");
          res.redirect("/employee/home", 302, {});
        });
    })
    .catch(err => {
      console.log(err);
      req.flash("ERROR_MESSAGE", "Something went Worng")
    });
});

/*''''''''''''   PUT request START HERE''''''''''''''''''''''' */
/*''''''''''''   DELETE request START HERE''''''''''''''''''''''' */

router.delete("/delete-emp/:id", async (req, res) => {
  await EmpSchema.deleteOne({ _id: req.params.id });
  req.flash("SUCCESS_MESSAGE", "Employee DELETED");
  res.redirect("/employee/home", 302, {});
});
/*''''''''''''   DELETE request ENDS HERE''''''''''''''''''''''' */



module.exports = router;
