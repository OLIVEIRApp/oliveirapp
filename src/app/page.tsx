"use client";
import { useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

const characters: Record<string, Record<string, { name: string; img: string; country: string }>> = {
  VE: {
    male:   { name: "Andrés",    img: "/andres.png",    country: "فنزويلا" },
    female: { name: "Valentina", img: "/valentina.png", country: "فنزويلا" },
  },
  CO: {
    male:   { name: "Santiago",  img: "/santiago.png",  country: "كولومبيا" },
    female: { name: "Isabella",  img: "/isabella.png",  country: "كولومبيا" },
  },
  MX: {
    male:   { name: "Diego",     img: "/diego.png",     country: "المكسيك" },
    female: { name: "Camila",    img: "/camila.png",    country: "المكسيك" },
  },
  UY: {
    male:   { name: "Mateo",     img: "/mateo.png",     country: "أوروغواي" },
    female: { name: "Lucía",     img: "/lucia.png",     country: "أوروغواي" },
  },
};

const countries = [
  { code: "VE", flag: "🇻🇪", name: "فنزويلا" },
  { code: "CO", flag: "🇨🇴", name: "كولومبيا" },
  { code: "MX", flag: "🇲🇽", name: "المكسيك" },
  { code: "UY", flag: "🇺🇾", name: "أوروغواي" },
];

const S = {
  page:    { minHeight:"100vh", background:"#FFFFFF", color:"#0A0F1E", fontFamily:"sans-serif", display:"flex", flexDirection:"column" as const, alignItems:"center", justifyContent:"center", padding:"24px", textAlign:"center" as const },
  card:    { background:"#F0F4FF", borderRadius:"20px", padding:"24px", marginBottom:"24px", border:"1px solid #00B4D8", maxWidth:"480px", width:"100%" },
  btn:     { width:"100%", padding:"14px", borderRadius:"12px", background:"#00B4D8", border:"none", color:"#0A0F1E", fontWeight:"bold" as const, fontSize:"16px", cursor:"pointer", marginTop:"12px" },
  optBtn:  { width:"100%", padding:"14px", borderRadius:"12px", border:"1px solid #00B4D8", background:"#F8FBFF", color:"#0A0F1E", fontSize:"15px", cursor:"pointer", textAlign:"right" as const, marginBottom:"8px" },
  backBtn: { background:"none", border:"none", color:"#00B4D8", cursor:"pointer", fontSize:"14px", marginBottom:"16px" },
  input:   { width:"100%", padding:"14px", borderRadius:"12px", border:"1px solid #00B4D8", background:"#FFFFFF", color:"#0A0F1E", fontSize:"16px", textAlign:"right" as const, outline:"none", marginBottom:"12px" },
  footer:  { marginTop:"48px", padding:"24px", fontSize:"12px", color:"#7A8FAF", textAlign:"center" as const, borderTop:"1px solid #E5E7EB", width:"100%" },
  yellow:  { color:"#B8860B", fontSize:"22px", fontWeight:"bold" as const },
  mint:    { color:"#007A6E", fontWeight:"bold" as const },
  blue:    { color:"#0077AA", fontWeight:"bold" as const },
};

const CharImg = ({ src, name }: { src: string; name: string }) => (
  <div style={{ width:"160px", height:"160px", borderRadius:"50%", overflow:"hidden", margin:"0 auto 16px", border:"3px solid #00B4D8", background:"#F0F4FF" }}>
    <Image src={src} alt={name} width={160} height={160} style={{ objectFit:"cover", objectPosition:"top" }} />
  </div>
);

export default function Home() {
  const [step, setStep]             = useState(0);
  const [country, setCountry]       = useState("");
  const [gender, setGender]         = useState("");
  const [name, setName]             = useState("");
  const [age, setAge]               = useState("");
  const [reason, setReason]         = useState("");
  const [time, setTime]             = useState("");
  const [level, setLevel]           = useState("");
  const [email, setEmail]           = useState("");
  const [registered, setRegistered] = useState(false);
  const [loading, setLoading]       = useState(false);

  const char = country && gender ? characters[country][gender] : null;
  const goHome = () => { setStep(0); setCountry(""); setGender(""); setName(""); setAge(""); setReason(""); setTime(""); setLevel(""); setEmail(""); setRegistered(false); };

  const handleRegister = async () => {
    if (!email.trim()) return;
    setLoading(true);
    await supabase.from("waitlist").insert([{
      name,
      email,
      age,
      reason,
      time,
      level,
      country,
      character: char?.name,
    }]);
    setLoading(false);
    setRegistered(true);
  };

  const BackBtn = () => <button style={S.backBtn} onClick={goHome}>← الرئيسية</button>;
  const Footer  = () => <footer style={S.footer}>© 2026 OLIVEIRApp · جميع الحقوق محفوظة</footer>;

  if (registered) return (
    <div style={{ ...S.page, justifyContent:"space-between" }}>
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
        <div style={{ fontSize:"64px", marginBottom:"16px" }}>🎉</div>
        <h1 style={{ fontSize:"28px", color:"#007A6E", marginBottom:"12px" }}>¡Bienvenido, {name}!</h1>
        <p style={{ color:"#555", marginBottom:"8px" }}>أنت الآن من مؤسسي OLIVEIRApp 🌿</p>
        <p style={{ color:"#555", marginBottom:"32px" }}>سيصلك إيميل قريباً 📧</p>
        <p style={{ color:"#0077AA", fontWeight:"bold", marginBottom:"8px" }}>تابعنا</p>
        <p style={{ color:"#B8860B", fontSize:"18px", fontWeight:"bold", marginBottom:"24px" }}>@OLIVEIRApp</p>
        <button style={{ ...S.btn, width:"auto", padding:"12px 32px" }} onClick={goHome}>← العودة للرئيسية</button>
      </div>
      <Footer />
    </div>
  );

  return (
    <div style={{ ...S.page, justifyContent:"space-between" }} dir="rtl">
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", width:"100%" }}>

        {step === 0 && (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
            <Image src="/logo.png" alt="OLIVEIRApp" width={360} height={110} style={{ objectFit:"contain", marginBottom:"8px" }} priority />
            <p style={{ color:"#00B4D8", marginBottom:"48px", letterSpacing:"3px", fontSize:"12px" }}>تقنية · لغة · مستقبل</p>
            <h2 style={{ fontSize:"22px", marginBottom:"32px" }}>اختر رفيقك اللاتيني</h2>
            <div style={{ display:"flex", gap:"16px", justifyContent:"center", flexWrap:"wrap" }}>
              {countries.map(c => (
                <button key={c.code} onClick={() => { setCountry(c.code); setStep(1); }}
                  style={{ background:"#F0F4FF", border:"1px solid #00B4D8", borderRadius:"16px", padding:"20px 28px", cursor:"pointer", color:"#0A0F1E", fontSize:"14px", display:"flex", flexDirection:"column", alignItems:"center", gap:"8px" }}>
                  <span style={{ fontSize:"42px" }}>{c.flag}</span>
                  <span style={{ fontWeight:"bold" }}>{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", width:"100%" }}>
            <BackBtn />
            <h2 style={{ fontSize:"22px", marginBottom:"32px" }}>اختر شخصيتك</h2>
            <div style={{ display:"flex", gap:"24px", justifyContent:"center" }}>
              {["male","female"].map(g => {
                const c = characters[country][g];
                return (
                  <button key={g} onClick={() => { setGender(g); setStep(2); }}
                    style={{ background:"#F0F4FF", border:"1px solid #00B4D8", borderRadius:"16px", padding:"20px 32px", cursor:"pointer", color:"#0A0F1E" }}>
                    <div style={{ width:"120px", height:"120px", borderRadius:"50%", overflow:"hidden", margin:"0 auto 12px", border:"2px solid #00B4D8" }}>
                      <Image src={c.img} alt={c.name} width={120} height={120} style={{ objectFit:"cover", objectPosition:"top" }} />
                    </div>
                    <div style={{ fontWeight:"bold", fontSize:"16px" }}>{c.name}</div>
                    <div style={{ color:"#7A8FAF", fontSize:"12px", marginTop:"4px" }}>{g==="male"?"ذكر":"أنثى"}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 2 && char && (
          <div style={{ maxWidth:"480px", width:"100%", display:"flex", flexDirection:"column", alignItems:"flex-end" }}>
            <BackBtn />
            <CharImg src={char.img} name={char.name} />
            <div style={S.card}>
              <p style={{ fontSize:"17px", lineHeight:"2" }}>
                مرحباً بك! أنا <strong style={S.mint}>{char.name}</strong> من {char.country} 🌿<br />
                يسعدني أن أكون رفيقك في رحلة تعلم الإسبانية.<br /><br />
                ما اسمك الكريم؟
              </p>
            </div>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="اكتب اسمك هنا..." style={S.input} />
            <button style={S.btn} onClick={() => { if(name.trim()) setStep(3); }}>التالي ←</button>
          </div>
        )}

        {step === 3 && char && (
          <div style={{ maxWidth:"480px", width:"100%", display:"flex", flexDirection:"column", alignItems:"flex-end" }}>
            <BackBtn />
            <CharImg src={char.img} name={char.name} />
            <div style={S.card}>
              <p style={{ fontSize:"17px", lineHeight:"2" }}>
                <strong style={S.mint}>{name}</strong>! اسم جميل 😊<br /><br />
                في الإسبانية نقول:<br />
                <span style={S.yellow}>¡Mucho gusto, {name}!</span><br />
                يعني: تشرفنا! 🤝<br /><br />
                كم عمرك؟
              </p>
            </div>
            {["١٥ - ١٨ سنة", "١٩ - ٢٥ سنة", "٢٦ - ٣٥ سنة", "+٣٥ سنة"].map(opt => (
              <button key={opt} style={S.optBtn} onClick={() => { setAge(opt); setStep(4); }}>{opt}</button>
            ))}
          </div>
        )}

        {step === 4 && char && (
          <div style={{ maxWidth:"480px", width:"100%", display:"flex", flexDirection:"column", alignItems:"flex-end" }}>
            <BackBtn />
            <CharImg src={char.img} name={char.name} />
            <div style={S.card}>
              <p style={{ fontSize:"17px", lineHeight:"2" }}>
                لماذا تريد تعلم الإسبانية؟ 🌟
              </p>
            </div>
            {["السفر إلى أمريكا اللاتينية ✈️", "العمل والأعمال التجارية 💼", "الدراسة الأكاديمية 📚", "التواصل مع أشخاص لاتينيين 🤝", "الثقافة والترفيه 🎵", "سبب آخر"].map(opt => (
              <button key={opt} style={S.optBtn} onClick={() => { setReason(opt); setStep(5); }}>{opt}</button>
            ))}
          </div>
        )}

        {step === 5 && char && (
          <div style={{ maxWidth:"480px", width:"100%", display:"flex", flexDirection:"column", alignItems:"flex-end" }}>
            <BackBtn />
            <CharImg src={char.img} name={char.name} />
            <div style={S.card}>
              <p style={{ fontSize:"17px", lineHeight:"2" }}>
                كم وقتاً تستطيع تخصيصه يومياً؟ ⏰
              </p>
            </div>
            {["١٥ دقيقة ⚡", "٣٠ دقيقة 🌟", "ساعة كاملة 💪", "أكثر من ساعة 🔥"].map(opt => (
              <button key={opt} style={S.optBtn} onClick={() => { setTime(opt); setStep(6); }}>{opt}</button>
            ))}
          </div>
        )}

        {step === 6 && char && (
          <div style={{ maxWidth:"480px", width:"100%", display:"flex", flexDirection:"column", alignItems:"flex-end" }}>
            <BackBtn />
            <CharImg src={char.img} name={char.name} />
            <div style={S.card}>
              <p style={{ fontSize:"17px", lineHeight:"2" }}>
                هل سبق لك تعلم الإسبانية؟
              </p>
            </div>
            {["نعم، تعلمت بعض الكلمات", "لا، هذه أول مرة", "درست قليلاً لكنني نسيت"].map(opt => (
              <button key={opt} style={S.optBtn} onClick={() => { setLevel(opt); setStep(7); }}>{opt}</button>
            ))}
          </div>
        )}

        {step === 7 && char && (
          <div style={{ maxWidth:"480px", width:"100%", display:"flex", flexDirection:"column", alignItems:"flex-end" }}>
            <BackBtn />
            <CharImg src={char.img} name={char.name} />
            <div style={S.card}>
              <p style={{ fontSize:"17px", lineHeight:"2" }}>
                ممتاز! أول كلمة 🌟<br /><br />
                <span style={{ ...S.yellow, fontSize:"32px" }}>Hola</span><br />
                تُنطق: <strong style={S.blue}>أولا</strong><br />
                وتعني: مرحباً 👋<br /><br />
                كيف ستُحيي <strong style={S.mint}>{char.name}</strong>؟
              </p>
            </div>
            {[`Hola ${char.name}!`, `مرحباً ${char.name}!`, `Buenos días ${char.name}!`].map(opt => (
              <button key={opt} style={S.optBtn} onClick={() => setStep(8)}>{opt}</button>
            ))}
          </div>
        )}

        {step === 8 && char && (
          <div style={{ maxWidth:"480px", width:"100%", display:"flex", flexDirection:"column", alignItems:"flex-end" }}>
            <BackBtn />
            <CharImg src={char.img} name={char.name} />
            <div style={S.card}>
              <p style={{ fontSize:"17px", lineHeight:"2" }}>
                <strong style={S.mint}>¡Muy bien!</strong> 🌟<br /><br />
                الكلمة الثانية:<br />
                <span style={{ ...S.yellow, fontSize:"32px" }}>Gracias</span><br />
                تُنطق: <strong style={S.blue}>غراسياس</strong><br />
                وتعني: شكراً 🙏<br /><br />
                كيف تشكر <strong style={S.mint}>{char.name}</strong>؟
              </p>
            </div>
            {[`¡Gracias ${char.name}!`, `شكراً ${char.name}!`, `¡Muchas gracias!`].map(opt => (
              <button key={opt} style={S.optBtn} onClick={() => setStep(9)}>{opt}</button>
            ))}
          </div>
        )}

        {step === 9 && char && (
          <div style={{ maxWidth:"480px", width:"100%", display:"flex", flexDirection:"column", alignItems:"flex-end" }}>
            <BackBtn />
            <CharImg src={char.img} name={char.name} />
            <div style={S.card}>
              <p style={{ fontSize:"17px", lineHeight:"2" }}>
                <strong style={S.mint}>¡Increíble!</strong> 🤩<br /><br />
                الكلمة الثالثة:<br />
                <span style={{ ...S.yellow, fontSize:"28px" }}>¿Cómo estás?</span><br />
                تُنطق: <strong style={S.blue}>كومو إيستاس</strong><br />
                ماذا تعني؟
              </p>
            </div>
            {["كيف حالك؟ ✅", "ما اسمك؟", "من أين أنت؟"].map((opt, i) => (
              <button key={opt} style={{ ...S.optBtn, background: i===0 ? "#E8FFF8" : "#F8FBFF", borderColor: i===0 ? "#007A6E" : "#00B4D8" }}
                onClick={() => setStep(10)}>{opt}</button>
            ))}
          </div>
        )}

        {step === 10 && char && (
          <div style={{ maxWidth:"480px", width:"100%", display:"flex", flexDirection:"column", alignItems:"flex-end" }}>
            <BackBtn />
            <CharImg src={char.img} name={char.name} />
            <div style={S.card}>
              <p style={{ fontSize:"17px", lineHeight:"2" }}>
                <strong style={S.mint}>¡Fantástico, {name}!</strong> 🎉<br />
                أنهيت أول جلسة!<br /><br />
                ⭐ مستواك: مبتدئ متميز<br />
                📚 تعلمت: ٣ كلمات<br />
                🎯 هدفك: {reason}<br />
                ⏰ وقتك: {time}<br /><br />
                قريباً OLIVEIRApp:<br />
                🎯 دروس يومية<br />
                🏆 تحديات وجوائز<br />
                👨‍🏫 معلمون حقيقيون<br />
                🎓 شهادات معتمدة
              </p>
            </div>
            <button style={S.btn} onClick={() => setStep(11)}>أريد أن أكون أول المشتركين! 🚀</button>
          </div>
        )}

        {step === 11 && char && (
          <div style={{ maxWidth:"480px", width:"100%", display:"flex", flexDirection:"column", alignItems:"flex-end" }}>
            <BackBtn />
            <CharImg src={char.img} name={char.name} />
            <div style={{ ...S.card, border:"1px solid #007A6E" }}>
              <p style={{ fontSize:"17px", lineHeight:"2", marginBottom:"16px" }}>
                <strong style={S.mint}>¡Bienvenido, {name}!</strong> 🎊<br />
                سجل الآن وكن من أوائل المنضمين!<br /><br />
                ⭐ شهر مجاني كامل<br />
                🎯 وصول مبكر<br />
                🏆 شارة المؤسسين
              </p>
              <input value={email} onChange={e => setEmail(e.target.value)}
                placeholder="بريدك الإلكتروني..." style={S.input} />
              <button onClick={handleRegister} disabled={loading}
                style={{ ...S.btn, marginTop:"0", background:"linear-gradient(135deg, #00B4D8, #00F5D4)", opacity: loading ? 0.7 : 1 }}>
                {loading ? "جاري التسجيل..." : "سجّل الآن 🌿"}
              </button>
            </div>
          </div>
        )}

      </div>
      <Footer />
    </div>
  );
}
