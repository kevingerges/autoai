import React from 'react';

export function CarCard({ car, onClick }) {
    const savings = car.originalPrice - car.price;

    return (
        <div onClick={() => onClick(car)} className="flex-shrink-0 w-72 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-slate-100 group slide-in">
            <div className="relative h-40 overflow-hidden">
                <img src={car.image} alt={car.model} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                {savings > 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md animate-pulse">
                        Save ${savings.toLocaleString()}!
                    </div>
                )}
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-3">
                    <h3 className="text-white font-bold text-lg">{car.year} {car.make} {car.model}</h3>
                </div>
            </div>
            <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-2xl font-bold text-blue-600">${car.price.toLocaleString()}</span>
                    <span className="text-xs text-slate-500">{car.mileage.toLocaleString()} mi</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                    {car.features.slice(0, 2).map((feat, i) => (
                        <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{feat}</span>
                    ))}
                </div>
                <button className="w-full bg-slate-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                    View Details
                </button>
            </div>
        </div>
    );
}
