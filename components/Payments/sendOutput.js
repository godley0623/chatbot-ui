export const sendOutput = async (body)  => {

    const API_URL = process.env.REACT_APP_API_URL;
    console.log(API_URL)
    try {
        const response = await fetch(`${API_URL}/countOutput`, {
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