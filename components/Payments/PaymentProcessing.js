import { processInput } from './processInput';
import { ProcessBCPaymentClient } from './ProcessBCPayment';
import { addCreditRecord } from './addCreditRecord';
import { addCreditByCreditId } from './addCreditByCreditId';
import Swal, { SweetAlertOptions } from 'sweetalert2';

export const PaymentProcessing = async (body) => {

    // Check local storage for existing credit string
    const credit_id = localStorage.getItem('credit_id');

    try {
        // Send string to DB for verification and await its JSON response
        let response = await processInput(body, credit_id);
        response = JSON.parse(response);
        let invoice = response.payment_request;
        let new_credit_id = response.new_credit_id;
        localStorage.setItem('credit_id', new_credit_id);

        // Process the payment depending on whether or not the user is making first payment or is pulling from credit and making asynch payment.
        let payment;
        if (credit_id === null) {
            console.log('credit_id is null')
            payment = await ProcessBCPaymentClient(invoice);
            if (payment.payment) {
                addCreditRecord(new_credit_id, response.price_in_sats);
            }
        }
        if (credit_id !== null) {
            ProcessBCPaymentClient(invoice)
                .then(() => {
                    addCreditByCreditId(new_credit_id, response.price_in_sats);
                })
                .catch(error => {
                    console.error("Error in ProcessBCPaymentClient:", error);
                    // Handle error or do nothing if you only want to proceed on success
                });
        }

        // Handle payment response
        // if (!payment.payment) {
        //     const error = payment.error;
        //     Swal.fire({
        //                     icon: 'error',
        //     title: 'Oops...',
        //     text: 'Something went wrong!',
        //     });
        //     localStorage.removeItem('pay-progress');
        //     return;
        // }

    } catch (error) {
        console.error('Error in PaymentProcessing:', error);
        // Handle error (show alert, log error, etc.)
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
        });
    }
};

// You can call PaymentProcessing function from your component or event handler


            //send string to DB for verification
          //if valid===True
          //check if account credit is enough
            //if enough===True
              //deduct credit from DB
              //initiate new payment in background
              //Run query
            //else if enough===False
            //return insufficient funds error
          //elif valid===False
            //return invalid credit error
        //elif isConnected === True
            //Run initial payment... this will be similar to running regular payment except for it will be larger.

        //else isConnected === False
          //Bring up Bitcoin connect modal