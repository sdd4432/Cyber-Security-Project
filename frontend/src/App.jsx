import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [history, setHistory] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [status, setStatus] = useState("System Secure");
  const [password, setPassword] = useState("");
  const [url, setUrl] = useState("");
  const [urlResult, setUrlResult] = useState(null);
  const [securityScore, setSecurityScore] = useState(85);

 const startScan = async () => {
  setScanning(true);
  setStatus("Scanning...");

  try {
    const response = await fetch("http://127.0.0.1:5000/scan");
    const data = await response.json();

    setStatus(data.message);
  } catch (error) {
    setStatus("Backend connection failed");
  } finally {
    setScanning(false);
  }
};

  const passwordScore = () => {
    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (!password) return { text: "Enter a password", className: "" };
    if (score <= 2) return { text: "🔴 Weak Password", className: "weak" };
    if (score <= 4) return { text: "🟡 Medium Password", className: "medium" };

    return { text: "🟢 Strong Password", className: "strong" };
  };

  const checkUrl = () => {
    if (!url.trim()) {
      setUrlResult({
        text: "Please enter a URL",
        className: "medium",
      });
      return;
    }

    const suspiciousWords = [
      "login",
      "verify",
      "account",
      "password",
      "secure",
      "free",
      "claim",
      "update",
    ];

    const lowerUrl = url.toLowerCase();

    const hasSuspiciousWord = suspiciousWords.some((word) =>
      lowerUrl.includes(word)
    );

    const hasIpAddress =
      /https?:\/\/\d{1,3}(\.\d{1,3}){3}/.test(lowerUrl);

    const hasHttp = lowerUrl.startsWith("http://");

    if (hasIpAddress || hasHttp) {
      setUrlResult({
        text: "🔴 High Risk URL",
        className: "weak",
      });
    } else if (hasSuspiciousWord) {
      setUrlResult({
        text: "🟡 Suspicious URL",
        className: "medium",
      });
    } else {
      setUrlResult({
        text: "🟢 Looks Safe",
        className: "strong",
      });
    }
  };

  const result = passwordScore();

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>🛡️ CyberGuard</h2>

        <div className="menu active">📊 Dashboard</div>
       <div
  className="menu"
 onClick={() => document.getElementById("threat-detection").scrollIntoView({ behavior: "smooth" })}
>
  🚨 Threat Detection
</div>
        <div
  className="menu"
  onClick={() => document.getElementById("password-security")?.scrollIntoView({ behavior: "smooth" })}
  >
  🔐 Password Security
</div>
        <div
  className="menu"
  onClick={() => document.getElementById("phishing-awareness")?.scrollIntoView({ behavior: "smooth" })}
>
  🌐 Phishing Awareness
</div>
        <div className="menu">⚙️ Settings</div>
      </aside>

      <main className="main">
        <header>
          <div>
            <h1>Cyber Security Dashboard</h1>
            <p>Awareness & Threat Detection System</p>
          </div>

          <div className="online">
            <span></span> System Online
          </div>
        </header>

        <section className="cards">
          <div className="card">
            <h3>Security Status</h3>
            <strong className="green">🟢 Secure</strong>
            <p>Your system is protected</p>
          </div>

          <div className="card">
            <h3>Threats Detected</h3>
            <strong>0</strong>
            <p>No active threats</p>
          </div>

          <div className="card">
            <h3>Security Score</h3>
            <strong>92%</strong>
            <p>Excellent security level</p>
          </div>

          <div className="card">
            <h3>Last Scan</h3>
            <strong>Today</strong>
            <p>System scan completed</p>
          </div>
        </section>

        <section id="threat-detection" className="dashboard">
          <div className="panel">
            <h2>🔍 Threat Detection</h2>
            <p>Run a basic security scan of the application.</p>

            <button onClick={startScan} disabled={scanning}>
              {scanning ? "Scanning..." : "Start Security Scan"}
            </button>

            <div className="scan-status">
              <span>●</span> {status}
            </div>
          </div>

          <div className="panel" id="password-security">
            <h2>🔐 Password Security Checker</h2>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter test password"
              className="password-input"
            />

            <div className={`password-result ${result.className}`}>
              {result.text}
            </div>

            <div className="password-rules">
              <p className={password.length >= 8 ? "valid" : ""}>
                {password.length >= 8 ? "✓" : "○"} At least 8 characters
              </p>

              <p className={/[A-Z]/.test(password) ? "valid" : ""}>
                {/[A-Z]/.test(password) ? "✓" : "○"} Uppercase letter
              </p>

              <p className={/[a-z]/.test(password) ? "valid" : ""}>
                {/[a-z]/.test(password) ? "✓" : "○"} Lowercase letter
              </p>

              <p className={/[0-9]/.test(password) ? "valid" : ""}>
                {/[0-9]/.test(password) ? "✓" : "○"} Number
              </p>

              <p className={/[^A-Za-z0-9]/.test(password) ? "valid" : ""}>
                {/[^A-Za-z0-9]/.test(password) ? "✓" : "○"} Special character
              </p>
            </div>
          </div>
        </section>

        <section id="phishing-awareness" className="panel url-panel">
          <h2>🌐 Phishing URL Checker</h2>

          <p>
            Enter a website URL to perform a basic suspicious-link analysis.
          </p>

          <div className="url-box">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="url-input"
            />

            <button onClick={checkUrl}>Check URL</button>
          </div>

          {urlResult && (
            <div className={`url-result ${urlResult.className}`}>
              {urlResult.text}
            </div>
          )}

          <small>
            ⚠️ This is an educational checker and does not guarantee that a
            website is safe.
          </small>
        </section>

        <section className="panel tips">
          <h2>🔐 Cyber Security Tips</h2>

          <div className="tip-grid">
            <div>🔑 Use strong and unique passwords</div>
            <div>📱 Enable two-factor authentication</div>
            <div>🌐 Avoid suspicious links</div>
            <div>🔄 Keep software updated</div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;