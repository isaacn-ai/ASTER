// ============================================================
// ASTER CHATBOT — SECURE API CONFIGURATION
// All API keys and endpoints are stored here ONLY.
// Never expose keys in client-side code in production.
// Replace placeholders with your backend proxy URL.
// ============================================================

const CHATBOT_CONFIG = {
  // ── Primary AI Provider ──────────────────────────────────
  // Route all requests through your secure backend proxy.
  // NEVER place raw API keys in this file in production.
  apiEndpoint: "",                    // TODO: e.g., "https://your-backend.com/api/chat"
  apiKey: "",                         // TODO: populate via environment variable server-side
  model: "",                          // TODO: e.g., "claude-sonnet-4-20250514" or "gpt-4o"
  provider: "",                       // TODO: "anthropic" | "openai" | "custom"

  // ── Fallback / Offline Mode ───────────────────────────────
  offlineFallbackEnabled: true,
  offlineResponses: [
    "Our team will be with you shortly. Please leave your email and we will follow up.",
    "Thank you for reaching out. This feature is coming online soon.",
    "I am currently unavailable. Please contact us at [email] for immediate assistance."
  ],

  // ── System Prompt ─────────────────────────────────────────
  // Define the chatbot's persona and scope here.
  systemPrompt: `You are ASTER's intelligent customer assistant.
You are knowledgeable, professional, and concise.
You help users understand ASTER's products, services, pricing, and onboarding.
You do not discuss competitors or make promises not documented in official materials.
If you cannot answer a question, offer to connect the user with a human agent.`,

  // ── Rate Limiting (client-side soft limit) ────────────────
  maxMessagesPerSession: 50,
  sessionTimeoutMinutes: 30,

  // ── Features ──────────────────────────────────────────────
  persistHistory: true,
  showTypingIndicator: true,
  enableSuggestedReplies: true,
  suggestedReplies: [
    "What does ASTER do?",
    "How do I get started?",
    "What are the pricing options?",
    "I need technical support"
  ],
};

const CHATBOT_SECURITY = {
  requireSessionToken: true,
  sessionTokenEndpoint: "",           // TODO: e.g., "/api/chat/session"
  csrfProtection: true,
  allowedOrigins: [
    "https://isaacn-ai.github.io",
    "https://your-custom-domain.com"
  ],
};

(() => {
  const sanitize = (value) => {
    const text = String(value ?? "");
    if (window.DOMPurify && typeof window.DOMPurify.sanitize === "function") {
      return window.DOMPurify.sanitize(text, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
    }
    return text.replace(/[<>]/g, "");
  };

  const storageKey = "aster_chatbot_messages";
  let offlineIndex = 0;
  const messages = [];

  function nextOfflineReply() {
    const text = CHATBOT_CONFIG.offlineResponses[offlineIndex % CHATBOT_CONFIG.offlineResponses.length];
    offlineIndex += 1;
    return text;
  }

  function restoreFromStorage() {
    try {
      const raw = sessionStorage.getItem(storageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        parsed.forEach((m) => {
          if (m && typeof m.role === "string" && typeof m.content === "string") {
            messages.push(m);
          }
        });
      }
    } catch (_) {}
  }

  function persist() {
    try { sessionStorage.setItem(storageKey, JSON.stringify(messages)); } catch (_) {}
  }

  window.ASTERChatbot = {
    config: CHATBOT_CONFIG,
    security: CHATBOT_SECURITY,
    send(userInput) {
      if (messages.length >= CHATBOT_CONFIG.maxMessagesPerSession * 2) {
        return { role: "assistant", content: "Session limit reached. Please refresh to begin a new chat." };
      }
      const cleaned = sanitize(userInput).trim();
      if (!cleaned) return null;
      const userMessage = { role: "user", content: cleaned, timestamp: new Date().toISOString() };
      messages.push(userMessage);

      const reply = CHATBOT_CONFIG.apiEndpoint
        ? "Live endpoint configured. Wire this call through your secure backend proxy."
        : nextOfflineReply();

      const assistantMessage = { role: "assistant", content: reply, timestamp: new Date().toISOString() };
      messages.push(assistantMessage);
      persist();
      return assistantMessage;
    },
    history() { return [...messages]; },
    clear() {
      messages.length = 0;
      try { sessionStorage.removeItem(storageKey); } catch (_) {}
    },
  };

  restoreFromStorage();
})();
