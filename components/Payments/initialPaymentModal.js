import Swal from 'sweetalert2';
import { retrieveLumpSumInvoice } from './retrieveLumpSumInvoice';
import QRCode from 'qrcode';
import Pusher from 'pusher-js';

// At the top of your file, after imports
Pusher.logToConsole = true;

const NEXT_PUBLIC_CLUSTER = process.env.NEXT_PUBLIC_CLUSTER;
const NEXT_PUBLIC_PUSHER_APP_KEY = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;

const pusher = new Pusher(NEXT_PUBLIC_PUSHER_APP_KEY, {
  cluster: NEXT_PUBLIC_CLUSTER
});

// Assuming you have a way to determine the current theme mode
const isDarkMode = () => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

export const initialPaymentModal = async (credit_id) => {

    let invoice = await retrieveLumpSumInvoice(credit_id);
    let qrCodeDataURL;
    try {
        qrCodeDataURL = await QRCode.toDataURL(invoice); // Ensure this uses the invoice's unique identifier
    } catch (error) {
        console.error('Error generating QR code:', error);
        return;
    }

    const swalButtonColor = '#3085d6'; // Example button color, adjust as needed

    return new Promise((resolve) => {

        const channel = pusher.subscribe('payment-channel');
        channel.bind('payment-event', function(data) {
          if (data.invoice === invoice && data.status === 'confirmed') {
            resolve({ choice: 'bought credit', credit_id: data.credit_id });
            Swal.close();
          }
        });
        Swal.fire({
            title: 'Choose Payment Method',
            html: `
            <p style="text-align: center; font-size: 1.2em;">1. Streaming Payments via Connected Wallet</p>
            <div style="text-align: center; margin-bottom: 10px;">
                <img src="https://d4.alternativeto.net/wbw0Br9Q0qwY4-kY0h2eR0uVx6i-jBza8accEf1Up1A/rs:fill:280:280:0/g:ce:0:0/YWJzOi8vZGlzdC9pY29ucy9hbGJ5XzIxMzMyNS5wbmc.png" alt="Alby Logo" style="max-width: 100px; display: block; margin-left: auto; margin-right: auto;">
            </div>
            <button id="pay-with-alby" class="swal2-styled" style="background-color: #3085d6; display: block; width: fit-content; margin: 0 auto;">Pay with Alby</button>
            <div style="display: flex; align-items: center; justify-content: center; margin: 20px 0;">
                <hr style="flex: 1; height: 1px; background-color: #ccc; border: none;">
                <h1 style="flex: 0 1 auto; padding: 0 20px; font-size: 2em; margin: 0;">OR</h1>
                <hr style="flex: 1; height: 1px; background-color: #ccc; border: none;">
            </div>
            <p style="text-align: center; font-size: 1.2em;">2. Buy credit via Lightning Invoice</p>
            <br>
            <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 10px;">
                <label for="user-input-field" style="margin-right: 10px; white-space: nowrap;">Amount:</label>
                <input type="text" id="user-input-field" value="$0.10" style="width: 150px; padding: 10px; border: 1px solid #ccc; border-radius: 4px; background-color: #e0e0e0;" readonly>
            </div>
            <div style="margin-top: 10px;">
                <img src="${qrCodeDataURL}" alt="QR Code" style="margin: auto; display: block;"/>
                <br>
                <button id="copy-invoice" class="swal2-styled" style="background-color: #3085d6;">Copy Invoice</button>
            </div>

            
            `,
            showConfirmButton: false,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            customClass: {
                container: isDarkMode() ? 'dark-bg' : 'light-bg',
                title: isDarkMode() ? 'dark-text' : 'light-text',
                content: isDarkMode() ? 'dark-content' : 'light-content',
            },
            allowOutsideClick: false
        }).then((result) => {
            if (result.dismiss === Swal.DismissReason.cancel) {
                console.log('Payment cancelled by user');
                resolve('cancelled');
            }
        });

        // Button event listeners
        document.getElementById('pay-with-alby')?.addEventListener('click', async () => {
            resolve('pay with alby');
            Swal.close();
        });

        document.getElementById('copy-invoice')?.addEventListener('click', () => {
            navigator.clipboard.writeText(invoice).then(() => {
                Swal.showValidationMessage('Copied to clipboard');
            }).catch(err => {
                console.error('Error copying to clipboard', err);
                Swal.showValidationMessage(`Failed to copy: ${err}`);
            });
        });
    });
};