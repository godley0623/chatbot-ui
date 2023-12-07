export const sendOutput = async (body)  => {
    try {
        const response = await fetch('http://localhost:4000/countOutput', {
            method: 'POST', // Use POST method to send data
            headers: {
                'Content-Type': 'application/json' // Specify that we're sending JSON
            },
            body: JSON.stringify({ messages: body })
        });
        const isSuccessful = await response.text();
        return isSuccessful;

    } catch (error) {
        console.error('Error:', error);
    }
}