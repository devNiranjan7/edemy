import CallToAction from "../../components/student/CallToAction.jsx";
import Companies from "../../components/student/Companies.jsx";
import CoursesSection from "../../components/student/CoursesSection.jsx";
import Hero from "../../components/student/Hero.jsx";
import TestimonialsSection from "../../components/student/TestimonialsSection.jsx";

const Home = () => {
    return (
        <div className="flex flex-col items-center space-y-7 text-center">
            <Hero />
            <Companies />
            <CoursesSection />
            <TestimonialsSection />
            <CallToAction />
        </div>
    );
};

export default Home;
