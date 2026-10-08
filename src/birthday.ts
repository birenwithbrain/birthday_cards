export const birthday = {
  name: "Ananya",
  age: 24,
  pronoun: "she",
  theme: {
    background: "#fff8ef",
    foreground: "#171717",
    primary: "#ff5c8a",
    secondary: "#7557f5",
    accent: "#ffd166",
    card: "#ffffff",
    muted: "#766f68"
  },
  intro: {
    eyebrow: "CLASSIFIED BIRTHDAY FILE",
    title: "Someone turned 24.",
    subtitle: "Unfortunately, the evidence points directly at Ananya."
  },
  subjectLine: "Professional overthinker · Part-time chaos consultant",
  stats: [
    ["Age", 24],
    ["Good decisions", 31],
    ["Drama generation", 84],
    ["Main character energy", 96]
  ],
  evidence: [
    { label: "EXHIBIT A", title: "A perfectly normal photograph.", caption: "There is absolutely nothing suspicious happening here.", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=80" },
    { label: "EXHIBIT B", title: "Evidence of questionable decisions.", caption: "The committee has chosen not to comment.", image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=80" },
    { label: "EXHIBIT C", title: "Still somehow iconic.", caption: "Further investigation is required.", image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1000&q=80" }
  ],
  flashcards: [
    ["What is Ananya's greatest superpower?", "Turning a five-minute task into a three-business-day saga."],
    ["What does 'I'm on my way' mean?", "A highly theoretical concept with no fixed arrival time."],
    ["What is her natural habitat?", "Somewhere comfortable, with snacks, Wi-Fi and exactly zero urgency."],
    ["What happens when plans change?", "A 14-slide internal presentation begins immediately."],
    ["Official birthday diagnosis?", "Chronically iconic. No treatment recommended."],
  ],
  quiz: [
    { q: "You have plans at 7 PM. At 6:45 you get: 'Are you coming?'", options: ["On my way", "5 minutes", "Wait, today?", "👁️👄👁️"], answer: 3 },
    { q: "Your friend says: 'We need to talk.' Your response?", options: ["What happened?", "I'm moving countries", "I have done nothing", "All of the above"], answer: 3 },
    { q: "Pick your ideal birthday superpower.", options: ["Teleportation", "Unlimited snacks", "Pause time", "Make everyone bring cake"], answer: 3 }
  ],
  finalMessage: "Okay. Enough bullying. Happy birthday, Ananya. I hope this year gives you more ridiculous stories, more reasons to laugh until your stomach hurts, and plenty of moments that feel worth remembering. Stay exactly as wonderfully you as you are. ❤️",
  wishPrompt: "Make a wish. Then press the button like you absolutely mean it."
} as const;
