export const processInput = async (body)  => {
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
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