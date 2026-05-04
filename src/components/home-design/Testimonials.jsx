import { motion } from "motion/react";
import { Star, Quote } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { useState } from "react";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

const testimonials = [
  {
    name: "Gauri Pandey",
    image: "https://lh3.googleusercontent.com/a-/ALV-UjUSHBN9TRmN_XAc0zswdZtWRQZmZE2UopvFG56JjHflxd4LvJbg=w120-h120-p-rp-mo-br100",
    text: "Aarmbh Fitness Gym is one of the best places to start or continue your fitness journey. The environment is clean, motivating, and well-maintained, which makes working out here a great experience every day. The gym is equipped with good quality machines and all the essential equipment needed for strength training, cardio, and overall fitness. Overall, it’s a great gym for anyone looking to improve their health and fitness. Highly recommended for its facilities, guidance, and motivating atmosphere!",
    rating: 5
  },
  {
    name: "Sachin",
    image: "https://lh3.googleusercontent.com/a-/ALV-UjXKE5cILVir2aHSaSjq-9HERQiei9icNMLcON5LyTcinMm5Fh2k4w=w120-h120-p-rp-mo-br100",
    text: "The overall gym looks very aesthetic, and the people here in the gym are very friendly too specially the trainers. the equipment are very reliable too and always hits on the spot where it needs to. overall a 10/10 gym.",
    rating: 5
  },
  {
    name: "Niraj",
    image: "https://lh3.googleusercontent.com/a-/ALV-UjWJU3nwadcI70LLc_VgyZFAQ4uf1Fiz4wJcuYfJhP0gtHCkhB8=w120-h120-p-rp-mo-br100",
    text: "This is Niraj and i want to express my special gratitude towards the members and especially the trainers in the gym who are very supportive 💖. In my opinion this is the best gym where everyone is treated fair and equal 💓. …",
    rating: 5
  },
  {
    name: "Aarambh Member",
    image: "https://picsum.photos/seed/member1/120/120",
    text: "Joining Aarambh was the best decision I made this year. The community here is unmatched. It's not just a gym, it's a family that pushes you to be your absolute best version.",
    rating: 5
  },
  {
    name: "Strength Junkie",
    image: "https://picsum.photos/seed/member2/120/120",
    text: "The quality of machines here is better than any big chain gym I've visited. Everything is calibrated perfectly, and the trainers actually know their science. 5 stars all the way.",
    rating: 5
  }
];

function ReviewCard({ review }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className="group relative h-full cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="absolute -inset-0.5 bg-gradient-to-br from-zinc-700/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative h-full bg-zinc-900/40 backdrop-blur-xl border border-white/5 p-8 rounded-3xl flex flex-col hover:bg-zinc-900/60 transition-all duration-300">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <img 
              src={review.image} 
              alt={review.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-zinc-800 group-hover:border-zinc-700 transition-colors"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center border-2 border-zinc-900 shadow-lg">
              <svg className="w-3 h-3 text-[#4285F4]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm tracking-wide">{review.name}</h4>
            <div className="flex gap-0.5 mt-1">
              {[...Array(review.rating)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-yellow-500 text-yellow-500" />
              ))}
            </div>
          </div>
        </div>

        <div className="relative mb-4 flex-grow">
          <Quote className="absolute -top-2 -left-2 w-8 h-8 text-white/5 -z-10" />
          <p className={`text-zinc-400 text-sm leading-relaxed italic transition-all duration-300 ${isExpanded ? 'line-clamp-none' : 'line-clamp-6 group-hover:line-clamp-none'}`}>
            {review.text}
          </p>
          {!isExpanded && (
            <span className="md:hidden text-zinc-600 text-[10px] font-bold uppercase tracking-widest mt-2 block group-hover:hidden">
              Tap to read more
            </span>
          )}
        </div>
        
        <div className="pt-4 mt-auto">
          <span className="text-[10px] text-zinc-600 uppercase font-black tracking-widest block mb-4">
            Verified Google Review
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 relative overflow-hidden bg-zinc-950">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-zinc-500/5 blur-[120px] rounded-full -translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-[10px] uppercase tracking-[0.4em] font-black text-zinc-500 mb-4 inline-flex items-center gap-2">
              <span className="w-8 h-[1px] bg-zinc-800" />
              Community Feedback
            </h2>
            <h3 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-white leading-[0.9]">
              Google <br/> <span className="text-zinc-500">Testimonials</span>
            </h3>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-start md:items-end gap-2"
          >
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
              ))}
            </div>
            <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-[0.2em] italic">
              Excellent Rating on Google
            </p>
          </motion.div>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={32}
          slidesPerView={1}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            bulletClass: 'swiper-pagination-bullet !bg-zinc-800',
            bulletActiveClass: 'swiper-pagination-bullet-active !bg-zinc-100',
          }}
          breakpoints={{
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          className="reviews-swiper !pb-16"
        >
          {testimonials.map((review, index) => (
            <SwiperSlide key={index} className="h-auto">
              <ReviewCard review={review} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style>{`
        .reviews-swiper .swiper-pagination-bullet {
          transition: all 0.3s ease;
          width: 6px;
          height: 6px;
          opacity: 1;
        }
        .reviews-swiper .swiper-pagination-bullet-active {
          width: 24px;
          border-radius: 4px;
        }
      `}</style>
    </section>
  );
}
