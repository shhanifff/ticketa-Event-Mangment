



import React from "react";
import AR from "../../assets/images/AR rahman.avif";

const About = () => {
  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "CEO & Co-Founder",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "Michael Chen",
      role: "CTO & Co-Founder",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "Jessica Patel",
      role: "Head of Design",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "David Wilson",
      role: "Head of Marketing",
      image: "/placeholder.svg?height=300&width=300",
    },
  ];

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed text-white px-4 sm:px-6 lg:px-8 py-12 relative"
      style={{ backgroundImage: `url(${AR})` }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Title */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-[#FF4D4D] via-white to-[#FF4D4D] bg-clip-text text-transparent">
            About ticketa
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto mt-4">
            We're revolutionizing the way people discover, book, and experience events.
          </p>
        </div>

        {/* Our Story */}
        <div className="mb-20 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Our Story</h2>
          <p className="text-base sm:text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Founded in 2020, rvrnt was born from a simple idea: make event booking seamless and accessible for everyone. What started as a small team with big dreams has grown into a platform trusted by thousands of event organizers and attendees worldwide.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {[
            { icon: "bx-group", count: "50,000+", label: "Active Users" },
            { icon: "bx-calendar", count: "10,000+", label: "Bookings Completed" },
            { icon: "bx-trophy", count: "5,000+", label: "Events Hosted" },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center shadow-xl border border-white/10 hover:scale-105 transition-transform"
            >
              <div className="text-5xl mb-4">
                <i className={`bx ${stat.icon} `}></i>
              </div>
              <h3 className="text-4xl font-bold text-white">{stat.count}</h3>
              <p className="text-gray-300 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-10 text-white">Meet Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-shadow"
              >
                <img src={member.image} alt={member.name} className="w-full h-64 object-cover" />
                <div className="p-4 text-center">
                  <h3 className="text-lg font-semibold text-white">{member.name}</h3>
                  <p className="text-gray-300 text-sm">{member.role}</p>
                 
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-center mb-10 text-white">Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "bx-time-five",
                title: "Efficiency",
                desc: "We value your time and strive to make booking events as quick and seamless as possible.",
              },
              {
                icon: "bx-map",
                title: "Accessibility",
                desc: "We believe everyone should have access to amazing events, no matter where they are.",
              },
              {
                icon: "bx-award",
                title: "Quality",
                desc: "We curate high-quality events and ensure exceptional experiences for all our users.",
              },
            ].map((val, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center text-white border border-white/10 hover:scale-105 transition-transform"
              >
                <i className={`bx ${val.icon}  text-4xl mb-3`}></i>
                <h3 className="text-xl font-semibold mb-2">{val.title}</h3>
                <p className="text-gray-300 text-sm">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
