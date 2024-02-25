import  maxInput  from './maxInputHistory.js';

export const processInput = async (body, credit_id) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    body = JSON.parse(body);

    let maxInputBody = await maxInput(body);
    console.log('maxInput:', maxInputBody)

    let requestBody
    requestBody = body;

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