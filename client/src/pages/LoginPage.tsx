import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const [, setLocation] = useLocation();

  // Restore normal cursor for login panel
  useEffect(() => {
    document.body.style.cursor = "auto";
    return () => {
      document.body.style.cursor = "none";
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      setLocation("/admin");
      toast.success("Welcome to DREAMER Admin Dashboard!", {
        style: { background: "var(--dreamer-charcoal)", color: "white", border: "1px solid rgba(161,193,216,0.2)" },
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed", {
        style: { background: "var(--dreamer-charcoal)", color: "white", border: "1px solid rgba(161,193,216,0.2)" },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
    }}>
      <div style={{
        width: "100%",
        maxWidth: "400px",
      }}>
        {/* Logo */}
        <div style={{
          textAlign: "center",
          marginBottom: 48,
        }}>
          <h1 style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: 32,
            fontWeight: 400,
            color: "white",
            margin: 0,
            marginBottom: 8,
          }}>
            DREAMER
          </h1>
          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 12,
            letterSpacing: "0.2em",
            color: "var(--dreamer-blue)",
            textTransform: "uppercase",
            margin: 0,
          }}>
            Admin Dashboard
          </p>
        </div>

        {/* Form Card */}
        <div style={{
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(161, 193, 216, 0.1)",
          borderRadius: "8px",
          padding: 40,
          backdropFilter: "blur(10px)",
        }}>
          <h2 style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 18,
            fontWeight: 600,
            color: "white",
            marginBottom: 24,
            textAlign: "center",
          }}>
            Access Dashboard
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div style={{ marginBottom: 20 }}>
              <label style={{
                display: "block",
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 12,
                fontWeight: 500,
                color: "rgba(255, 255, 255, 0.7)",
                marginBottom: 8,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(161, 193, 216, 0.2)",
                  borderRadius: "6px",
                  color: "white",
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 14,
                  transition: "all 0.3s",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                  e.currentTarget.style.borderColor = "rgba(161, 193, 216, 0.4)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                  e.currentTarget.style.borderColor = "rgba(161, 193, 216, 0.2)";
                }}
              />
            </div>

            {/* Password Input */}
            <div style={{ marginBottom: 32 }}>
              <label style={{
                display: "block",
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 12,
                fontWeight: 500,
                color: "rgba(255, 255, 255, 0.7)",
                marginBottom: 8,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(161, 193, 216, 0.2)",
                  borderRadius: "6px",
                  color: "white",
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 14,
                  transition: "all 0.3s",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                  e.currentTarget.style.borderColor = "rgba(161, 193, 216, 0.4)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                  e.currentTarget.style.borderColor = "rgba(161, 193, 216, 0.2)";
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "12px 24px",
                background: isLoading ? "rgba(161, 193, 216, 0.3)" : "var(--dreamer-blue)",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                cursor: isLoading ? "not-allowed" : "pointer",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.background = "rgba(161, 193, 216, 0.9)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.background = "var(--dreamer-blue)";
                }
              }}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
