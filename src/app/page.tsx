"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

const characters = {
  VE: {
    male:   { name: "Andrés",    img: "/andres.png",    country: "فنزويلا",   flag: "🇻🇪", color: "#CF0A0A" },
    female: { name: "Valentina", img: "/valentina.png", country: "فنزويلا",   flag: "🇻🇪", color: "#CF0A0A" },
  },
  CO: {
    male:   { name: "Santiago",  img: "/santiago.png",  country: "كولومبيا",  flag: "🇨🇴", color: "#FCD116" },
    female: { name: "Isabella",  img: "/isabella.png",  country: "كولومبيا",  flag: "🇨🇴", color: "#FCD116" },
  },
  MX: {
    male:   { name: "Diego",     img: "/diego.png",     country: "المكسيك",   flag: "🇲🇽", color: "#006847" },
    female: { name: "Camila",    img: "/camila.png",    country: "المكسيك",   flag: "🇲🇽", color: "#006847" },
  },
  UY: {
    male:   { name: "Mateo",     img: "/mateo.png",     country: "أوروغواي",  flag: "🇺🇾", color: "#5EB6E4" },
    female: { name: "Lucía",     img: "/lucia.png",     country: "أوروغواي",  flag: "🇺🇾", color: "#5EB6E4" },
  },
};

const countries = [
  { code: "VE", flag: "🇻🇪", name: "فنزويلا",  color: "#CF0A0A" },
  { code: "CO", flag: "🇨🇴", name: "كولومبيا", color: "#FCD116" },
  { code: "MX", flag: "🇲🇽", name: "المكسيك",  color: "#006847" },
  { code: "UY", flag: "🇺🇾", name: "أوروغواي", color: "#5EB6E4" },
];

const features = [
  { icon: "🎯", title: "دروس يومية", desc: "محتوى مصمم خصيصاً للناطقين بالعربية" },
  { icon: "🏆", title: "تحديات وجوائز", desc: "نقاط وشارات تجعل التعلم ممتعاً" },
  { icon: "👨‍🏫", title: "معلمون حقيقيون", desc: "مدرسون من أمريكا اللاتينية" },
  { icon: "🎓", title: "شهادات معتمدة", desc: "احصل على شهادة رسمية" },
  { icon: "🤖", title: "ذكاء اصطناعي", desc: "مساعد AI يصحح نطقك" },
  { icon: "🌎", title: "مجتمع عربي", desc: "تعلم مع آلاف الطلاب العرب" },
];

// ═══════════════════════════════════════
// APP LAYOUT — خارج Home تماماً
// ═══════════════════════════════════════
function AppLayout({
  children,
  onGoHome,
}: {
  children: React.ReactNode;
  onGoHome: () => void;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FFFFFF",
        fontFamily: "sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
      dir="rtl"
    >
      <nav
        style={{
          background: "#FFFFFF",
          borderBottom: "1px solid #E5E7EB",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <Image
          src="/logo.png"
          alt="OLIVEIRApp"
          width={140}
          height={40}
          style={{ objectFit: "contain", mixBlendMode: "screen" as const }}
        />
        <button
          onClick={onGoHome}
          style={{
            background: "none",
            border: "1px solid #00B4D8",
            borderRadius: "10px",
            padding: "8px 16px",
            color: "#00B4D8",
            cursor: "pointer",
            fontSize: "13px",
          }}
        >
          ← الرئيسية
        </button>
      </nav>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 24px",
        }}
      >
        {children}
      </div>
      <footer
        style={{
          padding: "20px",
          textAlign: "center",
          fontSize: "12px",
          color: "#9CA3AF",
          borderTop: "1px solid #F3F4F6",
        }}
      >
        © 2026 OLIVEIRApp · جميع الحقوق محفوظة
      </footer>
    </div>
  );
}

// ═══════════════════════════════════════
// HOME
// ═══════════════════════════════════════
export default function Home() {
  const [screen, setScreen]         = useState<"landing" | "app">("landing");
  const [step, setStep]             = useState(0);
  const [country, setCountry]       = useState("");
  const [gender, setGender]         = useState("");
  const [name, setName]             = useState("");
  const [age, setAge]               = useState("");
  const [reason, setReason]         = useState("");
  const [time, setTime]             = useState("");
  const [level, setLevel]           = useState("");
  const [email, setEmail]           = useState("");
  const [score, setScore]           = useState(0);
  const [totalQ, setTotalQ]         = useState(0);
  const [mood, setMood]             = useState<"happy" | "surprised" | "neutral">("neutral");
  const [registered, setRegistered] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [floatingWords, setFloatingWords] = useState<string[]>([]);

  const char =
    country && gender
      ? characters[country as keyof typeof characters][gender as "male" | "female"]
      : null;

  const words = ["¡Hola!", "Gracias", "¿Cómo estás?", "¡Buenas!", "Amigo", "¡Perfecto!", "Saludos", "¡Vamos!", "Bonito", "¡Increíble!"];

  useEffect(() => {
    // ابدأ فوراً
    setFloatingWords(words.slice(0, 5).map(w => w));
    const interval = setInterval(() => {
      setFloatingWords((prev) => {
        const newWord = words[Math.floor(Math.random() * words.length)];
        return [...prev.slice(-6), newWord];
      });
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const goHome = () => {
    setScreen("landing");
    setStep(0);
    setCountry("");
    setGender("");
    setName("");
    setAge("");
    setReason("");
    setTime("");
    setLevel("");
    setEmail("");
    setScore(0);
    setTotalQ(0);
    setMood("neutral");
    setRegistered(false);
  };

  const handleAnswer = (correct: boolean) => {
    setTotalQ((q) => q + 1);
    if (correct) {
      setScore((s) => s + 1);
      setMood("happy");
    } else {
      setMood("neutral");
    }
    setTimeout(() => setMood("neutral"), 1500);
  };

  const handleRegister = async () => {
    if (!email.trim()) return;
    setLoading(true);
    const pct = totalQ > 0 ? Math.round((score / totalQ) * 100) : 0;
    await supabase.from("waitlist").insert([
      {
        name,
        email,
        age,
        reason,
        time,
        level,
        country,
        character: char?.name,
        score: `${pct}%`,
      },
    ]);
    setLoading(false);
    setRegistered(true);
  };

  const moodEmoji =
    mood === "happy" ? "😄" : mood === "surprised" ? "🤩" : "🙂";

  const optBtn = (text: string, onClick: () => void) => (
    <motion.button
      key={text}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{
        width: "100%",
        padding: "16px",
        borderRadius: "14px",
        border: "1px solid #00B4D8",
        background: "#F8FBFF",
        color: "#0A0F1E",
        fontSize: "15px",
        cursor: "pointer",
        textAlign: "right",
        marginBottom: "10px",
        fontFamily: "sans-serif",
      }}
    >
      {text}
    </motion.button>
  );

  // ═══════════════════════════════════════
  // LANDING PAGE
  // ═══════════════════════════════════════
  if (screen === "landing")
    return (
      <div
        style={{
          background: "#0A0F1E",
          minHeight: "100vh",
          fontFamily: "sans-serif",
          overflowX: "hidden",
        }}
      >
        {/* NAVBAR */}
        <nav
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            background: "rgba(10,15,30,0.9)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(0,180,216,0.15)",
            padding: "16px 40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Image
            src="/logo.png"
            alt="OLIVEIRApp"
            width={220}
            height={60}
            style={{ objectFit: "contain", mixBlendMode: "screen" as const }}
          />
          <button
            onClick={() => setScreen("app")}
            style={{
              background: "linear-gradient(135deg, #00B4D8, #00F5D4)",
              border: "none",
              borderRadius: "12px",
              padding: "12px 28px",
              color: "#0A0F1E",
              fontWeight: "bold",
              fontSize: "15px",
              cursor: "pointer",
            }}
          >
            ابدأ مجاناً 🚀
          </button>
        </nav>

        {/* HERO */}
        <section
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "120px 24px 60px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "600px",
              height: "600px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(0,180,216,0.08) 0%, transparent 70%)",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              overflow: "hidden",
            }}
          >
            {floatingWords.map((word, i) => (
              <motion.div
                key={`${word}-${i}`}
                initial={{ opacity: 0, y: 80, scale: 0.6 }}
                animate={{ opacity: [0, 1, 1, 0], y: -300, scale: 1.2 }}
                transition={{ duration: 5, ease: "easeOut" }}
                style={{
                  position: "absolute",
                  bottom: "10%",
                  color: i % 2 === 0 ? "#00F5D4" : "#FFD60A",
                  fontSize: "28px",
                  fontWeight: "900",
                  left: `${8 + i * 16}%`,
                  textShadow: "0 0 20px rgba(0,245,212,0.5)",
                  letterSpacing: "1px",
                }}
              >
                {word}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div
              style={{
                display: "inline-block",
                background: "rgba(0,180,216,0.1)",
                border: "1px solid rgba(0,180,216,0.3)",
                borderRadius: "999px",
                padding: "8px 20px",
                marginBottom: "32px",
                color: "#00B4D8",
                fontSize: "13px",
                letterSpacing: "2px",
              }}
            >
              🌿 أول منصة إسبانية لاتينية للعرب
            </div>

            <h1
              style={{
                fontSize: "clamp(40px, 7vw, 80px)",
                fontWeight: "900",
                color: "#F0F4FF",
                lineHeight: "1.1",
                marginBottom: "24px",
                maxWidth: "800px",
              }}
            >
              تعلم الإسبانية
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #00B4D8, #00F5D4)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                بطريقة لم تجربها قبل
              </span>
            </h1>

            <p
              style={{
                fontSize: "18px",
                color: "rgba(240,244,255,0.6)",
                maxWidth: "500px",
                margin: "0 auto 48px",
                lineHeight: "1.8",
              }}
            >
              رفيقك اللاتيني ينتظرك. محادثات حقيقية، تعلم ممتع، ونتائج
              مضمونة.
            </p>

            <div
              style={{
                display: "flex",
                gap: "16px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setScreen("app")}
                style={{
                  background: "linear-gradient(135deg, #00B4D8, #00F5D4)",
                  border: "none",
                  borderRadius: "16px",
                  padding: "18px 40px",
                  color: "#0A0F1E",
                  fontWeight: "bold",
                  fontSize: "17px",
                  cursor: "pointer",
                }}
              >
                ابدأ التجربة مجاناً 🚀
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(0,180,216,0.4)",
                  borderRadius: "16px",
                  padding: "18px 40px",
                  color: "#F0F4FF",
                  fontSize: "17px",
                  cursor: "pointer",
                }}
              >
                كيف يعمل؟ 👇
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            style={{
              display: "flex",
              gap: "16px",
              justifyContent: "center",
              marginTop: "80px",
              flexWrap: "wrap",
            }}
          >
            {[
              "/andres.png",
              "/valentina.png",
              "/santiago.png",
              "/isabella.png",
              "/diego.png",
              "/camila.png",
              "/mateo.png",
              "/lucia.png",
            ].map((img, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.1, y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "2px solid rgba(0,180,216,0.4)",
                  background: "#1A2744",
                }}
              >
                <Image
                  src={img}
                  alt="character"
                  width={80}
                  height={80}
                  style={{ objectFit: "cover", objectPosition: "top" }}
                />
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* FEATURES */}
        <section
          id="features"
          style={{ padding: "100px 24px", maxWidth: "1100px", margin: "0 auto" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: "64px" }}
          >
            <h2
              style={{
                fontSize: "clamp(28px, 4vw, 48px)",
                fontWeight: "800",
                color: "#F0F4FF",
                marginBottom: "16px",
              }}
            >
              كل ما تحتاجه في مكان واحد
            </h2>
            <p style={{ color: "rgba(240,244,255,0.5)", fontSize: "16px" }}>
              منصة شاملة صممت خصيصاً للمتعلم العربي
            </p>
          </motion.div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "20px",
            }}
          >
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5, borderColor: "rgba(0,180,216,0.5)" }}
                style={{
                  background: "rgba(26,39,68,0.6)",
                  border: "1px solid rgba(0,180,216,0.15)",
                  borderRadius: "20px",
                  padding: "32px",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div style={{ fontSize: "40px", marginBottom: "16px" }}>
                  {f.icon}
                </div>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "700",
                    color: "#F0F4FF",
                    marginBottom: "8px",
                  }}
                >
                  {f.title}
                </h3>
                <p
                  style={{
                    color: "rgba(240,244,255,0.5)",
                    fontSize: "14px",
                    lineHeight: "1.6",
                  }}
                >
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CHARACTERS SECTION */}
        <section
          style={{
            padding: "100px 24px",
            background: "rgba(0,180,216,0.03)",
            borderTop: "1px solid rgba(0,180,216,0.08)",
            borderBottom: "1px solid rgba(0,180,216,0.08)",
          }}
        >
          <div
            style={{
              maxWidth: "1100px",
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2
                style={{
                  fontSize: "clamp(28px, 4vw, 48px)",
                  fontWeight: "800",
                  color: "#F0F4FF",
                  marginBottom: "16px",
                }}
              >
                اختر رفيقك اللاتيني
              </h2>
              <p
                style={{
                  color: "rgba(240,244,255,0.5)",
                  marginBottom: "60px",
                }}
              >
                ٨ شخصيات من ٤ دول لاتينية تنتظرك
              </p>
            </motion.div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "20px",
              }}
            >
              {Object.entries(characters).flatMap(([code, genders]) =>
                Object.entries(genders).map(([g, c]) => (
                  <motion.div
                    key={`${code}-${g}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    whileHover={{
                      y: -10,
                      boxShadow: `0 20px 40px ${c.color}30`,
                    }}
                    style={{
                      background: "rgba(26,39,68,0.8)",
                      border: `1px solid ${c.color}30`,
                      borderRadius: "20px",
                      padding: "24px",
                      cursor: "pointer",
                    }}
                    onClick={() => setScreen("app")}
                  >
                    <div
                      style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                        overflow: "hidden",
                        margin: "0 auto 16px",
                        border: `2px solid ${c.color}`,
                      }}
                    >
                      <Image
                        src={c.img}
                        alt={c.name}
                        width={100}
                        height={100}
                        style={{ objectFit: "cover", objectPosition: "top" }}
                      />
                    </div>
                    <div
                      style={{
                        fontWeight: "700",
                        color: "#F0F4FF",
                        fontSize: "16px",
                      }}
                    >
                      {c.name}
                    </div>
                    <div
                      style={{
                        color: c.color,
                        fontSize: "13px",
                        marginTop: "4px",
                      }}
                    >
                      {c.flag} {c.country}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: "120px 24px", textAlign: "center" }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2
              style={{
                fontSize: "clamp(32px, 5vw, 60px)",
                fontWeight: "900",
                color: "#F0F4FF",
                marginBottom: "24px",
              }}
            >
              جاهز تبدأ؟
            </h2>
            <p
              style={{
                color: "rgba(240,244,255,0.5)",
                marginBottom: "48px",
                fontSize: "16px",
              }}
            >
              انضم لقائمة الانتظار وكن من أوائل المشتركين
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setScreen("app")}
              style={{
                background: "linear-gradient(135deg, #00B4D8, #00F5D4)",
                border: "none",
                borderRadius: "16px",
                padding: "20px 60px",
                color: "#0A0F1E",
                fontWeight: "bold",
                fontSize: "20px",
                cursor: "pointer",
              }}
            >
              ابدأ رحلتك الآن 🌿
            </motion.button>
          </motion.div>
        </section>

        {/* FOOTER */}
        <footer
          style={{
            borderTop: "1px solid rgba(0,180,216,0.1)",
            padding: "32px 24px",
            textAlign: "center",
            color: "rgba(240,244,255,0.3)",
            fontSize: "13px",
          }}
        >
          © 2026 OLIVEIRApp · تقنية · لغة · مستقبل · جميع الحقوق محفوظة
        </footer>
      </div>
    );

  // ═══════════════════════════════════════
  // APP SCREEN
  // ═══════════════════════════════════════
  if (registered)
    return (
      <AppLayout onGoHome={goHome}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          style={{ textAlign: "center", maxWidth: "480px" }}
        >
          <div style={{ fontSize: "80px", marginBottom: "24px" }}>🎉</div>
          <h1
            style={{ fontSize: "28px", color: "#007A6E", marginBottom: "12px" }}
          >
            ¡Bienvenido, {name}!
          </h1>
          <div
            style={{
              background: "#F0FFF4",
              border: "1px solid #00B4D8",
              borderRadius: "20px",
              padding: "24px",
              marginBottom: "24px",
            }}
          >
            <p style={{ color: "#555", marginBottom: "8px" }}>
              أنت الآن من مؤسسي OLIVEIRApp 🌿
            </p>
            <p style={{ color: "#555", marginBottom: "16px" }}>
              سيصلك إيميل قريباً 📧
            </p>
            {totalQ > 0 && (
              <div
                style={{
                  background: "#E8F8FF",
                  borderRadius: "12px",
                  padding: "16px",
                }}
              >
                <p style={{ color: "#0077AA", fontWeight: "bold" }}>
                  نتيجتك: {Math.round((score / totalQ) * 100)}%
                </p>
                <p style={{ color: "#555", fontSize: "13px" }}>
                  أجبت {score} من {totalQ} إجابات صحيحة
                </p>
              </div>
            )}
          </div>
          <p style={{ color: "#B8860B", fontSize: "18px", fontWeight: "bold" }}>
            @OLIVEIRApp
          </p>
        </motion.div>
      </AppLayout>
    );

  return (
    <AppLayout onGoHome={goHome}>
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          style={{ width: "100%", maxWidth: "480px" }}
        >
          {/* STEP 0 — CHOOSE COUNTRY */}
          {step === 0 && (
            <div style={{ textAlign: "center" }}>
              <Image
                src="/logo.png"
                alt="OLIVEIRApp"
                width={300}
                height={90}
                style={{ objectFit: "contain", marginBottom: "32px" }}
                priority
              />
              <h2
                style={{
                  fontSize: "24px",
                  marginBottom: "8px",
                  color: "#0A0F1E",
                }}
              >
                اختر رفيقك اللاتيني
              </h2>
              <p
                style={{
                  color: "#9CA3AF",
                  marginBottom: "32px",
                  fontSize: "14px",
                }}
              >
                كل دولة لها أسلوبها وثقافتها الخاصة
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                }}
              >
                {countries.map((c) => (
                  <motion.button
                    key={c.code}
                    whileHover={{ scale: 1.05, borderColor: c.color }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setCountry(c.code);
                      setStep(1);
                    }}
                    style={{
                      background: "#F8FBFF",
                      border: `2px solid ${c.color}40`,
                      borderRadius: "20px",
                      padding: "28px 16px",
                      cursor: "pointer",
                      color: "#0A0F1E",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <span style={{ fontSize: "48px" }}>{c.flag}</span>
                    <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                      {c.name}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 1 — CHOOSE CHARACTER */}
          {step === 1 && (
            <div style={{ textAlign: "center" }}>
              <h2
                style={{
                  fontSize: "22px",
                  marginBottom: "8px",
                  color: "#0A0F1E",
                }}
              >
                اختر شخصيتك
              </h2>
              <p
                style={{
                  color: "#9CA3AF",
                  marginBottom: "32px",
                  fontSize: "14px",
                }}
              >
                من ستتعلم معه الإسبانية؟
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                }}
              >
                {["male", "female"].map((g) => {
                  const c =
                    characters[country as keyof typeof characters][
                      g as "male" | "female"
                    ];
                  return (
                    <motion.button
                      key={g}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setGender(g);
                        setStep(2);
                      }}
                      style={{
                        background: "#F8FBFF",
                        border: `2px solid ${c.color}40`,
                        borderRadius: "20px",
                        padding: "24px 16px",
                        cursor: "pointer",
                        color: "#0A0F1E",
                      }}
                    >
                      <div
                        style={{
                          width: "120px",
                          height: "120px",
                          borderRadius: "50%",
                          overflow: "hidden",
                          margin: "0 auto 12px",
                          border: `3px solid ${c.color}`,
                        }}
                      >
                        <Image
                          src={c.img}
                          alt={c.name}
                          width={120}
                          height={120}
                          style={{ objectFit: "cover", objectPosition: "top" }}
                        />
                      </div>
                      <div style={{ fontWeight: "bold", fontSize: "17px" }}>
                        {c.name}
                      </div>
                      <div
                        style={{
                          color: c.color,
                          fontSize: "13px",
                          marginTop: "4px",
                        }}
                      >
                        {g === "male" ? "ذكر" : "أنثى"}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2 — NAME */}
          {step === 2 && char && (
            <div style={{ textAlign: "center" }}>
              <motion.div
                animate={{ y: mood === "happy" ? -10 : 0 }}
                transition={{ type: "spring" }}
              >
                <div
                  style={{
                    width: "180px",
                    height: "180px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    margin: "0 auto 8px",
                    border: `4px solid ${char.color}`,
                    boxShadow: `0 0 30px ${char.color}40`,
                  }}
                >
                  <Image
                    src={char.img}
                    alt={char.name}
                    width={180}
                    height={180}
                    style={{ objectFit: "cover", objectPosition: "top" }}
                  />
                </div>
                <div style={{ fontSize: "32px", marginBottom: "16px" }}>
                  {moodEmoji}
                </div>
              </motion.div>
              <div
                style={{
                  background: "#F0F4FF",
                  borderRadius: "20px",
                  padding: "24px",
                  marginBottom: "24px",
                  border: `1px solid ${char.color}40`,
                  textAlign: "right",
                }}
              >
                <p
                  style={{ fontSize: "17px", lineHeight: "2", color: "#0A0F1E" }}
                >
                  ¡Hola! أنا{" "}
                  <strong style={{ color: char.color }}>{char.name}</strong>{" "}
                  {char.flag}
                  <br />
                  من {char.country} 🌿
                  <br />
                  <br />
                  يسعدني أن أكون رفيقك في رحلة تعلم الإسبانية اللاتينية
                  الحقيقية!
                  <br />
                  <br />
                  ما اسمك الكريم؟
                </p>
              </div>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && name.trim()) {
                    setMood("happy");
                    setTimeout(() => {
                      setMood("neutral");
                      setStep(3);
                    }, 500);
                  }
                }}
                placeholder="اكتب اسمك هنا..."
                autoFocus
                style={{
                  width: "100%",
                  padding: "16px",
                  borderRadius: "14px",
                  border: "1px solid #00B4D8",
                  background: "#FFFFFF",
                  color: "#0A0F1E",
                  fontSize: "16px",
                  textAlign: "right",
                  outline: "none",
                  marginBottom: "12px",
                  fontFamily: "sans-serif",
                  boxSizing: "border-box",
                }}
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (name.trim()) {
                    setMood("happy");
                    setTimeout(() => {
                      setMood("neutral");
                      setStep(3);
                    }, 500);
                  }
                }}
                style={{
                  width: "100%",
                  padding: "16px",
                  borderRadius: "14px",
                  background: `linear-gradient(135deg, ${char.color}, #00B4D8)`,
                  border: "none",
                  color: "#FFFFFF",
                  fontWeight: "bold",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                التالي ←
              </motion.button>
            </div>
          )}

          {/* STEP 3 — AGE */}
          {step === 3 && char && (
            <div>
              <div style={{ textAlign: "center", marginBottom: "24px" }}>
                <motion.div
                  animate={{
                    rotate: mood === "surprised" ? [0, 10, -10, 0] : 0,
                  }}
                >
                  <div
                    style={{
                      width: "140px",
                      height: "140px",
                      borderRadius: "50%",
                      overflow: "hidden",
                      margin: "0 auto 8px",
                      border: `3px solid ${char.color}`,
                    }}
                  >
                    <Image
                      src={char.img}
                      alt={char.name}
                      width={140}
                      height={140}
                      style={{ objectFit: "cover", objectPosition: "top" }}
                    />
                  </div>
                  <div style={{ fontSize: "28px" }}>{moodEmoji}</div>
                </motion.div>
              </div>
              <div
                style={{
                  background: "#F0F4FF",
                  borderRadius: "20px",
                  padding: "20px",
                  marginBottom: "20px",
                  border: `1px solid ${char.color}40`,
                  textAlign: "right",
                }}
              >
                <p
                  style={{ fontSize: "17px", lineHeight: "2", color: "#0A0F1E" }}
                >
                  <strong style={{ color: char.color }}>{name}</strong>! اسم
                  جميل جداً 😊<br />
                  <br />
                  في الإسبانية نقول:
                  <br />
                  <strong style={{ color: "#B8860B", fontSize: "22px" }}>
                    ¡Mucho gusto, {name}!
                  </strong>
                  <br />
                  يعني: تشرفنا بمعرفتك! 🤝<br />
                  <br />
                  كم عمرك؟
                </p>
              </div>
              {["١٥ - ١٨ سنة", "١٩ - ٢٥ سنة", "٢٦ - ٣٥ سنة", "+٣٥ سنة"].map(
                (opt) =>
                  optBtn(opt, () => {
                    setAge(opt);
                    setMood("happy");
                    setTimeout(() => {
                      setMood("neutral");
                      setStep(4);
                    }, 400);
                  })
              )}
            </div>
          )}

          {/* STEP 4 — REASON */}
          {step === 4 && char && (
            <div>
              <div style={{ textAlign: "center", marginBottom: "24px" }}>
                <div
                  style={{
                    width: "140px",
                    height: "140px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    margin: "0 auto 8px",
                    border: `3px solid ${char.color}`,
                  }}
                >
                  <Image
                    src={char.img}
                    alt={char.name}
                    width={140}
                    height={140}
                    style={{ objectFit: "cover", objectPosition: "top" }}
                  />
                </div>
                <div style={{ fontSize: "28px" }}>{moodEmoji}</div>
              </div>
              <div
                style={{
                  background: "#F0F4FF",
                  borderRadius: "20px",
                  padding: "20px",
                  marginBottom: "20px",
                  border: `1px solid ${char.color}40`,
                  textAlign: "right",
                }}
              >
                <p
                  style={{ fontSize: "17px", lineHeight: "2", color: "#0A0F1E" }}
                >
                  رائع! 🌟
                  <br />
                  لماذا تريد تعلم الإسبانية؟
                </p>
              </div>
              {[
                "السفر إلى أمريكا اللاتينية ✈️",
                "العمل والأعمال التجارية 💼",
                "الدراسة الأكاديمية 📚",
                "التواصل مع أشخاص لاتينيين 🤝",
                "الثقافة والترفيه 🎵",
                "سبب آخر",
              ].map((opt) =>
                optBtn(opt, () => {
                  setReason(opt);
                  setMood("surprised");
                  setTimeout(() => {
                    setMood("neutral");
                    setStep(5);
                  }, 400);
                })
              )}
            </div>
          )}

          {/* STEP 5 — TIME */}
          {step === 5 && char && (
            <div>
              <div style={{ textAlign: "center", marginBottom: "24px" }}>
                <div
                  style={{
                    width: "140px",
                    height: "140px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    margin: "0 auto 8px",
                    border: `3px solid ${char.color}`,
                  }}
                >
                  <Image
                    src={char.img}
                    alt={char.name}
                    width={140}
                    height={140}
                    style={{ objectFit: "cover", objectPosition: "top" }}
                  />
                </div>
                <div style={{ fontSize: "28px" }}>{moodEmoji}</div>
              </div>
              <div
                style={{
                  background: "#F0F4FF",
                  borderRadius: "20px",
                  padding: "20px",
                  marginBottom: "20px",
                  border: `1px solid ${char.color}40`,
                  textAlign: "right",
                }}
              >
                <p
                  style={{ fontSize: "17px", lineHeight: "2", color: "#0A0F1E" }}
                >
                  اختيار ممتاز! 🎯
                  <br />
                  كم وقتاً تستطيع تخصيصه يومياً؟
                </p>
              </div>
              {[
                "١٥ دقيقة ⚡",
                "٣٠ دقيقة 🌟",
                "ساعة كاملة 💪",
                "أكثر من ساعة 🔥",
              ].map((opt) =>
                optBtn(opt, () => {
                  setTime(opt);
                  setMood("happy");
                  setTimeout(() => {
                    setMood("neutral");
                    setStep(6);
                  }, 400);
                })
              )}
            </div>
          )}

          {/* STEP 6 — LEVEL CHECK */}
          {step === 6 && char && (
            <div>
              <div style={{ textAlign: "center", marginBottom: "24px" }}>
                <div
                  style={{
                    width: "140px",
                    height: "140px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    margin: "0 auto 8px",
                    border: `3px solid ${char.color}`,
                  }}
                >
                  <Image
                    src={char.img}
                    alt={char.name}
                    width={140}
                    height={140}
                    style={{ objectFit: "cover", objectPosition: "top" }}
                  />
                </div>
                <div style={{ fontSize: "28px" }}>{moodEmoji}</div>
              </div>
              <div
                style={{
                  background: "#F0F4FF",
                  borderRadius: "20px",
                  padding: "20px",
                  marginBottom: "20px",
                  border: `1px solid ${char.color}40`,
                  textAlign: "right",
                }}
              >
                <p
                  style={{ fontSize: "17px", lineHeight: "2", color: "#0A0F1E" }}
                >
                  هل سبق لك تعلم الإسبانية؟
                </p>
              </div>
              {[
                "نعم، تعلمت بعض الكلمات",
                "لا، هذه أول مرة",
                "درست قليلاً لكنني نسيت",
              ].map((opt) =>
                optBtn(opt, () => {
                  setLevel(opt);
                  setStep(7);
                })
              )}
            </div>
          )}

          {/* STEP 7 — WORD 1 */}
          {step === 7 && char && (
            <div>
              <div style={{ textAlign: "center", marginBottom: "24px" }}>
                <motion.div
                  animate={{ y: mood === "happy" ? -15 : 0 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div
                    style={{
                      width: "140px",
                      height: "140px",
                      borderRadius: "50%",
                      overflow: "hidden",
                      margin: "0 auto 8px",
                      border: `3px solid ${char.color}`,
                    }}
                  >
                    <Image
                      src={char.img}
                      alt={char.name}
                      width={140}
                      height={140}
                      style={{ objectFit: "cover", objectPosition: "top" }}
                    />
                  </div>
                  <div style={{ fontSize: "28px" }}>{moodEmoji}</div>
                </motion.div>
              </div>
              <div
                style={{
                  background: "#F0F4FF",
                  borderRadius: "20px",
                  padding: "20px",
                  marginBottom: "20px",
                  border: `1px solid ${char.color}40`,
                  textAlign: "right",
                }}
              >
                <p
                  style={{ fontSize: "17px", lineHeight: "2", color: "#0A0F1E" }}
                >
                  ممتاز! أول كلمة 🌟
                  <br />
                  <br />
                  <span
                    style={{
                      color: "#B8860B",
                      fontSize: "32px",
                      fontWeight: "bold",
                    }}
                  >
                    Hola
                  </span>
                  <br />
                  تُنطق:{" "}
                  <strong style={{ color: "#0077AA" }}>أولا</strong> — الحرف H
                  صامت!
                  <br />
                  وتعني: مرحباً 👋
                  <br />
                  <br />
                  كيف ستُحيي{" "}
                  <strong style={{ color: char.color }}>{char.name}</strong>؟
                </p>
              </div>
              {[
                { text: `¡Hola ${char.name}!`, correct: true },
                { text: `هولا ${char.name}!`, correct: false },
                { text: `Hello ${char.name}!`, correct: false },
              ].map((opt) => (
                <motion.button
                  key={opt.text}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    handleAnswer(opt.correct);
                    setTimeout(() => setStep(8), 600);
                  }}
                  style={{
                    width: "100%",
                    padding: "16px",
                    borderRadius: "14px",
                    border: "1px solid #00B4D8",
                    background: "#F8FBFF",
                    color: "#0A0F1E",
                    fontSize: "15px",
                    cursor: "pointer",
                    textAlign: "right",
                    marginBottom: "10px",
                    fontFamily: "sans-serif",
                  }}
                >
                  {opt.text}
                </motion.button>
              ))}
            </div>
          )}

          {/* STEP 8 — WORD 2 */}
          {step === 8 && char && (
            <div>
              <div style={{ textAlign: "center", marginBottom: "24px" }}>
                <motion.div
                  animate={{ scale: mood === "happy" ? [1, 1.1, 1] : 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <div
                    style={{
                      width: "140px",
                      height: "140px",
                      borderRadius: "50%",
                      overflow: "hidden",
                      margin: "0 auto 8px",
                      border: `3px solid ${char.color}`,
                    }}
                  >
                    <Image
                      src={char.img}
                      alt={char.name}
                      width={140}
                      height={140}
                      style={{ objectFit: "cover", objectPosition: "top" }}
                    />
                  </div>
                  <div style={{ fontSize: "28px" }}>{moodEmoji}</div>
                </motion.div>
              </div>
              <div
                style={{
                  background: "#F0F4FF",
                  borderRadius: "20px",
                  padding: "20px",
                  marginBottom: "20px",
                  border: `1px solid ${char.color}40`,
                  textAlign: "right",
                }}
              >
                <p
                  style={{ fontSize: "17px", lineHeight: "2", color: "#0A0F1E" }}
                >
                  <strong style={{ color: char.color }}>
                    ¡Muy bien, {name}!
                  </strong>{" "}
                  🌟
                  <br />
                  <br />
                  الكلمة الثانية:
                  <br />
                  <span
                    style={{
                      color: "#B8860B",
                      fontSize: "32px",
                      fontWeight: "bold",
                    }}
                  >
                    Gracias
                  </span>
                  <br />
                  تُنطق:{" "}
                  <strong style={{ color: "#0077AA" }}>غراسياس</strong>
                  <br />
                  وتعني: شكراً 🙏
                  <br />
                  <br />
                  ماذا تعني Gracias؟
                </p>
              </div>
              {[
                { text: "شكراً ✅", correct: true },
                { text: "مرحباً", correct: false },
                { text: "مع السلامة", correct: false },
              ].map((opt) => (
                <motion.button
                  key={opt.text}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    handleAnswer(opt.correct);
                    setTimeout(() => setStep(9), 600);
                  }}
                  style={{
                    width: "100%",
                    padding: "16px",
                    borderRadius: "14px",
                    border: "1px solid #00B4D8",
                    background: "#F8FBFF",
                    color: "#0A0F1E",
                    fontSize: "15px",
                    cursor: "pointer",
                    textAlign: "right",
                    marginBottom: "10px",
                    fontFamily: "sans-serif",
                  }}
                >
                  {opt.text}
                </motion.button>
              ))}
            </div>
          )}

          {/* STEP 9 — WORD 3 */}
          {step === 9 && char && (
            <div>
              <div style={{ textAlign: "center", marginBottom: "24px" }}>
                <div
                  style={{
                    width: "140px",
                    height: "140px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    margin: "0 auto 8px",
                    border: `3px solid ${char.color}`,
                  }}
                >
                  <Image
                    src={char.img}
                    alt={char.name}
                    width={140}
                    height={140}
                    style={{ objectFit: "cover", objectPosition: "top" }}
                  />
                </div>
                <div style={{ fontSize: "28px" }}>{moodEmoji}</div>
              </div>
              <div
                style={{
                  background: "#F0F4FF",
                  borderRadius: "20px",
                  padding: "20px",
                  marginBottom: "20px",
                  border: `1px solid ${char.color}40`,
                  textAlign: "right",
                }}
              >
                <p
                  style={{ fontSize: "17px", lineHeight: "2", color: "#0A0F1E" }}
                >
                  <strong style={{ color: char.color }}>¡Increíble!</strong>{" "}
                  🤩
                  <br />
                  <br />
                  الكلمة الثالثة:
                  <br />
                  <span
                    style={{
                      color: "#B8860B",
                      fontSize: "26px",
                      fontWeight: "bold",
                    }}
                  >
                    ¿Cómo estás?
                  </span>
                  <br />
                  تُنطق:{" "}
                  <strong style={{ color: "#0077AA" }}>كومو إيستاس</strong>
                  <br />
                  <br />
                  ماذا تعني؟
                </p>
              </div>
              {[
                { text: "كيف حالك؟ ✅", correct: true },
                { text: "ما اسمك؟", correct: false },
                { text: "من أين أنت؟", correct: false },
              ].map((opt) => (
                <motion.button
                  key={opt.text}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    handleAnswer(opt.correct);
                    setTimeout(() => setStep(10), 600);
                  }}
                  style={{
                    width: "100%",
                    padding: "16px",
                    borderRadius: "14px",
                    border: "1px solid #00B4D8",
                    background: opt.correct ? "#E8FFF8" : "#F8FBFF",
                    color: "#0A0F1E",
                    fontSize: "15px",
                    cursor: "pointer",
                    textAlign: "right",
                    marginBottom: "10px",
                    fontFamily: "sans-serif",
                  }}
                >
                  {opt.text}
                </motion.button>
              ))}
            </div>
          )}

          {/* STEP 10 — RESULT */}
          {step === 10 && char && (
            <div style={{ textAlign: "center" }}>
              <motion.div
                animate={{ scale: [0.8, 1.1, 1] }}
                transition={{ duration: 0.5 }}
              >
                <div
                  style={{
                    width: "160px",
                    height: "160px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    margin: "0 auto 8px",
                    border: `4px solid ${char.color}`,
                    boxShadow: `0 0 40px ${char.color}50`,
                  }}
                >
                  <Image
                    src={char.img}
                    alt={char.name}
                    width={160}
                    height={160}
                    style={{ objectFit: "cover", objectPosition: "top" }}
                  />
                </div>
                <div style={{ fontSize: "36px", marginBottom: "16px" }}>🎉</div>
              </motion.div>
              <div
                style={{
                  background: "#F0F4FF",
                  borderRadius: "20px",
                  padding: "24px",
                  marginBottom: "24px",
                  border: `1px solid ${char.color}40`,
                  textAlign: "right",
                }}
              >
                <p
                  style={{ fontSize: "17px", lineHeight: "2", color: "#0A0F1E" }}
                >
                  <strong style={{ color: char.color }}>
                    ¡Fantástico, {name}!
                  </strong>{" "}
                  🎉
                  <br />
                  أنهيت أول جلسة مع {char.name}!<br />
                  <br />
                  <strong style={{ color: "#007A6E", fontSize: "22px" }}>
                    نتيجتك: {totalQ > 0 ? Math.round((score / totalQ) * 100) : 0}%
                  </strong>
                  <br />
                  <br />
                  ⭐ {score} من {totalQ} إجابات صحيحة
                  <br />
                  🎯 هدفك: {reason}
                  <br />
                  ⏰ وقتك: {time}
                  <br />
                  <br />
                  قريباً OLIVEIRApp بكل شيء تحتاجه! 🚀
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStep(11)}
                style={{
                  width: "100%",
                  padding: "18px",
                  borderRadius: "14px",
                  background: `linear-gradient(135deg, ${char.color}, #00B4D8)`,
                  border: "none",
                  color: "#FFFFFF",
                  fontWeight: "bold",
                  fontSize: "17px",
                  cursor: "pointer",
                }}
              >
                أريد أن أكون أول المشتركين! 🚀
              </motion.button>
            </div>
          )}

          {/* STEP 11 — REGISTER */}
          {step === 11 && char && (
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "140px",
                  height: "140px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  margin: "0 auto 16px",
                  border: `3px solid ${char.color}`,
                }}
              >
                <Image
                  src={char.img}
                  alt={char.name}
                  width={140}
                  height={140}
                  style={{ objectFit: "cover", objectPosition: "top" }}
                />
              </div>
              <div
                style={{
                  background: "#F0F4FF",
                  borderRadius: "20px",
                  padding: "24px",
                  marginBottom: "16px",
                  border: `1px solid #007A6E`,
                  textAlign: "right",
                }}
              >
                <p
                  style={{
                    fontSize: "17px",
                    lineHeight: "2",
                    marginBottom: "16px",
                    color: "#0A0F1E",
                  }}
                >
                  <strong style={{ color: "#007A6E" }}>
                    ¡Bienvenido, {name}!
                  </strong>{" "}
                  🎊
                  <br />
                  سجل الآن وكن من أوائل المنضمين!
                  <br />
                  <br />
                  ⭐ شهر مجاني كامل
                  <br />
                  🎯 وصول مبكر قبل الجميع
                  <br />
                  🏆 شارة المؤسسين الأوائل
                </p>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleRegister();
                  }}
                  placeholder="بريدك الإلكتروني..."
                  style={{
                    width: "100%",
                    padding: "16px",
                    borderRadius: "14px",
                    border: "1px solid #007A6E",
                    background: "#FFFFFF",
                    color: "#0A0F1E",
                    fontSize: "16px",
                    textAlign: "right",
                    outline: "none",
                    marginBottom: "12px",
                    fontFamily: "sans-serif",
                    boxSizing: "border-box",
                  }}
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRegister}
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "16px",
                    borderRadius: "14px",
                    background: "linear-gradient(135deg, #00B4D8, #00F5D4)",
                    border: "none",
                    color: "#0A0F1E",
                    fontWeight: "bold",
                    fontSize: "16px",
                    cursor: "pointer",
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  {loading ? "جاري التسجيل..." : "سجّل الآن 🌿"}
                </motion.button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </AppLayout>
  );
}