"use client"
import { useSession } from "@/lib/auth-client";
import { products } from "@/lib/product";

export default function PricingPage() {

    const session = useSession()


    const userName = session.data?.user.name
    const userEmail = session.data?.user.email

    const initiateCheckout = async (productId: string) => {
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                     product_cart : [{ product_id: productId, quantity: 1 }],
                     customer : {name : userName, email: userEmail}
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
            <h1>Pricing</h1>
            <p>Choose the plan that fits your needs.</p>
        <div className="flex gap-2">
            {products.map((product) => (
                <div key={product.product_id} style={{ border: '1px solid #ccc', padding: '16px', marginBottom: '16px' }}>
                    <h2>{product.name}</h2>
                    <p>{product.description}</p>
                    <p>Price: ${product.price} / month</p>
                    <ul>
                        {product.features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                        ))}
                    </ul>

                    <button onClick={() => initiateCheckout(product.product_id) }>
                        Select Plan
                    </button>
                </div>
            ))}
            </div>

        </div>
    );
}
