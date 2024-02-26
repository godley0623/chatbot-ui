import Swal from 'sweetalert2';
import { getCreditIdBalance } from './getCreditIdBalance';

const accountIDModal = (accountId, fullCreditId) => {
  return async () => {
    try {
      const { creditRecord, queryMetadataRecords } = await getCreditIdBalance(fullCreditId);

      if (!creditRecord) {
        throw new Error('No account data found');
      }

      // Sort the records in descending order by timestamp (most recent first)
      queryMetadataRecords.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));


      let queryRecordsHtml = '';
      queryMetadataRecords.forEach(record => {
        const dateOptions = { month: 'short', day: '2-digit' }; // Month as abbreviated name, day as two digits
        const timeOptions = { hour: '2-digit', minute: '2-digit' }; // Include AM/PM for 12-hour cycle based on the locale
        const formattedDate = new Date(record.timestamp).toLocaleDateString('en-US', dateOptions);
        const formattedTime = new Date(record.timestamp).toLocaleTimeString('en-US', timeOptions);

        queryRecordsHtml += `
          <tr>
            <td style="padding: 0 10px;">${formattedDate} ${formattedTime}</td>
            <td style="padding: 0 10px;">${record.input_count}</td>
            <td style="padding: 0 10px;">${record.price_in_sats}</td>
          </tr>`;
      });

      const htmlContent = `
        <p>Your Account ID is: ${accountId}</p>
        <br>
        <p>Your balance is: ${creditRecord.amount} (Sats)</p>
        <br>
        <div style="width: 100%; display: flex; justify-content: center;">
          <table style="border-collapse: separate; border-spacing: 0 10px;">
            <thead>
              <tr>
                <th style="padding: 0 10px;">Date</th>
                <th style="padding: 0 10px;">Input Tokens</th>
                <th style="padding: 0 10px;">Price (satoshis)</th>
              </tr>
            </thead>
            <tbody>
              ${queryRecordsHtml}
            </tbody>
          </table>
        </div>`;

      Swal.fire({
        title: 'Account Info',
        html: htmlContent,
        width: '600px',
        preConfirm: () => { }
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