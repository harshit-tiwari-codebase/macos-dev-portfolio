// AI Service for Harshit's macOS Dev Portfolio
// Uses Google Gemini API with smart offline fallback

const HARSHIT_KNOWLEDGE_BASE = `
You are "Harshit AI", a smart and friendly virtual assistant embedded in Harshit Tiwari's macOS-themed developer portfolio.
Your job is to answer questions from recruiters, fellow developers, and visitors about Harshit Tiwari in a concise, professional, warm, and engaging macOS Siri / Copilot tone.

=== HARSHIT'S PROFILE & DETAILS ===
- Full Name: Harshit Tiwari
- Role: Full Stack Developer & CSIT (Computer Science & Information Technology) Student
- College / Education: IPS IES Academy, 2nd Year (CGPA: 9.29)
- Status: Learning • Building • Improving
- Goals: Become a top software engineer, master full stack engineering, crack top product-based companies, and build impactful real-world software.

=== TECHNICAL SKILLS ===
- Languages: JavaScript (ES6+), TypeScript, HTML5, CSS3, C/C++
- Frontend: React.js, Tailwind CSS, Framer Motion, GSAP, Responsive UI/UX Design, Vite
- Backend & Databases: Node.js, Express.js, MongoDB, REST APIs, JSON
- Tools & DevOps: Git, GitHub, Postman, VS Code, npm/yarn
- Core CS: Data Structures & Algorithms (DSA), Object-Oriented Programming (OOP)

=== FEATURED PROJECTS ===
1. VerifAi: AI verification engine designed for authenticity analysis and digital trust evaluation. (Live demo: https://verif-ai-six.vercel.app/)
2. macos-dev-portfolio: This interactive macOS-styled desktop developer portfolio built with React 19, Tailwind CSS, and Framer Motion.
3. Argus: Developer project repository focused on security and automation.
4. Nexora: Next-generation web application platform featuring fluid animations and high-performance UI.

=== CONTACT & LINKS ===
- Email: harshit20112005@gmail.com
- LinkedIn: https://www.linkedin.com/in/harshit-tiwari-48830b3b4/
- GitHub: https://github.com/harshit-tiwari-codebase
- Location: India

=== RESPONSE STYLE GUIDELINES ===
- Answer in 1 to 3 short, easy-to-read paragraphs or bullet points.
- Support both English and Hinglish naturally depending on the user's language.
- Format responses nicely using Markdown (bolding, lists, code blocks if asked).
- If the user asks how to see projects or resume, mention that they can click the Dock icons or ask you, and highlight that you can guide them.
- Be polite, humble yet confident, and highlight Harshit's strong work ethic and academic excellence (9.29 CGPA).
`;

// Smart offline fallback logic if no API key is provided
function getOfflineFallbackResponse(userMessage) {
  const query = userMessage.toLowerCase().trim();

  if (/project|work|build|app|repo/i.test(query)) {
    return `### 🚀 Harshit's Featured Projects:

1. **VerifAi** — AI verification engine designed for authenticity analysis and digital trust evaluation. ([Live Demo](https://verif-ai-six.vercel.app/))
2. **macos-dev-portfolio** — This interactive macOS desktop experience built with React, Tailwind CSS, and Framer Motion.
3. **Argus** & **Nexora** — High-performance full-stack web applications with modern fluid UIs.

💡 *Tip: You can open the **Projects** folder from the desktop or dock to explore all 13+ repositories!*`;
  }

  if (/skill|tech|stack|language|framework/i.test(query)) {
    return `### 🛠️ Core Tech Stack & Skills:

* **Frontend:** React, TypeScript, JavaScript, Tailwind CSS, Framer Motion
* **Backend:** Node.js, Express, REST APIs
* **Database:** MongoDB
* **Core CS & Tools:** Data Structures & Algorithms (DSA), Git & GitHub, Postman
* **Academics:** 9.29 CGPA in CSIT at IPS IES Academy (2nd Year)`;
  }

  if (/resume|cv|biodata/i.test(query)) {
    return `### 📄 Harshit's Resume:
Harshit is a 2nd year CSIT student at **IPS IES Academy** with a **9.29 CGPA** and strong hands-on full-stack development expertise.

You can view or download his full PDF resume directly from the **Resume** icon in the dock!`;
  }

  if (/contact|email|reach|hire|linkedin|message|call/i.test(query)) {
    return `### 📬 Get in touch with Harshit:

* **Email:** [harshit20112005@gmail.com](mailto:harshit20112005@gmail.com)
* **LinkedIn:** [Harshit Tiwari](https://www.linkedin.com/in/harshit-tiwari-48830b3b4/)
* **GitHub:** [harshit-tiwari-codebase](https://github.com/harshit-tiwari-codebase)

You can also use the **Mail** app on the desktop to send him a direct message!`;
  }

  if (/who|about|education|college|harshit/i.test(query)) {
    return `### 👋 Meet Harshit Tiwari!
Harshit is a passionate **Full Stack Developer & 2nd Year CSIT Student** at **IPS IES Academy** (maintaining a top **9.29 CGPA**).

He specializes in modern React ecosystems, scalable web applications, and problem-solving through DSA. His goal is to build impactful production software and excel in top product-driven engineering teams.`;
  }

  return `Hello! I'm **Harshit AI**, your virtual assistant inside this macOS desktop. 

I can tell you all about Harshit's:
- 🚀 **Projects** (VerifAi, Nexora, macOS Portfolio)
- 🛠️ **Tech Skills** (React, TypeScript, Node.js, DSA)
- 🎓 **Education & CGPA** (IPS IES Academy · 9.29 CGPA)
- 📬 **Contact & Hiring Details**

What would you like to know?`;
}

/**
 * Send message to Gemini API with conversational history
 * @param {Array<{ role: 'user' | 'model', text: string }>} conversationHistory
 * @returns {Promise<string>}
 */
export async function sendChatMessage(conversationHistory) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const lastUserMessage = conversationHistory[conversationHistory.length - 1]?.text || "";

  // If no API key is configured, return the smart offline fallback
  if (!apiKey || apiKey.trim() === "" || apiKey === "your_gemini_api_key_here") {
    // Artificial small delay for realistic typing feeling
    await new Promise((r) => setTimeout(r, 600));
    return getOfflineFallbackResponse(lastUserMessage);
  }

  // Format contents for Gemini REST API
  const contents = conversationHistory.map((item) => ({
    role: item.role === "model" ? "model" : "user",
    parts: [{ text: item.text }],
  }));

  // Models to try in order of preference
  const models = ["gemini-3.8-flash", "gemini-2.5-flash", "gemini-1.5-flash", "gemini-2.0-flash"];

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: HARSHIT_KNOWLEDGE_BASE }],
          },
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 600,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.warn(`Gemini API error with model ${model}:`, errorData);
        continue; // Try next model fallback
      }

      const data = await response.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (reply) {
        return reply;
      }
    } catch (err) {
      console.warn(`Fetch error with model ${model}:`, err);
    }
  }

  // Fallback to offline engine if API requests fail (e.g. quota, bad key)
  return getOfflineFallbackResponse(lastUserMessage);
}
