import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface Inscription {
  id: string;
  boutique_name: string;
  buyer_name: string;
  email: string;
  phone: string;
  address: string;
  collections: string;
  contacted: boolean;
  created_at: string;
}

export default function AdminPage() {
  const { isAuthenticated, isLoading: authLoading, logout, userEmail } = useAuth();
  const [, setLocation] = useLocation();
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "contacted">("all");

  // Restore normal cursor for admin panel
  useEffect(() => {
    document.body.style.cursor = "auto";
    return () => {
      document.body.style.cursor = "none";
    };
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, authLoading, setLocation]);

  // Load inscriptions
  useEffect(() => {
    if (isAuthenticated) {
      loadInscriptions();
    }
  }, [isAuthenticated]);

  const loadInscriptions = async () => {
    setIsLoading(true);
    try {
      const data = await supabase.getInscriptions();
      // Sort by created_at descending (newest first)
      const sorted = (data || []).sort((a: any, b: any) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
      setInscriptions(sorted);
    } catch (error) {
      console.error("Error loading inscriptions:", error);
      toast.error("Failed to load inscriptions", {
        style: { background: "var(--dreamer-charcoal)", color: "white" },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleContacted = async (id: string, currentStatus: boolean) => {
    try {
      await supabase.updateInscription(id, { contacted: !currentStatus });
      setInscriptions((prev) =>
        prev.map((insc) =>
          insc.id === id ? { ...insc, contacted: !currentStatus } : insc
        )
      );
      toast.success("Status updated", {
        style: { background: "var(--dreamer-charcoal)", color: "white" },
      });
    } catch (error) {
      console.error("Error updating inscription:", error);
      toast.error("Failed to update status", {
        style: { background: "var(--dreamer-charcoal)", color: "white" },
      });
    }
  };

  const filteredInscriptions = inscriptions.filter((insc) => {
    const matchesSearch = 
      insc.boutique_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      insc.buyer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      insc.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === "pending") return matchesSearch && !insc.contacted;
    if (filterStatus === "contacted") return matchesSearch && insc.contacted;
    return matchesSearch;
  });

  const exportToCSV = () => {
    const headers = ["Boutique", "Buyer Name", "Email", "Phone", "Address", "Collections", "Status", "Date"];
    const rows = filteredInscriptions.map((insc) => [
      insc.boutique_name,
      insc.buyer_name,
      insc.email,
      insc.phone,
      insc.address,
      insc.collections,
      insc.contacted ? "Contacted" : "Pending",
      new Date(insc.created_at).toLocaleDateString(),
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dreamer-inscriptions-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  if (authLoading) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <p style={{ color: "white", fontFamily: "'Montserrat', sans-serif" }}>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0f0f23",
      color: "white",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        padding: "24px",
        borderBottom: "1px solid rgba(161, 193, 216, 0.1)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <div>
          <h1 style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: 32,
            fontWeight: 400,
            color: "white",
            margin: 0,
            marginBottom: 4,
          }}>
            DREAMER Admin
          </h1>
          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 12,
            color: "var(--dreamer-blue)",
            margin: 0,
          }}>
            Logged in as: {userEmail}
          </p>
        </div>
        <button
          onClick={() => {
            logout();
            setLocation("/");
          }}
          style={{
            padding: "10px 20px",
            background: "rgba(255, 59, 48, 0.2)",
            border: "1px solid rgba(255, 59, 48, 0.4)",
            color: "#ff3b30",
            borderRadius: "6px",
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.3s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 59, 48, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 59, 48, 0.2)";
          }}
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div style={{ padding: "32px 24px" }}>
        {/* Stats */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
          marginBottom: 32,
        }}>
          <div style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(161, 193, 216, 0.1)",
            borderRadius: "8px",
            padding: 20,
          }}>
            <p style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 12,
              color: "rgba(255, 255, 255, 0.6)",
              margin: 0,
              marginBottom: 8,
              textTransform: "uppercase",
            }}>
              Total Inscriptions
            </p>
            <p style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 32,
              fontWeight: 700,
              color: "var(--dreamer-blue)",
              margin: 0,
            }}>
              {inscriptions.length}
            </p>
          </div>
          <div style={{
            background: "rgba(161, 193, 216, 0.05)",
            border: "1px solid rgba(161, 193, 216, 0.1)",
            borderRadius: "8px",
            padding: 20,
          }}>
            <p style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 12,
              color: "rgba(255, 255, 255, 0.6)",
              margin: 0,
              marginBottom: 8,
              textTransform: "uppercase",
            }}>
              Pending Contact
            </p>
            <p style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 32,
              fontWeight: 700,
              color: "#ffd700",
              margin: 0,
            }}>
              {inscriptions.filter((i) => !i.contacted).length}
            </p>
          </div>
          <div style={{
            background: "rgba(76, 175, 80, 0.05)",
            border: "1px solid rgba(76, 175, 80, 0.2)",
            borderRadius: "8px",
            padding: 20,
          }}>
            <p style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 12,
              color: "rgba(255, 255, 255, 0.6)",
              margin: 0,
              marginBottom: 8,
              textTransform: "uppercase",
            }}>
              Contacted
            </p>
            <p style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 32,
              fontWeight: 700,
              color: "#4caf50",
              margin: 0,
            }}>
              {inscriptions.filter((i) => i.contacted).length}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div style={{
          display: "flex",
          gap: 16,
          marginBottom: 24,
          flexWrap: "wrap",
          alignItems: "center",
        }}>
          <input
            type="text"
            placeholder="Search by name, email, or boutique..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              minWidth: "200px",
              padding: "10px 16px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(161, 193, 216, 0.2)",
              borderRadius: "6px",
              color: "white",
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 14,
            }}
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            style={{
              padding: "10px 16px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(161, 193, 216, 0.2)",
              borderRadius: "6px",
              color: "white",
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 14,
            }}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="contacted">Contacted</option>
          </select>
          <button
            onClick={exportToCSV}
            style={{
              padding: "10px 20px",
              background: "rgba(161, 193, 216, 0.1)",
              border: "1px solid rgba(161, 193, 216, 0.3)",
              color: "var(--dreamer-blue)",
              borderRadius: "6px",
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(161, 193, 216, 0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(161, 193, 216, 0.1)";
            }}
          >
            Export CSV
          </button>
          <button
            onClick={loadInscriptions}
            style={{
              padding: "10px 20px",
              background: "rgba(161, 193, 216, 0.1)",
              border: "1px solid rgba(161, 193, 216, 0.3)",
              color: "var(--dreamer-blue)",
              borderRadius: "6px",
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(161, 193, 216, 0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(161, 193, 216, 0.1)";
            }}
          >
            Refresh
          </button>
        </div>

        {/* Table */}
        {isLoading ? (
          <div style={{
            textAlign: "center",
            padding: "40px",
            fontFamily: "'Montserrat', sans-serif",
            color: "rgba(255, 255, 255, 0.6)",
          }}>
            Loading inscriptions...
          </div>
        ) : filteredInscriptions.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "40px",
            fontFamily: "'Montserrat', sans-serif",
            color: "rgba(255, 255, 255, 0.6)",
          }}>
            No inscriptions found
          </div>
        ) : (
          <div style={{
            overflowX: "auto",
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(161, 193, 216, 0.1)",
            borderRadius: "8px",
          }}>
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 13,
            }}>
              <thead>
                <tr style={{
                  background: "rgba(161, 193, 216, 0.05)",
                  borderBottom: "1px solid rgba(161, 193, 216, 0.1)",
                }}>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "var(--dreamer-blue)" }}>Date</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "var(--dreamer-blue)" }}>Boutique</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "var(--dreamer-blue)" }}>Buyer</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "var(--dreamer-blue)" }}>Email</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "var(--dreamer-blue)" }}>Phone</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "var(--dreamer-blue)" }}>Collections</th>
                  <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 600, color: "var(--dreamer-blue)" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredInscriptions.map((insc) => (
                  <tr
                    key={insc.id}
                    style={{
                      borderBottom: "1px solid rgba(161, 193, 216, 0.05)",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(161, 193, 216, 0.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <td style={{ padding: "12px 16px", color: "rgba(255, 255, 255, 0.7)" }}>
                      {new Date(insc.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "12px 16px", color: "white", fontWeight: 500 }}>
                      {insc.boutique_name}
                    </td>
                    <td style={{ padding: "12px 16px", color: "rgba(255, 255, 255, 0.8)" }}>
                      {insc.buyer_name}
                    </td>
                    <td style={{ padding: "12px 16px", color: "var(--dreamer-blue)" }}>
                      <a href={`mailto:${insc.email}`} style={{ color: "var(--dreamer-blue)", textDecoration: "none" }}>
                        {insc.email}
                      </a>
                    </td>
                    <td style={{ padding: "12px 16px", color: "rgba(255, 255, 255, 0.7)" }}>
                      {insc.phone}
                    </td>
                    <td style={{ padding: "12px 16px", color: "rgba(255, 255, 255, 0.6)" }}>
                      {insc.collections || "—"}
                    </td>
                    <td style={{ padding: "12px 16px", textAlign: "center" }}>
                      <button
                        onClick={() => toggleContacted(insc.id, insc.contacted)}
                        style={{
                          padding: "6px 12px",
                          background: insc.contacted ? "rgba(76, 175, 80, 0.2)" : "rgba(255, 193, 7, 0.2)",
                          border: `1px solid ${insc.contacted ? "rgba(76, 175, 80, 0.4)" : "rgba(255, 193, 7, 0.4)"}`,
                          color: insc.contacted ? "#4caf50" : "#ffc107",
                          borderRadius: "4px",
                          fontFamily: "'Montserrat', sans-serif",
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: "pointer",
                          transition: "all 0.2s",
                          textTransform: "uppercase",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = insc.contacted ? "rgba(76, 175, 80, 0.3)" : "rgba(255, 193, 7, 0.3)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = insc.contacted ? "rgba(76, 175, 80, 0.2)" : "rgba(255, 193, 7, 0.2)";
                        }}
                      >
                        {insc.contacted ? "✓ Contacted" : "Pending"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer Info */}
        <div style={{
          marginTop: 32,
          paddingTop: 24,
          borderTop: "1px solid rgba(161, 193, 216, 0.1)",
          fontSize: 12,
          color: "rgba(255, 255, 255, 0.5)",
          fontFamily: "'Montserrat', sans-serif",
        }}>
          <p>Showing {filteredInscriptions.length} of {inscriptions.length} inscriptions</p>
        </div>
      </div>
    </div>
  );
}
