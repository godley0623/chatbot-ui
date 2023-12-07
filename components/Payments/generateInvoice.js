export const processInput = async (body)  => {
    try {
        const response = await fetch('http://localhost:4000/processInput', {
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