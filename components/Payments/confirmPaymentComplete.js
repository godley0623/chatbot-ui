export const confirmPaymentComplete = async (credit_id, price_in_sats) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

        let response = await fetch(`${API_URL}/confirmPaymentComplete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Specify that we're sending JSON
            },
            body: JSON.stringify({ credit_id, price_in_sats })
        });

        response = await response.text();
        console.log('confirmPaymentComplete response:', response)
        return response;

};