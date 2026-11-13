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
  const openWindow = (name) => {
    setWindowState((state) => ({ ...state, [name]: true }));
    setActiveWindow?.(name);
    window.dispatchEvent(new CustomEvent("portfolio:restore-window", { detail: name }));
  };

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
      title="Terminal — zsh — 80x24"
      initialWidth={720}
      initialHeight={460}
    >
      <div className="flex h-full w-full flex-col overflow-hidden bg-[#101411] text-xs sm:text-sm">
        <div className="flex shrink-0 items-center justify-between border-b border-white/[0.08] bg-[#171d19] px-4 py-2.5 text-xs text-[#b8c5b8]">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#739776]" />
            <img src="/doc-icons/cli.svg" alt="" className="h-4 w-4" />
            <span className="font-medium">harshit@devfolio</span>
            <span className="text-[#778477]">—</span>
            <span className="font-mono text-[11px]">zsh</span>
          </div>
          <span className="hidden font-mono text-[10px] text-[#819080] sm:inline">~/portfolio</span>
        </div>
        <div className="min-h-0 flex-1">
          <div className="border-b border-white/[0.07] px-5 py-3 text-xs leading-relaxed text-[#aeb9af]">
            <p className="font-medium text-[#d7dfd7]">Harshit Tiwari · Developer Portfolio</p>
            <p className="mt-1">Type <span className="font-mono text-[#a7c39e]">help</span>, <span className="font-mono text-[#a7c39e]">commands</span>, or <span className="font-mono text-[#a7c39e]">projects</span> to get started.</p>
          </div>
        <Terminal
          commands={commands}
          promptLabel="harshit@devfolio:~$"
          style={{
            height: "calc(100% - 65px)",
            minHeight: 0,
            backgroundColor: "#101411",
            color: "#cbd4cb",
            fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", monospace',
            fontSize: "0.82rem",
            lineHeight: 1.7,
            padding: "1.25rem",
          }}
          contentStyle={{
            color: "#cbd4cb",
          }}
          promptLabelStyle={{
            color: "#a7c39e",
            fontWeight: 600,
          }}
          inputTextStyle={{
            color: "#f0f3ee",
          }}
        />
        </div>
      </div>
    </MacWindow>
  );
};

export default Cli;
