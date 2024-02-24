import { ProcessPayment } from './LightningPayments';
import { ProcessBCPaymentClient } from './ProcessBCPayment';
import { addCreditByCreditId } from './addCreditByCreditId';
import { addCreditRecord } from './addCreditRecord';
import { initialPaymentModal } from './initialPaymentModal';
import { InsufficientCreditModal } from './insufficientCreditModal';
import { processInput } from './processInput';
import { albyNotDetected } from './albyNotDetectedModal';
import Swal, { SweetAlertOptions } from 'sweetalert2';

export const PaymentProcessing = async (body) => {
  // Check local storage for existing credit string
  let credit_id = localStorage.getItem('credit_id');
  let new_credit_id;

  try {
    //if credit_id is null, then this is the first payment and should proceed with initial payment modal to let user set up their payment method
    if (credit_id === null) {
      let user_choice = await initialPaymentModal(credit_id);
      console.log('paymentprocessing user_choice:', user_choice);
      if (user_choice === 'pay with alby') {
        console.log('User chose to pay with alby');
      }
      //If user hits cancel button in payment modal
      if (user_choice === 'cancelled') {
        return user_choice;
      }
      else if (user_choice === 'alby not detected') {
        console.log('alby not detected');
        await albyNotDetected();
        return 'alby not detected';
      }
      //If user pays lump sum invoice
      else if (user_choice.choice === 'bought credit') {
        credit_id = user_choice.credit_id;
        localStorage.setItem('credit_id', credit_id);
        window.dispatchEvent(
          new CustomEvent('localStorageChange', {
            detail: { credit_id: credit_id },
          }),
        );

        return user_choice.choice;
      }
    }
    //processInput
    let invoiceData;
    let response = await processInput(body, credit_id);
    if (typeof response === 'string') {
      response = JSON.parse(response);
    }
    console.log('response:', response);
    //Check Insufficient credit
    if (response.error === 'Insufficient credit') {
      let user_choice = await InsufficientCreditModal();
      return user_choice.choice;
    }
    invoiceData = response.invoiceData;
    console.log('invoiceData', invoiceData)
    new_credit_id = response.new_credit_id;
    localStorage.setItem('credit_id', new_credit_id);
    window.dispatchEvent(
      new CustomEvent('localStorageChange', {
        detail: { credit_id: new_credit_id },
      }),
    );

    // Process the payment depending on whether or not the user is making first payment or is pulling from credit and making asynch payment.
    let payment;
    if (credit_id === null) {
      console.log('ProcessPayment executed');
      payment = await ProcessPayment(invoiceData);
      if (payment.payment) {
        await addCreditRecord(new_credit_id, response.price_in_sats);
        console.log('addCreditRecord complete');
        return 'alby payment complete';
      }
    }
    if (credit_id !== null) {
      if (credit_id.startsWith('ls-')) {
        return 'lump sum payment';
      }
      console.log('ProcessPayment executed');
      ProcessPayment(invoiceData)
        .then(() => {
          console.log('addCreditByCreditId executed');
          addCreditByCreditId(new_credit_id, response.price_in_sats);
        })
        .catch((error) => {
          console.error('Error in ProcessPayment:', error);
          // Handle error or do nothing if you only want to proceed on success
        });
      return 'alby payment complete';
    }
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
