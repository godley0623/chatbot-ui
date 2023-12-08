export const processInput = async (body)  => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    try {
        const response = await fetch(`${API_URL}/processInput`, {
            method: 'POST', // Use POST method to send data
            headers: {
                'Content-Type': 'application/json' // Specify that we're sending JSON
            },
            body: body
        });
        const invoice = await response.text();
        return invoice;

    } catch (error) {
        console.error('Error:', error);
    }
}