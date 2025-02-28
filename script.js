document.addEventListener("DOMContentLoaded", function() {
    console.log("Dark Mode Toggle Script Loaded");

    const toggle = document.getElementById("darkModeToggle");
    const modeText = document.getElementById("mode-text");

    toggle.addEventListener("change", function () {
        document.body.classList.toggle("light-mode");
        console.log("Dark mode toggled:", document.body.classList.contains("light-mode"));
        modeText.textContent = document.body.classList.contains("light-mode") ? "Light Mode" : "Dark Mode";
    });

    // Particle Background Effect
    console.log("Loading Particles.js...");
    particlesJS("particles-js", {
        particles: {
            number: { value: 80 },
            color: { value: "#0ff" },
            shape: { type: "circle" },
            opacity: { value: 0.7 },
            size: { value: 3 },
            line_linked: { enable: true, color: "#0ff", opacity: 0.5, width: 1 },
            move: { enable: true, speed: 3 }
        }
    }, function() {
        console.log("Particles.js initialized successfully");
    });
});
