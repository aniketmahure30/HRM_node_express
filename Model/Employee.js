const { Schema, model } = require("mongoose");
const EmpSchema = new Schema(
  {
    emp_name: {
      type: String,
      required: true,
    },
    emp_id: {
      type: String,
      required: true,
    },
    emp_salary: {
      type: Number,
      required: true,
    },
    emp_edu: {
      type: String,
      required: true,
    },
    emp_gender: {
      type: String,
      required: true,
      enum: ["male", "female", "others"],
    },
    emp_exp: {
      type: Number,
      required: true,
    },
    emp_des: {
      type: String,
      required: true,
    },
    emp_location: {
      type: String,
      required: true,
    },
    emp_email: {
      type: String,
      required: true,
    },
    emp_phone: {
      type: Number,
      required: true,
    },
    emp_skills: {
      type: [" "],
      required: true,
    },
    emp_photo: {
      type: [""],
      required: true,
      default: [
        "https://cdn-icons.flaticon.com/png/512/1144/premium/1144709.png?token=exp=1643957200~hmac=631ff0cccf78e6b9916597531ad1966b",
      ],
    },
  },
  { timestamps: true }
);





module.exports = model("emp", EmpSchema)