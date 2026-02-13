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

function fakeLocalClassifier(text) {
    const spamKeywords = ["win","free","prize","lottery","click here","urgent"];
    const lowered = text.toLowerCase();
    let hits = spamKeywords.filter(k => lowered.includes(k)).length;

    if (hits === 0) {
        return {
            label: "ham",
            confidence: 0.6,
            reasons: ["No spam keywords detected"],
            explanation: "Looks like a normal email."
        };
    } else {
        return {
            label: "spam",
            confidence: Math.min(0.5 + hits * 0.1, 0.99),
            reasons: ["Matched spam keywords"],
            explanation: "Contains phrases commonly used in spam emails."
        };
    }
}

analyzeBtn.addEventListener("click", () => {
    const text = emailText.value.trim();
    if (!text) return alert("Enter email text");

    const result = fakeLocalClassifier(text);

    resultBadge.textContent = result.label.toUpperCase();
    confidenceText.textContent = "Confidence: " + Math.round(result.confidence * 100) + "%";
    confidenceBar.style.width = Math.round(result.confidence * 100) + "%";
    explanationText.textContent = result.explanation;

    reasonTags.innerHTML = "";
    result.reasons.forEach(r => {
        const span = document.createElement("span");
        span.className = "reason-tag";
        span.textContent = r;
        reasonTags.appendChild(span);
    });

    statusPill.textContent = "Done";
});

clearBtn.addEventListener("click", () => location.reload());
