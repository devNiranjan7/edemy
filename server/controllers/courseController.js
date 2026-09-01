import courseModel from "../models/courseModel.js";

export const getAllCourses = async (req, res) => {
    try {
        const courses = await courseModel
            .find({ isPublished: true })
            .select(["-courseContent", "-enrolledStudents"])
            .populate({ path: "educator" });
        res.json({ success: true, courses });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getCourseId = async (req, res) => {
    try {
        const { id } = req.params;
        const courseData = await courseModel
            .findById(id)
            .populate({ path: "educator" });
        courseData.courseContent.forEach((chapter) => {
            chapter.chapterContent.forEach((lecture) => {
                if (!lecture.isPreviewFree) {
                    lecture.lectureUrl = "";
                }
            });
        });
        res.json({ success: true, courseData });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
