import React from 'react';
import { Trophy, Smile, Globe2 } from 'lucide-react';

const InfoCards: React.FC = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div className="bg-gray-50 rounded-2xl p-8 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-gray-200 mb-6 overflow-hidden flex items-center justify-center relative">
               <img src="https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=200" className="object-cover w-full h-full opacity-80" />
               <div className="absolute bg-white/90 p-2 rounded-full shadow-lg">
                 <Trophy className="text-yellow-600" size={24} />
               </div>
            </div>
            <h3 className="font-bold text-lg mb-3">Top list 2024</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Are you unsure about what you can actually rent out? Let yourself be inspired by the list of the most rented products on Rentloo last year.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-gray-50 rounded-2xl p-8 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-green-100 mb-6 overflow-hidden flex items-center justify-center">
                <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" className="object-cover w-full h-full" />
            </div>
            <h3 className="font-bold text-lg mb-3">Anwen: Renting a pressure washer was much better than buying one</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Renting on Rentloo saved me money and let me avoid the waste of owning something I rarely need.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-gray-50 rounded-2xl p-8 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-blue-50 mb-6 overflow-hidden flex items-center justify-center">
               <Globe2 size={48} className="text-blue-300" />
            </div>
            <h3 className="font-bold text-lg mb-3">Over a Million Rentals in Seven Countries</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              We want people to buy less and share more. Rentloo's mission is to make it affordable and convenient to get any item, anywhere.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default InfoCards;