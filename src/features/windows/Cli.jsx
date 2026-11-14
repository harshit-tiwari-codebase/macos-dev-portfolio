import { useMemo } from "react";
import MacWindow from "./MacWindow";
import TerminalPackage from "react-console-emulator";

const Terminal = TerminalPackage.default || TerminalPackage;

const MONO_STACK =
  'ui-monospace, "SF Mono", SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace';

const Cli = ({
  windowName,
  WindowState,
  setWindowState,
  activeWindow,
  setActiveWindow,
}) => {
  const openWindow = (name) => {
    setWindowState((state) => ({ ...state, [name]: true }));
    setActiveWindow?.(name);
    window.dispatchEvent(new CustomEvent("portfolio:restore-window", { detail: name }));
  };

  // Real macOS Terminal opens with "Last login: Sat Nov 14 10:22:31 on ttys001"
  const welcomeMessage = useMemo(() => {
    const now = new Date();
    const day = now.toDateString().slice(0, 10);
    const time = now.toLocaleTimeString("en-GB");
    return [
      `Last login: ${day} ${time} on ttys001`,
      "Harshit Tiwari · Developer Portfolio",
      "Type help, commands, or projects to get started.",
      "",
    ];
  }, []);

  const commands = {
    commands: {
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
        openWindow("projects");
        return `
Fetched projects from GitHub:
1. Argus                 - Project repository
2. Nexora                - Modern web application platform
3. pixlify-mern          - MERN stack photo sharing platform
4. VerifAi               - AI authenticity & digital trust engine
5. macos-dev-portfolio   - Interactive macOS desktop portfolio
6. Refokus-Clone         - Award-winning GSAP agency clone
7. emotify               - Emotion-based music recommendation app
8. Productivity-Dashboard- Personal Pomodoro & task suite
9. CSS-UI-CLONE-PROJECTS - Collection of modern UI clones
10. JS-MINI-PROJECT      - Interactive JavaScript algorithms & mini-apps
11. LEARNINGS            - Daily code practice & full-stack notes

[Opened Projects Window]
`;
      },
    },

    open: {
      fn: (target) => {
        const app = (target || "").toLowerCase().trim();
        if (["projects", "project"].includes(app)) {
          openWindow("projects");
          return "Opening Projects window...";
        }
        if (["github", "git"].includes(app)) {
          openWindow("github");
          return "Opening GitHub window...";
        }
        if (["resume", "cv"].includes(app)) {
          openWindow("resume");
          return "Opening Resume window...";
        }
        if (["note", "notes"].includes(app)) {
          openWindow("note");
          return "Opening Notes window...";
        }
        if (["spotify", "music"].includes(app)) {
          openWindow("spotify");
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
      title="harshit — zsh — 80×24"
      initialWidth={720}
      initialHeight={460}
    >
      <div
        className="h-full w-full overflow-hidden"
        style={{
          background: "linear-gradient(180deg, rgba(30,30,33,0.86) 0%, rgba(16,16,18,0.92) 100%)",
          backdropFilter: "blur(40px) saturate(180%)",
          WebkitBackdropFilter: "blur(40px) saturate(180%)",
          boxShadow: "inset 0 0.5px 0 rgba(255,255,255,0.12)",
        }}
      >
        <Terminal
          commands={commands}
          welcomeMessage={welcomeMessage}
          promptLabel="harshit@devfolio ~ %"
          style={{
            height: "100%",
            minHeight: 0,
            maxHeight: "100%",
            width: "100%",
            backgroundColor: "transparent",
            color: "rgba(255,255,255,0.86)",
            fontFamily: MONO_STACK,
            fontSize: "12.5px",
            lineHeight: 1.55,
            padding: "14px 16px",
            borderRadius: 0,
            overflowY: "auto",
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(255,255,255,0.2) transparent",
          }}
          contentStyle={{
            color: "rgba(255,255,255,0.86)",
            paddingLeft: 0,
          }}
          messageStyle={{
            color: "rgba(255,255,255,0.78)",
          }}
          promptLabelStyle={{
            color: "#30d158",
            fontWeight: 500,
          }}
          inputTextStyle={{
            color: "#ffffff",
            caretColor: "#ffffff",
          }}
        />
      </div>
    </MacWindow>
  );
};

export default Cli;