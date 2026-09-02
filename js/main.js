/* ============================================================
   Sittal Basyal — Portfolio interactions
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Navbar: scroll state ---------- */
  var nav = document.getElementById("nav");
  if (nav) {
    function navToggle() {
      nav.classList.toggle("scrolled", window.scrollY > 24);
    }
    window.addEventListener("scroll", navToggle, { passive: true });
    navToggle();
  }

  /* ---------- Mobile menu ---------- */
  var toggle = document.getElementById("nav-toggle");
  var links = document.getElementById("nav-links");
  if (toggle && links) {
    function closeMenu() {
      toggle.classList.remove("open");
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
  }

  /* ---------- Active nav link on scroll ---------- */
  var sections = document.querySelectorAll("section[id]");
  var navLinks = document.querySelectorAll(".nav-link");
  if (sections.length && navLinks.length) {
    function activeLink() {
      var pos = window.scrollY + 130;
      var current = "";
      sections.forEach(function (sec) {
        if (pos >= sec.offsetTop) {
          current = sec.getAttribute("id");
        }
      });
      navLinks.forEach(function (l) {
        l.classList.toggle("active", l.getAttribute("href") === "#" + current);
      });
    }
    window.addEventListener("scroll", activeLink, { passive: true });
    activeLink();
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("visible");
    });
  }

  /* ============================================================
     Interactive Terminal
     ============================================================ */
  var termBody = document.getElementById("term-body");
  var realInput = document.getElementById("term-real-input");
  var terminalWindow = document.getElementById("terminal-window");

  if (termBody && realInput) {
    var promptStr = "sittal@portfolio:~$";
    var history = [];
    var historyIndex = -1;
    var currentDraft = "";
    var busy = false;
    var touchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (touchDevice && terminalWindow) {
      terminalWindow.classList.add("term-touch");
    }

    function getInputSpan() {
      return termBody.querySelector("#term-input");
    }

    var commands = {
      help: function () {
        return [
          "<div class='cmd-block'>" +
            "<span class='tc-ink'>Available commands:</span><br>" +
            "<span class='tc-accent'>help</span>     — show this help<br>" +
            "<span class='tc-accent'>whoami</span>   — who am I<br>" +
            "<span class='tc-accent'>skills</span>   — tech stack<br>" +
            "<span class='tc-accent'>projects</span> — featured work<br>" +
            "<span class='tc-accent'>learning</span> — what I'm exploring now<br>" +
            "<span class='tc-accent'>journey</span>  — education &amp; experience<br>" +
            "<span class='tc-accent'>contact</span>  — get in touch<br>" +
            "<span class='tc-accent'>cls</span>      — clear the screen<br>" +
            "</div>" +
            "<span class='tc-dim'>Tip: press </span><span class='tc-ink'>↑ / ↓</span><span class='tc-dim'> for history, or tap a suggested command below.</span>"
          ];
      },

      whoami: function () {
        return [
          "<span class='tc-ok'>sittal.basyal</span><br>" +
          "<div class='cmd-block'>" +
            "<span class='tc-dim'>Name:</span>    <span class='tc-ink'>Sittal Basyal</span><br>" +
            "<span class='tc-dim'>Role:</span>    <span class='tc-ink'>AI / Software Engineer</span><br>" +
            "<span class='tc-dim'>Based in:</span> <span class='tc-ink'>Nepal</span><br>" +
            "<span class='tc-dim'>Focus:</span>   <span class='tc-ink'>AI · ML · Software</span><br>" +
            "<span class='tc-dim'>Status:</span>   <span class='tc-ink'>Open to collaboration</span>" +
          "</div>"
        ];
      },

      skills: function () {
        return [
          "<div class='cmd-block'>" +
            "<span class='tc-dim'>Languages:</span> <span class='tc-ink'>Python · JavaScript · SQL</span><br>" +
            "<span class='tc-dim'>AI / ML:</span> <span class='tc-ink'>TensorFlow · PyTorch · scikit-learn</span><br>" +
            "<span class='tc-dim'>Data:</span> <span class='tc-ink'>NumPy · Pandas · Matplotlib</span><br>" +
            "<span class='tc-dim'>Fields:</span> <span class='tc-ink'>Deep Learning · Computer Vision · Generative AI</span><br>" +
            "<span class='tc-dim'>Web:</span> <span class='tc-ink'>HTML · CSS · JavaScript · FastAPI</span><br>" +
            "<span class='tc-dim'>Tools:</span> <span class='tc-ink'>Git · Docker · Jupyter · VS Code</span>" +
            "</div>"
        ];
      },

      projects: function () {
        return [
          "<span class='tc-ok'>Featured projects — click to jump:</span><br>" +
            "<div class='cmd-block'>" +
            "<span class='tc-accent'>01</span> <span class='tc-ink'>Dog Breed Classifier</span><br>" +
            "<span class='tc-dent'><a class='term-link' href='#p1'>→ View project</a></span><br>" +
            "<span class='tc-accent'>02</span> <span class='tc-ink'>Bank Loan Approval Predictor</span><br>" +
            "<span class='tc-dent'><a class='term-link' href='#p2'>→ View project</a></span><br>" +
            "<span class='tc-accent'>03</span> <span class='tc-ink'>Neural Imaging Pipeline</span><br>" +
            "<span class='tc-dent'><a class='term-link' href='#p3'>→ View project</a></span><br>" +
            "<span class='tc-accent'>04</span> <span class='tc-ink'>Data Insight Generator</span><br>" +
            "<span class='tc-dent'><a class='term-link' href='#p4'>→ View project</a></span>" +
            "</div>"
        ];
      },

      journey: function () {
        return [
          "<span class='tc-ok'>My journey so far:</span><br>" +
            "<div class='cmd-block'>" +
            "<span class='tc-dim'>2025 — present</span> <span class='tc-ink'>BSc. CSIT</span> — Tribhuvan University<br>" +
            "<span class='tc-dim'>2025</span> <span class='tc-ink'>Secretary, Code for Change Rupandehi</span><br>" +
            "<span class='tc-dim'>2025</span> <span class='tc-ink'>Finalist, CodeFest Provincial</span><br>" +
            "<span class='tc-dim'>2024</span> <span class='tc-ink'>IEEE Nepathya College Student Branch</span>" +
            "</div>"
        ];
      },

      contact: function () {
        return [
          "<div class='cmd-block'>" +
            "<span class='tc-dim'>Email</span>     <span class='tc-accent'>→</span> <a href='mailto:bashyalshittal@gmail.com'>bashyalshittal@gmail.com</a><br>" +
            "<span class='tc-dim'>LinkedIn</span> <span class='tc-accent'>→</span> <a href='https://www.linkedin.com/in/sittal-basyal-5a162a32b/' target='_blank' rel='noopener'>/in/sittal-basyal</a><br>" +
            "<span class='tc-dim'>GitHub</span>   <span class='tc-accent'>→</span> <a href='https://github.com/sittal-basyal' target='_blank' rel='noopener'>/sittal-basyal</a>" +
            "</div>"
        ];
      },

      learning: function () {
        return [
          "<span class='tc-ok'>Currently exploring — in depth:</span><br>" +
          "<div class='cmd-block'>" +
            "<span class='tc-dim'>→ Deep Learning</span><br>" +
            "<span class='tc-soft'>building intuition for backpropagation, optimization, and training dynamics</span><br>" +
            "<span class='tc-dim'>→ Neural Networks</span><br>" +
            "<span class='tc-soft'>feed-forward → CNN / RNN architectures</span><br>" +
            "<span class='tc-dim'>→ Computer Vision</span><br>" +
            "<span class='tc-soft'>image classification, object detection, CNNs in practice</span><br>" +
            "<span class='tc-dim'>→ Large Language Models</span><br>" +
            "<span class='tc-soft'>transformers, attention, prompting &amp; fine-tuning</span>" +
          "</div>"
        ];
      },

      clear: function () {
        return null;
      }
    };

    function scrollTerm() {
      if (termBody) termBody.scrollTop = termBody.scrollHeight;
    }

    function renderPrompt() {
      var span = getInputSpan();
      if (span) span.textContent = realInput.value;
      scrollTerm();
    }

    /* Remove the active prompt row, rebuild it at the bottom */
    function ensurePromptRow() {
      var current = termBody.querySelector(".term-prompt-row");
      if (!current) {
        current = document.createElement("div");
        current.className = "term-line term-prompt-row";
        current.id = "prompt-row";
        current.innerHTML =
          '<span class="term-prompt">' + promptStr + "</span>" +
          '<span class="term-input" id="term-input"></span>' +
          '<span class="term-cursor" aria-hidden="true"></span>';
        termBody.appendChild(current);
      }
      return current;
    }

    function freezePromptRow(row) {
      if (!row) return;
      row.removeAttribute("id");
      row.classList.remove("term-prompt-row");
      row.classList.add("term-typed", "term-cmd-line");
      var input = row.querySelector(".term-input");
      if (input) input.removeAttribute("id");
      var cursor = row.querySelector(".term-cursor");
      if (cursor) cursor.remove();
    }

    /* Print message(s) with typing animation */
    function typeOut(messages, callback) {
      if (!messages || messages.length === 0) {
        if (callback) callback();
        return;
      }
      var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      var index = 0;
      var div = document.createElement("div");
      div.className = "term-line term-typed";
      termBody.insertBefore(div, termBody.querySelector(".term-prompt-row"));
      var msgArr = messages.slice();

      function textContentOf(html) {
        var tmp = document.createElement("span");
        tmp.innerHTML = html;
        return tmp.textContent || "";
      }

      function typeNext() {
        if (index >= msgArr.length) {
          var lastMsg = div.querySelector(".cmd-msg:last-child");
          if (lastMsg) lastMsg.style.marginBottom = "14px";
          if (callback) callback();
          return;
        }
        var fullHTML = msgArr[index];
        var el = document.createElement("span");
        el.className = "cmd-msg";
        div.appendChild(el);
        var fullText = textContentOf(fullHTML);
        var ci = 0;

        function typeChar() {
          if (ci < fullText.length) {
            el.textContent = fullText.slice(0, ci + 1);
            ci++;
            scrollTerm();
            if (!reduced) {
              window.setTimeout(typeChar, 4 + Math.random() * 14);
            } else {
              typeChar();
            }
          } else {
            el.innerHTML = fullHTML;
            index++;
            window.setTimeout(typeNext, 90);
          }
        }
        typeChar();
      }
      typeNext();
    }

    function runCommand(raw) {
      var value = raw.trim();
      if (!value) {
        busy = false;
        return;
      }
      // record history unless it duplicates the last
      var lower = value.toLowerCase();
      if (history[history.length - 1] !== value && lower !== "clear" && lower !== "cls") {
        history.push(value);
      }
      historyIndex = history.length;
      currentDraft = "";

      var parts = value.split(/\s+/);
      var cmd = parts[0].toLowerCase();

      if (cmd === "clear" || cmd === "cls") {
        termBody.innerHTML = "";
        realInput.value = "";
        ensurePromptRow();
        renderPrompt();
        busy = false;
        realInput.focus();
        return;
      }

      if (commands[cmd]) {
        var output = commands[cmd]();
        typeOut(output, function () {
          realInput.value = "";
          renderPrompt();
          busy = false;
        });
      } else {
        typeOut(['<span class="tc-dim">command not found:</span> <span class="tc-ink">' + cmd + "</span>. Type <span class='tc-accent'>help</span> to see available commands."], function () {
          realInput.value = "";
          renderPrompt();
          busy = false;
        });
      }
    }

    function appendPromptLine(text) {
      // echo a non-output command (e.g. blank) as a normal line
      var promptRow = termBody.querySelector(".term-prompt-row");
      if (!promptRow) ensurePromptRow();
      var el = document.createElement("div");
      el.className = "term-line term-typed";
      el.innerHTML = '<span class="cmd-line">' + promptStr + " " + text + "</span>";
      termBody.insertBefore(el, termBody.querySelector(".term-prompt-row"));
      scrollTerm();
    }

    /* Focus management: clicking terminal focuses hidden input */
    function focusTerm() {
      realInput.focus();
    }

    function setTermActive(active) {
      if (terminalWindow) terminalWindow.classList.toggle("term-active", active);
    }

    /* Input handlers */
    realInput.addEventListener("keydown", function (e) {
      if (busy) {
        if (e.key === "c" && e.ctrlKey) {
          // emulate ctrl+c
          e.preventDefault();
          busy = false;
          var pr = termBody.querySelector(".term-prompt-row");
          if (pr) {
            realInput.value = "";
            renderPrompt();
          }
          appendPromptLine("^C");
        }
        e.preventDefault();
        return;
      }

      if (e.key === "Enter") {
        e.preventDefault();
        var val = realInput.value;
        var pr = termBody.querySelector(".term-prompt-row");
        if (pr) freezePromptRow(pr);
        ensurePromptRow();
        realInput.value = "";
        renderPrompt();
        busy = true;
        runCommand(val);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (historyIndex > 0) {
          if (historyIndex === history.length) currentDraft = realInput.value;
          historyIndex--;
          realInput.value = history[historyIndex];
          renderPrompt();
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex < history.length) {
          historyIndex++;
          realInput.value = historyIndex === history.length ? currentDraft : history[historyIndex];
          renderPrompt();
        }
      } else if (e.key === "l" && e.ctrlKey) {
        e.preventDefault();
        termBody.innerHTML = "";
        ensurePromptRow();
        renderPrompt();
      }
    });

    realInput.addEventListener("input", renderPrompt);

    /* Clickable suggested commands */
    var tips = document.querySelectorAll(".tip");
    tips.forEach(function (tip) {
      tip.addEventListener("click", function () {
        if (busy) return;
        var cmd = tip.getAttribute("data-cmd") || "";
        var pr = termBody.querySelector(".term-prompt-row");
        if (pr) freezePromptRow(pr);
        ensurePromptRow();
        realInput.value = "";
        renderPrompt();
        busy = true;
        runCommand(cmd);
        realInput.focus();
      });
    });

    /* Clicking the terminal body focuses input */
    if (termBody) termBody.addEventListener("click", focusTerm);
    if (terminalWindow) terminalWindow.addEventListener("mousedown", function () { realInput.focus(); });

    /* Blinking cursor only while the terminal is focused */
    realInput.addEventListener("focus", function () { setTermActive(true); });
    realInput.addEventListener("blur", function () { setTermActive(false); });

    /* Initial render */
    ensurePromptRow();
    renderPrompt();
  }
})();
