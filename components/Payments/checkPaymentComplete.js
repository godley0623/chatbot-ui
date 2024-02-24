import { confirmPaymentComplete } from './confirmPaymentComplete';

const NEXT_PUBLIC_LNBITS_API_ENDPOINT = process.env.NEXT_PUBLIC_LNBITS_API_ENDPOINT; 
const apiKey = process.env.NEXT_PUBLIC_invoicekey;

export const checkPayment = async (payment_hash, payment_request, credit_id, clearCheckingInterval) => {  
  try {
    const response = await fetch(`${NEXT_PUBLIC_LNBITS_API_ENDPOINT}/${payment_hash}`, {
      headers: {
        'X-Api-Key': apiKey,
      },
    });
    const data = await response.json();

    if (data.paid) {
      console.log('Payment complete!');
      let price_in_sats = await fetchInvoiceAmount(payment_request);

      await confirmPaymentComplete(credit_id, price_in_sats);
      
      // Clear the interval once payment is confirmed
      if (clearCheckingInterval) clearCheckingInterval();
    } else {
      console.log('Payment has not been made yet.');
    }
  } catch (error) {
    console.error('Error checking payment:', error);
  }
};


export const startCheckingPayment = (payment_hash, payment_request, credit_id) => {
    let intervalId;
  
    // Function to clear the interval
    const clearCheckingInterval = () => {
      clearInterval(intervalId);
      console.log('Stopped checking for payment.');
    };
  
    intervalId = setInterval(() => checkPayment(payment_hash, payment_request, credit_id, clearCheckingInterval), 2000);
  
    // Optionally, still stop after 3 minutes regardless of payment status
    setTimeout(() => {
      clearCheckingInterval();
      console.log('Stopped checking for payment after 3 minutes.');
    }, 180000); // Stop after 3 minutes
  };

  const fetchInvoiceAmount = async (invoice) => {
    // Ensure you replace this URL with your actual LNbits API endpoint if different
    const LNBITS_API_ENDPOINT = 'https://legend.lnbits.com/api/v1/payments/decode'; 
    const apiKey = process.env.NEXT_PUBLIC_invoicekey; // Use the correct environment variable for your API key
  
    try {
      const response = await fetch(LNBITS_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Api-Key': apiKey, // Include your API key in the request headers
        },
        body: JSON.stringify({
          data: invoice // Your invoice data
        }),
      });
  
      if (!response.ok) {
        // If the response is not OK, throw an error
        throw new Error(`Failed to fetch invoice details: ${response.statusText}`);
      }
  
      const decodedInvoice = await response.json();

  
      // Assuming the decoded invoice response structure includes an "amount" field
      // Adjust the property name based on the actual response
      const amountSats = decodedInvoice.amount_msat / 1000;;
      console.log(`Amount in sats: ${amountSats}`);
      
      return amountSats; // Return the amount in satoshis
    } catch (error) {
      console.error('Error fetching invoice details:', error);
      throw error; // Rethrow or handle appropriately in your application
    }
  };
  
  
  