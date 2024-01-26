import dynamic from 'next/dynamic';
import { useEffect } from 'react';

let errorBody;

// Dynamically import the module only on the client side. This needs to be done because its a server side thing and we need to make it client side according to getalby docs.
dynamic(() => import('./ProcessBCPayment'), { ssr: false });

export const ProcessBCPaymentClient = async (invoice) => {
  const payment = await requestPayment(invoice);
  return payment;
};

const requestPayment = async (invoice) => {
  let weblnProvider, result;

  // Dynamically import the provider
  try {
    const { requestProvider } = await import('@getalby/bitcoin-connect-react');
    weblnProvider = await requestProvider();

  } catch (error) {
    console.error("Provider request failed", error);
    return handleError(error, "Provider Error");
  }

  // Attempt to send payment
  try {
    result = await weblnProvider.sendPayment(invoice)
    
  } catch (error) {
    console.error("Payment failed", error);
    return handleError(error, "Payment Error");
  }

  return { payment: true, error: errorBody };
};

const handleError = (error, title) => {
  errorBody = {
    icon: "error",
    title: title,
    text: `${error}`,
    imageHeight: 150,
    imageAlt: "Error Logo",
    confirmButtonColor: "#202123"
  };
  return { payment: false, error: errorBody };
};

// Use useEffect for initializing webln object
const useWeblnInitializer = () => {
  useEffect(() => {
    // Dynamically import the onConnected function
    const initWebln = async () => {
      const { onConnected } = await import('@getalby/bitcoin-connect-react');
      const unsub = onConnected((provider) => {
        window.webln = provider;
      });

      return () => unsub();
    };

    initWebln();
  }, []);
};

export default ProcessBCPaymentClient;
export { useWeblnInitializer };