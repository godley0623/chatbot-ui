export const retrieveLumpSumInvoice = async (credit_id) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

        const response = await fetch(`${API_URL}/retrieveLumpSumInvoice`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Specify that we're sending JSON
            },
            body: JSON.stringify({ credit_id })
        });

        const invoice = await response.text();
        return invoice;

};