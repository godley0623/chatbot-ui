import Swal from 'sweetalert2';
import { getCreditIdBalance } from './getCreditIdBalance';

const accountIDModal = (accountId, fullCreditId) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

  return async () => { // Make this function async
    try {
      // Fetch the account data from your backend
      const response = await getCreditIdBalance(fullCreditId);
      console.log('accountIDModal response:', response);
      if (response.ok) {
        const accountData = await response.json();
        console.log('accountData:', accountData);
        // Now use the retrieved data in your modal
        Swal.fire({
          title: 'Account ID',
          html: `<p>Your Account ID is: ${accountId}</p>
                 <p>Balance (satoshis): ${accountData.creditRecord.amount}</p>`,
        });
      } else {
        // Handle errors or cases where the account is not found
        Swal.fire({
          title: 'Error',
          text: 'Failed to retrieve account data',
          icon: 'error',
        });
      }
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
