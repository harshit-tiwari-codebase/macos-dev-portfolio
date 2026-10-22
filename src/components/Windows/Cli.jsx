import React from "react";
import MacWindow from "./MacWindow";
import TerminalPackage from "react-console-emulator";

const Terminal = TerminalPackage.default || TerminalPackage;

const Cli = ({
  windowName,
  WindowState,
  setWindowState,
  activeWindow,
  setActiveWindow,
}) => {
  const commands = {
    help: {
      fn: () => `
Available commands:
• projects     - View all GitHub projects
• about        - Learn about Harshit
• skills       - Technical skills & stack
• education    - College & academics
• open <app>   - Open app (projects, github, resume, note, spotify)
• contact      - Social links & email
• github       - Visit GitHub profile
• linkedin     - Visit LinkedIn
• leetcode     - Visit LeetCode profile
• clear        - Clear the terminal screen
`,
    },

    about: {
      fn: () => "Harshit Tiwari — Full Stack Developer & CSIT Student at IPS IES Academy.",
    },

    skills: {
      fn: () =>
        "React.js • Tailwind CSS • JavaScript (ES6+) • TypeScript • Node.js • Express.js • MongoDB • Git",
    },

    education: {
      fn: () => "IPS IES Academy | 2nd Year B.Tech (CSIT) | CGPA: 9.12",
    },

    projects: {
      fn: () => {
        setWindowState((prev) => ({ ...prev, projects: true }));
        if (setActiveWindow) setActiveWindow("projects");
        return `
Fetched projects from GitHub:
1. BlockTraceAI          - AI blockchain transaction intelligence
2. TraceMail-            - Email verification & delivery analytics
3. VerifAi               - AI authenticity & digital trust engine
4. macos-dev-portfolio   - Interactive macOS desktop portfolio
5. Nexora                - Modern web application platform
6. pixlify-mern          - MERN stack photo sharing platform
7. Refokus-Clone         - Award-winning GSAP agency clone
8. emotify               - Emotion-based music recommendation app
9. Productivity-Dashboard- Personal Pomodoro & task suite
10. CSS-UI-CLONE-PROJECTS - Collection of modern UI clones
11. JS-MINI-PROJECT      - Interactive JavaScript algorithms & mini-apps
12. LEARNINGS            - Daily code practice & full-stack notes

[Opened Projects Window]
`;
      },
    },

    open: {
      fn: (target) => {
        const app = (target || "").toLowerCase().trim();
        if (["projects", "project"].includes(app)) {
          setWindowState((s) => ({ ...s, projects: true }));
          if (setActiveWindow) setActiveWindow("projects");
          return "Opening Projects window...";
        }
        if (["github", "git"].includes(app)) {
          setWindowState((s) => ({ ...s, github: true }));
          if (setActiveWindow) setActiveWindow("github");
          return "Opening GitHub window...";
        }
        if (["resume", "cv"].includes(app)) {
          setWindowState((s) => ({ ...s, resume: true }));
          if (setActiveWindow) setActiveWindow("resume");
          return "Opening Resume window...";
        }
        if (["note", "notes"].includes(app)) {
          setWindowState((s) => ({ ...s, note: true }));
          if (setActiveWindow) setActiveWindow("note");
          return "Opening Notes window...";
        }
        if (["spotify", "music"].includes(app)) {
          setWindowState((s) => ({ ...s, spotify: true }));
          if (setActiveWindow) setActiveWindow("spotify");
          return "Opening Spotify window...";
        }
        return `Unknown application '${target}'. Try: open projects, open resume, open github, open note, open spotify`;
      },
    },

    techstack: {
      fn: () => `
Frontend  : React.js, Tailwind CSS, HTML5, CSS3
Backend   : Node.js, Express.js
Database  : MongoDB
Languages : JavaScript, TypeScript, C++
`,
    },

    contact: {
      fn: () => `
GitHub   : https://github.com/harshit-tiwari-codebase
LinkedIn : https://www.linkedin.com/in/harshit-tiwari-48830b3b4/
LeetCode : https://leetcode.com/u/vision0808/
Email    : Contact via Mail icon on Dock
`,
    },

    github: {
      fn: () => {
        window.open("https://github.com/harshit-tiwari-codebase", "_blank");
        return "Opening GitHub profile in new tab...";
      },
    },

    linkedin: {
      fn: () => {
        window.open(
          "https://www.linkedin.com/in/harshit-tiwari-48830b3b4/",
          "_blank"
        );
        return "Opening LinkedIn profile in new tab...";
      },
    },

    leetcode: {
      fn: () => {
        window.open("https://leetcode.com/u/vision0808/", "_blank");
        return "Opening LeetCode profile in new tab...";
      },
    },

    whoami: {
      fn: () => "harshit-tiwari",
    },

    date: {
      fn: () => new Date().toLocaleDateString(),
    },

    time: {
      fn: () => new Date().toLocaleTimeString(),
    },
  };

  return (
    <MacWindow
      windowName={windowName}
      setWindowState={setWindowState}
      WindowState={WindowState}
      activeWindow={activeWindow}
      setActiveWindow={setActiveWindow}
      title="Terminal — zsh — 80x24"
      initialWidth={720}
      initialHeight={460}
    >
      <div className="w-full h-full bg-[#181818]">
        <Terminal
          commands={commands}
          welcomeMessage="Welcome to Harshit Tiwari's macOS Developer Terminal. Type 'help' or 'projects' to begin."
          promptLabel="harshit@devfolio:~$"
          style={{
            height: "100%",
            backgroundColor: "#181818",
            color: "#4ade80",
            fontFamily: "monospace",
          }}
          contentStyle={{
            color: "#e2e8f0",
          }}
          promptLabelStyle={{
            color: "#38bdf8",
            fontWeight: "bold",
          }}
          inputTextStyle={{
            color: "#f8fafc",
          }}
        />
      </div>
    </MacWindow>
  );
};

export default Cli;
