import oilImg from "@/assets/product-growth-oil.jpg";
import sprayImg from "@/assets/Hydrating-Spray.jpg";
import butterImg from "@/assets/Hair-Butter-v2.jpg";
import bundleImg from "@/assets/3-Step-Hair-Growth.jpg";
import ingredientsImg from "@/assets/Goat-Milk.jpg";
import aloeSheaImg from "@/assets/Aloe-Shea.jpg";
import charcoalImg from "@/assets/Charcoal-Detox.jpg";
import lotionImg from "@/assets/Rosemary.jpg";
import menButterImg from "@/assets/Men’s-Repair-Hair.jpg";
import soapBundleImg from "@/assets/3-shop.jpg";
import menSprayImg from "@/assets/Leave-In-Hydrating.jpg";
import menOilImg from "@/assets/Men’s-Bald-Spot.jpg";
import turmericImg from "@/assets/Turmeric-Glow.png";
import bookImg from "@/assets/Renew-Your-Mind-Book.png";


export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  ingredients?: string[];
  includes?: string[];
  benefits: string[];
  image: string;
  category: "hair" | "skin" | "bundles" | "men" | "books";
  featured?: boolean;
}

export const products: Product[] = [
  {
    id: "oil",
    name: "TSR™ Growth Oil",
    price: 19.99,
    category: "hair",
    description: "A nutrient-rich botanical oil blend designed to nourish the scalp, strengthen roots, reduce breakage, and support healthier-looking hair growth while adding softness and shine.",
    ingredients: ["Castor Oil", "Rosemary Oil", "Argan Oil", "Vitamin E"],
    benefits: ["Helps reduce breakage", "Nourishes scalp", "Adds softness", "Supports healthier-looking hair"],
    image: oilImg,
  },
  {
    id: "spray",
    name: "TSR™ Hydrating Spray",
    price: 16.99,
    category: "hair",
    description: "A lightweight moisture mist formulated to hydrate dry hair, soften texture, refresh curls, and revitalize the scalp throughout the day.",
    ingredients: ["Aloe Vera", "Peppermint", "Vitamin E", "Glycerin"],
    benefits: ["Lightweight hydration", "Refreshes hair", "Softens strands", "Revitalizes scalp"],
    image: sprayImg,
  },
  {
    id: "butter",
    name: "TSR™ Hair Butter",
    price: 24.99,
    category: "hair",
    description: "A rich botanical butter crafted to deeply nourish strands, seal in moisture, soften texture, protect ends, and support fuller-looking healthy hair.",
    ingredients: ["Shea Butter", "Mango Oil", "Batana Oil", "Vitamin E"],
    benefits: ["Deep moisture", "Protects ends", "Softens texture", "Enhances fullness"],
    image: butterImg,
  },
  {
    id: "bundle",
    name: "TSR™ 3-Step Hair Growth Bundle",
    price: 49.99,
    category: "bundles",
    description: "A complete luxury botanical hair ritual featuring Growth Oil, Hydrating Spray, and Hair Butter designed to hydrate, strengthen, nourish, and protect hair in one premium system.",
    includes: ["Growth Oil", "Hydrating Spray", "Hair Butter"],
    benefits: ["Complete hair ritual", "Moisture + nourishment", "Strength support", "Fuller-looking hair"],
    image: bundleImg,
  },
  {
    id: "lotion",
    name: "TSR™ Rosemary & Clove Lotion",
    price: 13.99,
    category: "skin",
    description: "A nourishing botanical lotion designed to hydrate skin deeply while leaving it soft, smooth, refreshed, and lightly scented with luxurious rosemary and clove notes.",
    ingredients: ["Rosemary", "Clove", "Shea Butter", "Vitamin E"],
    benefits: ["Deep hydration", "Smooth texture", "Lightweight moisture", "Luxurious finish"],
    image: lotionImg,
  },
  {
    id: "aloe-bar",
    name: "TSR™ Aloe Shea Moisturizing Bar",
    price: 9.99,
    category: "skin",
    description: "A moisturizing cleansing bar enriched with aloe and shea butter to gently cleanse while helping maintain soft, hydrated skin.",
    ingredients: ["Aloe Vera", "Shea Butter", "Botanical Oils"],
    benefits: ["Gentle cleansing", "Moisturizing care", "Soft skin finish", "Everyday luxury cleansing"],
    image: aloeSheaImg,
  },
  {
    id: "charcoal-bar",
    name: "TSR™ Charcoal Detox Bar",
    price: 10.99,
    category: "skin",
    description: "A detoxifying charcoal cleansing bar designed to deeply cleanse impurities while refreshing and revitalizing the skin.",
    ingredients: ["Activated Charcoal", "Essential Oils", "Botanical Base"],
    benefits: ["Detoxifying cleanse", "Removes impurities", "Refreshes skin", "Clean luxury feel"],
    image: charcoalImg,
  },
  {
    id: "goat-milk-bar",
    name: "TSR™ Goat Milk Honey Bar",
    price: 11.99,
    category: "skin",
    description: "A creamy goat milk and honey cleansing bar crafted to nourish and soften skin while delivering a luxurious bathing experience.",
    ingredients: ["Goat Milk", "Honey", "Nourishing Oils"],
    benefits: ["Nourishing cleanse", "Soft smooth skin", "Rich creamy lather", "Luxury moisture care"],
    image: ingredientsImg,
  },
  {
    id: "turmeric-glow-bar",
    name: "TSR™ Turmeric Glow Bar",
    price: 10.99,
    category: "skin",
    description: "A brightening bar infused with turmeric to help improve the appearance of uneven skin tone while enhancing your natural glow.",
    ingredients: ["Turmeric", "Botanical Base", "Essential Oils"],
    benefits: ["Brightens dull skin", "Helps even skin tone", "Promotes a radiant glow"],
    image: turmericImg,
  },
  {
    id: "soap-bundle",
    name: "TSR™ 3 Soap Bundle",
    price: 27.99,
    category: "bundles",
    description: "A premium bundle featuring the complete TSR™ luxury soap collection designed to cleanse, hydrate, soften, and refresh skin.",
    includes: ["Aloe Shea Bar", "Charcoal Detox Bar", "Goat Milk Honey Bar"],
    benefits: ["Complete skin ritual", "Diverse cleansing", "Hydration + Detox", "Luxury gift set"],
    image: soapBundleImg,
  },
  {
    id: "men-butter",
    name: "TSR™ Men’s Repair Hair Butter",
    price: 29.99,
    category: "men",
    description: "A rich restorative hair butter designed specifically for men to deeply moisturize, soften texture, nourish dry hair, and support healthier-looking hair.",
    ingredients: ["Botanical Butters", "Growth Oils", "Vitamin E"],
    benefits: ["Deep moisture", "Texture softening", "Nourishes hair", "Helps reduce dryness"],
    image: menButterImg,
  },
  {
    id: "men-spray",
    name: "TSR™ Leave-In Hydrating Spray",
    price: 19.99,
    category: "men",
    description: "A lightweight leave-in hydration spray designed for men to refresh hair, add moisture, soften texture, and support daily hair maintenance.",
    ingredients: ["Aloe Vera", "Hydration Complex", "Mint"],
    benefits: ["Lightweight moisture", "Refreshes hair", "Daily hydration", "Soft texture support"],
    image: menSprayImg,
  },
  {
    id: "men-oil",
    name: "TSR™ Men’s Bald Spot Restore Oil",
    price: 27.99,
    category: "men",
    description: "A concentrated botanical oil blend crafted to nourish the scalp and support healthier-looking hair in thinning or sparse areas.",
    ingredients: ["Restorative Oils", "Botanical Extracts", "Biotin"],
    benefits: ["Nourishes scalp", "Supports fuller appearance", "Adds shine", "Lightweight oil care"],
    image: menOilImg,
  },
  {
    id: "men-bundle",
    name: "TSR™ Men’s Restoration System Bundle",
    price: 64.99,
    category: "men",
    description: "A complete men’s hair restoration ritual featuring premium hydration, moisture, and scalp care products designed to support healthier-looking hair.",
    includes: ["Repair Hair Butter", "Leave-In Spray", "Bald Spot Oil"],
    benefits: ["Full restoration system", "Complete men's ritual", "Moisture + Growth Support", "Premium hair care"],
    image: bundleImg,
  },
  {
    id: "renew-mind-book",
    name: "Renew Your Mind & Guard Your Heart",
    price: 20.00,
    category: "books",
    description: "Renew Your Mind & Guard Your Heart is a faith-filled devotional written for anyone who has struggled with fear, emotional wounds, or overwhelming life circumstances. Through Scripture, reflection, and biblical principles, this book shows how applying God's Word daily can bring healing, peace, and lasting change.",
    benefits: [
      "Renewing your mind daily",
      "Breaking strongholds and negative thinking",
      "Emotional healing and forgiveness",
      "Protecting your peace",
      "Walking in the mind of Christ",
      "Guarding your heart from fear and anxiety",
      "Spiritual growth and transformation through God's Word"
    ],
    image: bookImg,
  },

];
