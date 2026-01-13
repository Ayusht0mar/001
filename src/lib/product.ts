export type Product = {
  product_id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
};

export const products: Product[] = [
    {
        product_id: "pdt_0NWC6uyAB9IP4HeR7Dpav",
        name: "Pro Plan",
        description: "Essential features for personal use",
        price: 29,
        features: [
            "Feature A",
            "Feature B",
            "Feature C",
        ],
    }
    ,
    {
        product_id: "pdt_0NWC75krf8lECAiN7mJ4j",
        name: "Pro Plus Plan",
        description: "Advanced features for professionals",
        price: 49,
        features: [
            "Feature A",
            "Feature B",
            "Feature C",
            "Feature D",
            "Feature E",
        ],
    },
];