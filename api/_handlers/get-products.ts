import { connectToDatabase } from '../_utils/mongodb';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { db } = await connectToDatabase();
    let productsList = await db.collection("products").find({}).toArray();

    if (productsList.length === 0) {
      const initialProducts = [
        {
          id: "oil",
          name: "TSR™ Growth Oil",
          price: 19.99,
          category: "hair",
          description: "A nutrient-rich botanical oil blend designed to nourish the scalp, strengthen roots, reduce breakage, and support healthier-looking hair growth while adding softness and shine.",
          ingredients: ["Castor Oil", "Rosemary Oil", "Argan Oil", "Vitamin E"],
          benefits: ["Helps reduce breakage", "Nourishes scalp", "Adds softness", "Supports healthier-looking hair"],
          image: "/src/assets/product-growth-oil.jpg"
        },
        {
          id: "spray",
          name: "TSR™ Hydrating Spray",
          price: 16.99,
          category: "hair",
          description: "A lightweight moisture mist formulated to hydrate dry hair, soften texture, refresh curls, and revitalize the scalp throughout the day.",
          ingredients: ["Aloe Vera", "Peppermint", "Vitamin E", "Glycerin"],
          benefits: ["Lightweight hydration", "Refreshes hair", "Softens strands", "Revitalizes scalp"],
          image: "/src/assets/Hydrating-Spray.jpg"
        },
        {
          id: "butter",
          name: "TSR™ Hair Butter",
          price: 24.99,
          category: "hair",
          description: "A rich botanical butter crafted to deeply nourish strands, seal in moisture, soften texture, protect ends, and support fuller-looking healthy hair.",
          ingredients: ["Shea Butter", "Mango Oil", "Batana Oil", "Vitamin E"],
          benefits: ["Deep moisture", "Protects ends", "Softens texture", "Enhances fullness"],
          image: "/src/assets/Hair-Butter-v2.jpg"
        },
        {
          id: "bundle",
          name: "TSR™ 3-Step Hair Growth Bundle",
          price: 49.99,
          category: "bundles",
          description: "A complete luxury botanical hair ritual featuring Growth Oil, Hydrating Spray, and Hair Butter designed to hydrate, strengthen, nourish, and protect hair in one premium system.",
          includes: ["Growth Oil", "Hydrating Spray", "Hair Butter"],
          benefits: ["Complete hair ritual", "Moisture + nourishment", "Strength support", "Fuller-looking hair"],
          image: "/src/assets/3-Step-Hair-Growth.jpg"
        },
        {
          id: "lotion",
          name: "TSR™ Rosemary & Clove Lotion",
          price: 13.99,
          category: "skin",
          description: "A nourishing botanical lotion designed to hydrate skin deeply while leaving it soft, smooth, refreshed, and lightly scented with luxurious rosemary and clove notes.",
          ingredients: ["Rosemary", "Clove", "Shea Butter", "Vitamin E"],
          benefits: ["Deep hydration", "Smooth texture", "Lightweight moisture", "Luxurious finish"],
          image: "/src/assets/Rosemary.jpg"
        },
        {
          id: "aloe-bar",
          name: "TSR™ Aloe Shea Moisturizing Bar",
          price: 9.99,
          category: "skin",
          description: "A moisturizing cleansing bar enriched with aloe and shea butter to gently cleanse while helping maintain soft, hydrated skin.",
          ingredients: ["Aloe Vera", "Shea Butter", "Botanical Oils"],
          benefits: ["Gentle cleansing", "Moisturizing care", "Soft skin finish", "Everyday luxury cleansing"],
          image: "/src/assets/Aloe-Shea.jpg"
        },
        {
          id: "charcoal-bar",
          name: "TSR™ Charcoal Detox Bar",
          price: 10.99,
          category: "skin",
          description: "A detoxifying charcoal cleansing bar designed to deeply cleanse impurities while refreshing and revitalizing the skin.",
          ingredients: ["Activated Charcoal", "Essential Oils", "Botanical Base"],
          benefits: ["Detoxifying cleanse", "Removes impurities", "Refreshes skin", "Clean luxury feel"],
          image: "/src/assets/Charcoal-Detox.jpg"
        },
        {
          id: "goat-milk-bar",
          name: "TSR™ Goat Milk Honey Bar",
          price: 11.99,
          category: "skin",
          description: "A creamy goat milk and honey cleansing bar crafted to nourish and soften skin while delivering a luxurious bathing experience.",
          ingredients: ["Goat Milk", "Honey", "Nourishing Oils"],
          benefits: ["Nourishing cleanse", "Soft smooth skin", "Rich creamy lather", "Luxury moisture care"],
          image: "/src/assets/Goat-Milk.jpg"
        },
        {
          id: "soap-bundle",
          name: "TSR™ 3 Soap Bundle",
          price: 27.99,
          category: "bundles",
          description: "A premium bundle featuring the complete TSR™ luxury soap collection designed to cleanse, hydrate, soften, and refresh skin.",
          includes: ["Aloe Shea Bar", "Charcoal Detox Bar", "Goat Milk Honey Bar"],
          benefits: ["Complete skin ritual", "Diverse cleansing", "Hydration + Detox", "Luxury gift set"],
          image: "/src/assets/3-shop.jpg"
        },
        {
          id: "men-butter",
          name: "TSR™ Men’s Repair Hair Butter",
          price: 29.99,
          category: "men",
          description: "A rich restorative hair butter designed specifically for men to deeply moisturize, soften texture, nourish dry hair, and support healthier-looking hair.",
          ingredients: ["Botanical Butters", "Growth Oils", "Vitamin E"],
          benefits: ["Deep moisture", "Texture softening", "Nourishes hair", "Helps reduce dryness"],
          image: "/src/assets/Men’s-Repair-Hair.jpg"
        },
        {
          id: "men-spray",
          name: "TSR™ Leave-In Hydrating Spray",
          price: 19.99,
          category: "men",
          description: "A lightweight leave-in hydration spray designed for men to refresh hair, add moisture, soften texture, and support daily hair maintenance.",
          ingredients: ["Aloe Vera", "Hydration Complex", "Mint"],
          benefits: ["Lightweight moisture", "Refreshes hair", "Daily hydration", "Soft texture support"],
          image: "/src/assets/Leave-In-Hydrating.jpg"
        },
        {
          id: "men-oil",
          name: "TSR™ Men’s Bald Spot Restore Oil",
          price: 27.99,
          category: "men",
          description: "A concentrated botanical oil blend crafted to nourish the scalp and support healthier-looking hair in thinning or sparse areas.",
          ingredients: ["Restorative Oils", "Botanical Extracts", "Biotin"],
          benefits: ["Nourishes scalp", "Supports fuller appearance", "Adds shine", "Lightweight oil care"],
          image: "/src/assets/Men’s-Bald-Spot.jpg"
        }
      ];
      await db.collection("products").insertMany(initialProducts);
      productsList = initialProducts;
    }

    res.status(200).json(productsList);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
}
