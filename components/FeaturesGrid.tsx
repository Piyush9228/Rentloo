import React from 'react';
import { Wine, UserCheck, PiggyBank, Bike, Sun, ThumbsUp } from 'lucide-react';

const features = [
  {
    icon: <Wine size={32} />,
    title: "Everything is guaranteed",
    desc: "A protection for both the person who rents and the person who rents out"
  },
  {
    icon: <UserCheck size={32} />,
    title: "Everyone is verified",
    desc: "Rentloo is safe. Everyone is verified."
  },
  {
    icon: <PiggyBank size={32} />,
    title: "Cheaper than buying",
    desc: "It is often 60% cheaper to rent through Rentloo than a company."
  },
  {
    icon: <Bike size={32} />,
    title: "Rent in your area",
    desc: "You can usually rent something closer to you than the nearest store."
  },
  {
    icon: <Sun size={32} />,
    title: "Hours that suit you",
    desc: "Before and after work and weekends work best - just as it should be."
  },
  {
    icon: <ThumbsUp size={32} />,
    title: "Good for the Environment",
    desc: "The more things gets used - the better."
  }
];

const FeaturesGrid: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
          {features.map((f, i) => (
            <div key={i} className="group flex flex-col items-center text-center perspective-500 feature-3d p-4 rounded-2xl hover:bg-gray-50 transition-colors">
              <div 
                className="w-20 h-20 bg-[#805AD5] rounded-full flex items-center justify-center text-white mb-6 shadow-lg shadow-purple-200 feature-icon-spin transition-all duration-300 group-hover:scale-110 group-hover:shadow-purple-400 group-hover:-translate-y-2"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 transform transition-transform group-hover:translate-z-10" style={{transform: 'translateZ(10px)'}}>
                {f.title}
              </h3>
              <p className="text-gray-600 max-w-sm transition-colors group-hover:text-gray-800">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;