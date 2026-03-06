import { useState, useEffect, useCallback, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// ── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  forest: "#0F2A1D",
  forestMid: "#1A3D2B",
  forestLight: "#2A5C3F",
  ivory: "#F6F4EF",
  ivoryDark: "#EDE9E1",
  gold: "#C6A769",
  goldLight: "#D4BC8A",
  goldDark: "#A88A4E",
  charcoal: "#1E1E1E",
  softGray: "#E5E5E5",
  white: "#FFFFFF",
  danger: "#C0392B",
  success: "#27AE60",
  text: "#2C2C2C",
  textMid: "#5A5A5A",
  textLight: "#8A8A8A",
};

const CATEGORY_COLORS = {
  Food: "#C6A769",
  Transport: "#0F2A1D",
  Housing: "#1A3D2B",
  Utilities: "#7B9E87",
  Entertainment: "#8B6914",
  Giving: "#2A5C3F",
  Healthcare: "#4A7C59",
  Education: "#3D5A47",
  Shopping: "#A88A4E",
  Miscellaneous: "#9E9E9E",
};

const PAYMENT_METHODS = [
  "Cash",
  "Card",
  "Bank Transfer",
  "Mobile Money",
  "Cheque",
  "Other",
];

const DEFAULT_CATEGORIES = [
  "Food",
  "Transport",
  "Housing",
  "Utilities",
  "Entertainment",
  "Giving",
  "Healthcare",
  "Education",
  "Shopping",
  "Miscellaneous",
];

const ACCOUNT_TYPES = [
  "Personal",
  "Church",
  "Organization",
  "Business",
  "Savings",
];

// ── STYLES ───────────────────────────────────────────────────────────────────
const injectStyles = () => {
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'DM Sans', sans-serif; background: ${C.ivory}; color: ${C.text}; }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: ${C.softGray}; border-radius: 2px; }

    .card-3d {
      background: ${C.white};
      border-radius: 16px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06), 0 1px 0 rgba(255,255,255,0.9) inset;
      transition: transform 0.25s ease, box-shadow 0.25s ease;
    }
    .card-3d:hover {
      transform: translateY(-3px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.06), 0 16px 40px rgba(0,0,0,0.10), 0 1px 0 rgba(255,255,255,0.9) inset;
    }
    .card-dark {
      background: linear-gradient(145deg, ${C.forestMid}, ${C.forest});
      border-radius: 16px;
      box-shadow: 0 4px 8px rgba(15,42,29,0.3), 0 16px 40px rgba(15,42,29,0.2), 0 1px 0 rgba(255,255,255,0.08) inset;
      transition: transform 0.25s ease, box-shadow 0.25s ease;
    }
    .card-dark:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 16px rgba(15,42,29,0.35), 0 24px 60px rgba(15,42,29,0.25);
    }
    .btn-primary {
      background: linear-gradient(145deg, ${C.forest}, ${C.forestMid});
      color: ${C.ivory};
      border: none;
      border-radius: 12px;
      padding: 12px 24px;
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(15,42,29,0.2), 0 6px 16px rgba(15,42,29,0.15), inset 0 1px 0 rgba(255,255,255,0.1);
      transition: all 0.2s ease;
      letter-spacing: 0.3px;
    }
    .btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(15,42,29,0.25), 0 12px 28px rgba(15,42,29,0.2);
    }
    .btn-primary:active { transform: translateY(0); }
    .btn-gold {
      background: linear-gradient(145deg, ${C.gold}, ${C.goldDark});
      color: ${C.white};
      border: none;
      border-radius: 12px;
      padding: 12px 24px;
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(198,167,105,0.3), 0 6px 16px rgba(198,167,105,0.2);
      transition: all 0.2s ease;
    }
    .btn-gold:hover { transform: translateY(-1px); box-shadow: 0 4px 8px rgba(198,167,105,0.35), 0 12px 28px rgba(198,167,105,0.25); }
    .btn-ghost {
      background: transparent;
      color: ${C.textMid};
      border: 1.5px solid ${C.softGray};
      border-radius: 12px;
      padding: 11px 24px;
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      font-weight: 400;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .btn-ghost:hover { border-color: ${C.forest}; color: ${C.forest}; background: rgba(15,42,29,0.03); }
    .btn-icon {
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 8px;
      border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      transition: background 0.15s ease;
      color: ${C.textMid};
    }
    .btn-icon:hover { background: ${C.ivoryDark}; color: ${C.charcoal}; }
    .btn-danger { color: ${C.danger}; }
    .btn-danger:hover { background: rgba(192,57,43,0.08) !important; color: ${C.danger}; }
    input, select, textarea {
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      color: ${C.text};
      background: ${C.ivory};
      border: 1.5px solid ${C.softGray};
      border-radius: 10px;
      padding: 11px 14px;
      width: 100%;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    input:focus, select:focus, textarea:focus {
      border-color: ${C.forest};
      box-shadow: 0 0 0 3px rgba(15,42,29,0.08);
      background: ${C.white};
    }
    label { font-size: 12px; font-weight: 500; color: ${C.textMid}; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 6px; display: block; }
    .serif { font-family: 'Cormorant Garamond', serif; }
    .nav-item { padding: 10px 16px; border-radius: 10px; cursor: pointer; display: flex; align-items: center; gap: 10px; font-size: 14px; color: ${C.textMid}; transition: all 0.15s ease; font-weight: 400; white-space: nowrap; }
    .nav-item:hover { background: ${C.ivoryDark}; color: ${C.forest}; }
    .nav-item.active { background: ${C.forest}; color: ${C.ivory}; font-weight: 500; }
    .nav-item.active svg { opacity: 1; }
    .badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 500; }
    .progress-bar-wrap { background: ${C.softGray}; border-radius: 99px; height: 6px; overflow: hidden; }
    .progress-bar-fill { height: 100%; border-radius: 99px; transition: width 0.6s ease; }
    .modal-backdrop { position: fixed; inset: 0; background: rgba(30,30,30,0.45); backdrop-filter: blur(4px); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 20px; animation: fadeIn 0.2s ease; }
    .modal-box { background: ${C.white}; border-radius: 20px; padding: 32px; width: 100%; max-width: 520px; max-height: 90vh; overflow-y: auto; box-shadow: 0 24px 64px rgba(0,0,0,0.18); animation: slideUp 0.3s ease; }
    @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
    @keyframes slideUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
    .toast { position: fixed; bottom: 24px; right: 24px; background: ${C.charcoal}; color: ${C.ivory}; padding: 14px 20px; border-radius: 12px; font-size: 13px; box-shadow: 0 8px 24px rgba(0,0,0,0.2); z-index: 999; animation: slideUp 0.3s ease; }
    .chip { display: inline-flex; align-items: center; gap: 6px; padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; cursor: pointer; border: 1.5px solid transparent; transition: all 0.15s ease; }
    .chip.selected { background: ${C.forest}; color: ${C.ivory}; border-color: ${C.forest}; }
    .chip:not(.selected) { background: ${C.ivoryDark}; color: ${C.textMid}; border-color: ${C.softGray}; }
    .chip:hover:not(.selected) { border-color: ${C.forest}; color: ${C.forest}; }
    .table-row { display: grid; align-items: center; padding: 14px 20px; border-bottom: 1px solid ${C.softGray}; transition: background 0.15s; }
    .table-row:hover { background: rgba(246,244,239,0.6); }
    .table-row:last-child { border-bottom: none; }
    .sidebar-mobile-overlay { display: none; }
    @media (max-width: 768px) {
      .sidebar-mobile-overlay { display: block; position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 49; }
      .sidebar-wrap { position: fixed !important; z-index: 50; top: 0; left: 0; height: 100vh; transform: translateX(-100%); transition: transform 0.3s ease; }
      .sidebar-wrap.open { transform: translateX(0); }
      .main-content { margin-left: 0 !important; }
    }
  `;
  const el = document.createElement("style");
  el.textContent = css;
  document.head.appendChild(el);
};

// ── ICONS ─────────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const paths = {
    dashboard: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
      </>
    ),
    expense: (
      <>
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
      </>
    ),
    budget: (
      <>
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </>
    ),
    report: (
      <>
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14,2 14,8 20,8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </>
    ),
    accounts: (
      <>
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
      </>
    ),
    plus: (
      <>
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </>
    ),
    edit: (
      <>
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
      </>
    ),
    trash: (
      <>
        <polyline points="3,6 5,6 21,6" />
        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
        <path d="M10 11v6M14 11v6" />
        <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
      </>
    ),
    close: (
      <>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </>
    ),
    chevronDown: <polyline points="6,9 12,15 18,9" />,
    chevronRight: <polyline points="9,6 15,12 9,18" />,
    menu: (
      <>
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </>
    ),
    logout: (
      <>
        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
        <polyline points="16,17 21,12 16,7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </>
    ),
    trend_up: (
      <>
        <polyline points="22,7 13.5,15.5 8.5,10.5 2,17" />
        <polyline points="16,7 22,7 22,13" />
      </>
    ),
    trend_down: (
      <>
        <polyline points="22,17 13.5,8.5 8.5,13.5 2,7" />
        <polyline points="16,17 22,17 22,11" />
      </>
    ),
    download: (
      <>
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <polyline points="7,10 12,15 17,10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </>
    ),
    wallet: (
      <>
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 01-3.46 0" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </>
    ),
    filter: (
      <>
        <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" />
      </>
    ),
    eye: (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    user: (
      <>
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </>
    ),
    ai: (
      <>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </>
    ),
    check: <polyline points="20,6 9,17 4,12" />,
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
};

// ── DATA STORE (simulated backend) ────────────────────────────────────────────
const generateId = () => Math.random().toString(36).substr(2, 9);

const DEMO_USER = {
  id: "u1",
  name: "Unam Dube",
  email: "unam@example.com",
  role: "admin",
  avatar: "UD",
};

const DEMO_ACCOUNTS = [
  {
    id: "acc1",
    name: "Personal",
    type: "Personal",
    balance: 45230,
    currency: "ZAR",
  },
  {
    id: "acc2",
    name: "Grace Community Church",
    type: "Church",
    balance: 128500,
    currency: "ZAR",
  },
  {
    id: "acc3",
    name: "Dube Holdings",
    type: "Organization",
    balance: 892000,
    currency: "ZAR",
  },
];

const DEMO_EXPENSES = [
  {
    id: "e1",
    accountId: "acc1",
    amount: 1200,
    category: "Food",
    description: "Monthly groceries",
    date: "2026-03-01",
    paymentMethod: "Card",
    notes: "Checkers bulk shop",
  },
  {
    id: "e2",
    accountId: "acc1",
    amount: 450,
    category: "Transport",
    description: "Uber rides",
    date: "2026-03-03",
    paymentMethod: "Card",
    notes: "",
  },
  {
    id: "e3",
    accountId: "acc1",
    amount: 8500,
    category: "Housing",
    description: "March rent",
    date: "2026-03-01",
    paymentMethod: "Bank Transfer",
    notes: "Landlord: Mr Nkosi",
  },
  {
    id: "e4",
    accountId: "acc1",
    amount: 320,
    category: "Utilities",
    description: "Electricity (Eskom)",
    date: "2026-03-02",
    paymentMethod: "Mobile Money",
    notes: "",
  },
  {
    id: "e5",
    accountId: "acc1",
    amount: 650,
    category: "Entertainment",
    description: "DStv & streaming",
    date: "2026-03-01",
    paymentMethod: "Card",
    notes: "",
  },
  {
    id: "e6",
    accountId: "acc1",
    amount: 2000,
    category: "Giving",
    description: "Church tithe",
    date: "2026-03-02",
    paymentMethod: "Bank Transfer",
    notes: "",
  },
  {
    id: "e7",
    accountId: "acc2",
    amount: 12000,
    category: "Utilities",
    description: "Hall electricity",
    date: "2026-03-01",
    paymentMethod: "Bank Transfer",
    notes: "",
  },
  {
    id: "e8",
    accountId: "acc2",
    amount: 8500,
    category: "Food",
    description: "Community feeding",
    date: "2026-03-02",
    paymentMethod: "Cash",
    notes: "Monthly outreach",
  },
  {
    id: "e9",
    accountId: "acc3",
    amount: 45000,
    category: "Housing",
    description: "Office lease",
    date: "2026-03-01",
    paymentMethod: "Bank Transfer",
    notes: "",
  },
  {
    id: "e10",
    accountId: "acc3",
    amount: 18000,
    category: "Miscellaneous",
    description: "Staff catering",
    date: "2026-03-03",
    paymentMethod: "Card",
    notes: "",
  },
  {
    id: "e11",
    accountId: "acc1",
    amount: 890,
    category: "Healthcare",
    description: "Pharmacy",
    date: "2026-02-20",
    paymentMethod: "Card",
    notes: "",
  },
  {
    id: "e12",
    accountId: "acc1",
    amount: 1500,
    category: "Food",
    description: "Restaurant dinners",
    date: "2026-02-25",
    paymentMethod: "Card",
    notes: "",
  },
  {
    id: "e13",
    accountId: "acc1",
    amount: 350,
    category: "Transport",
    description: "Fuel",
    date: "2026-02-18",
    paymentMethod: "Card",
    notes: "",
  },
];

const DEMO_BUDGETS = [
  {
    id: "b1",
    accountId: "acc1",
    category: "Food",
    limit: 3000,
    month: "2026-03",
  },
  {
    id: "b2",
    accountId: "acc1",
    category: "Transport",
    limit: 1500,
    month: "2026-03",
  },
  {
    id: "b3",
    accountId: "acc1",
    category: "Entertainment",
    limit: 800,
    month: "2026-03",
  },
  {
    id: "b4",
    accountId: "acc1",
    category: "Housing",
    limit: 9000,
    month: "2026-03",
  },
  {
    id: "b5",
    accountId: "acc1",
    category: "Utilities",
    limit: 500,
    month: "2026-03",
  },
];

const DEMO_INCOME = [
  {
    id: "i1",
    accountId: "acc1",
    amount: 28000,
    source: "Salary",
    date: "2026-03-25",
    month: "2026-03",
  },
  {
    id: "i2",
    accountId: "acc1",
    amount: 25000,
    source: "Salary",
    date: "2026-02-25",
    month: "2026-02",
  },
];

// ── UTILITIES ─────────────────────────────────────────────────────────────────
const fmt = (n, currency = "ZAR") =>
  new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(n);

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const currentMonth = () => new Date().toISOString().substr(0, 7);

// ── TOAST ─────────────────────────────────────────────────────────────────────
const Toast = ({ msg, onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 2800);
    return () => clearTimeout(t);
  }, [onDone]);
  return <div className="toast">{msg}</div>;
};

// ── AUTH SCREEN ────────────────────────────────────────────────────────────────
const AuthScreen = ({ onAuth }) => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "demo@example.com",
    password: "password",
  });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = () => {
    if (!form.email || !form.password) return;
    onAuth({
      ...DEMO_USER,
      name: form.name || DEMO_USER.name,
      email: form.email,
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${C.forest} 0%, ${C.forestMid} 50%, #0a1f14 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div style={{ width: "100%", maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div
            style={{
              width: 64,
              height: 64,
              background: `linear-gradient(145deg, ${C.gold}, ${C.goldDark})`,
              borderRadius: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              boxShadow: `0 8px 24px rgba(198,167,105,0.4)`,
            }}
          >
            <Icon name="wallet" size={28} color={C.white} />
          </div>
          <h1
            className="serif"
            style={{
              fontSize: 36,
              fontWeight: 300,
              color: C.ivory,
              letterSpacing: 1,
            }}
          >
            Ledger
          </h1>
          <p
            style={{
              color: "rgba(246,244,239,0.5)",
              fontSize: 13,
              marginTop: 6,
              letterSpacing: 0.5,
            }}
          >
            Premium Financial Intelligence
          </p>
        </div>
        {/* Card */}
        <div
          style={{
            background: "rgba(246,244,239,0.04)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(246,244,239,0.1)",
            borderRadius: 20,
            padding: "36px 32px",
            boxShadow: "0 24px 64px rgba(0,0,0,0.3)",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 28,
              background: "rgba(255,255,255,0.05)",
              borderRadius: 10,
              padding: 4,
            }}
          >
            {["login", "signup"].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  flex: 1,
                  padding: "9px 0",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 13,
                  fontWeight: 500,
                  transition: "all 0.2s",
                  background: mode === m ? C.ivory : "transparent",
                  color: mode === m ? C.forest : "rgba(246,244,239,0.5)",
                }}
              >
                {m === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {mode === "signup" && (
              <div>
                <label style={{ color: "rgba(246,244,239,0.5)" }}>
                  Full Name
                </label>
                <input
                  value={form.name}
                  onChange={set("name")}
                  placeholder="Unam Dube"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1.5px solid rgba(246,244,239,0.12)",
                    color: C.ivory,
                  }}
                />
              </div>
            )}
            <div>
              <label style={{ color: "rgba(246,244,239,0.5)" }}>
                Email Address
              </label>
              <input
                value={form.email}
                onChange={set("email")}
                type="email"
                placeholder="name@example.com"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1.5px solid rgba(246,244,239,0.12)",
                  color: C.ivory,
                }}
              />
            </div>
            <div>
              <label style={{ color: "rgba(246,244,239,0.5)" }}>Password</label>
              <input
                value={form.password}
                onChange={set("password")}
                type="password"
                placeholder="••••••••"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1.5px solid rgba(246,244,239,0.12)",
                  color: C.ivory,
                }}
              />
            </div>
          </div>
          <button
            className="btn-primary"
            onClick={submit}
            style={{
              width: "100%",
              marginTop: 24,
              padding: "14px 0",
              fontSize: 15,
            }}
          >
            {mode === "login" ? "Sign In to Ledger" : "Create Account"}
          </button>
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <p style={{ color: "rgba(246,244,239,0.3)", fontSize: 12 }}>
              Demo: any email + any password
            </p>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              margin: "20px 0",
            }}
          >
            <div
              style={{
                flex: 1,
                height: 1,
                background: "rgba(246,244,239,0.1)",
              }}
            />
            <span style={{ color: "rgba(246,244,239,0.3)", fontSize: 12 }}>
              or
            </span>
            <div
              style={{
                flex: 1,
                height: 1,
                background: "rgba(246,244,239,0.1)",
              }}
            />
          </div>
          <button
            onClick={submit}
            style={{
              width: "100%",
              padding: "13px 0",
              borderRadius: 12,
              border: "1.5px solid rgba(246,244,239,0.15)",
              background: "rgba(255,255,255,0.04)",
              color: "rgba(246,244,239,0.7)",
              fontFamily: "'DM Sans',sans-serif",
              fontSize: 14,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transition: "all 0.2s",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};

// ── SIDEBAR ────────────────────────────────────────────────────────────────────
const Sidebar = ({ page, setPage, user, onLogout, isOpen, onClose }) => {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    { id: "expenses", label: "Expenses", icon: "expense" },
    { id: "budget", label: "Budgets", icon: "budget" },
    { id: "reports", label: "Reports", icon: "report" },
    { id: "accounts", label: "Accounts", icon: "accounts" },
    { id: "settings", label: "Settings", icon: "settings" },
  ];

  return (
    <>
      {isOpen && <div className="sidebar-mobile-overlay" onClick={onClose} />}
      <div
        className={`sidebar-wrap${isOpen ? " open" : ""}`}
        style={{
          width: 230,
          background: C.white,
          borderRight: `1px solid ${C.softGray}`,
          display: "flex",
          flexDirection: "column",
          padding: "24px 16px",
          height: "100vh",
          position: "sticky",
          top: 0,
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            paddingLeft: 8,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              background: `linear-gradient(145deg, ${C.forest}, ${C.forestMid})`,
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 4px 12px rgba(15,42,29,0.25)`,
            }}
          >
            <Icon name="wallet" size={18} color={C.gold} />
          </div>
          <span
            className="serif"
            style={{
              fontSize: 22,
              fontWeight: 400,
              color: C.forest,
              letterSpacing: 0.5,
            }}
          >
            Ledger
          </span>
        </div>
        {/* Nav */}
        <nav
          style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}
        >
          {navItems.map((item) => (
            <div
              key={item.id}
              className={`nav-item${page === item.id ? " active" : ""}`}
              onClick={() => {
                setPage(item.id);
                onClose();
              }}
            >
              <Icon name={item.icon} size={16} />
              {item.label}
            </div>
          ))}
        </nav>
        {/* User */}
        <div style={{ borderTop: `1px solid ${C.softGray}`, paddingTop: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 8px",
              borderRadius: 10,
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: `linear-gradient(145deg, ${C.forest}, ${C.forestLight})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: C.gold,
                fontSize: 12,
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              {user.avatar}
            </div>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: C.text,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user.name}
              </div>
              <div style={{ fontSize: 11, color: C.textLight }}>
                {user.role}
              </div>
            </div>
            <button className="btn-icon" onClick={onLogout} title="Logout">
              <Icon name="logout" size={15} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// ── STAT CARD ─────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, icon, dark, gold, trend }) => (
  <div
    className={dark ? "card-dark" : "card-3d"}
    style={{
      padding: "24px",
      display: "flex",
      flexDirection: "column",
      gap: 16,
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      <div>
        <p
          style={{
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: 1,
            textTransform: "uppercase",
            color: dark ? "rgba(246,244,239,0.5)" : C.textLight,
            marginBottom: 8,
          }}
        >
          {label}
        </p>
        <p
          className="serif"
          style={{
            fontSize: 30,
            fontWeight: 300,
            color: dark ? C.ivory : gold ? C.gold : C.text,
            letterSpacing: -0.5,
          }}
        >
          {value}
        </p>
      </div>
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 12,
          background: dark ? "rgba(255,255,255,0.08)" : C.ivoryDark,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon name={icon} size={18} color={dark ? C.gold : C.forest} />
      </div>
    </div>
    {sub && (
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {trend && (
          <Icon
            name={trend === "up" ? "trend_up" : "trend_down"}
            size={14}
            color={trend === "up" ? C.success : C.danger}
          />
        )}
        <span
          style={{
            fontSize: 12,
            color: dark ? "rgba(246,244,239,0.5)" : C.textLight,
          }}
        >
          {sub}
        </span>
      </div>
    )}
  </div>
);

// ── STABLE DEMO BAR DATA (generated once at module level) ────────────────────
const DEMO_BAR_DATA = (() => {
  const seed = [1850, 2400, 980, 2100, 3200, 1600, 750];
  return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => ({
    day,
    Amount: seed[i],
  }));
})();

// ── CUSTOM CHART TOOLTIP ──────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: C.white,
        border: `1px solid ${C.softGray}`,
        borderRadius: 10,
        padding: "10px 14px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
        fontSize: 12,
      }}
    >
      <p style={{ fontWeight: 600, marginBottom: 6 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: {fmt(p.value)}
        </p>
      ))}
    </div>
  );
};

// ── DASHBOARD PAGE ─────────────────────────────────────────────────────────────
const DashboardPage = ({
  expenses,
  budgets,
  income,
  activeAccount,
  setPage,
}) => {
  const acctExpenses = useMemo(
    () => expenses.filter((e) => e.accountId === activeAccount.id),
    [expenses, activeAccount],
  );
  const acctIncome = useMemo(
    () => income.filter((i) => i.accountId === activeAccount.id),
    [income, activeAccount],
  );
  const thisMonth = currentMonth();
  const monthExpenses = useMemo(
    () => acctExpenses.filter((e) => e.date.startsWith(thisMonth)),
    [acctExpenses, thisMonth],
  );
  const totalSpent = useMemo(
    () => monthExpenses.reduce((s, e) => s + e.amount, 0),
    [monthExpenses],
  );
  const totalIncome = useMemo(
    () =>
      acctIncome
        .filter((i) => i.month === thisMonth)
        .reduce((s, i) => s + i.amount, 0),
    [acctIncome, thisMonth],
  );

  // Pie data
  const categoryData = useMemo(() => {
    const map = {};
    monthExpenses.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [monthExpenses]);

  // Line data (last 6 months)
  const lineData = useMemo(() => {
    const fallback = totalIncome > 0 ? totalIncome : 28000;
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = d.toISOString().substr(0, 7);
      const label = d.toLocaleString("default", { month: "short" });
      const spent = acctExpenses
        .filter((e) => e.date.startsWith(key))
        .reduce((s, e) => s + e.amount, 0);
      const inc = acctIncome
        .filter((i) => i.month === key)
        .reduce((s, i) => s + i.amount, 0);
      months.push({
        month: label,
        Expenses: spent,
        Income: inc > 0 ? inc : i === 0 ? fallback : 0,
      });
    }
    return months;
  }, [acctExpenses, acctIncome, totalIncome]);

  // Bar data (weekly) — stable seed data, no random
  const barData = DEMO_BAR_DATA;

  const acctBudgets = budgets.filter(
    (b) => b.accountId === activeAccount.id && b.month === thisMonth,
  );
  const recentExpenses = [...acctExpenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const displayIncome = totalIncome > 0 ? totalIncome : 28000;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h2
            className="serif"
            style={{ fontSize: 28, fontWeight: 300, color: C.forest }}
          >
            Dashboard
          </h2>
          <p style={{ fontSize: 13, color: C.textLight, marginTop: 2 }}>
            {activeAccount.name} ·{" "}
            {new Date().toLocaleDateString("en-ZA", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => setPage("expenses")}
          style={{ display: "flex", alignItems: "center", gap: 8 }}
        >
          <Icon name="plus" size={15} /> Add Expense
        </button>
      </div>

      {/* Stat Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
        }}
      >
        <StatCard
          label="Account Balance"
          value={fmt(activeAccount.balance)}
          icon="wallet"
          dark
          sub="Available funds"
        />
        <StatCard
          label="Monthly Spending"
          value={fmt(totalSpent)}
          icon="expense"
          sub={`${monthExpenses.length} transactions`}
          trend="up"
        />
        <StatCard
          label="Monthly Income"
          value={fmt(displayIncome)}
          icon="trend_up"
          sub="This month"
          gold
        />
        <StatCard
          label="Net Savings"
          value={fmt(displayIncome - totalSpent)}
          icon="check"
          sub={`${Math.round(((displayIncome - totalSpent) / displayIncome) * 100)}% saved`}
          trend="up"
        />
      </div>

      {/* Charts Row */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}
      >
        {/* Line Chart */}
        <div className="card-3d" style={{ padding: 24, gridColumn: "span 2" }}>
          <p
            style={{
              fontSize: 12,
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: 0.8,
              color: C.textLight,
              marginBottom: 4,
            }}
          >
            Income vs Expenses
          </p>
          <p
            className="serif"
            style={{ fontSize: 18, color: C.text, marginBottom: 20 }}
          >
            6-Month Overview
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={lineData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={C.softGray}
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: C.textLight }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: C.textLight }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `R${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="Income"
                stroke={C.forest}
                strokeWidth={2.5}
                dot={{ fill: C.forest, r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="Expenses"
                stroke={C.gold}
                strokeWidth={2.5}
                dot={{ fill: C.gold, r: 4 }}
                activeDot={{ r: 6 }}
                strokeDasharray="6 3"
              />
            </LineChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: 20, marginTop: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div
                style={{
                  width: 20,
                  height: 2.5,
                  background: C.forest,
                  borderRadius: 2,
                }}
              />
              <span style={{ fontSize: 11, color: C.textLight }}>Income</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div
                style={{
                  width: 20,
                  height: 2.5,
                  background: C.gold,
                  borderRadius: 2,
                  opacity: 0.8,
                }}
              />
              <span style={{ fontSize: 11, color: C.textLight }}>Expenses</span>
            </div>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="card-3d" style={{ padding: 24 }}>
          <p
            style={{
              fontSize: 12,
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: 0.8,
              color: C.textLight,
              marginBottom: 4,
            }}
          >
            By Category
          </p>
          <p
            className="serif"
            style={{ fontSize: 18, color: C.text, marginBottom: 12 }}
          >
            Spending Breakdown
          </p>
          {categoryData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={CATEGORY_COLORS[entry.name] || C.forest}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v) => fmt(v)}
                    contentStyle={{
                      fontSize: 12,
                      borderRadius: 10,
                      border: `1px solid ${C.softGray}`,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  marginTop: 8,
                }}
              >
                {categoryData.slice(0, 4).map((d) => (
                  <div
                    key={d.name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 2,
                          background: CATEGORY_COLORS[d.name] || C.forest,
                        }}
                      />
                      <span style={{ fontSize: 11, color: C.textMid }}>
                        {d.name}
                      </span>
                    </div>
                    <span
                      style={{ fontSize: 11, fontWeight: 500, color: C.text }}
                    >
                      {fmt(d.value)}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div
              style={{
                height: 160,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: C.textLight,
                fontSize: 13,
              }}
            >
              No data yet
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Weekly Bar */}
        <div className="card-3d" style={{ padding: 24 }}>
          <p
            style={{
              fontSize: 12,
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: 0.8,
              color: C.textLight,
              marginBottom: 4,
            }}
          >
            Weekly Pattern
          </p>
          <p
            className="serif"
            style={{ fontSize: 18, color: C.text, marginBottom: 20 }}
          >
            Daily Spending
          </p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={barData} barSize={22}>
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: C.textLight }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="Amount" fill={C.forest} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Budget Progress */}
        <div className="card-3d" style={{ padding: 24 }}>
          <p
            style={{
              fontSize: 12,
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: 0.8,
              color: C.textLight,
              marginBottom: 4,
            }}
          >
            Budgets
          </p>
          <p
            className="serif"
            style={{ fontSize: 18, color: C.text, marginBottom: 20 }}
          >
            Monthly Progress
          </p>
          {acctBudgets.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "24px 0",
                color: C.textLight,
                fontSize: 13,
              }}
            >
              No budgets set for this account
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {acctBudgets.map((b) => {
                const spent = monthExpenses
                  .filter((e) => e.category === b.category)
                  .reduce((s, e) => s + e.amount, 0);
                const pct = Math.min((spent / b.limit) * 100, 100);
                const over = spent > b.limit;
                return (
                  <div key={b.id}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 6,
                      }}
                    >
                      <span style={{ fontSize: 13, color: C.text }}>
                        {b.category}
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          color: over ? C.danger : C.textMid,
                        }}
                      >
                        {fmt(spent)} / {fmt(b.limit)}
                      </span>
                    </div>
                    <div className="progress-bar-wrap">
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${pct}%`,
                          background: over
                            ? C.danger
                            : pct > 75
                              ? C.gold
                              : C.forest,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent */}
      <div className="card-3d" style={{ padding: "24px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <p className="serif" style={{ fontSize: 20, color: C.text }}>
            Recent Transactions
          </p>
          <button
            className="btn-ghost"
            onClick={() => setPage("expenses")}
            style={{ padding: "8px 16px", fontSize: 12 }}
          >
            View All
          </button>
        </div>
        {recentExpenses.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "32px 0",
              color: C.textLight,
            }}
          >
            No transactions yet
          </div>
        ) : (
          recentExpenses.map((exp) => (
            <div
              key={exp.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 0",
                borderBottom: `1px solid ${C.softGray}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: C.ivoryDark,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 3,
                      background: CATEGORY_COLORS[exp.category] || C.forest,
                    }}
                  />
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 500, color: C.text }}>
                    {exp.description}
                  </p>
                  <p style={{ fontSize: 12, color: C.textLight }}>
                    {exp.category} · {fmtDate(exp.date)}
                  </p>
                </div>
              </div>
              <span style={{ fontSize: 15, fontWeight: 500, color: C.text }}>
                −{fmt(exp.amount)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ── EXPENSE MODAL ─────────────────────────────────────────────────────────────
const ExpenseModal = ({ expense, accounts, categories, onSave, onClose }) => {
  const [form, setForm] = useState(
    expense || {
      amount: "",
      category: categories[0],
      description: "",
      date: new Date().toISOString().split("T")[0],
      paymentMethod: "Card",
      notes: "",
      accountId: accounts[0]?.id,
    },
  );
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const handleSave = () => {
    if (!form.amount || !form.description) return;
    onSave({
      ...form,
      amount: parseFloat(form.amount),
      id: form.id || generateId(),
    });
  };
  return (
    <div
      className="modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-box">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <h2
            className="serif"
            style={{ fontSize: 24, fontWeight: 400, color: C.forest }}
          >
            {expense ? "Edit Expense" : "Add Expense"}
          </h2>
          <button className="btn-icon" onClick={onClose}>
            <Icon name="close" size={18} />
          </button>
        </div>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
        >
          <div style={{ gridColumn: "span 2" }}>
            <label>Account</label>
            <select value={form.accountId} onChange={set("accountId")}>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Amount (ZAR)</label>
            <input
              type="number"
              value={form.amount}
              onChange={set("amount")}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label>Category</label>
            <select value={form.category} onChange={set("category")}>
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div style={{ gridColumn: "span 2" }}>
            <label>Description</label>
            <input
              value={form.description}
              onChange={set("description")}
              placeholder="What was this expense for?"
            />
          </div>
          <div>
            <label>Date</label>
            <input type="date" value={form.date} onChange={set("date")} />
          </div>
          <div>
            <label>Payment Method</label>
            <select value={form.paymentMethod} onChange={set("paymentMethod")}>
              {PAYMENT_METHODS.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>
          <div style={{ gridColumn: "span 2" }}>
            <label>Notes (optional)</label>
            <textarea
              value={form.notes}
              onChange={set("notes")}
              placeholder="Any additional notes..."
              rows={2}
              style={{ resize: "vertical" }}
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 24,
            justifyContent: "flex-end",
          }}
        >
          <button className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSave}>
            {expense ? "Save Changes" : "Add Expense"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── EXPENSES PAGE ─────────────────────────────────────────────────────────────
const ExpensesPage = ({
  expenses,
  setExpenses,
  accounts,
  categories,
  activeAccount,
}) => {
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [sortBy, setSortBy] = useState("date");

  const acctExpenses = useMemo(
    () =>
      expenses.filter(
        (e) => !activeAccount || e.accountId === activeAccount.id,
      ),
    [expenses, activeAccount],
  );
  const filtered = useMemo(() => {
    let r = acctExpenses;
    if (search)
      r = r.filter(
        (e) =>
          e.description.toLowerCase().includes(search.toLowerCase()) ||
          e.category.toLowerCase().includes(search.toLowerCase()),
      );
    if (filterCat !== "All") r = r.filter((e) => e.category === filterCat);
    return [...r].sort((a, b) =>
      sortBy === "date"
        ? new Date(b.date) - new Date(a.date)
        : b.amount - a.amount,
    );
  }, [acctExpenses, search, filterCat, sortBy]);

  const handleSave = (exp) => {
    setExpenses((prev) =>
      prev.some((e) => e.id === exp.id)
        ? prev.map((e) => (e.id === exp.id ? exp : e))
        : [exp, ...prev],
    );
    setModal(null);
  };
  const handleDelete = (id) =>
    setExpenses((prev) => prev.filter((e) => e.id !== id));

  const cats = ["All", ...categories];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {modal && (
        <ExpenseModal
          expense={modal === "new" ? null : modal}
          accounts={accounts}
          categories={categories}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h2
            className="serif"
            style={{ fontSize: 28, fontWeight: 300, color: C.forest }}
          >
            Expenses
          </h2>
          <p style={{ fontSize: 13, color: C.textLight, marginTop: 2 }}>
            {filtered.length} transactions
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => setModal("new")}
          style={{ display: "flex", alignItems: "center", gap: 8 }}
        >
          <Icon name="plus" size={15} /> Add Expense
        </button>
      </div>
      {/* Filters */}
      <div className="card-3d" style={{ padding: 20 }}>
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
            <div
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
              }}
            >
              <Icon name="search" size={15} color={C.textLight} />
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search transactions…"
              style={{ paddingLeft: 36 }}
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ width: "auto" }}
          >
            <option value="date">Sort: Date</option>
            <option value="amount">Sort: Amount</option>
          </select>
        </div>
        <div
          style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}
        >
          {cats.map((c) => (
            <div
              key={c}
              className={`chip${filterCat === c ? " selected" : ""}`}
              onClick={() => setFilterCat(c)}
            >
              {c}
            </div>
          ))}
        </div>
      </div>
      {/* Table */}
      <div className="card-3d" style={{ overflow: "hidden", padding: 0 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 120px 120px 110px 80px",
            padding: "12px 20px",
            borderBottom: `1px solid ${C.softGray}`,
            background: C.ivoryDark,
          }}
        >
          {["Description", "Category", "Date", "Amount", ""].map((h, i) => (
            <span
              key={i}
              style={{
                fontSize: 11,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: 0.8,
                color: C.textLight,
              }}
            >
              {h}
            </span>
          ))}
        </div>
        {filtered.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "48px 0",
              color: C.textLight,
            }}
          >
            <Icon name="expense" size={32} color={C.softGray} />
            <p style={{ marginTop: 12 }}>No expenses found</p>
          </div>
        ) : (
          filtered.map((exp) => (
            <div
              key={exp.id}
              className="table-row"
              style={{ gridTemplateColumns: "1fr 120px 120px 110px 80px" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 9,
                    background: C.ivoryDark,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 2,
                      background: CATEGORY_COLORS[exp.category] || C.forest,
                    }}
                  />
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 500, color: C.text }}>
                    {exp.description}
                  </p>
                  {exp.notes && (
                    <p style={{ fontSize: 11, color: C.textLight }}>
                      {exp.notes}
                    </p>
                  )}
                </div>
              </div>
              <span
                className="badge"
                style={{
                  background:
                    `${CATEGORY_COLORS[exp.category]}18` || C.ivoryDark,
                  color: CATEGORY_COLORS[exp.category] || C.forest,
                  width: "fit-content",
                }}
              >
                {exp.category}
              </span>
              <span style={{ fontSize: 13, color: C.textMid }}>
                {fmtDate(exp.date)}
              </span>
              <span style={{ fontSize: 15, fontWeight: 600, color: C.text }}>
                {fmt(exp.amount)}
              </span>
              <div style={{ display: "flex", gap: 4 }}>
                <button className="btn-icon" onClick={() => setModal(exp)}>
                  <Icon name="edit" size={14} />
                </button>
                <button
                  className="btn-icon btn-danger"
                  onClick={() => handleDelete(exp.id)}
                >
                  <Icon name="trash" size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ── BUDGET PAGE ────────────────────────────────────────────────────────────────
const BudgetPage = ({
  budgets,
  setBudgets,
  expenses,
  activeAccount,
  categories,
}) => {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({
    category: categories[0],
    limit: "",
    month: currentMonth(),
  });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const acctBudgets = budgets.filter((b) => b.accountId === activeAccount.id);
  const thisMonth = currentMonth();
  const acctExpenses = expenses.filter(
    (e) => e.accountId === activeAccount.id && e.date.startsWith(thisMonth),
  );

  const handleSave = () => {
    if (!form.limit) return;
    const existing = budgets.find(
      (b) =>
        b.accountId === activeAccount.id &&
        b.category === form.category &&
        b.month === form.month,
    );
    if (existing)
      setBudgets((prev) =>
        prev.map((b) =>
          b.id === existing.id ? { ...b, limit: parseFloat(form.limit) } : b,
        ),
      );
    else
      setBudgets((prev) => [
        ...prev,
        {
          ...form,
          limit: parseFloat(form.limit),
          id: generateId(),
          accountId: activeAccount.id,
        },
      ]);
    setModal(false);
  };
  const handleDelete = (id) =>
    setBudgets((prev) => prev.filter((b) => b.id !== id));

  const totalBudget = acctBudgets.reduce((s, b) => s + b.limit, 0);
  const totalSpent = acctExpenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {modal && (
        <div
          className="modal-backdrop"
          onClick={(e) => e.target === e.currentTarget && setModal(false)}
        >
          <div className="modal-box" style={{ maxWidth: 400 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <h2 className="serif" style={{ fontSize: 22, color: C.forest }}>
                Set Budget
              </h2>
              <button className="btn-icon" onClick={() => setModal(false)}>
                <Icon name="close" size={18} />
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label>Category</label>
                <select value={form.category} onChange={set("category")}>
                  {categories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label>Monthly Limit (ZAR)</label>
                <input
                  type="number"
                  value={form.limit}
                  onChange={set("limit")}
                  placeholder="0.00"
                  min="0"
                />
              </div>
              <div>
                <label>Month</label>
                <input
                  type="month"
                  value={form.month}
                  onChange={set("month")}
                />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 24,
                justifyContent: "flex-end",
              }}
            >
              <button className="btn-ghost" onClick={() => setModal(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleSave}>
                Save Budget
              </button>
            </div>
          </div>
        </div>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h2
            className="serif"
            style={{ fontSize: 28, fontWeight: 300, color: C.forest }}
          >
            Budgets
          </h2>
          <p style={{ fontSize: 13, color: C.textLight, marginTop: 2 }}>
            {activeAccount.name}
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => setModal(true)}
          style={{ display: "flex", alignItems: "center", gap: 8 }}
        >
          <Icon name="plus" size={15} /> Set Budget
        </button>
      </div>

      {/* Summary */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))",
          gap: 16,
        }}
      >
        <StatCard
          label="Total Budgeted"
          value={fmt(totalBudget)}
          icon="budget"
        />
        <StatCard
          label="Total Spent"
          value={fmt(totalSpent)}
          icon="expense"
          dark
        />
        <StatCard
          label="Remaining"
          value={fmt(Math.max(totalBudget - totalSpent, 0))}
          icon="check"
          gold
        />
      </div>

      {/* Budget cards */}
      {acctBudgets.length === 0 ? (
        <div
          className="card-3d"
          style={{ padding: 48, textAlign: "center", color: C.textLight }}
        >
          <Icon name="budget" size={36} color={C.softGray} />
          <p style={{ marginTop: 16, fontSize: 15 }}>No budgets set yet</p>
          <p style={{ fontSize: 13, marginTop: 8 }}>
            Set category budgets to track your spending
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))",
            gap: 16,
          }}
        >
          {acctBudgets.map((b) => {
            const spent = acctExpenses
              .filter((e) => e.category === b.category)
              .reduce((s, e) => s + e.amount, 0);
            const pct = Math.min((spent / b.limit) * 100, 100);
            const over = spent > b.limit;
            const warn = pct > 75 && !over;
            return (
              <div key={b.id} className="card-3d" style={{ padding: 24 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 16,
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 4,
                      }}
                    >
                      <div
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 3,
                          background: CATEGORY_COLORS[b.category] || C.forest,
                        }}
                      />
                      <span style={{ fontSize: 15, fontWeight: 500 }}>
                        {b.category}
                      </span>
                    </div>
                    <span style={{ fontSize: 11, color: C.textLight }}>
                      {b.month}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    {over && (
                      <span
                        className="badge"
                        style={{
                          background: "rgba(192,57,43,0.1)",
                          color: C.danger,
                        }}
                      >
                        Over
                      </span>
                    )}
                    {warn && (
                      <span
                        className="badge"
                        style={{
                          background: "rgba(198,167,105,0.15)",
                          color: C.goldDark,
                        }}
                      >
                        Alert
                      </span>
                    )}
                    <button
                      className="btn-icon btn-danger"
                      onClick={() => handleDelete(b.id)}
                    >
                      <Icon name="trash" size={13} />
                    </button>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 10,
                  }}
                >
                  <span
                    style={{
                      fontSize: 22,
                      fontWeight: 300,
                      fontFamily: "'Cormorant Garamond',serif",
                    }}
                  >
                    {fmt(spent)}
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      color: C.textLight,
                      alignSelf: "flex-end",
                      paddingBottom: 2,
                    }}
                  >
                    / {fmt(b.limit)}
                  </span>
                </div>
                <div className="progress-bar-wrap">
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${pct}%`,
                      background: over ? C.danger : warn ? C.gold : C.forest,
                    }}
                  />
                </div>
                <p style={{ fontSize: 12, color: C.textLight, marginTop: 8 }}>
                  {pct.toFixed(0)}% used · {fmt(Math.max(b.limit - spent, 0))}{" "}
                  remaining
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ── REPORTS PAGE ──────────────────────────────────────────────────────────────
const ReportsPage = ({ expenses, activeAccount }) => {
  const [month, setMonth] = useState(currentMonth());
  const acctExpenses = expenses.filter(
    (e) => e.accountId === activeAccount.id && e.date.startsWith(month),
  );
  const total = acctExpenses.reduce((s, e) => s + e.amount, 0);
  const byCategory = (() => {
    const map = {};
    acctExpenses.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  })();

  const exportCSV = () => {
    const header = "Date,Description,Category,Amount,Payment Method,Notes\n";
    const rows = acctExpenses
      .map(
        (e) =>
          `${e.date},"${e.description}",${e.category},${e.amount},${e.paymentMethod},"${e.notes}"`,
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ledger-report-${month}.csv`;
    a.click();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h2
            className="serif"
            style={{ fontSize: 28, fontWeight: 300, color: C.forest }}
          >
            Reports
          </h2>
          <p style={{ fontSize: 13, color: C.textLight, marginTop: 2 }}>
            Financial insights & exports
          </p>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            style={{ width: "auto" }}
          />
          <button
            className="btn-gold"
            onClick={exportCSV}
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <Icon name="download" size={15} /> Export CSV
          </button>
        </div>
      </div>
      {/* Summary Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))",
          gap: 16,
        }}
      >
        <StatCard
          label="Total Expenses"
          value={fmt(total)}
          icon="expense"
          dark
        />
        <StatCard
          label="Transactions"
          value={acctExpenses.length}
          icon="report"
        />
        <StatCard
          label="Avg per Day"
          value={fmt(total / 30)}
          icon="trend_up"
          gold
        />
      </div>
      {/* Category Breakdown */}
      <div className="card-3d" style={{ padding: 24 }}>
        <p
          className="serif"
          style={{ fontSize: 20, color: C.text, marginBottom: 20 }}
        >
          Category Breakdown
        </p>
        {byCategory.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "32px 0",
              color: C.textLight,
            }}
          >
            No data for this period
          </div>
        ) : (
          byCategory.map(([cat, amt]) => (
            <div key={cat} style={{ marginBottom: 16 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 3,
                      background: CATEGORY_COLORS[cat] || C.forest,
                    }}
                  />
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{cat}</span>
                </div>
                <div style={{ display: "flex", gap: 16 }}>
                  <span style={{ fontSize: 13, color: C.textLight }}>
                    {total > 0 ? ((amt / total) * 100).toFixed(1) : 0}%
                  </span>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      minWidth: 100,
                      textAlign: "right",
                    }}
                  >
                    {fmt(amt)}
                  </span>
                </div>
              </div>
              <div className="progress-bar-wrap">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${total > 0 ? (amt / total) * 100 : 0}%`,
                    background: CATEGORY_COLORS[cat] || C.forest,
                    opacity: 0.85,
                  }}
                />
              </div>
            </div>
          ))
        )}
      </div>
      {/* Transaction list */}
      <div className="card-3d" style={{ padding: 0, overflow: "hidden" }}>
        <div
          style={{
            padding: "20px 24px",
            borderBottom: `1px solid ${C.softGray}`,
          }}
        >
          <p className="serif" style={{ fontSize: 20, color: C.text }}>
            All Transactions — {month}
          </p>
        </div>
        {acctExpenses.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px 0",
              color: C.textLight,
            }}
          >
            No transactions in this period
          </div>
        ) : (
          <div style={{ maxHeight: 400, overflowY: "auto" }}>
            {[...acctExpenses]
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map((exp) => (
                <div
                  key={exp.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 24px",
                    borderBottom: `1px solid ${C.softGray}`,
                  }}
                >
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 500 }}>
                      {exp.description}
                    </p>
                    <p style={{ fontSize: 12, color: C.textLight }}>
                      {exp.category} · {fmtDate(exp.date)} · {exp.paymentMethod}
                    </p>
                  </div>
                  <span style={{ fontWeight: 600, fontSize: 15 }}>
                    {fmt(exp.amount)}
                  </span>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ── ACCOUNTS PAGE ─────────────────────────────────────────────────────────────
const AccountsPage = ({
  accounts,
  setAccounts,
  expenses,
  activeAccountId,
  setActiveAccountId,
}) => {
  const BLANK = {
    name: "",
    type: ACCOUNT_TYPES[0],
    balance: "",
    currency: "ZAR",
  };
  const [modal, setModal] = useState(null); // null | "new" | account-object
  const [form, setForm] = useState(BLANK);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const openNew = () => {
    setForm(BLANK);
    setModal("new");
  };
  const openEdit = (acc, e) => {
    e.stopPropagation();
    setForm({ ...acc, balance: String(acc.balance) });
    setModal(acc);
  };

  const handleSave = () => {
    if (!form.name || form.balance === "") return;
    const parsed = { ...form, balance: parseFloat(form.balance) || 0 };
    if (modal === "new") {
      setAccounts((prev) => [...prev, { ...parsed, id: generateId() }]);
    } else {
      setAccounts((prev) =>
        prev.map((a) => (a.id === modal.id ? { ...a, ...parsed } : a)),
      );
    }
    setModal(null);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    setDeleteConfirm(id);
  };
  const confirmDelete = () => {
    setAccounts((prev) => prev.filter((a) => a.id !== deleteConfirm));
    if (activeAccountId === deleteConfirm && accounts.length > 1) {
      setActiveAccountId(accounts.find((a) => a.id !== deleteConfirm)?.id);
    }
    setDeleteConfirm(null);
  };

  const isEditing = modal && modal !== "new";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* ── New / Edit Modal ── */}
      {modal && (
        <div
          className="modal-backdrop"
          onClick={(e) => e.target === e.currentTarget && setModal(null)}
        >
          <div className="modal-box" style={{ maxWidth: 420 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <h2 className="serif" style={{ fontSize: 22, color: C.forest }}>
                {isEditing ? "Edit Account" : "New Account"}
              </h2>
              <button className="btn-icon" onClick={() => setModal(null)}>
                <Icon name="close" size={18} />
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label>Account Name</label>
                <input
                  value={form.name}
                  onChange={set("name")}
                  placeholder="e.g. Personal Savings"
                />
              </div>
              <div>
                <label>Account Type</label>
                <select value={form.type} onChange={set("type")}>
                  {ACCOUNT_TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label>
                  {isEditing ? "Balance (ZAR)" : "Opening Balance (ZAR)"}
                </label>
                <input
                  type="number"
                  value={form.balance}
                  onChange={set("balance")}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
                {isEditing && (
                  <p style={{ fontSize: 11, color: C.textLight, marginTop: 6 }}>
                    ✎ You can update the balance directly — this won't affect
                    transaction history.
                  </p>
                )}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 24,
                justifyContent: "flex-end",
              }}
            >
              <button className="btn-ghost" onClick={() => setModal(null)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleSave}>
                {isEditing ? "Save Changes" : "Create Account"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteConfirm && (
        <div className="modal-backdrop" onClick={() => setDeleteConfirm(null)}>
          <div
            className="modal-box"
            style={{ maxWidth: 380 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              className="serif"
              style={{ fontSize: 22, color: C.danger, marginBottom: 12 }}
            >
              Delete Account?
            </h2>
            <p style={{ fontSize: 14, color: C.textMid, marginBottom: 24 }}>
              This will remove the account. Existing expenses linked to it will
              remain but become unlinked. This cannot be undone.
            </p>
            <div
              style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}
            >
              <button
                className="btn-ghost"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                style={{
                  background: C.danger,
                  color: C.white,
                  border: "none",
                  borderRadius: 12,
                  padding: "12px 24px",
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h2
            className="serif"
            style={{ fontSize: 28, fontWeight: 300, color: C.forest }}
          >
            Accounts
          </h2>
          <p style={{ fontSize: 13, color: C.textLight, marginTop: 2 }}>
            Manage all your financial accounts
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={openNew}
          style={{ display: "flex", alignItems: "center", gap: 8 }}
        >
          <Icon name="plus" size={15} /> New Account
        </button>
      </div>

      {/* ── Account Cards ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px,1fr))",
          gap: 16,
        }}
      >
        {accounts.map((acc) => {
          const accExpenses = expenses.filter((e) => e.accountId === acc.id);
          const totalSpent = accExpenses.reduce((s, e) => s + e.amount, 0);
          const isActive = acc.id === activeAccountId;
          return (
            <div
              key={acc.id}
              onClick={() => setActiveAccountId(acc.id)}
              style={{ cursor: "pointer" }}
            >
              <div
                className={isActive ? "card-dark" : "card-3d"}
                style={{
                  padding: 28,
                  border: isActive ? "none" : `2px solid ${C.softGray}`,
                  position: "relative",
                }}
              >
                {/* Edit + Delete buttons */}
                <div
                  style={{
                    position: "absolute",
                    top: 14,
                    right: 14,
                    display: "flex",
                    gap: 4,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="btn-icon"
                    title="Edit account"
                    onClick={(e) => openEdit(acc, e)}
                    style={{
                      background: isActive
                        ? "rgba(255,255,255,0.1)"
                        : C.ivoryDark,
                      borderRadius: 8,
                    }}
                  >
                    <Icon
                      name="edit"
                      size={13}
                      color={isActive ? C.goldLight : C.forest}
                    />
                  </button>
                  {accounts.length > 1 && (
                    <button
                      className="btn-icon btn-danger"
                      title="Delete account"
                      onClick={(e) => handleDelete(acc.id, e)}
                      style={{
                        background: isActive
                          ? "rgba(255,255,255,0.1)"
                          : C.ivoryDark,
                        borderRadius: 8,
                      }}
                    >
                      <Icon
                        name="trash"
                        size={13}
                        color={isActive ? "#ff9999" : C.danger}
                      />
                    </button>
                  )}
                </div>

                <div style={{ marginBottom: 20, paddingRight: 64 }}>
                  <p
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: 1,
                      color: isActive ? "rgba(246,244,239,0.5)" : C.textLight,
                      marginBottom: 6,
                    }}
                  >
                    {acc.type}
                  </p>
                  <p
                    className="serif"
                    style={{
                      fontSize: 20,
                      fontWeight: 400,
                      color: isActive ? C.ivory : C.text,
                    }}
                  >
                    {acc.name}
                  </p>
                </div>

                <p
                  className="serif"
                  style={{
                    fontSize: 30,
                    fontWeight: 300,
                    color: isActive ? C.ivory : C.forest,
                    marginBottom: 4,
                  }}
                >
                  {fmt(acc.balance)}
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: isActive ? "rgba(246,244,239,0.5)" : C.textLight,
                  }}
                >
                  {accExpenses.length} transactions · {fmt(totalSpent)} spent
                  total
                </p>

                {isActive && (
                  <div
                    style={{
                      marginTop: 16,
                      padding: "6px 12px",
                      background: "rgba(198,167,105,0.15)",
                      borderRadius: 8,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: C.gold,
                      }}
                    />
                    <span
                      style={{ fontSize: 11, color: C.gold, fontWeight: 500 }}
                    >
                      Active
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── SETTINGS PAGE ─────────────────────────────────────────────────────────────
const SettingsPage = ({ user, categories, setCategories }) => {
  const [newCat, setNewCat] = useState("");
  const [tab, setTab] = useState("profile");
  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "categories", label: "Categories" },
    { id: "security", label: "Security" },
  ];

  const addCat = () => {
    if (newCat && !categories.includes(newCat)) {
      setCategories((prev) => [...prev, newCat]);
      setNewCat("");
    }
  };
  const removeCat = (c) => {
    if (!DEFAULT_CATEGORIES.includes(c))
      setCategories((prev) => prev.filter((x) => x !== c));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h2
          className="serif"
          style={{ fontSize: 28, fontWeight: 300, color: C.forest }}
        >
          Settings
        </h2>
        <p style={{ fontSize: 13, color: C.textLight, marginTop: 2 }}>
          Manage your preferences
        </p>
      </div>
      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: 4,
          background: C.ivoryDark,
          borderRadius: 12,
          padding: 4,
          width: "fit-content",
        }}
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: "8px 20px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              fontFamily: "'DM Sans',sans-serif",
              fontSize: 13,
              fontWeight: 500,
              transition: "all 0.2s",
              background: tab === t.id ? C.white : "transparent",
              color: tab === t.id ? C.forest : C.textMid,
              boxShadow: tab === t.id ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "profile" && (
        <div className="card-3d" style={{ padding: 32, maxWidth: 520 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              marginBottom: 32,
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 18,
                background: `linear-gradient(145deg, ${C.forest}, ${C.forestLight})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: C.gold,
                fontSize: 22,
                fontWeight: 600,
                boxShadow: `0 8px 24px rgba(15,42,29,0.25)`,
              }}
            >
              {user.avatar}
            </div>
            <div>
              <p className="serif" style={{ fontSize: 22, color: C.text }}>
                {user.name}
              </p>
              <p style={{ fontSize: 13, color: C.textLight }}>{user.email}</p>
              <span
                className="badge"
                style={{
                  background: `rgba(15,42,29,0.08)`,
                  color: C.forest,
                  marginTop: 6,
                  textTransform: "capitalize",
                }}
              >
                {user.role}
              </span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label>Full Name</label>
              <input defaultValue={user.name} />
            </div>
            <div>
              <label>Email Address</label>
              <input defaultValue={user.email} type="email" />
            </div>
            <div>
              <label>Currency</label>
              <select defaultValue="ZAR">
                <option value="ZAR">South African Rand (ZAR)</option>
                <option value="USD">US Dollar (USD)</option>
                <option value="EUR">Euro (EUR)</option>
                <option value="GBP">British Pound (GBP)</option>
              </select>
            </div>
          </div>
          <button className="btn-primary" style={{ marginTop: 24 }}>
            Save Changes
          </button>
        </div>
      )}

      {tab === "categories" && (
        <div className="card-3d" style={{ padding: 32, maxWidth: 520 }}>
          <p
            className="serif"
            style={{ fontSize: 20, color: C.text, marginBottom: 20 }}
          >
            Expense Categories
          </p>
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            <input
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              placeholder="New category name…"
              onKeyDown={(e) => e.key === "Enter" && addCat()}
            />
            <button
              className="btn-primary"
              onClick={addCat}
              style={{ whiteSpace: "nowrap", padding: "11px 20px" }}
            >
              Add
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {categories.map((c) => (
              <div
                key={c}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 14px",
                  background: C.ivoryDark,
                  borderRadius: 10,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 3,
                      background: CATEGORY_COLORS[c] || C.textLight,
                    }}
                  />
                  <span style={{ fontSize: 14 }}>{c}</span>
                  {DEFAULT_CATEGORIES.includes(c) && (
                    <span
                      style={{
                        fontSize: 10,
                        color: C.textLight,
                        background: C.softGray,
                        padding: "2px 8px",
                        borderRadius: 20,
                      }}
                    >
                      Built-in
                    </span>
                  )}
                </div>
                {!DEFAULT_CATEGORIES.includes(c) && (
                  <button
                    className="btn-icon btn-danger"
                    onClick={() => removeCat(c)}
                  >
                    <Icon name="trash" size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "security" && (
        <div className="card-3d" style={{ padding: 32, maxWidth: 520 }}>
          <p
            className="serif"
            style={{ fontSize: 20, color: C.text, marginBottom: 20 }}
          >
            Security Settings
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label>Current Password</label>
              <input type="password" placeholder="••••••••" />
            </div>
            <div>
              <label>New Password</label>
              <input type="password" placeholder="••••••••" />
            </div>
            <div>
              <label>Confirm New Password</label>
              <input type="password" placeholder="••••••••" />
            </div>
          </div>
          <button className="btn-primary" style={{ marginTop: 24 }}>
            Update Password
          </button>
          <div
            style={{
              marginTop: 32,
              padding: 20,
              background: C.ivoryDark,
              borderRadius: 12,
            }}
          >
            <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>
              Security Features
            </p>
            {[
              "JWT Authentication",
              "bcrypt Password Hashing",
              "Rate Limiting Enabled",
              "Input Validation Active",
            ].map((f) => (
              <div
                key={f}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 8,
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 6,
                    background: C.forest,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon name="check" size={11} color={C.gold} />
                </div>
                <span style={{ fontSize: 13, color: C.textMid }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ── APP ROOT ──────────────────────────────────────────────────────────────────
export default function App() {
  useEffect(() => {
    injectStyles();
  }, []);
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expenses, setExpenses] = useState(DEMO_EXPENSES);
  const [accounts, setAccounts] = useState(DEMO_ACCOUNTS);
  const [budgets, setBudgets] = useState(DEMO_BUDGETS);
  const [income] = useState(DEMO_INCOME);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [activeAccountId, setActiveAccountId] = useState(DEMO_ACCOUNTS[0].id);
  const [toast, setToast] = useState(null);

  const activeAccount = useMemo(
    () => accounts.find((a) => a.id === activeAccountId) || accounts[0],
    [accounts, activeAccountId],
  );

  const showToast = useCallback((msg) => setToast(msg), []);

  if (!user)
    return (
      <AuthScreen
        onAuth={(u) => {
          setUser(u);
          showToast(`Welcome back, ${u.name.split(" ")[0]}!`);
        }}
      />
    );

  const pages = {
    dashboard: (
      <DashboardPage
        expenses={expenses}
        budgets={budgets}
        income={income}
        activeAccount={activeAccount}
        setPage={setPage}
      />
    ),
    expenses: (
      <ExpensesPage
        expenses={expenses}
        setExpenses={setExpenses}
        accounts={accounts}
        categories={categories}
        activeAccount={activeAccount}
      />
    ),
    budget: (
      <BudgetPage
        budgets={budgets}
        setBudgets={setBudgets}
        expenses={expenses}
        activeAccount={activeAccount}
        categories={categories}
      />
    ),
    reports: <ReportsPage expenses={expenses} activeAccount={activeAccount} />,
    accounts: (
      <AccountsPage
        accounts={accounts}
        setAccounts={setAccounts}
        expenses={expenses}
        activeAccountId={activeAccountId}
        setActiveAccountId={(id) => {
          setActiveAccountId(id);
          setPage("dashboard");
        }}
      />
    ),
    settings: (
      <SettingsPage
        user={user}
        categories={categories}
        setCategories={setCategories}
      />
    ),
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.ivory }}>
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
      <Sidebar
        page={page}
        setPage={setPage}
        user={user}
        onLogout={() => setUser(null)}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="main-content" style={{ flex: 1, overflow: "hidden" }}>
        {/* Top Bar */}
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 40,
            background: "rgba(246,244,239,0.85)",
            backdropFilter: "blur(12px)",
            borderBottom: `1px solid ${C.softGray}`,
            padding: "14px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              className="btn-icon"
              onClick={() => setSidebarOpen((o) => !o)}
              style={{ display: "none" }}
              id="menuBtn"
            >
              <Icon name="menu" size={20} />
            </button>
            {/* Account Switcher */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "7px 14px",
                background: C.white,
                borderRadius: 10,
                border: `1px solid ${C.softGray}`,
                cursor: "pointer",
              }}
              onClick={() => setPage("accounts")}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: C.gold,
                }}
              />
              <span style={{ fontSize: 13, fontWeight: 500, color: C.text }}>
                {activeAccount?.name}
              </span>
              <Icon name="chevronDown" size={14} color={C.textLight} />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button className="btn-icon">
              <Icon name="bell" size={18} />
            </button>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: `linear-gradient(145deg, ${C.forest}, ${C.forestLight})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: C.gold,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {user.avatar}
            </div>
          </div>
        </div>
        {/* Page Content */}
        <div style={{ padding: "32px 28px", maxWidth: 1100, margin: "0 auto" }}>
          {pages[page] || pages.dashboard}
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          #menuBtn { display: flex !important; }
          .main-content { margin-left: 0 !important; }
        }
      `}</style>
    </div>
  );
}
