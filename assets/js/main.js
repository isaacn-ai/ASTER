/* Global site helpers for ASTER static builds. */
const CONTACT_ENDPOINT = ""; // TODO: configure

(() => {
  const root = document.documentElement;
  const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
  const initial = localStorage.getItem("aster-theme") || (prefersLight ? "light" : "dark");
  root.dataset.theme = initial;

  window.ASTERTheme = {
    set(theme) {
      root.dataset.theme = theme === "light" ? "light" : "dark";
      localStorage.setItem("aster-theme", root.dataset.theme);
    },
    toggle() {
      this.set(root.dataset.theme === "light" ? "dark" : "light");
      return root.dataset.theme;
    },
    get() { return root.dataset.theme; },
  };

  window.ASTERContact = {
    endpoint: CONTACT_ENDPOINT,
    async submit(payload) {
      if (!CONTACT_ENDPOINT) {
        return { ok: true, demoMode: true, message: "Demo mode active. Configure CONTACT_ENDPOINT." };
      }
      const response = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return { ok: response.ok, status: response.status };
    },
  };
})();
