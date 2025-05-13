import React from "react";
import { CheckCircle, Circle } from "lucide-react";

const RoadmapSection = () => {
  const roadmapItems = [
    {
      phase: "Phase 1",
      date: "Q1 2025",
      title: "Foundation and Pilot",
      description:
        "We establish the foundational infrastructure and launch our initial pilot program.",
      tasks: [
        { text: "Infrastructure Setup", completed: true },
        { text: "Smart Contract Basics", completed: true },
        { text: "Small Pilot Launch", completed: false },
        { text: "Stakeholder Onboarding", completed: false },
      ],
    },
    {
      phase: "Phase 2",
      date: "Q2 2025",
      title: "Careful Expansion",
      description:
        "Expand our pilot program and begin implementing key features for growth.",
      tasks: [
        { text: "Scaling the Pilot", completed: false },
        { text: "Energy Trading Trials", completed: false },
        { text: "Interoperability", completed: false },
        { text: "Community Incentives", completed: false },
      ],
    },
    {
      phase: "Phase 3",
      date: "Q3 2025",
      title: "Deeper Security and Optimization",
      description:
        "Enhance platform security and optimize with advanced technologies.",
      tasks: [
        { text: "AI and Quantum Testing", completed: false },
        { text: "Privacy Enhancements", completed: false },
        { text: "Layer-2 Solutions", completed: false },
        { text: "Data Insights", completed: false },
      ],
    },
    {
      phase: "Phase 4",
      date: "Q4 2025",
      title: "Wider Adoption",
      description:
        "Scale deployment and improve user experience for broader market adoption.",
      tasks: [
        { text: "Full-scale, Gradual Deployment", completed: false },
        { text: "Collaborations", completed: false },
        { text: "User Experience Boost", completed: false },
        { text: "Network Assessment", completed: false },
      ],
    },
  ];

  return (
    <section className="bg-blue-700 py-20 px-4 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-6 text-white">
          ROADMAP
        </h1>
        <div className="w-20 h-1 bg-blue-300 mx-auto mb-6"></div>
        <p className="text-center text-white/80 text-lg mb-16 max-w-3xl mx-auto">
          Our strategic plan to revolutionize EV charging with the QSE Token
          through a pilot-first approach.
        </p>

        {/* Roadmap content */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-400 hidden md:block" />

          <div className="space-y-12">
            {roadmapItems.map((item, index) => (
              <div key={index} className="relative">
                {/* Dot on timeline */}
                <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:block">
                  <div className="w-6 h-6 rounded-full bg-white border-4 border-blue-400 z-10" />
                </div>

                {/* Content card */}
                <div
                  className={`bg-blue-600/30 backdrop-blur-sm rounded-xl p-6 md:w-5/12 
                          ${index % 2 === 0 ? "md:mr-auto" : "md:ml-auto"}`}
                >
                  <div className="bg-blue-800/40 rounded-lg px-3 py-1 text-xs text-blue-200 inline-block mb-2">
                    {item.phase} • {item.date}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-blue-100 mb-4">{item.description}</p>

                  <div className="space-y-2">
                    {item.tasks.map((task, taskIndex) => (
                      <div key={taskIndex} className="flex items-center gap-2">
                        {task.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                        ) : (
                          <Circle className="w-5 h-5 text-blue-300 flex-shrink-0" />
                        )}
                        <span
                          className={
                            task.completed ? "text-white" : "text-blue-200"
                          }
                        >
                          {task.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoadmapSection;
