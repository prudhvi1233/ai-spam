// === Configuration: put your real AI API endpoint here ===
const AI_API_URL = "https://your-backend.example.com/spam-classify";

const analyzeBtn = document.getElementById("analyzeBtn");
const clearBtn = document.getElementById("clearBtn");
const emailText = document.getElementById("emailText");
const statusPill = document.getElementById("statusPill");
const resultBadge = document.getElementById("resultBadge");
const confidenceText = document.getElementById("confidenceText");
const confidenceBar = document.getElementById("confidenceBar");
const explanationText = document.getElementById("explanationText");
const reasonTags = document.getElementById("reasonTags");

function setBadge(label) {
    resultBadge.classList.remove("badge-spam", "badge-ham", "badge-unknown");

    if (label === "spam") {
        resultBadge.textContent = "Spam";
        resultBadge.classList.add("badge-spam");
    } else if (label === "ham" || label === "not_spam") {
        resultBadge.textContent = "Not spam";
        resultBadge.classList.add("badge-ham");
    } else {
        resultBadge.textContent = "Unknown";
        resultBadge.classList.add("badge-unknown");
    }
}

function setConfidence(value) {
    if (typeof value !== "number" || isNaN(value)) {
        confidenceText.textContent = "Confidence: --";
        confidenceBar.style.width = "0%";
        return;
    }
    const percent = Math.round(value * 100);
    confidenceText.textContent = "Confidence: " + percent + "%";
    confidenceBar.style.width = percent + "%";
}

function setReasons(reasons) {
    reasonTags.innerHTML = "";
    if (!Array.isArray(reasons) || reasons.length === 0) {
        const span = document.createElement("span");
        span.className = "reason-tag";
        span.textContent = "No specific reasons provided";
        reasonTags.appendChild(span);
        return;
    }
    reasons.forEach(r => {
        const span = document.createElement("span");
        span.className = "reason-tag";
        span.textContent = r;
        reasonTags.appendChild(span);
    });
}

function fakeLocalClassifier(text) {
    const spamKeywords = ["win", "winner", "free", "prize", "lottery", "click here", "claim now", "credit card", "urgent", "act now"];
    const lowered = text.toLowerCase();
    let hits = 0;
    spamKeywords.forEach(k => {
        if (lowered.includes(k)) hits++;
    });

    if (hits === 0) {
        return {
            label: "ham",
            confidence: 0.6,
            reasons: ["No common spam keywords detected"],
            explanation: "The content does not match usual spam patterns in this simple demo classifier."
        };
    } else {
        const conf = Math.min(0.5 + hits * 0.07, 0.99);
        return {
            label: "spam",
            confidence: conf,
            reasons: ["Matched " + hits + " known spam keyword(s)"],
            explanation: "The text contains phrases frequently used in spam campaigns in this demo classifier."
        };
    }
}

async function classifyEmail() {
    const text = emailText.value.trim();
    if (!text) {
        alert("Please paste or type an email first.");
        return;
    }

    analyzeBtn.disabled = true;
    statusPill.textContent = "Analyzing with AI...";
    statusPill.style.color = "#a5b4fc";

    try {
        let result;

        if (AI_API_URL.startsWith("https://your-backend.example.com")) {
            result = fakeLocalClassifier(text);
        } else {
            const response = await fetch(AI_API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text })
            });

            if (!response.ok) throw new Error("API request failed");
            result = await response.json();
        }

        setBadge(result.label);
        setConfidence(result.confidence);
        explanationText.textContent = result.explanation;
        setReasons(result.reasons);

        statusPill.textContent = "Done • classification updated";
        statusPill.style.color = "#22c55e";
    } catch (err) {
        statusPill.textContent = "Error • could not reach AI service";
        statusPill.style.color = "#f97373";
    } finally {
        analyzeBtn.disabled = false;
    }
}

analyzeBtn.addEventListener("click", classifyEmail);

clearBtn.addEventListener("click", () => {
    emailText.value = "";
    statusPill.textContent = "Idle • waiting for input";
    statusPill.style.color = "#9ca3af";
    setBadge("unknown");
    setConfidence(NaN);
    explanationText.textContent = "The AI will highlight spam indicators once you analyze an email.";
    setReasons(["No analysis yet"]);
});
