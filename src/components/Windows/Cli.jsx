import React from "react";

import MacWindow from "./MacWindow";

import TerminalPackage from "react-console-emulator";

const Terminal = TerminalPackage.default;

const Cli = () => {
const commands = {

  about: {
    fn: () => "Full Stack Developer & CSIT Student",
  },

  skills: {
    fn: () =>
      "React • Tailwind • JavaScript • TypeScript • Node.js • MongoDB",
  },

  education: {
    fn: () =>
      "IPS IES Academy | 2nd Year | CGPA: 9.12",
  },

  projects: {
    fn: () =>
      `
• MacOS Portfolio
• Spotify Clone
• Weather App
• AI Resume Builder
`,
  },

  techstack: {
    fn: () =>
      `
Frontend  : React.js, Tailwind CSS
Backend   : Node.js, Express.js
Database  : MongoDB
Languages : JavaScript, TypeScript, C++
`,
  },

  goals: {
    fn: () =>
      `
• Become a top software engineer
• Master Full Stack Development
• Crack product-based companies
`,
  },

  contact: {
    fn: () =>
      `
GitHub   : github.com/harshit-tiwari-codebase
LinkedIn : linkedin.com
Location : Madhya Pradesh, India
`,
  },

  github: {
    fn: () => {
      window.open(
        "https://github.com/harshit-tiwari-codebase",
        "_blank"
      );

      return "Opening GitHub...";
    },
  },

  linkedin: {
    fn: () => {
      window.open(
        "https://linkedin.com",
        "_blank"
      );

      return "Opening LinkedIn...";
    },
  },
  leetcode: {
    fn: () => {
      window.open(
        "https://leetcode.com/u/vision0808/",
        "_blank"
      );

      return "Opening LinkedIn...";
    },
  },

  resume: {
    fn: () =>
      "Frontend-focused Full Stack Developer with React ecosystem experience.",
  },

  experience: {
    fn: () =>
      "Currently building projects and improving backend + DSA skills.",
  },

  learning: {
    fn: () =>
      `
Currently Learning:
• Backend Development
• DSA
• TypeScript
• System Design Basics
`,
  },

  achievements: {
    fn: () =>
      `
• 9.12 CGPA
• Built multiple full stack projects
• Learning MERN Stack
`,
  },

  status: {
    fn: () =>
      "Learning • Building • Improving",
  },

  whoami: {
    fn: () =>
      "harshit-tiwari",
  },

  date: {
    fn: () =>
      new Date().toLocaleDateString(),
  },

  time: {
    fn: () =>
      new Date().toLocaleTimeString(),
  }

 

};

  return (

    <MacWindow>

      <div className="w-full h-full  p-2">

        <div className="h-full">

          <Terminal
            commands= {commands}
            welcomeMessage={"Welcome to my Harshit developer terminal"}
            promptLabel={"harshit@portfolio:~$"}

            style={{
              height: "100%",
            }}
          />

        </div>

      </div>

    </MacWindow>

  );
};

export default Cli;