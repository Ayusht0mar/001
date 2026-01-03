export type Product = {
  product_id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
};

export const products: Product[] = [
    {
        product_id: "pdt_0NUU2ubxMAJtwwlx8xvxs",
        name: "Basic Plan",
        description: "Essential features for personal use",
        price: 9,
        features: [
            "Feature A",
            "Feature B",
            "Feature C",
        ],
    }
    ,
    {
        product_id: "pdt_0NUU2ubxMAJtwwlx8xvxy",
        name: "Pro Plan",
        description: "Advanced features for professionals",
        price: 30,
        features: [
            "Feature A",
            "Feature B",
            "Feature C",
            "Feature D",
            "Feature E",
        ],
    },
];