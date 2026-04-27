export interface Product {
  id: number;
  slug: string;
  name: string;
  price: number;
  image: string;
  category: string; // Internal slug: boost-pumps, holmen-submersible, etc.
  description: string;
  rating: number;
  reviews: number;
  tags: string[];
  features?: string[];
  specs?: { label: string; value: string }[];
  images?: string[];
}

// 2. Category Mapping (Internal Slug -> UI Label)
export const CATEGORY_MAP: Record<string, string> = {
  "all": "الكل",
  "boost-pumps": "مضخات رفع مياه",
  "holmen-submersible": "غاطس مياه هولمن",
  "cast-iron-stainless-submersible": "غاطس مياه زهر & استانلس",
  "holmen-deep-well": "غاطس اعماق هولمن",
  "full-cast-iron-submersible": "غاطس مياه زهر بالكامل",
  "full-stainless-submersible": "غاطس مياه استانلس بالكامل"
};

export const products: Product[] = [
  {
    id: 1,
    slug: "proflow-x-1000",
    name: "مضخة ProFlow X-1000 الرافعة",
    category: "boost-pumps",
    price: 14970,
    rating: 4.9,
    reviews: 128,
    image: "/products/smart_pump.png",
    images: [
      "/products/smart_pump.png",
      "/products/pump_side.png",
      "/products/pump_detail.png"
    ],
    tags: ["الأكثر مبيعاً", "رفع مياه"],
    description: "تعد مضخة ProFlow X-1000 الخيار الأمثل للمنازل الحديثة لزيادة ضغط المياه في الأدوار العليا، حيث تجمع بين القوة الهائلة والذكاء الاصطناعي لتوفير ضغط مياه ثابت واستهلاك طاقة منخفض.",
    features: [
      "تحكم ذكي في الضغط",
      "محرك هادئ جداً بتقنية العزل الصوتي",
      "توفير في الطاقة يصل إلى ٤٠٪",
      "حماية تلقائية من التشغيل الجاف",
      "سهلة التركيب والبرمجة"
    ],
    specs: [
      { label: "القوة", value: "١.٥ حصان" },
      { label: "أقصى تدفق", value: "٥ متر مكعب / ساعة" },
      { label: "أقصى ارتفاع", value: "٤٥ متر" },
      { label: "الضمان", value: "٥ سنوات" }
    ]
  },
  {
    id: 2,
    slug: "holmen-sub-750",
    name: "غاطس مياه هولمن ٧٥٠ وات",
    category: "holmen-submersible",
    price: 8970,
    rating: 4.8,
    reviews: 84,
    image: "/products/ro_filter.png", // Using existing placeholder
    tags: ["جديد", "هولمن"],
    description: "غاطس مياه هولمن عالي الكفاءة، مصمم لسحب المياه النظيفة والرمادية بسهولة تامة مع استهلاك طاقة مثالي.",
    features: [
      "محرك هولمن الأصلي",
      "عوامة كهربائية للتشغيل التلقائي",
      "سهولة الصيانة والتنظيف",
      "هيكل مقاوم للصدمات"
    ],
    specs: [
      { label: "القدرة", value: "٧٥٠ وات" },
      { label: "أقصى عمق", value: "٨ متر" },
      { label: "الضمان", value: "سنتان" }
    ]
  },
  {
    id: 3,
    slug: "cast-iron-titan",
    name: "غاطس مياه زهر & استانلس تيتان",
    category: "cast-iron-stainless-submersible",
    price: 18970,
    rating: 5.0,
    reviews: 42,
    image: "/products/industrial_motor.png",
    tags: ["تحمل شاق"],
    description: "مزيج من الزهر والاستانلس ستيل لضمان أقصى درجات التحمل في سحب المياه ورفعها.",
    features: [
      "هيكل زهر متين",
      "عمود استانلس ستيل مقاوم للصدأ",
      "سعة رفع عالية",
      "حماية حرارية للمحرك"
    ],
    specs: [
      { label: "القوة", value: "٢ حصان" },
      { label: "الخامة", value: "زهر / استانلس" },
      { label: "الضمان", value: "٣ سنوات" }
    ]
  },
  {
    id: 4,
    slug: "holmen-deep-well-2hp",
    name: "غاطس اعماق هولمن ٢ حصان",
    category: "holmen-deep-well",
    price: 22500,
    rating: 4.7,
    reviews: 35,
    image: "/products/mini_plant.png",
    tags: ["أعماق كبيرة"],
    description: "مخصص لسحب المياه من الآبار العميقة بكفاءة عالية وضمان استمرارية التدفق.",
    features: [
      "تصميم مدمج للآبار",
      "ريش من مادة النوريل المقواة",
      "مكثف داخلي للحماية",
      "كابل طويل معزول"
    ],
    specs: [
      { label: "القوة", value: "٢ حصان" },
      { label: "أقصى ارتفاع", value: "٦٠ متر" },
      { label: "الضمان", value: "سنة واحدة" }
    ]
  }
];

export function getProductBySlug(slug: string) {
  return products.find(p => p.slug === slug);
}

export function getProductById(id: number | string) {
  return products.find(p => p.id === Number(id));
}
