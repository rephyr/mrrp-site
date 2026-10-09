(() => {
  document.documentElement.classList.add("js");

  // --- The café knows what time it is where you are ---
  const now = new Date();
  const h = now.getHours();
  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const tod = h >= 22 || h < 5 ? "night" : h < 11 ? "morning" : h < 18 ? "day" : "evening";
  document.body.dataset.tod = tod;
  const lines = {
    night: [`It's ${time} where you are. We're open late; the café cat has her nightcap on.`],
    morning: [`It's ${time} where you are. Just opened, the cats are still waking up.`],
    day: [`It's ${time} where you are. Open, and the cats are on shift.`],
    evening: [`It's ${time} where you are. Open, the lamps are on.`],
  };
  const clock = document.querySelector("[data-clock]");
  if (clock) clock.textContent = lines[tod][0];
  const year = document.querySelector("[data-year]");
  if (year) year.textContent = String(now.getFullYear());

  // --- Toast ---
  const toast = document.querySelector("[data-toast]");
  let toastTimer;
  const say = (msg) => {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
  };

  // --- The house cat on the ledge ---
  const cat = document.querySelector("[data-housecat]");
  const bubble = document.querySelector("[data-bubble]");
  const sounds = ["mrrp?", "mrrp!", "prrrr", "mew.", "…mrrp"];
  let pets = 0, sleepTimer;
  const wake = (msg) => {
    if (!cat) return;
    cat.classList.add("awake");
    if (msg && bubble) bubble.textContent = msg;
    clearTimeout(sleepTimer);
    sleepTimer = setTimeout(() => cat.classList.remove("awake"), 3200);
  };
  if (cat) {
    cat.addEventListener("pointerenter", () => wake("mrrp?"));
    cat.addEventListener("focus", () => wake("mrrp?"));
    cat.addEventListener("click", () => {
      pets += 1;
      wake(pets >= 5 ? "prrrrrrrr ♥" : sounds[pets % sounds.length]);
    });
  }

  // --- Hidden cats ---
  const KEY = "mrrp-found-cats";
  let found = [];
  try { found = JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { found = []; }
  const counter = document.querySelector("[data-found]");
  const total = document.querySelectorAll(".hidden-cat").length;
  const render = () => { if (counter) counter.textContent = String(found.length); };
  document.querySelectorAll(".hidden-cat").forEach((btn) => {
    const id = btn.dataset.cat;
    if (found.includes(id)) { btn.classList.add("found"); btn.setAttribute("aria-label", "A cat you already found"); }
    btn.addEventListener("click", () => {
      if (found.includes(id)) return;
      found.push(id);
      try { localStorage.setItem(KEY, JSON.stringify(found)); } catch {}
      btn.classList.add("found");
      btn.setAttribute("aria-label", "A cat you already found");
      render();
      if (found.length === total) {
        say("All five cats found. The café cat approves.");
        wake("prrrrrrrr ♥");
      } else {
        say(`Found a cat! ${found.length} of ${total}.`);
      }
    });
  });
  render();
})();
