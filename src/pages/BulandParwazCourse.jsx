import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  BookOpen,
  CheckCircle,
  GraduationCap,
} from "lucide-react";

import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import EnrollmentForm from "../components/buland-parwaz/EnrollmentForm";

import { scrollToId } from "../utils/scrollTo";

import {
  getCourseById,
  statusLabels,
  statusBadgeVariant,
  isEnrollmentOpen,
} from "../data/bulandParwazCourses";

import { fetchPublicCourseBySlug } from "../api/public";
import { getCourseDisplayImage } from "../utils/courseImages";

import { usePageMeta } from "../hooks/usePageMeta";
import { courseMeta } from "../seo/pageMeta";


const parseCurriculum = (raw) => {
  if (!raw) {
    return {
      format: "",
      schedule: "",
      modules: [],
    };
  }


  if (Array.isArray(raw)) {
    return {
      format: "",
      schedule: "",
      modules: raw
        .filter(Boolean)
        .map((m) => ({
          title: m.title || "Module",
          topics: Array.isArray(m.topics)
            ? m.topics
            : [],
        })),
    };
  }


  if (typeof raw === "object") {

    return {
      format:
        typeof raw.format === "string"
          ? raw.format
          : "",

      schedule:
        typeof raw.schedule === "string"
          ? raw.schedule
          : "",

      modules:
        Array.isArray(raw.modules)
          ? raw.modules.map((m) => ({
            title:
              m.title || "Module",
            topics:
              Array.isArray(m.topics)
                ? m.topics
                : [],
          }))
          : [],
    };
  }


  return {
    format: "",
    schedule: "",
    modules: []
  };
};



const mapApiCourseDetail = (c) => {

  const curriculum = parseCurriculum(
    c.curriculum
  );


  return {

    id:
      c.slug ||
      c.id,


    title:
      c.title,


    image:
      getCourseDisplayImage(c),


    price:
      c.price || 0,


    fullDescription:
      c.description || "",


    status:
      c.isCompleted
        ? "completed"
        : c.enrollmentOpen !== false
          ? "live"
          : "closed",


    duration:
      c.duration,


    level:
      c.level,


    format:
      curriculum.format,


    schedule:
      curriculum.schedule,


    modules:
      curriculum.modules,


    outcomes:
      c.learningOutcomes || [],


    prerequisites:
      c.requirements || []

  };

};



const BulandParwazCourse = () => {


  const { courseId } = useParams();

  const navigate = useNavigate();


  const [course, setCourse] =
    useState(null);


  const [loading, setLoading] =
    useState(true);



  usePageMeta(
    course
      ? courseMeta(course, courseId)
      : {
        title:
          "Course | Buland Parwaz"
      }
  );



  useEffect(() => {

    let cancelled = false;


    fetchPublicCourseBySlug(courseId)

      .then((data) => {

        if (!cancelled) {

          setCourse(
            mapApiCourseDetail(data)
          );

        }

      })

      .catch(() => {

        if (!cancelled) {

          setCourse(
            getCourseById(courseId)
            || null
          );

        }

      })

      .finally(() => {

        if (!cancelled) {

          setLoading(false);

        }

      });



    return () => {

      cancelled = true;

    };


  }, [courseId]);



  const isOpen =
    course
      ? isEnrollmentOpen(course.status)
      : false;



  if (loading) {

    return (

      <div className="
        min-h-screen
        pt-32
        text-center
      ">

        Loading course...

      </div>

    );

  }



  if (!course) {

    return (

      <div className="
        min-h-screen
        pt-32
        text-center
      ">

        <h1 className="
          text-3xl
          font-bold
        ">
          Course Not Found
        </h1>


        <Button
          onClick={() =>
            navigate(
              "/buland-parwaz"
            )
          }
          className="mt-6"
        >
          Back
        </Button>


      </div>

    );

  }
  return (
    <div className="min-h-screen pt-20">


      {/* ================= HERO SECTION ================= */}

      <section className="
        bg-gradient-to-br
        from-primary-50
        via-white
        to-navy-50
        py-12
      ">

        <div className="container-custom">


          <Link
            to="/buland-parwaz"
            className="
              inline-flex
              items-center
              text-primary-600
              hover:text-primary-700
              mb-8
              text-sm
              font-medium
            "
          >

            <ArrowLeft className="w-4 h-4 mr-2" />

            Back to Buland Parwaz

          </Link>



          <div className="
            grid
            lg:grid-cols-3
            gap-10
            items-start
          ">



            {/* LEFT SIDE */}

            <motion.div

              initial={{
                opacity: 0,
                y: 20
              }}

              animate={{
                opacity: 1,
                y: 0
              }}

              className="
                lg:col-span-2
                space-y-8
              "

            >



              {/* IMAGE CARD */}

              <div className="
                bg-white
                rounded-3xl
                border
                border-neutral-200
                shadow-xl
                p-6
                flex
                justify-center
                items-center
              ">


                <img

                  src={course.image}

                  alt={course.title}

                  className="
                    max-h-[360px]
                    w-auto
                    object-contain
                    rounded-2xl
                  "

                  loading="lazy"

                />


              </div>





              {/* TITLE DESCRIPTION CARD */}


              <div className="
                bg-white
                rounded-3xl
                border
                border-neutral-200
                shadow-sm
                p-6
                sm:p-8
              ">



                <div className="
                  flex
                  flex-wrap
                  gap-3
                  mb-5
                ">


                  <Badge
                    variant={
                      statusBadgeVariant[
                      course.status
                      ]
                    }
                  >

                    {
                      statusLabels[
                      course.status
                      ]
                    }

                  </Badge>



                  <div className="
                    flex
                    items-center
                    gap-2
                    text-sm
                    text-neutral-600
                  ">

                    <Clock className="w-4 h-4" />

                    {course.duration}

                  </div>


                </div>





                <h1 className="
                  text-3xl
                  lg:text-4xl
                  font-display
                  font-bold
                  text-neutral-900
                  leading-tight
                  mb-5
                ">

                  {course.title}

                </h1>




                <div className="
                  h-px
                  bg-neutral-200
                  mb-5
                "/>




                <p className="
                  text-sm
                  sm:text-base
                  text-neutral-600
                  leading-7
                  max-w-3xl
                ">

                  {course.fullDescription}

                </p>



              </div>



            </motion.div>







            {/* RIGHT SIDE DETAILS */}


            <motion.div

              initial={{
                opacity: 0,
                y: 20
              }}

              animate={{
                opacity: 1,
                y: 0
              }}

              transition={{
                delay: .15
              }}

              className="
                lg:sticky
                lg:top-24
              "

            >


              <Card

                padding="lg"

                className="
                  rounded-3xl
                  shadow-xl
                "

              >



                <div className="
                  flex
                  items-center
                  gap-3
                  mb-6
                ">


                  <GraduationCap
                    className="
                      w-6
                      h-6
                      text-primary-600
                    "
                  />


                  <h2 className="
                    text-xl
                    font-bold
                    text-neutral-900
                  ">

                    Course Details

                  </h2>


                </div>





                {/* PRICE TAG */}


                <div className="
                  rounded-2xl
                  bg-gradient-to-br
                  from-primary-600
                  to-primary-800
                  text-white
                  p-6
                  mb-7
                  shadow-lg
                ">


                  <p className="
                    text-sm
                    text-white/80
                  ">

                    Course Fee

                  </p>


                  <h3 className="
                    text-4xl
                    font-bold
                    mt-2
                    text-white
                  ">

                    {
                      course.price > 0
                        ? `Rs. ${course.price}`
                        : "Free"
                    }

                  </h3>


                  <p className="
                    text-xs
                    text-white/70
                    mt-3
                  ">

                    Includes complete course access and Verified Certification by Buland Parwaz Program and Axiolink Systems (Pvt) Ltd.

                  </p>


                </div>



{/* Payment Details */}
<div className="mt-5 rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
  <h4 className="text-base font-semibold text-neutral-900 mb-4">
    Payment Details
  </h4>

  <div className="space-y-4">
    <div>
      <p className="text-xs uppercase tracking-wide text-neutral-500">
        Payment Method
      </p>
      <p className="text-lg font-semibold text-primary-600">
        Easypaisa
      </p>
    </div>

    <div>
      <p className="text-xs uppercase tracking-wide text-neutral-500">
        Account Title
      </p>
      <p className="font-medium text-neutral-900">
        Muhammad Uzair Asif
      </p>
    </div>

    <div>
      <p className="text-xs uppercase tracking-wide text-neutral-500">
        Easypaisa Number
      </p>

      <div className="mt-2 flex items-center justify-between rounded-xl bg-white border border-neutral-200 px-4 py-3">
        <span className="font-mono text-lg font-semibold tracking-wider text-neutral-900">
          0370-5834161
        </span>

        <button
          onClick={() => {
            navigator.clipboard.writeText("03705834161");
            alert("Number copied!");
          }}
          className="text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          Copy
        </button>
      </div>
    </div>

    <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
      <p className="text-sm text-amber-800">
        After payment, upload your payment screenshot in the registration form
        to verify your enrollment.
      </p>
    </div>
  </div>
</div>


                <div className="
                  space-y-5
                ">


                  <div>

                    <p className="
                      text-sm
                      text-neutral-500
                    ">

                      Level

                    </p>


                    <p className="
                      font-semibold
                    ">

                      {course.level}

                    </p>


                  </div>





                  <div>

                    <p className="
                      text-sm
                      text-neutral-500
                    ">

                      Format

                    </p>


                    <p className="
                      font-semibold
                    ">

                      {
                        course.format
                        ||
                        "—"
                      }

                    </p>


                  </div>





                  <div>

                    <p className="
                      text-sm
                      text-neutral-500
                    ">

                      Schedule

                    </p>


                    <p className="
                      font-semibold
                    ">

                      {
                        course.schedule
                        ||
                        "—"
                      }

                    </p>


                  </div>





                  <div>

                    <p className="
                      text-sm
                      text-neutral-500
                    ">

                      Modules

                    </p>


                    <p className="
                      font-semibold
                    ">

                      {
                        course.modules.length
                      }
                      {" "}
                      Modules

                    </p>


                  </div>



                </div>





                {
                  isOpen && (

                    <Button

                      className="
                        w-full
                        mt-8
                      "

                      onClick={() =>
                        scrollToId(
                          "enroll"
                        )
                      }

                    >

                      Enroll Now

                    </Button>

                  )
                }




              </Card>


            </motion.div>




          </div>



        </div>


      </section>
      {/* ================= CURRICULUM + REGISTRATION ================= */}

      <section className="
        py-16
        bg-white
      ">

        <div className="
          container-custom
        ">


          <div className="
            grid
            lg:grid-cols-3
            gap-10
            items-start
          ">



            {/* MODULES */}

            <div className="
              lg:col-span-2
            ">


              <Card
                padding="lg"
                className="
                  rounded-3xl
                "
              >


                <div className="
                  flex
                  items-center
                  gap-3
                  mb-8
                ">


                  <BookOpen
                    className="
                      w-6
                      h-6
                      text-primary-600
                    "
                  />


                  <h2 className="
                    text-2xl
                    font-bold
                  ">

                   Course Modules and Curriculum

                  </h2>


                </div>



                <div className="
                  space-y-5
                ">


                  {
                    course.modules.length === 0

                      ?

                      (

                        <p className="
                        text-neutral-500
                      ">

                          Curriculum will be updated soon.

                        </p>

                      )

                      :

                      course.modules.map(
                        (module, index) => (

                          <div

                            key={
                              `${module.title}-${index}`
                            }

                            className="
                            p-5
                            rounded-2xl
                            bg-neutral-50
                            border
                            border-neutral-100
                          "

                          >


                            <div className="
                            flex
                            gap-3
                            items-center
                            mb-4
                          ">


                              <span className="
                              w-8
                              h-8
                              rounded-lg
                              bg-primary-100
                              text-primary-600
                              flex
                              items-center
                              justify-center
                              font-semibold
                            ">

                                {
                                  index + 1
                                }

                              </span>



                              <h3 className="
                              font-semibold
                              text-lg
                            ">

                                {module.title}

                              </h3>


                            </div>



                            <ul className="
                            space-y-2
                            ml-11
                          ">

                              {
                                module.topics.map(
                                  topic => (

                                    <li
                                      key={topic}
                                      className="
                                    text-sm
                                    text-neutral-700
                                    flex
                                    gap-2
                                  "
                                    >

                                      <span>
                                        •
                                      </span>

                                      {topic}

                                    </li>

                                  ))
                              }

                            </ul>


                          </div>


                        )
                      )
                  }


                </div>


              </Card>


            </div>
            {/* REGISTRATION FORM */}

            <motion.div

              initial={{
                opacity: 0,
                y: 20
              }}

              whileInView={{
                opacity: 1,
                y: 0
              }}

              viewport={{
                once: true
              }}

              className="
  lg:sticky
  lg:top-24
"

            >

              {
                isOpen ? (

                  <div
                    id="enroll"
                    className="
        bg-neutral-50
        rounded-3xl
        border
        border-neutral-200
        p-6
        shadow-lg
      "
                  >

                    <h3 className="
        text-xl
        font-bold
        text-neutral-900
        mb-2
      ">

                      Register Now

                    </h3>


                    <p className="
        text-sm
        text-neutral-600
        mb-6
      ">

                      Secure your seat and start your learning journey.

                    </p>



                    <EnrollmentForm
                      course={course}
                    />


                  </div>


                ) : (


                  <Card
                    padding="lg"
                    className="
        rounded-3xl
      "
                  >

                    <div className="
        flex
        items-center
        gap-3
        mb-4
      ">


                      <CheckCircle
                        className="
            w-6
            h-6
            text-primary-600
          "
                      />


                      <h3 className="
          text-xl
          font-bold
        ">

                        Enrollment Closed

                      </h3>


                    </div>



                    <p className="
        text-sm
        text-neutral-600
        leading-relaxed
      ">

                      Enrollment for this course is currently closed.
                      Check back later or contact us for future openings.

                    </p>


                  </Card>


                )
              }


            </motion.div>



          </div>


        </div>


      </section>


    </div>
  );

};


export default BulandParwazCourse;