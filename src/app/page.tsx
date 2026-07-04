"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import {
  Upload,
  X,
  Play,
  ChevronDown,
  Phone,
  Mail,
  Instagram,
  Send,
  Sparkles,
  Shield,
  Zap,
  Droplets,
  Gift,
  Building2,
  Coffee,
  ShoppingBag,
  Camera,
  CheckCircle2,
  Menu,
  Lightbulb,
  ArrowRight,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";

/* ──────────────────────── types ──────────────────────── */

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
}

type LightSize = "40 мм" | "60 мм" | "80 мм" | "100 мм";
type LightColor =
  | "Теплий білий"
  | "Холодний білий"
  | "Жовтий"
  | "Синій"
  | "RGB (на вибір)";
type ConnectionType = "USB" | "220V";

const SIZE_PRICES: Record<LightSize, number> = {
  "40 мм": 140,
  "60 мм": 180,
  "80 мм": 220,
  "100 мм": 260,
};

const COLOR_PRICES: Record<LightColor, number> = {
  "Теплий білий": 0,
  "Холодний білий": 0,
  Жовтий: 0,
  Синій: 0,
  "RGB (на вибір)": 15,
};

const LIGHT_PRICE = 15;
const ENGRAVING_PRICE = 300;
const PACKAGING_PRICE = 200;

/* ──────────────────────── FAQ data ──────────────────────── */

const FAQ_ITEMS = [
  {
    q: "Які матеріали використовуються для підсвітки?",
    a: "Ми використовуємо преміум акрил товщиною 3-5 мм з ідеальною прозорістю. LED-підсвітка не нагрівається, безпечна для використання протягом тривалого часу. Всі матеріали відповідають стандартам якості та безпечні для дітей.",
  },
  {
    q: "Чи можна замовити індивідуальну форму?",
    a: "Так! Ми приймаємо логотипи у форматах PNG, SVG, AI та PDF. Будь-яка форма — кругла, квадратна, у вигляді логотипу чи символу. Наші інженери адаптують ваш дизайн для лазерної гравірування.",
  },
  {
    q: "Який мінімальний розмір замовлення?",
    a: "Мінімальне замовлення — від 10 підсвіток. Ми рекомендуємо замовляти від 50 штук для оптимального вигляду гірлянди. Для корпоративних замовлень діють спеціальні ціни.",
  },
  {
    q: "Скільки часу займає виробництво?",
    a: "Стандартний термін виробництва — 3-5 робочих днів. У сезон (листопад-грудень) рекомендуємо замовляти заздалегідь. Експрес-виробництво за 1-2 дні можливе за додаткову плату.",
  },
  {
    q: "Яка доставка по Україні?",
    a: "Доставка безкоштовна по всій Україні через Nova Poshta або Justin. Термін доставки 1-3 дні. Можливий самовивіз з нашого офісу у Києві.",
  },
  {
    q: "Чи є гарантія на продукцію?",
    a: "Так, ми надаємо гарантію 12 місяців на всі LED-підсвітки. У разі несправності протягом гарантійного терміну ми безкоштовно замінимо дефектні елементи.",
  },
];

/* ──────────────────────── main component ──────────────────────── */

export default function HomePage() {
  /* state */
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [lightCount, setLightCount] = useState(100);
  const [lightSize, setLightSize] = useState<LightSize>("60 мм");
  const [lightColor, setLightColor] = useState<LightColor>("Теплий білий");
  const [distance, setDistance] = useState(10);
  const [connectionType, setConnectionType] = useState<ConnectionType>("USB");
  const [engraving, setEngraving] = useState(true);
  const [packaging, setPackaging] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sending, setSending] = useState(false);

  /* order form */
  const [orderName, setOrderName] = useState("");
  const [orderPhone, setOrderPhone] = useState("");
  const [orderEmail, setOrderEmail] = useState("");
  const [orderComment, setOrderComment] = useState("");
  const [showOrderForm, setShowOrderForm] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* computed */
  const totalLength = useMemo(() => {
    return ((lightCount - 1) * distance) / 100;
  }, [lightCount, distance]);

  const subtotal = useMemo(
    () => lightCount * SIZE_PRICES[lightSize],
    [lightCount, lightSize]
  );

  const colorCost = useMemo(
    () => lightCount * COLOR_PRICES[lightColor],
    [lightCount, lightColor]
  );

  const extrasCost = useMemo(
    () => (engraving ? ENGRAVING_PRICE : 0) + (packaging ? PACKAGING_PRICE : 0),
    [engraving, packaging]
  );

  const totalPrice = useMemo(
    () => subtotal + lightCount * LIGHT_PRICE + colorCost + extrasCost,
    [subtotal, lightCount, colorCost, extrasCost]
  );

  const formatPrice = (n: number) =>
    n.toLocaleString("uk-UA", { minimumFractionDigits: 0 }) + " грн";

  /* handlers */
  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;
      const newFiles: UploadedFile[] = Array.from(files).map((f) => ({
        id: crypto.randomUUID(),
        file: f,
        preview: URL.createObjectURL(f),
      }));
      setUploadedFiles((prev) => [...prev, ...newFiles]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    []
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const files = e.dataTransfer.files;
      const newFiles: UploadedFile[] = Array.from(files).map((f) => ({
        id: crypto.randomUUID(),
        file: f,
        preview: URL.createObjectURL(f),
      }));
      setUploadedFiles((prev) => [...prev, ...newFiles]);
    },
    []
  );

  const removeFile = useCallback((id: string) => {
    setUploadedFiles((prev) => {
      const f = prev.find((x) => x.id === id);
      if (f) URL.revokeObjectURL(f.preview);
      return prev.filter((x) => x.id !== id);
    });
  }, []);

  const handleSendOrder = async () => {
    if (!orderName.trim()) {
      toast.error("Будь ласка, вкажіть ваше ім'я");
      return;
    }
    if (!orderPhone.trim() && !orderEmail.trim()) {
      toast.error("Будь ласка, вкажіть телефон або email");
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/send-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: orderName,
          phone: orderPhone,
          email: orderEmail,
          comment: orderComment,
          lightCount,
          lightSize,
          lightColor,
          distance: distance + " см",
          connectionType,
          engraving,
          packaging,
          totalPrice: formatPrice(totalPrice),
        }),
      });
      if (res.ok) {
        toast.success(
          "Замовлення надіслано! Ми зв'яжемося з вами найближчим часом."
        );
        setShowOrderForm(false);
        setOrderName("");
        setOrderPhone("");
        setOrderEmail("");
        setOrderComment("");
      } else {
        toast.error("Помилка відправки. Спробуйте ще раз.");
      }
    } catch {
      toast.error("Помилка з'єднання. Перевірте інтернет.");
    } finally {
      setSending(false);
    }
  };

  /* ──────────────────── RENDER ──────────────────── */
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#000" }}>
      {/* ────────── HEADER ────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-[#FFD700]" />
            <span className="text-lg font-bold text-white tracking-tight">
              Kyiv Light Logo
            </span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6 text-sm text-gray-300">
            <a href="#about" className="hover:text-[#FFD700] transition-colors">
              Про нас
            </a>
            <a href="#constructor" className="hover:text-[#FFD700] transition-colors">
              Конструктор
            </a>
            <a href="#examples" className="hover:text-[#FFD700] transition-colors">
              Кейси
            </a>
            <a href="#faq" className="hover:text-[#FFD700] transition-colors">
              FAQ
            </a>
            <a href="#contacts" className="hover:text-[#FFD700] transition-colors">
              Контакти
            </a>
          </nav>

          {/* CTA */}
          <div className="hidden lg:block">
            <a
              href="#constructor"
              className="inline-flex items-center gap-2 bg-[#FFD700] text-black font-semibold px-5 py-2.5 rounded-full text-sm hover:bg-[#ffcc00] transition-colors"
            >
              Розрахувати гірлянду
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Меню"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-black/95 border-t border-white/10 px-4 py-6 space-y-4">
            <a
              href="#about"
              className="block text-gray-300 hover:text-[#FFD700]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Про нас
            </a>
            <a
              href="#constructor"
              className="block text-gray-300 hover:text-[#FFD700]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Конструктор
            </a>
            <a
              href="#examples"
              className="block text-gray-300 hover:text-[#FFD700]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Кейси
            </a>
            <a
              href="#faq"
              className="block text-gray-300 hover:text-[#FFD700]"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ
            </a>
            <a
              href="#contacts"
              className="block text-gray-300 hover:text-[#FFD700]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Контакти
            </a>
            <a
              href="#constructor"
              className="inline-flex items-center gap-2 bg-[#FFD700] text-black font-semibold px-5 py-2.5 rounded-full text-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              Розрахувати гірлянду
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        )}
      </header>

      {/* ────────── HERO ────────── */}
      <section
        id="about"
        className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden"
      >
        {/* background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 70% 50%, rgba(255,215,0,0.08) 0%, transparent 60%)",
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-10 lg:gap-16 relative z-10">
          {/* Text */}
          <div className="flex-1 text-center lg:text-left">
            <p className="text-[#FFD700] text-sm font-semibold uppercase tracking-widest mb-4">
              Новорічна гірлянд з вашим логотипом
            </p>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6"
              style={{ fontFamily: "var(--font-geist-sans)" }}
            >
              ЗРОБИМО ГІРЛЯНДИ З ВАШИМ{" "}
              <span className="text-[#FFD700]">ЛОГОТИПОМ</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              Будь-яка форма. Будь-який логотип. Виріжуємо, гравіруємо та
              збираємо за 3 дні до Нового року.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <a
                href="#constructor"
                className="inline-flex items-center gap-2 bg-[#FFD700] text-black font-bold px-8 py-4 rounded-full text-base hover:bg-[#ffcc00] transition-all hover:scale-105 shadow-lg shadow-[#FFD700]/20"
              >
                Створити свою гірлянду
                <ArrowRight className="w-5 h-5" />
              </a>
              <button className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors group">
                <span className="flex items-center justify-center w-12 h-12 rounded-full border border-white/20 group-hover:border-[#FFD700]/50 transition-colors">
                  <Play className="w-5 h-5 text-[#FFD700] ml-0.5" />
                </span>
                Дивитись відео
              </button>
            </div>
          </div>

          {/* Hero image */}
          <div className="flex-1 relative max-w-lg w-full">
            <div
              className="absolute inset-0 rounded-full blur-3xl opacity-30"
              style={{ background: "radial-gradient(circle, #FFD700, transparent)" }}
            />
            <img
              src="/garland-product-1.png"
              alt="Гірлянда з логотипами"
              className="relative rounded-2xl w-full object-cover shadow-2xl"
              style={{ maxHeight: 420 }}
            />
          </div>
        </div>
      </section>

      {/* ────────── FEATURES BAR ────────── */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            {[
              { icon: <Sparkles className="w-5 h-5" />, text: "Будь-яка форма" },
              {
                icon: <Upload className="w-5 h-5" />,
                text: "PNG, SVG, AI, PDF",
              },
              {
                icon: <Zap className="w-5 h-5" />,
                text: "Виробимо за 3 дні",
              },
              {
                icon: <Shield className="w-5 h-5" />,
                text: "Преміум акрил 3-5 мм",
              },
              {
                icon: <Send className="w-5 h-5" />,
                text: "Доставка по всій Україні",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-2 text-gray-300"
              >
                <span className="text-[#FFD700]">{f.icon}</span>
                <span className="text-xs sm:text-sm font-medium">{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────── CONSTRUCTOR + CALCULATOR ────────── */}
      <section id="constructor" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* ── CONSTRUCTOR ── */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  <span className="text-[#FFD700]">1.</span> КОНСТРУКТОР ГІРЛЯНДИ
                </h2>
              </div>

              {/* Step 1 — Upload */}
              <div
                className="border border-white/10 rounded-2xl p-6 bg-white/[0.03]"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#FFD700] text-black text-sm font-bold">
                    1
                  </span>
                  Завантажте ваш логотип або зображення
                </h3>
                <div
                  className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center cursor-pointer hover:border-[#FFD700]/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-10 h-10 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">
                    Перетягніть файл сюди або оберіть на комп&apos;ютері
                  </p>
                  <p className="text-gray-600 text-xs mt-2">
                    Підтримуються формати: PNG, SVG, AI, PDF
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".png,.svg,.ai,.pdf"
                  multiple
                  className="hidden"
                  onChange={handleFileUpload}
                />

                {/* Preview uploaded files */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-3">
                    {uploadedFiles.map((f) => (
                      <div
                        key={f.id}
                        className="relative group w-20 h-20 rounded-lg overflow-hidden border border-white/10"
                      >
                        <img
                          src={f.preview}
                          alt={f.file.name}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => removeFile(f.id)}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Видалити"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Step 2 — Add lights */}
              <div className="border border-white/10 rounded-2xl p-6 bg-white/[0.03]">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#FFD700] text-black text-sm font-bold">
                    2
                  </span>
                  Додайте підсвітку до гірлянди
                </h3>
                <p className="text-gray-500 text-sm">
                  Перетягніть, щоб змінити порядок. Натисніть, щоб видалити.
                </p>
                {/* Light previews */}
                <div className="mt-4 flex gap-3 flex-wrap">
                  {uploadedFiles.length > 0 ? (
                    uploadedFiles.map((f) => (
                      <div
                        key={f.id}
                        className="w-16 h-16 rounded-full border-2 border-[#FFD700]/40 flex items-center justify-center bg-black/50 overflow-hidden"
                      >
                        <img
                          src={f.preview}
                          alt=""
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      </div>
                    ))
                  ) : (
                    <div className="flex gap-3">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className="w-16 h-16 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center text-gray-600 text-xs"
                        >
                          +{i}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Step 3 — Settings */}
              <div className="border border-white/10 rounded-2xl p-6 bg-white/[0.03]">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#FFD700] text-black text-sm font-bold">
                    3
                  </span>
                  Налаштуйте параметри підсвітки
                </h3>

                {/* Light Size */}
                <div className="mb-6">
                  <label className="text-gray-300 text-sm font-medium block mb-3">
                    Розмір підсвітки
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(
                      ["40 мм", "60 мм", "80 мм", "100 мм"] as LightSize[]
                    ).map((s) => (
                      <button
                        key={s}
                        onClick={() => setLightSize(s)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          lightSize === s
                            ? "bg-[#FFD700] text-black"
                            : "bg-white/10 text-gray-300 hover:bg-white/20"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Light Color */}
                <div className="mb-6">
                  <label className="text-gray-300 text-sm font-medium block mb-3">
                    Колір світла
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        "Теплий білий",
                        "Холодний білий",
                        "Жовтий",
                        "Синій",
                        "RGB (на вибір)",
                      ] as LightColor[]
                    ).map((c) => (
                      <button
                        key={c}
                        onClick={() => setLightColor(c)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          lightColor === c
                            ? "bg-[#FFD700] text-black"
                            : "bg-white/10 text-gray-300 hover:bg-white/20"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Extras */}
                <div>
                  <label className="text-gray-300 text-sm font-medium block mb-3">
                    Додаткові опції
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <Checkbox
                        checked={engraving}
                        onCheckedChange={(v) => setEngraving(v === true)}
                        className="data-[state=checked]:bg-[#FFD700] data-[state=checked]:border-[#FFD700] border-white/30"
                      />
                      <span className="text-gray-300 text-sm group-hover:text-white transition-colors">
                        Гравірування (3 дні строк)
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <Checkbox
                        checked={packaging}
                        onCheckedChange={(v) => setPackaging(v === true)}
                        className="data-[state=checked]:bg-[#FFD700] data-[state=checked]:border-[#FFD700] border-white/30"
                      />
                      <span className="text-gray-300 text-sm group-hover:text-white transition-colors">
                        Індивідуальна упаковка
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* ── CALCULATOR ── */}
            <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                <span className="text-[#FFD700]">2.</span> КАЛЬКУЛЯТОР
              </h2>

              <div className="border border-white/10 rounded-2xl p-6 md:p-8 bg-white/[0.03] space-y-6">
                {/* Light count slider */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-gray-300 text-sm font-medium">
                      Кількість підсвіток
                    </label>
                    <span className="text-[#FFD700] font-bold text-lg">
                      {lightCount}
                    </span>
                  </div>
                  <Slider
                    value={[lightCount]}
                    onValueChange={(v) => setLightCount(v[0])}
                    min={10}
                    max={500}
                    step={1}
                    className="[&_[role=slider]]:bg-[#FFD700] [&_[role=slider]]:border-[#FFD700]"
                  />
                  <div className="flex justify-between text-xs text-gray-600 mt-1">
                    <span>10</span>
                    <span>500</span>
                  </div>
                </div>

                {/* Distance */}
                <div>
                  <label className="text-gray-300 text-sm font-medium block mb-3">
                    Відстань між підсвітками
                  </label>
                  <div className="flex gap-2">
                    {[10, 15, 20, 25, 30].map((d) => (
                      <button
                        key={d}
                        onClick={() => setDistance(d)}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                          distance === d
                            ? "bg-[#FFD700] text-black"
                            : "bg-white/10 text-gray-300 hover:bg-white/20"
                        }`}
                      >
                        {d} см
                      </button>
                    ))}
                  </div>
                </div>

                {/* Total length */}
                <div className="flex justify-between items-center py-3 border-t border-white/10">
                  <span className="text-gray-400 text-sm">
                    Загальна довжина гірлянди
                  </span>
                  <span className="text-white font-semibold">
                    {totalLength.toFixed(1)} м
                  </span>
                </div>

                {/* Connection type */}
                <div>
                  <label className="text-gray-300 text-sm font-medium block mb-3">
                    Тип підключення
                  </label>
                  <div className="flex gap-2">
                    {(["USB", "220V"] as ConnectionType[]).map((t) => (
                      <button
                        key={t}
                        onClick={() => setConnectionType(t)}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                          connectionType === t
                            ? "bg-[#FFD700] text-black"
                            : "bg-white/10 text-gray-300 hover:bg-white/20"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Production time */}
                <div className="flex justify-between items-center py-3 border-t border-white/10">
                  <span className="text-gray-400 text-sm">
                    Термін виробництва
                  </span>
                  <span className="text-white font-semibold">
                    3-5 робочих днів
                  </span>
                </div>

                {/* Price breakdown */}
                <div className="border-t border-white/10 pt-4 space-y-3">
                  <h3 className="text-white font-semibold text-sm">
                    Розрахунок вартості
                  </h3>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">
                      {lightCount} шт × {lightSize}
                    </span>
                    <span className="text-white">{formatPrice(subtotal)}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">
                      Підсвітка ({lightColor.toLowerCase()})
                    </span>
                    <span className="text-white">
                      {formatPrice(lightCount * LIGHT_PRICE)}
                    </span>
                  </div>

                  {extrasCost > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Додаткові опції</span>
                      <span className="text-white">
                        {formatPrice(extrasCost)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Доставка</span>
                    <span className="text-green-400">Безкоштовно</span>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-[#FFD700]/30">
                    <span className="text-white font-bold text-lg">Разом:</span>
                    <span className="text-[#FFD700] font-extrabold text-2xl">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                </div>

                {/* Order button */}
                <button
                  onClick={() => setShowOrderForm(true)}
                  className="w-full bg-[#FFD700] text-black font-bold py-4 rounded-full text-base hover:bg-[#ffcc00] transition-all hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg shadow-[#FFD700]/20"
                >
                  Замовити гірлянду
                  <ArrowRight className="w-5 h-5" />
                </button>

                <p className="text-center text-gray-500 text-xs">
                  Без передоплати. Оплата при отриманні.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────── BENEFITS ────────── */}
      <section className="py-16 border-y border-white/10 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              {
                icon: <Shield className="w-8 h-8 text-[#FFD700]" />,
                title: "Прозорий акрил",
                desc: "Преміум акрил 3-5 мм з ідеальною прозорістю",
              },
              {
                icon: <Zap className="w-8 h-8 text-[#FFD700]" />,
                title: "Яскраве світло",
                desc: "LED-підсвітка, яка не нагрівається",
              },
              {
                icon: <Droplets className="w-8 h-8 text-[#FFD700]" />,
                title: "Міцні матеріали",
                desc: "Не бояться вологи, морозу та сонця",
              },
              {
                icon: <CheckCircle2 className="w-8 h-8 text-[#FFD700]" />,
                title: "Безпечне використання",
                desc: "Низька напруга, економне споживання",
              },
            ].map((b, i) => (
              <div
                key={i}
                className="border border-white/10 rounded-2xl p-6 bg-black/50 text-center hover:border-[#FFD700]/30 transition-colors"
              >
                <div className="flex justify-center mb-4">{b.icon}</div>
                <h3 className="text-white font-semibold mb-2">{b.title}</h3>
                <p className="text-gray-400 text-sm">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────── TARGET AUDIENCE ────────── */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">
            ДЛЯ КОГО?
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {[
              {
                icon: <Gift className="w-8 h-8 text-[#FFD700]" />,
                label: "Корпоративні подарунки",
              },
              {
                icon: <Building2 className="w-8 h-8 text-[#FFD700]" />,
                label: "Офіс та компанії",
              },
              {
                icon: <Coffee className="w-8 h-8 text-[#FFD700]" />,
                label: "Кав&apos;ярні та ресторани",
              },
              {
                icon: <ShoppingBag className="w-8 h-8 text-[#FFD700]" />,
                label: "Магазини та бутики",
              },
              {
                icon: <Camera className="w-8 h-8 text-[#FFD700]" />,
                label: "Івенти та фотозони",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="border border-white/10 rounded-2xl p-6 bg-white/[0.03] text-center hover:border-[#FFD700]/30 transition-colors group cursor-pointer"
              >
                <div className="flex justify-center mb-3 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <p className="text-gray-300 text-sm font-medium">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────── EXAMPLES ────────── */}
      <section id="examples" className="py-16 md:py-24 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              ПРИКЛАДИ РОБІТ
            </h2>
            <a
              href="#constructor"
              className="hidden sm:inline-flex items-center gap-2 text-[#FFD700] text-sm font-medium hover:underline"
            >
              Дивитись всі кейси
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="relative group rounded-2xl overflow-hidden border border-white/10">
              <img
                src="/garland-product-1.png"
                alt="Приклад роботи 1"
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <p className="text-white font-semibold">Київ Незламний</p>
                <p className="text-gray-400 text-sm">Корпоративна гірлянда</p>
              </div>
            </div>
            <div className="relative group rounded-2xl overflow-hidden border border-white/10">
              <img
                src="/garland-product-2.png"
                alt="Приклад роботи 2"
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <p className="text-white font-semibold">Київводоканал</p>
                <p className="text-gray-400 text-sm">Новорічна колекція</p>
              </div>
            </div>
            <div className="relative group rounded-2xl overflow-hidden border border-white/10">
              <img
                src="/hero-garland.png"
                alt="Приклад роботи 3"
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <p className="text-white font-semibold">З Різдвом Київ</p>
                <p className="text-gray-400 text-sm">Патріотична серія</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-8 sm:hidden">
            <a
              href="#constructor"
              className="inline-flex items-center gap-2 text-[#FFD700] text-sm font-medium"
            >
              Дивитись всі кейси
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ────────── FAQ ────────── */}
      <section id="faq" className="py-16 md:py-24 border-t border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">
            FAQ
          </h2>
          <Accordion
            type="single"
            collapsible
            className="space-y-3"
          >
            {FAQ_ITEMS.map((item, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border border-white/10 rounded-xl bg-white/[0.03] px-6 data-[state=open]:border-[#FFD700]/30 transition-colors"
              >
                <AccordionTrigger className="text-left text-white hover:no-underline hover:text-[#FFD700] py-5">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-gray-400 leading-relaxed pb-5">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ────────── CTA ────────── */}
      <section className="py-16 md:py-24 border-t border-white/10 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(255,215,0,0.06) 0%, transparent 70%)",
          }}
        />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-4">
            ГОТОВІ СТВОРИТИ СВОЮ ГІРЛЯНДУ?
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
            Створіть унікальну новорічну гірлянду з вашим логотипом за 3
            хвилини!
          </p>
          <a
            href="#constructor"
            className="inline-flex items-center gap-2 bg-[#FFD700] text-black font-bold px-10 py-4 rounded-full text-lg hover:bg-[#ffcc00] transition-all hover:scale-105 shadow-lg shadow-[#FFD700]/20"
          >
            Почати конструювання
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* ────────── FOOTER ────────── */}
      <footer
        id="contacts"
        className="border-t border-white/10 bg-white/[0.02] mt-auto"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-10">
            {/* Logo & copyright */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-6 h-6 text-[#FFD700]" />
                <span className="text-lg font-bold text-white">
                  Kyiv Light Logo
                </span>
              </div>
              <p className="text-gray-500 text-sm">
                &copy; 2024 Kyiv Light Logo. Усі права захищені.
              </p>
              <p className="text-gray-600 text-sm mt-1">
                Створено з любов&apos;ю до свята
              </p>
            </div>

            {/* Contact info */}
            <div className="space-y-3">
              <a
                href="tel:+380931234567"
                className="flex items-center gap-3 text-gray-400 hover:text-[#FFD700] transition-colors text-sm"
              >
                <Phone className="w-4 h-4" />
                +38 093 123 45 67
              </a>
              <a
                href="mailto:2294598@gmail.com"
                className="flex items-center gap-3 text-gray-400 hover:text-[#FFD700] transition-colors text-sm"
              >
                <Mail className="w-4 h-4" />
                2294598@gmail.com
              </a>
            </div>

            {/* Social */}
            <div className="space-y-3">
              <a
                href="#"
                className="flex items-center gap-3 text-gray-400 hover:text-[#FFD700] transition-colors text-sm"
              >
                <Instagram className="w-4 h-4" />
                @kyiv.light.logo
              </a>
              <a
                href="#"
                className="flex items-center gap-3 text-gray-400 hover:text-[#FFD700] transition-colors text-sm"
              >
                <Send className="w-4 h-4" />
                t.me/kyivlightlogo
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* ────────── ORDER MODAL ────────── */}
      {showOrderForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#111] border border-white/10 rounded-2xl p-6 md:p-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowOrderForm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              aria-label="Закрити"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-1">
              Оформлення замовлення
            </h3>
            <p className="text-[#FFD700] font-bold text-lg mb-6">
              {formatPrice(totalPrice)}
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm block mb-1">
                  Ім&apos;я *
                </label>
                <input
                  type="text"
                  value={orderName}
                  onChange={(e) => setOrderName(e.target.value)}
                  placeholder="Ваше ім'я"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#FFD700]/50 transition-colors"
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-1">
                  Телефон
                </label>
                <input
                  type="tel"
                  value={orderPhone}
                  onChange={(e) => setOrderPhone(e.target.value)}
                  placeholder="+38 0XX XXX XX XX"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#FFD700]/50 transition-colors"
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={orderEmail}
                  onChange={(e) => setOrderEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#FFD700]/50 transition-colors"
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-1">
                  Коментар
                </label>
                <textarea
                  value={orderComment}
                  onChange={(e) => setOrderComment(e.target.value)}
                  placeholder="Додаткові побажання..."
                  rows={3}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#FFD700]/50 transition-colors resize-none"
                />
              </div>

              {/* Order summary */}
              <div className="bg-white/5 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Підсвітки</span>
                  <span className="text-white">
                    {lightCount} шт × {lightSize}
                  </span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Колір</span>
                  <span className="text-white">{lightColor}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Відстань</span>
                  <span className="text-white">{distance} см</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Підключення</span>
                  <span className="text-white">{connectionType}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Довжина</span>
                  <span className="text-white">{totalLength.toFixed(1)} м</span>
                </div>
                {engraving && (
                  <div className="flex justify-between text-gray-400">
                    <span>Гравірування</span>
                    <span className="text-green-400">Так</span>
                  </div>
                )}
                {packaging && (
                  <div className="flex justify-between text-gray-400">
                    <span>Упаковка</span>
                    <span className="text-green-400">Так</span>
                  </div>
                )}
              </div>

              <button
                onClick={handleSendOrder}
                disabled={sending}
                className="w-full bg-[#FFD700] text-black font-bold py-4 rounded-full text-base hover:bg-[#ffcc00] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {sending ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Відправка...
                  </span>
                ) : (
                  <>
                    Відправити запит
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}