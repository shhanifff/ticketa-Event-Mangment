import React from "react";

const HowItWorks = () => {
  const steps = [
    {
      title: "1. Login / Sign Up",
      description:
        "Create an account or log in to explore all the exciting events available.",
    },
    {
      title: "2. Select Your Interested Event",
      description:
        "Browse through events and pick the one you love – music, tech, workshops & more!",
    },
    {
      title: "3. Get Your Ticket & Pay",
      description:
        'Click the "Get Ticket" button, complete your secure payment, and receive your ticket instantly!',
    },
  ];

  return (
    <div className="bg-black text-white py-16 px-6 md:px-20">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          How It Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-[#1E1E1E] p-6 rounded-2xl border border-white/10 hover:border-white/20 transition duration-300"
            >
              <div className="text-2xl font-semibold mb-3">{step.title}</div>
              <p className="text-gray-300">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
