export const processInput = async (body, credit_id) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    let requestBody
    requestBody = JSON.parse(body);

        // Add credit_id to the requestBody object
        requestBody.credit_id = credit_id;

        const response = await fetch(`${API_URL}/processInput`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Specify that we're sending JSON
            },
            body: JSON.stringify(requestBody) // Convert the entire request body to a JSON string
        });

        const invoice = await response.text();
        return invoice;

};