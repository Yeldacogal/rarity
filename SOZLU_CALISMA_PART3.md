# 🎓 RARITY - SÖZLÜ SINAV ÇALIŞMA NOTLARI (BÖLÜM 3)

# FRONTEND KODLARI VE REACT

---

## 📚 İÇİNDEKİLER

1. [Frontend Yapısı](#1-frontend-yapısı)
2. [main.tsx ve App.tsx](#2-maintsx-ve-apptsx)
3. [AuthContext - Global State](#3-authcontext---global-state)
4. [API Çağrıları (Axios)](#4-api-çağrıları-axios)
5. [Layout ve Navigation](#5-layout-ve-navigation)
6. [ProtectedRoute ve AdminRoute](#6-protectedroute-ve-adminroute)
7. [Sayfa Componentleri](#7-sayfa-componentleri)
8. [Yeniden Kullanılabilir Componentler](#8-yeniden-kullanılabilir-componentler)

---

## 1. FRONTEND YAPISI

### 📁 Klasör Yapısı

```
frontend/src/
├── main.tsx           → Uygulama giriş noktası
├── App.tsx            → Routing yapısı
├── index.css          → Global stiller (Tailwind)
├── contexts/
│   └── AuthContext.tsx → Kullanıcı state yönetimi
├── lib/
│   └── api.ts         → Axios instance ve interceptors
├── components/
│   ├── Layout.tsx     → Header, Footer
│   ├── ProtectedRoute.tsx → Auth korumalı route
│   ├── AdminRoute.tsx → Admin korumalı route
│   ├── QuestionCard.tsx → Soru kartı
│   ├── AnswerCard.tsx → Cevap kartı
│   ├── TagSelector.tsx → Etiket seçici
│   └── ...
├── pages/
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── QuestionsPage.tsx
│   ├── QuestionDetailPage.tsx
│   ├── CreateQuestionPage.tsx
│   ├── admin/
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminUsersPage.tsx
│   │   ├── AdminReportsPage.tsx
│   │   └── AdminTagsPage.tsx
│   └── ...
└── types/
    └── index.ts       → TypeScript tipleri
```

---

## 2. main.tsx VE App.tsx

### 📌 main.tsx - React Giriş Noktası

```typescript
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### Ne Yapar:

| Satır                             | Açıklama                   |
| --------------------------------- | -------------------------- |
| `ReactDOM.createRoot()`           | React 18 root oluştur      |
| `document.getElementById('root')` | index.html'deki div        |
| `!`                               | TypeScript: null olmayacak |
| `<React.StrictMode>`              | Development uyarıları      |
| `<App />`                         | Ana component              |

---

### 📌 App.tsx - Routing Yapısı

```typescript
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import QuestionsPage from "./pages/QuestionsPage";
import QuestionDetailPage from "./pages/QuestionDetailPage";
import CreateQuestionPage from "./pages/CreateQuestionPage";
import AdminDashboard from "./pages/admin/AdminDashboard";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/questions" element={<QuestionsPage />} />
            <Route path="/questions/:id" element={<QuestionDetailPage />} />

            <Route
              path="/questions/new"
              element={
                <ProtectedRoute>
                  <CreateQuestionPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
```

### Routing Açıklaması:

| Component                          | Ne Yapar                        |
| ---------------------------------- | ------------------------------- |
| `<AuthProvider>`                   | Global auth state sağlar        |
| `<Router>`                         | URL yönlendirmesi etkinleştirir |
| `<Layout>`                         | Her sayfaya Header/Footer ekler |
| `<Routes>`                         | Route eşleştirmesi yapar        |
| `<Route path="/" element={...} />` | URL → Component eşleştir        |
| `<ProtectedRoute>`                 | Login gerektiren sayfalar       |
| `<AdminRoute>`                     | Admin gerektiren sayfalar       |

### Dynamic Route:

```typescript
<Route path="/questions/:id" element={<QuestionDetailPage />} />
// /questions/5 → id = 5
// /questions/123 → id = 123
```

---

## 3. AUTHCONTEXT - GLOBAL STATE

### 📌 AuthContext.tsx - Tam Kod

```typescript
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import api from "../lib/api";

interface User {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
  avatarUrl?: string;
  bio?: string;
  isBanned: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isLoading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));

      api
        .get("/users/me")
        .then((response) => {
          setUser(response.data);
          localStorage.setItem("user", JSON.stringify(response.data));
        })
        .catch(() => {
          logout();
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password });
    const { user: userData, accessToken } = response.data;

    setUser(userData);
    setToken(accessToken);
    localStorage.setItem("token", accessToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
    });
    const { user: userData, accessToken } = response.data;

    setUser(userData);
    setToken(accessToken);
    localStorage.setItem("token", accessToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const isAdmin = user?.role === "ADMIN";

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        updateUser,
        isLoading,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
```

### Context API Açıklaması:

**1. createContext:**

```typescript
const AuthContext = createContext<AuthContextType | undefined>(undefined);
```

- Global state container oluştur
- Tip: `AuthContextType | undefined`

**2. Provider Component:**

```typescript
<AuthContext.Provider value={{ user, token, login, ... }}>
  {children}
</AuthContext.Provider>
```

- State'i tüm alt componentlere sağlar
- `value`: Paylaşılan veriler

**3. Custom Hook:**

```typescript
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
```

- Context'e kolay erişim sağlar
- Provider dışında kullanılırsa hata fırlatır

### useEffect - Sayfa Yüklendiğinde:

```typescript
useEffect(() => {
  const storedToken = localStorage.getItem("token");
  if (storedToken) {
    // Token varsa kullanıcıyı doğrula
    api
      .get("/users/me")
      .then((res) => setUser(res.data))
      .catch(() => logout()); // Token geçersizse çıkış yap
  }
  setIsLoading(false);
}, []); // [] = sadece ilk render'da çalış
```

### localStorage Kullanımı:

```typescript
// Kaydet
localStorage.setItem("token", accessToken);
localStorage.setItem("user", JSON.stringify(userData));

// Oku
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

// Sil
localStorage.removeItem("token");
```

---

## 4. API ÇAĞRILARI (AXIOS)

### 📌 lib/api.ts

```typescript
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Axios Instance:

```typescript
const api = axios.create({
  baseURL: "http://localhost:3000", // Tüm isteklerin önüne eklenir
  headers: { "Content-Type": "application/json" },
});

// Kullanım:
api.get("/questions"); // GET http://localhost:3000/questions
api.post("/auth/login"); // POST http://localhost:3000/auth/login
```

### Request Interceptor:

```typescript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

- Her API isteğinden önce çalışır
- Token varsa header'a ekler
- Backend JWT'yi bu header'dan okur

### Response Interceptor:

```typescript
api.interceptors.response.use(
  (response) => response, // Başarılı → olduğu gibi döndür
  (error) => {
    if (error.response?.status === 401) {
      // Token geçersiz
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
```

- 401 Unauthorized → Login'e yönlendir

---

## 5. LAYOUT VE NAVIGATION

### 📌 Layout.tsx

```typescript
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from "react";
import api from "../lib/api";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
    }
  }, [user]);

  const fetchUnreadCount = async () => {
    try {
      const response = await api.get("/notifications/unread-count");
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error("Failed to fetch unread count");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-2xl font-bold text-pink-600">
              RARITY
            </Link>

            <nav className="flex items-center space-x-6">
              <Link
                to="/questions"
                className="text-gray-600 hover:text-pink-600"
              >
                Sorular
              </Link>

              {user ? (
                <>
                  <Link
                    to="/questions/new"
                    className="text-gray-600 hover:text-pink-600"
                  >
                    Soru Sor
                  </Link>

                  <Link
                    to="/notifications"
                    className="relative text-gray-600 hover:text-pink-600"
                  >
                    🔔
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="text-purple-600 hover:text-purple-700"
                    >
                      Admin Panel
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-pink-600"
                  >
                    Çıkış
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-pink-600"
                  >
                    Giriş
                  </Link>
                  <Link
                    to="/register"
                    className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700"
                  >
                    Kayıt Ol
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-grow">{children}</main>

      <footer className="bg-white border-t border-gray-200 py-8">
        <p className="text-center text-gray-500">© 2024 RARITY</p>
      </footer>
    </div>
  );
}
```

### Layout Yapısı:

```
┌─────────────────────────────────────────┐
│           HEADER (sabit)                │
│  Logo    |    Nav Links    |   User     │
├─────────────────────────────────────────┤
│                                         │
│              {children}                 │
│         (sayfa içeriği)                 │
│                                         │
├─────────────────────────────────────────┤
│           FOOTER (sabit)                │
└─────────────────────────────────────────┘
```

### Conditional Rendering:

```typescript
{
  user ? (
    // Giriş yapılmış
    <>
      <Link to="/questions/new">Soru Sor</Link>
      <button onClick={handleLogout}>Çıkış</button>
    </>
  ) : (
    // Giriş yapılmamış
    <>
      <Link to="/login">Giriş</Link>
      <Link to="/register">Kayıt Ol</Link>
    </>
  );
}
```

### Bildirim Badge:

```typescript
{
  unreadCount > 0 && (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4">
      {unreadCount}
    </span>
  );
}
```

---

## 6. PROTECTEDROUTE VE ADMINROUTE

### 📌 ProtectedRoute.tsx

```typescript
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
```

### Akış:

```
1. isLoading = true → Spinner göster
2. isLoading = false, user = null → Login'e yönlendir
3. isLoading = false, user var → İçeriği göster
```

### Navigate Component:

```typescript
<Navigate to="/login" replace />
// replace: Browser history'ye ekleme, geri tuşunda dönemez
```

---

### 📌 AdminRoute.tsx

```typescript
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface Props {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: Props) {
  const { user, isLoading, isAdmin } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
```

### Akış:

```
1. isLoading → Spinner
2. user yok → Login'e
3. user var ama admin değil → Ana sayfaya
4. Admin → İçeriği göster
```

---

## 7. SAYFA COMPONENTLERİ

### 📌 LoginPage.tsx

```typescript
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Giriş başarısız");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Giriş Yap
        </h2>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Şifre
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 disabled:opacity-50"
          >
            {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Hesabınız yok mu?{" "}
          <Link to="/register" className="text-pink-600 hover:text-pink-700">
            Kayıt olun
          </Link>
        </p>
      </div>
    </div>
  );
}
```

### Form Handling:

**1. State'ler:**

```typescript
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
const [isLoading, setIsLoading] = useState(false);
```

**2. Controlled Input:**

```typescript
<input
  value={email} // State'ten oku
  onChange={(e) => setEmail(e.target.value)} // State'e yaz
/>
```

**3. Form Submit:**

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault(); // Sayfa yenilemeyi engelle
  setIsLoading(true);

  try {
    await login(email, password);
    navigate("/"); // Başarılı → ana sayfaya
  } catch (err) {
    setError(err.response?.data?.message); // Hata göster
  } finally {
    setIsLoading(false);
  }
};
```

---

### 📌 QuestionDetailPage.tsx (Özet)

```typescript
export default function QuestionDetailPage() {
  const { id } = useParams(); // URL'den id al
  const { user } = useAuth();
  const navigate = useNavigate();

  const [question, setQuestion] = useState<Question | null>(null);
  const [answerContent, setAnswerContent] = useState("");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchQuestion();
  }, [id]);

  useEffect(() => {
    if (user && id) {
      checkBookmark();
    }
  }, [user, id]);

  const fetchQuestion = async () => {
    try {
      const response = await api.get(`/questions/${id}`);
      setQuestion(response.data);
    } catch (error) {
      navigate("/questions");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerContent.trim()) return;

    try {
      await api.post(`/questions/${id}/answers`, { content: answerContent });
      setAnswerContent("");
      fetchQuestion(); // Listeyi yenile
    } catch (error: any) {
      alert(error.response?.data?.message || "Hata!");
    }
  };

  const handleBookmark = async () => {
    try {
      const response = await api.post(`/bookmarks/questions/${id}`);
      setIsBookmarked(response.data.bookmarked);
    } catch (error) {
      console.error("Bookmark error");
    }
  };

  // ... render
}
```

### useParams():

```typescript
const { id } = useParams();
// URL: /questions/5
// id = "5" (string!)
```

### Veri Çekme Pattern:

```typescript
useEffect(() => {
  fetchQuestion();
}, [id]); // id değişince tekrar çek
```

---

## 8. YENİDEN KULLANILABİLİR COMPONENTLER

### 📌 AnswerCard.tsx

```typescript
interface Props {
  answer: Answer;
  onVote: (answerId: number) => Promise<void>;
  onReply: (answerId: number, content: string) => Promise<void>;
  onDelete: (answerId: number) => Promise<void>;
  onBookmark: (answerId: number) => Promise<void>;
  currentUserId?: number;
  isAdmin?: boolean;
}

export default function AnswerCard({
  answer,
  onVote,
  onReply,
  onDelete,
  onBookmark,
  currentUserId,
  isAdmin,
}: Props) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isVoted, setIsVoted] = useState(false);
  const [voteCount, setVoteCount] = useState(answer.votes?.length || 0);

  useEffect(() => {
    if (currentUserId) {
      checkVoteStatus();
    }
  }, [currentUserId, answer.id]);

  const checkVoteStatus = async () => {
    try {
      const response = await api.get(`/answers/${answer.id}/votes/check`);
      setIsVoted(response.data.voted);
    } catch (error) {
      console.error("Vote check error");
    }
  };

  const handleVote = async () => {
    try {
      await onVote(answer.id);
      setIsVoted(!isVoted);
      setVoteCount(isVoted ? voteCount - 1 : voteCount + 1);
    } catch (error) {
      console.error("Vote error");
    }
  };

  const handleReply = async () => {
    if (!replyContent.trim()) return;
    await onReply(answer.id, replyContent);
    setReplyContent("");
    setShowReplyForm(false);
  };

  const isOwner = currentUserId === answer.authorId;
  const canDelete = isOwner || isAdmin;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <div className="flex items-start space-x-4">
        <div className="flex flex-col items-center">
          <button
            onClick={handleVote}
            className={`p-2 rounded-full ${
              isVoted
                ? "text-pink-600 bg-pink-50"
                : "text-gray-400 hover:text-pink-600"
            }`}
          >
            ❤️
          </button>
          <span className="font-semibold text-gray-700">{voteCount}</span>
        </div>

        <div className="flex-grow">
          <div className="flex items-center space-x-2 mb-2">
            <span className="font-medium text-gray-900">
              {answer.author.name}
            </span>
            <span className="text-gray-400 text-sm">
              {new Date(answer.createdAt).toLocaleDateString("tr-TR")}
            </span>
          </div>

          <p className="text-gray-700 whitespace-pre-wrap">{answer.content}</p>

          <div className="flex items-center space-x-4 mt-4 text-sm">
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-gray-500 hover:text-pink-600"
            >
              Yanıtla
            </button>

            <button
              onClick={() => onBookmark(answer.id)}
              className="text-gray-500 hover:text-pink-600"
            >
              Favorile
            </button>

            {canDelete && (
              <button
                onClick={() => onDelete(answer.id)}
                className="text-red-500 hover:text-red-600"
              >
                Sil
              </button>
            )}
          </div>

          {showReplyForm && (
            <div className="mt-4">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Yanıtınızı yazın..."
                className="w-full p-3 border border-gray-300 rounded-lg"
                rows={3}
              />
              <button
                onClick={handleReply}
                className="mt-2 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700"
              >
                Gönder
              </button>
            </div>
          )}

          {answer.replies && answer.replies.length > 0 && (
            <div className="mt-4 pl-4 border-l-2 border-gray-200 space-y-4">
              {answer.replies.map((reply) => (
                <AnswerCard
                  key={reply.id}
                  answer={reply}
                  onVote={onVote}
                  onReply={onReply}
                  onDelete={onDelete}
                  onBookmark={onBookmark}
                  currentUserId={currentUserId}
                  isAdmin={isAdmin}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

### Recursive Component (Nested Replies):

```typescript
{
  answer.replies.map((reply) => (
    <AnswerCard
      key={reply.id}
      answer={reply} // Yanıtı aynı component'e ver
      // ... aynı props'lar
    />
  ));
}
```

- Component kendi kendini çağırır
- Sonsuz derinlikte yanıt gösterilebilir

### Props Pattern:

```typescript
interface Props {
  answer: Answer; // Veri
  onVote: () => Promise<void>; // Callback fonksiyon
  currentUserId?: number; // Opsiyonel prop
}
```

### Optimistic UI Update:

```typescript
const handleVote = async () => {
  setIsVoted(!isVoted); // Hemen UI'ı güncelle
  setVoteCount(isVoted ? voteCount - 1 : voteCount + 1);
  await onVote(answer.id); // Sonra API çağır
};
```

---

### 📌 TagSelector.tsx

```typescript
interface Props {
  selectedTags: number[];
  onChange: (tagIds: number[]) => void;
}

export default function TagSelector({ selectedTags, onChange }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories/with-tags");
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTagToggle = (tagId: number) => {
    if (selectedTags.includes(tagId)) {
      onChange(selectedTags.filter((id) => id !== tagId));
    } else {
      onChange([...selectedTags, tagId]);
    }
  };

  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <div key={category.id}>
          <h4 className="font-medium text-gray-900 mb-2">{category.name}</h4>

          {category.subcategories.map((subcategory) => (
            <div key={subcategory.id} className="ml-4 mb-2">
              <h5 className="text-sm text-gray-600 mb-1">{subcategory.name}</h5>

              <div className="flex flex-wrap gap-2">
                {subcategory.tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleTagToggle(tag.id)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedTags.includes(tag.id)
                        ? "bg-pink-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
```

### Array Toggle Pattern:

```typescript
const handleTagToggle = (tagId: number) => {
  if (selectedTags.includes(tagId)) {
    // Zaten seçili → kaldır
    onChange(selectedTags.filter((id) => id !== tagId));
  } else {
    // Seçili değil → ekle
    onChange([...selectedTags, tagId]);
  }
};
```

---

## 🎯 PUANLAMA KARŞILIĞI (BÖLÜM 3)

| Kriter               | Puan | Bu Dosyada Nerede                                     |
| -------------------- | ---- | ----------------------------------------------------- |
| **Giriş/Kayıt**      | 10P  | LoginPage, RegisterPage, AuthContext                  |
| **Yetkilendirme**    | 10P  | ProtectedRoute, AdminRoute, useAuth                   |
| **Frontend-Backend** | 15P  | api.ts (Axios), interceptors, useEffect API çağrıları |
| **Tasarım**          | 20P  | Tailwind classes, responsive design                   |

---

**📝 BÖLÜM 4'TE:** Tailwind CSS detayları, Admin sayfaları ve SSS!
