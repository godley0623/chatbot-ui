export const addCreditRecord = async (new_credit_id, price_in_sats)  => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;


    try {
        const response = await fetch(`${API_URL}/addCreditRecord`, {
            method: 'POST', // Use POST method to send data
            headers: {
                'Content-Type': 'application/json'
                
            },
            body: JSON.stringify({ new_credit_id, price_in_sats })
        });
        const isSuccessful = await response.text();
        console.log('isSuccessful:', isSuccessful);
        return isSuccessful;

    } catch (error) {
        console.error('Error:', error);
    }
}