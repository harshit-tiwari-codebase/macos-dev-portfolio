import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: { translation: {
    projects: "Projects", github: "GitHub", spotify: "Spotify", notes: "Notes", resume: "Resume", terminal: "Terminal",
    available: "Available for hire", search: "Search", wallpaper: "Control Center & Wallpapers", language: "Language",
    stats: "GitHub Stats", achievements: "Achievements", contact: "Contact", blog: "Blog & Articles", skillsMap: "Skills Map",
    askAi: "Ask Harshit AI", soon: "Coming Soon", certificates: "Certificates", viewCertificate: "View certificate",
    contactHeading: "Let’s connect", yourName: "Your name", yourEmail: "Email", message: "Message", sendMessage: "Send message",
    statsSubtitle: "Live public activity for", contributionActivity: "Contribution activity", languagesByRepo: "Languages by repository", topRepos: "Top public repositories",
    trophyCase: "Trophy Case", verifiedAwards: "Verified from the resume and the certificate provided.", articles: "Articles & notes", writingBy: "Writing by",
  } },
  hi: { translation: {
    projects: "प्रोजेक्ट", github: "गिटहब", spotify: "स्पॉटिफ़ाई", notes: "नोट्स", resume: "रिज़्यूमे", terminal: "टर्मिनल",
    available: "काम के लिए उपलब्ध", search: "खोजें", wallpaper: "कंट्रोल सेंटर और वॉलपेपर", language: "भाषा",
    stats: "गिटहब आँकड़े", achievements: "उपलब्धियाँ", contact: "संपर्क", blog: "ब्लॉग और लेख", skillsMap: "स्किल मैप",
    askAi: "हरषित AI से पूछें", soon: "जल्द आ रहा है", certificates: "प्रमाणपत्र", viewCertificate: "प्रमाणपत्र देखें",
    contactHeading: "आइए जुड़ें", yourName: "आपका नाम", yourEmail: "ईमेल", message: "संदेश", sendMessage: "संदेश भेजें",
    statsSubtitle: "की सार्वजनिक गतिविधि", contributionActivity: "योगदान गतिविधि", languagesByRepo: "रिपॉज़िटरी के अनुसार भाषाएँ", topRepos: "शीर्ष सार्वजनिक रिपॉज़िटरी",
    trophyCase: "उपलब्धियाँ", verifiedAwards: "रिज़्यूमे और दिए गए प्रमाणपत्र से सत्यापित।", articles: "लेख और नोट्स", writingBy: "लेखक",
  } },
};

let initialLanguage = "en";
try {
  initialLanguage = localStorage.getItem("harshitos_language") || "en";
} catch { /* storage can be unavailable in private browsing */ }

i18n.use(initReactI18next).init({
  resources,
  lng: initialLanguage,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

i18n.on("languageChanged", (language) => {
  try { if (typeof window !== "undefined") localStorage.setItem("harshitos_language", language); } catch { /* ignore unavailable storage */ }
});

export default i18n;
