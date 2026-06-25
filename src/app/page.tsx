"use client";
import { useState } from "react";
import Image from "next/image";

const characters = {
  VE: { male: { name: "Andrés", emoji: "👨🏽" }, female: { name: "Valentina", emoji: "👩🏽" } },
  CO: { male: { name: "Santiago", emoji: "👨🏽" }, female: { name: "Isabella", emoji: "👩🏽" } },
  MX: { male: { name: "Diego", emoji: "👨🏽" }, female: { name: "Camila", emoji: "👩🏽" } },
  UY: { male: { name: "Mateo", emoji: "👨🏽" }, female: { name: "Lucía", emoji: "👩🏽" } },
};

const countries = [
  { code: "VE", flag: "🇻🇪", name: "فنزويلا" },
  { code: "CO", flag: "🇨🇴", name: "كولومبيا" },
  { code: "MX", flag: "🇲🇽", name: "المكسيك" },
  { code: "UY", flag: "🇺🇾", name: "أوروغواي" },
];

export default function Home() {
  const [step, setStep] = useState(0);
  const [country, setCountry] = useState("");
  const [gender, setGender] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [registered, setRegistered] = useState(false);

  const char = country && gender ? characters[country as keyof typeof characters][gender as "male" | "female"] : null;

  if (registered) return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", textAlign: "center" }}>
      <div style={{ fontSize: "64px", marginBottom: "24px" }}>🎉</div>
      <h1 style={{ fontSize: "28px", color: "#00F5D4", marginBottom: "12px" }}>¡Bienvenido, {name}!</h1>
      <p style={{ color: "#7A8FAF", marginBottom: "8px" }}>أنت الآن من مؤسسي OLIVEIRApp</p>
      <p style={{ color: "#7A8FAF", marginBottom: "32px" }}>سيصلك إيميل قريباً 📧</p>
      <p style={{ color: "#FFD60A" }}>@OLIVEIRApp</p>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", textAlign: "center" }} dir="rtl">

      {step === 0 && (
        <div>
          <Image src="/logo.png" alt="OLIVEIRApp" width={400} height={120} style={{ objectFit: "contain", marginBottom: "32px" }} />
          <p style={{ color: "#00B4D8", marginBottom: "48px", letterSpacing: "3px", fontSize: "12px" }}>تقنية · لغة · مستقبل</p>
          <h2 style={{ fontSize: "22px", marginBottom: "32px", color: "#F0F4FF" }}>اختر رفيقك اللاتيني</h2>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            {countries.map(c => (
              <button key={c.code} onClick={() => { setCountry(c.code); setStep(1); }}
                style={{ background: "#1A2744", border: "1px solid #00B4D8", borderRadius: "16px", padding: "24px 32px", cursor: "pointer", color: "#F0F4FF", fontSize: "14px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "48px" }}>{c.flag}</span>
                <span>{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 1 && (
        <div>
          <Image src="/logo.png" alt="OLIVEIRApp" width={300} height={90} style={{ objectFit: "contain", marginBottom: "32px" }} />
          <h2 style={{ fontSize: "22px", marginBottom: "32px" }}>اختر شخصيتك</h2>
          <div style={{ display: "flex", gap: "24px", justifyContent: "center" }}>
            {["male", "female"].map(g => (
              <button key={g} onClick={() => { setGender(g); setStep(2); }}
                style={{ background: "#1A2744", border: "1px solid #00B4D8", borderRadius: "16px", padding: "32px 48px", cursor: "pointer", color: "#F0F4FF", fontSize: "16px" }}>
                <div style={{ fontSize: "48px", marginBottom: "8px" }}>{characters[country as keyof typeof characters][g as "male" | "female"].emoji}</div>
                <div>{characters[country as keyof typeof characters][g as "male" | "female"].name}</div>
                <div style={{ color: "#7A8FAF", fontSize: "12px", marginTop: "4px" }}>{g === "male" ? "ذكر" : "أنثى"}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && char && (
        <div style={{ maxWidth: "480px" }}>
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>{char.emoji}</div>
          <div style={{ background: "#1A2744", borderRadius: "20px", padding: "24px", marginBottom: "24px", border: "1px solid #00B4D8" }}>
            <p style={{ fontSize: "18px", lineHeight: "1.8" }}>
              مرحباً بك! أنا <strong style={{ color: "#00F5D4" }}>{char.name}</strong> 🌿<br />
              يسعدني أن أكون رفيقك في رحلة تعلم الإسبانية.<br /><br />
              ما اسمك؟
            </p>
          </div>
          <input value={name} onChange={e => setName(e.target.value)}
            placeholder="اكتب اسمك هنا..."
            style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid #00B4D8", background: "#0D1B2A", color: "#F0F4FF", fontSize: "16px", textAlign: "right", outline: "none" }} />
          <button onClick={() => { if(name) setStep(3); }}
            style={{ marginTop: "16px", width: "100%", padding: "14px", borderRadius: "12px", background: "#00B4D8", border: "none", color: "#0A0F1E", fontWeight: "bold", fontSize: "16px", cursor: "pointer" }}>
            التالي ←
          </button>
        </div>
      )}

      {step === 3 && char && (
        <div style={{ maxWidth: "480px" }}>
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>{char.emoji}</div>
          <div style={{ background: "#1A2744", borderRadius: "20px", padding: "24px", marginBottom: "24px", border: "1px solid #00B4D8" }}>
            <p style={{ fontSize: "18px", lineHeight: "1.8" }}>
              <strong style={{ color: "#00F5D4" }}>{name}</strong>! اسم جميل جداً 😊<br /><br />
              في الإسبانية اللاتينية نقول:<br />
              <strong style={{ color: "#FFD60A", fontSize: "22px" }}>¡Mucho gusto, {name}!</strong><br />
              يعني: تشرفنا! 🤝<br /><br />
              هل سبق لك أن تعلمت الإسبانية؟
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {["نعم، تعلمت بعض الكلمات", "لا، هذه أول مرة", "درست قليلاً لكنني نسيت"].map(opt => (
              <button key={opt} onClick={() => setStep(4)}
                style={{ padding: "14px", borderRadius: "12px", border: "1px solid #00B4D8", background: "#0D1B2A", color: "#F0F4FF", fontSize: "15px", cursor: "pointer", textAlign: "right" }}>
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 4 && char && (
        <div style={{ maxWidth: "480px" }}>
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>{char.emoji}</div>
          <div style={{ background: "#1A2744", borderRadius: "20px", padding: "24px", marginBottom: "24px", border: "1px solid #00B4D8" }}>
            <p style={{ fontSize: "18px", lineHeight: "1.8" }}>
              ممتاز! دعني أعلمك أول كلمة 🌟<br /><br />
              <strong style={{ color: "#FFD60A", fontSize: "28px" }}>Hola</strong><br />
              تُنطق: <strong style={{ color: "#00F5D4" }}>أولا</strong><br />
              وتعني: مرحباً<br /><br />
              كيف ستُحيي {char.name}؟
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {["Hola " + char.name + "!", "مرحباً " + char.name + "!", "Buenos días " + char.name + "!"].map(opt => (
              <button key={opt} onClick={() => setStep(5)}
                style={{ padding: "14px", borderRadius: "12px", border: "1px solid #00B4D8", background: "#0D1B2A", color: "#F0F4FF", fontSize: "15px", cursor: "pointer", textAlign: "right" }}>
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 5 && char && (
        <div style={{ maxWidth: "480px" }}>
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>{char.emoji}</div>
          <div style={{ background: "#1A2744", borderRadius: "20px", padding: "24px", marginBottom: "24px", border: "1px solid #00B4D8" }}>
            <p style={{ fontSize: "18px", lineHeight: "1.8" }}>
              <strong style={{ color: "#00F5D4" }}>¡Muy bien, {name}!</strong> 🌟<br />
              أحسنت في أول درس!<br /><br />
              قريباً ستنطلق منصة OLIVEIRApp:<br /><br />
              🎯 دروس يومية ممتعة<br />
              🏆 تحديات وجوائز<br />
              👨‍🏫 معلمون من أمريكا اللاتينية<br />
              🎓 شهادات معتمدة<br /><br />
              وأنا <strong style={{ color: "#FFD60A" }}>{char.name}</strong> سأكون رفيقك! 💪
            </p>
          </div>
          <button onClick={() => setStep(6)}
            style={{ width: "100%", padding: "14px", borderRadius: "12px", background: "#00B4D8", border: "none", color: "#0A0F1E", fontWeight: "bold", fontSize: "16px", cursor: "pointer" }}>
            أريد أن أكون أول المشتركين! 🚀
          </button>
        </div>
      )}

      {step === 6 && char && (
        <div style={{ maxWidth: "480px" }}>
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>{char.emoji}</div>
          <div style={{ background: "#1A2744", borderRadius: "20px", padding: "24px", marginBottom: "24px", border: "1px solid #00F5D4" }}>
            <p style={{ fontSize: "18px", lineHeight: "1.8", marginBottom: "16px" }}>
              <strong style={{ color: "#00F5D4" }}>¡Fantástico, {name}!</strong> 🎉<br />
              سجل الآن وكن من أوائل المنضمين!<br /><br />
              ⭐ شهر مجاني كامل<br />
              🎯 وصول مبكر قبل الجميع<br />
              🏆 شارة المؤسسين الأوائل
            </p>
            <input value={email} onChange={e => setEmail(e.target.value)}
              placeholder="بريدك الإلكتروني..."
              style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid #00F5D4", background: "#0A0F1E", color: "#F0F4FF", fontSize: "16px", textAlign: "right", outline: "none", marginBottom: "12px" }} />
            <button onClick={() => { if(email) setRegistered(true); }}
              style={{ width: "100%", padding: "14px", borderRadius: "12px", background: "linear-gradient(135deg, #00B4D8, #00F5D4)", border: "none", color: "#0A0F1E", fontWeight: "bold", fontSize: "16px", cursor: "pointer" }}>
              سجّل الآن 🌿
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
