"use client"
import { useSession } from "@/lib/auth-client";
import { products } from "@/lib/product";

export default function PricingPage() {

    const session = useSession()


    const userName = session.data?.user.name
    const userEmail = session.data?.user.email
    const userId = session.data?.user.id

    const initiateCheckout = async (productId: string) => {
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
    body: JSON.stringify({
        product_cart: [{ product_id: productId, quantity: 1 }],
        customer: { name: userName, email: userEmail },
        metadata: {
            user_id: userId,
        },
    }),
});

        

        if (!response.ok) {
                        throw new Error('Failed to initiate checkout');
                    }

                    const data = await response.json();

                    if (data.checkout_url) {
                        window.location.href = data.checkout_url;
                    } else {
                        throw new Error('Invalid checkout URL');
                    }
        } catch (error) {
            console.error('Checkout error:', error);
            alert(`Checkout failed: ${error}`);
        }
        

        // Placeholder function for initiating checkout
    }

    return (
        <div>
            <div className="text-center mt-16 mb-8">
                <h1 className="text-3xl md:text-5xl font-semibold tracking-wide leading-tight">
                    Affordable Plans for Every Need
                </h1>
                <p className="text-sm md:text-base text-neutral-500 text-balance">
                    Choose a plan that suits you best and enjoy our services with flexible pricing options.
                </p>
            </div>
            <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-3 gap-3 px-4 md:px-0 mb-3">
                    <div className="border py-6 px-4 border-neutral-800 rounded-lg flex flex-col gap-2">
                            <div>
                                <h2 className="font-semibold text-lg text-neutral-200 leading-none">Free Plan</h2>
                                <p className="text-neutral-500 text-sm text-balance mt-1">For developers.</p>
                            </div>
                            <div className="flex py-3 items-baseline gap-1">
                                <p className="text-2xl">$0</p>
                                <p className="text-neutral-500">/ month</p>
                            </div>
                            <button onClick={() => initiateCheckout('free_plan_id') } className="bg-neutral-100 rounded text-neutral-900 w-full text-sm py-1">
                                Select Free Plan
                            </button>
                            <ul className="text-sm text-neutral-500 flex flex-col gap-1 mt-2">
                                <li>Basic Feature 1</li>
                                <li>Basic Feature 2</li>
                                <li>Basic Feature 3</li>
                            </ul>
                    </div>
                    {products.map((product) => (
                        <div key={product.product_id} className="border py-6 px-4 border-neutral-800 rounded-lg flex flex-col gap-2">
                            <div>
                                <h2 className="font-semibold text-lg text-neutral-200 leading-none">{product.name}</h2>
                                <p className="text-neutral-500 text-sm text-balance mt-1">{product.description}</p>
                            </div>
                            <div className="flex py-3 items-baseline gap-1">
                                <p className="text-2xl">${product.price}</p>
                                <p className="text-neutral-500">/ month</p>
                            </div>
                            <div className="bg-neutral-100 rounded text-neutral-900 w-full text-sm py-1 text-center">
                            {session.data?.user
                                ? 
                                <button onClick={() => initiateCheckout(product.product_id) } >
                                    Select Plan
                                </button>
                                : 
                                <button>
                                    <a href="/auth" >
                                        Select Plan
                                    </a>
                                </button>
                            } 
                            </div>
                            <ul className="text-sm text-neutral-500 flex flex-col gap-1 mt-2">
                                {product.features.map((feature, index) => (
                                    <li key={index}>{feature}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="border p-6 border-neutral-800 rounded-lg text-center">
                    Enterprise. For teams that need custom limits, enterprise security, and dedicated support.
                </div>
            </div>

        </div>
    );
}
