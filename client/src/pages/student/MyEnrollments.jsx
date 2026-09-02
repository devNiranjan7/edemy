import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext.jsx";
import { Line } from "rc-progress";
import { toast } from "react-toastify";
import axios from "axios";

const MyEnrollments = () => {
    const {
        enrolledCourses,
        calcCourseDuration,
        navigate,
        userData,
        fetchEnrolledCourses,
        backendUrl,
        getToken,
        calcNoOfLectures,
    } = useContext(AppContext);
    const [progressArray, setProgressArray] = useState([]);

    const getCourseProgress = async () => {
        try {
            const token = await getToken();

            const tempProgressArray = await Promise.all(
                enrolledCourses.map(async (course) => {
                    const { data } = await axios.post(
                        `${backendUrl}/api/user/get-course-progress`,
                        { courseId: course._id },
                        { headers: { Authorization: `Bearer ${token}` } },
                    );
                    let totalLectures = calcNoOfLectures(course);
                    const lectureCompleted = data.progressData
                        ? data.progressData.lectureCompleted.length
                        : 0;
                    return { totalLectures, lectureCompleted };
                }),
            );
            setProgressArray(tempProgressArray);
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (userData) {
            fetchEnrolledCourses();
        }
    }, [userData]);
    useEffect(() => {
        if (enrolledCourses.length > 0) {
            getCourseProgress();
        }
    }, [enrolledCourses]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
            <h1 className="text-2xl font-semibold">My Enrollments</h1>

            {enrolledCourses.length === 0 ? (
                <div className="flex items-center justify-center h-52 border rounded-lg mt-10">
                    <p className="text-gray-500">No enrolled courses yet.</p>
                </div>
            ) : (
                <div className="overflow-x-auto mt-10">
                    <table className="w-full table-fixed md:table-auto border border-gray-300">
                        <thead className="text-gray-900 border-b border-gray-300 text-sm text-left max-sm:hidden">
                            <tr>
                                <th className="px-4 py-3 font-semibold">
                                    Course
                                </th>
                                <th className="px-4 py-3 font-semibold whitespace-nowrap">
                                    Duration
                                </th>
                                <th className="px-4 py-3 font-semibold whitespace-nowrap">
                                    Completed
                                </th>
                                <th className="px-4 py-3 font-semibold whitespace-nowrap">
                                    Status
                                </th>
                            </tr>
                        </thead>

                        <tbody className="text-gray-700">
                            {enrolledCourses.map((course, index) => {
                                const progress = progressArray[index];
                                const percentage = progress
                                    ? (progress.lectureCompleted /
                                          progress.totalLectures) *
                                      100
                                    : 0;

                                const isCompleted = progress
                                    ? progress.lectureCompleted ===
                                      progress.totalLectures
                                    : false;

                                return (
                                    <tr
                                        key={course._id || index}
                                        className="border-b border-gray-300"
                                    >
                                        <td className="px-2 md:px-4 py-3">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <img
                                                    className="w-16 sm:w-24 md:w-28 rounded-md object-cover shrink-0"
                                                    src={course.courseThumbnail}
                                                    alt={course.courseTitle}
                                                />

                                                <div className="flex-1 min-w-0">
                                                    <p className="mb-2 text-sm sm:text-base font-medium line-clamp-2">
                                                        {course.courseTitle}
                                                    </p>

                                                    <Line
                                                        percent={percentage}
                                                        strokeWidth={2}
                                                        strokeColor="#2563eb"
                                                        trailWidth={2}
                                                        trailColor="#d1d5db"
                                                        className="w-full rounded-full"
                                                    />
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-4 py-3 max-sm:hidden whitespace-nowrap">
                                            {calcCourseDuration(course)}
                                        </td>

                                        <td className="px-4 py-3 max-sm:hidden whitespace-nowrap">
                                            {progress && (
                                                <>
                                                    {progress.lectureCompleted}{" "}
                                                    / {progress.totalLectures}
                                                    <span className="ml-1">
                                                        Lectures
                                                    </span>
                                                </>
                                            )}
                                        </td>

                                        <td className="px-2 sm:px-4 py-3 text-right md:text-left">
                                            <button
                                                onClick={() =>
                                                    navigate(
                                                        "/player/" + course._id,
                                                    )
                                                }
                                                className="px-3 sm:px-5 py-2 rounded-md bg-blue-600 text-white text-xs sm:text-sm hover:bg-blue-700 transition cursor-pointer whitespace-nowrap"
                                            >
                                                {isCompleted
                                                    ? "Completed"
                                                    : "Ongoing"}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MyEnrollments;
