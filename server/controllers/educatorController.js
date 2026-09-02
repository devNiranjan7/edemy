import { clerkClient, getAuth } from "@clerk/express";
import courseModel from "../models/courseModel.js";
import { v2 as cloudinary } from "cloudinary";
import purchaseModel from "../models/purchaseModel.js";
import userModel from "../models/userModel.js";

export const updateRoleToEducator = async (req, res) => {
    try {
        const { userId } = getAuth(req);
        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: "educator",
            },
        });
        res.json({ success: true, message: "You can publish a course now" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const addCourse = async (req, res) => {
    try {
        const { courseData } = req.body;
        const imageFile = req.file;
        const { userId } = getAuth(req);
        if (!imageFile) {
            return res.json({
                success: false,
                message: "Thumbnail not attached",
            });
        }
        const parsedCourseData = await JSON.parse(courseData);
        parsedCourseData.educator = userId;
        const newCourse = await courseModel.create(parsedCourseData);
        const imageUpload = await cloudinary.uploader.upload(imageFile.path);
        newCourse.courseThumbnail = imageUpload.secure_url;
        await newCourse.save();
        res.json({ success: true, message: "Course Added" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getEducatorCourses = async (req, res) => {
    try {
        const { userId } = getAuth(req);
        const courses = await courseModel.find({ educator: userId });
        res.json({ success: true, courses });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const educatorDashboardData = async (req, res) => {
    try {
        const { userId } = getAuth(req);
        const courses = await courseModel.find({ educator: userId });
        const totalCourses = courses.length;
        const courseIds = courses.map((course) => course._id);
        const purchases = await purchaseModel.find({
            courseId: { $in: courseIds },
            status: "completed",
        });
        const totalEarnings = purchases.reduce(
            (sum, purchase) => (sum += purchase.amount),
            0,
        );
        const enrolledStudentsData = [];
        for (const course of courses) {
            const students = await userModel.find(
                { _id: { $in: course.enrolledStudents } },
                "name imageUrl",
            );
            students.forEach((student) =>
                enrolledStudentsData.push({
                    courseTitle: course.courseTitle,
                    student,
                }),
            );
        }
        res.json({
            success: true,
            dashboardData: {
                totalEarnings: Number(totalEarnings.toFixed(2)),
                totalCourses,
                enrolledStudentsData,
            },
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getEnrolledStudentsData = async (req, res) => {
    try {
        const { userId } = getAuth(req);
        const courses = await courseModel.find({ educator: userId });
        const courseIds = courses.map((course) => course._id);
        const purchases = await purchaseModel
            .find({
                courseId: { $in: courseIds },
                status: "completed",
            })
            .populate("userId", "name imageUrl")
            .populate("courseId", "courseTitle");
        const enrolledStudents = purchases.map((purchase) => ({
            student: purchase.userId,
            courseTitle: purchase.courseId.courseTitle,
            purchaseDate: purchase.createdAt,
        }));
        res.json({ success: true, enrolledStudents });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
