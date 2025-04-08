import { Course } from "../models/course.model.js";
import { v2 as cloudinary } from "cloudinary";
import { Purchase } from "../models/purchase.model.js";
//create
export const createCourse = async (req, res) => {
  const adminId = req.adminId;
  console.log("Creating course API working...");

  const { title, description, price } = req.body;

  try {
    // Validate required fields
    if (!title || !description || !price) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // yt
    const { image } = req.files;
    // Check if file is uploaded
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ errors: "No  image file uploaded" });
    }

    // Validate file format
    const allowedFormat = ["image/png", "image/jpeg"];
    if (!allowedFormat.includes(image.mimetype)) {
      return res
        .status(400)
        .json({
          error: " Invalid file format ,Only PNG and JPG files are allowed.",
        });
    }

    // claudinary code
    console.log("uploding image :>> ");
    const cloud_response = await cloudinary.uploader.upload(image.tempFilePath);
    if (!cloud_response || cloud_response.error) {
      return res
        .status(400)
        .json({ errors: "Error uploading file to cloudinary" });
    }

    // create course
    const courseData = {
      title,
      description,
      price,
      image: {
        public_id: cloud_response.public_id,
        url: cloud_response.url,
      },
      creatorId: adminId,
    };

    const course = await Course.create(courseData);
    res.json({
      message: "Course created successfully",
      course,
    });

    console.log("✅ Course created successfully");
  } catch (error) {
    console.error("❌ Error creating course:", error);
    res.status(500).json({ error: "Error creating course" });
  }
};

//update
export const updateCourse = async (req, res) => {
  const adminId = req.adminId;
  console.log("🔄 Updating course API called...");
  const { courseId } = req.params;
  

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ errors: "Course not found" });
    }

    // Check if new image is uploaded
    const newImageFile = req.files?.image;

    let updatedImage = course.image; // default to old image
    if (newImageFile) {
      // ✅ 1. Delete old image from Cloudinary
      if (course.image?.public_id) {
        await cloudinary.uploader.destroy(course.image.public_id);
      }

      // ✅ 2. Upload new image
      const cloudRes = await cloudinary.uploader.upload(newImageFile.tempFilePath);
      updatedImage = {
        public_id: cloudRes.public_id,
        url: cloudRes.url,
      };
    }

    // ✅ 3. Update course
    const updatedCourse = await Course.findOneAndUpdate(
      { _id: courseId, creatorId: adminId },
      {
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        image: updatedImage,
      },
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(403).json({ errors: "Unauthorized update" });
    }

    res.status(200).json({ message: "Course updated successfully", course: updatedCourse });

  } catch (error) {
    console.log("❌ Error updating course:", error);
    res.status(500).json({ errors: "Error updating course" });
  }
};


//delate
export const deleteCourse = async (req, res) => {
  const adminId = req.adminId;
  const { courseId } = req.params;
  try {
    const course = await Course.findOneAndDelete({
      _id: courseId,
      creatorId: adminId,
    });

    if (!course) {
      return res
        .status(404)
        .json({ errors: "can't delate or created by other admin" });
    }
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ errors: "Error in course deleting" });

    console.log("error in course deleting", error);
  }
};

//get all courses
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({});
    res.status(201).json({ courses });
  } catch (error) {
    res.status(500).json({ errors: "Error in getting courses" });
    console.log("error to get courses", error);
  }
};

//get perticular course details
export const courseDetails = async (req, res) => {
  const { courseId } = req.params;
  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.status(200).json({ course });
  } catch (error) {
    console.log("errror in sourse detais", error);
  }
};




//stripe payment
import Stripe from "stripe";
import config from "../config.js";
const stripe = new Stripe(config.STRIPE_SECRET_KEY);
console.log(config.STRIPE_SECRET_KEY);

//purches courses
export const buyCourses = async (req, res) => {
  const { userId } = req;
  const { courseId } = req.params;
  try {
    //check our ourse is avalablew or not
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ errors: "Course not found" });
    }
    const existingPurchase = await Purchase.findOne({ userId, courseId }); // if already existi purshesed thos course
    if (existingPurchase) {
      return res
        .status(400)
        .json({ errors: "user  has already purchased this course " });
    }

    // stripe payment code goes here
    const amount = course.price; // Convert to cents
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      payment_method_types: ["card"],
    });

    //create newpurchase
    const newPurchase = new Purchase({ userId, courseId });
    await newPurchase.save();
    res.status(201).json({
      message: "Course purchased successfully",
      course,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ errors: "Error in course buying" });
    console.log("error in course buying ", error);
  }
};
