import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Card from "../ui/Card";
import Button from "../ui/Button";
import BulandParwazLogo from "../../assets/BulandParwazLogo.png";

const BulandParwazCard = () => {
  const navigate = useNavigate();

  return (
    <section
      id="buland-parwaz"
      className="section-padding bg-neutral-50 border-y border-neutral-200/60 scroll-mt-24"
    >
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          <Card hover padding="lg" className="overflow-hidden border-neutral-200/80">
            <div className="flex flex-col md:flex-row items-center gap-10 md:gap-14">
              <div className="shrink-0 w-full max-w-sm md:max-w-xs lg:max-w-sm bg-white rounded-xl p-6">
                <img
                  src={BulandParwazLogo}
                  alt="Buland Parwaz Program"
                  className="w-full h-auto object-contain"
                />
              </div>

              <div className="flex-1 text-center md:text-left">
                <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700 mb-3">
                  Training Initiative
                </p>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">
                  Buland Parwaz Program
                </h2>
                <p className="text-lg text-neutral-600 mb-6 leading-relaxed">
                  Professional bootcamps, courses, workshops, and mentorship
                  designed to accelerate your career in technology.
                </p>
                <Button
                  size="lg"
                  onClick={() => navigate("/buland-parwaz")}
                  className="group"
                >
                  Explore Programs
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default BulandParwazCard;
