import Swal from 'sweetalert2';
import { getCreditIdBalance } from './getCreditIdBalance';

const accountIDModal = (accountId, fullCreditId) => {
  return async () => { // The function is now async
    try {
      // Fetch the account data from your backend
      const accountData = await getCreditIdBalance(fullCreditId);
      console.log('accountIDModal response:', accountData);

      if (accountData.error) {
        throw new Error(accountData.error);
      }

      console.log('accountData:', accountData.creditRecord);
      // Now use the retrieved data in your modal
      Swal.fire({
        title: 'Account ID',
        html: `<p>Your Account ID is: ${accountId}</p>
               <p>Balance (satoshis): ${accountData.creditRecord.amount}</p>`,
      });

    } catch (error) {
      console.error('Failed to fetch account data:', error);
      Swal.fire({
        title: 'Error',
        text: 'There was a problem fetching account data',
        icon: 'error',
      });
    }
  };
};

export default accountIDModal;