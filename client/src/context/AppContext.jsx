import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets.js";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import { useAuth, useUser } from "@clerk/clerk-react";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const currency = "₹";
    const navigate = useNavigate();
    const { getToken } = useAuth();
    const { user } = useUser();
    const [allCourses, setAllCourses] = useState([]);
    const [isEducator, setIsEducator] = useState(true);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const fetchAllCourses = async () => {
        setAllCourses(dummyCourses);
    };

    const calcRating = (course) => {
        if (course.courseRatings.length === 0) {
            return 0;
        }
        let totalRating = 0;
        course.courseRatings.forEach((rating) => {
            totalRating += rating.rating;
        });
        return totalRating / course.courseRatings.length;
    };
    const calcChapterTime = (chapter) => {
        let time = 0;
        chapter.chapterContent.map(
            (lecture) => (time += lecture.lectureDuration),
        );
        return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
    };
    const calcCourseDuration = (course) => {
        let time = 0;
        course.courseContent.forEach((chapter) => {
            chapter.chapterContent.forEach(
                (lecture) => (time += lecture.lectureDuration),
            );
        });
        return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
    };
    const calcNoOfLectures = (course) => {
        let noOfLectures = 0;
        course.courseContent.map(
            (chapter) => (noOfLectures += chapter.chapterContent.length),
        );
        return noOfLectures;
    };
    const fetchEnrolledCourses = () => {
        setEnrolledCourses(dummyCourses);
    };
    const logToken = async () => {
        console.log(await getToken());
    };

    useEffect(() => {
        fetchAllCourses();
        fetchEnrolledCourses();
    }, []);
    useEffect(() => {
        if (user) {
            logToken();
        }
    }, [user]);

    const value = {
        currency,
        navigate,
        allCourses,
        calcRating,
        isEducator,
        setIsEducator,
        calcChapterTime,
        calcCourseDuration,
        calcNoOfLectures,
        enrolledCourses,
        fetchEnrolledCourses,
    };
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
