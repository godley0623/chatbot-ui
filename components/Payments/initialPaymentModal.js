import Swal from 'sweetalert2';
import { retrieveLumpSumInvoice } from './retrieveLumpSumInvoice';

import QRCode from 'qrcode';
import Pusher from 'pusher-js';

const NEXT_PUBLIC_CLUSTER = process.env.NEXT_PUBLIC_CLUSTER;
const NEXT_PUBLIC_PUSHER_APP_KEY = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;

const pusher = new Pusher(NEXT_PUBLIC_PUSHER_APP_KEY, {
  cluster: NEXT_PUBLIC_CLUSTER
});

// Assuming you have a way to determine the current theme mode
const isDarkMode = () => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

export const initialPaymentModal = async (credit_id) => {

    let default_invoice_value = "0.10"

    let invoice = await retrieveLumpSumInvoice(credit_id, default_invoice_value);
    let qrCodeDataURL;
    try {
        qrCodeDataURL = await QRCode.toDataURL(invoice); //Ensure this uses the invoice's unique identifier
    } catch (error) {
        console.error('Error generating QR code:', error);
        return;
    }
    const onMobileDevice = isMobileDevice();
    let htmlContent;
    //Do conditional rendering of Alby based on if mobile or not
    if (!onMobileDevice) {
        htmlContent = `
        <p style="text-align: center; font-size: 1.2em;">1. Buy credit via Lightning Invoice</p>
        <br>
        <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 10px;">
            <label for="user-input-field" style="margin-right: 10px; white-space: nowrap;">Amount:</label>
            <input type="text" id="user-input-field" value="$0.10" style="width: 150px; padding: 10px; border: 1px solid #ccc; border-radius: 4px; background-color: #e0e0e0;">
        </div>
        <div style="margin-top: 1px;">
            <img src="${qrCodeDataURL}" alt="QR Code" style="margin: auto; display: block;"/>
            <br>
            <button id="copy-invoice" class="swal2-styled" style="background-color: #7CBDF5; color: white; border-radius: 5px;">Copy Invoice</button>
        </div>
        <div style="display: flex; align-items: center; justify-content: center; margin: 20px 0;">
            <hr style="flex: 1; height: 1px; background-color: #ccc; border: none;">
            <h1 style="flex: 0 1 auto; padding: 0 20px; font-size: 2em; margin: 0;">OR</h1>
            <hr style="flex: 1; height: 1px; background-color: #ccc; border: none;">
        </div>
        <p style="text-align: center; font-size: 1.2em;">2. Streaming Payments via Connected Wallet</p>
        <div style="text-align: center; margin-bottom: 10px;">
            <img src="https://d4.alternativeto.net/wbw0Br9Q0qwY4-kY0h2eR0uVx6i-jBza8accEf1Up1A/rs:fill:280:280:0/g:ce:0:0/YWJzOi8vZGlzdC9pY29ucy9hbGJ5XzIxMzMyNS5wbmc.png" alt="Alby Logo" style="max-width: 100px; display: block; margin-left: auto; margin-right: auto;">
        </div>
        <button id="pay-with-alby" class="swal2-styled" style="background-color: #7CBDF5; color: white; border-radius: 5px; display: block; width: fit-content; margin: 0 auto;">Pay with Alby</button>
        
        `;
    } else {
        
        htmlContent = `
        <p style="text-align: center; font-size: 1.2em;">Buy credit via Lightning Invoice</p>
        <br>
        <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 10px;">
            <label for="user-input-field" style="margin-right: 10px; white-space: nowrap;">Amount:</label>
            <input type="text" id="user-input-field" value="$0.10" style="width: 150px; padding: 10px; border: 1px solid #ccc; border-radius: 4px; background-color: #e0e0e0;">
        </div>
        <div style="margin-top: 1px;">
            <img src="${qrCodeDataURL}" alt="QR Code" style="margin: auto; display: block;"/>
            <br>
            <button id="copy-invoice" class="swal2-styled" style="background-color: #7CBDF5; color: white; border-radius: 5px;">Copy Invoice</button>
        </div>
        <div style="display: flex; align-items: center; justify-content: center; margin: 20px 0;">
        </div>
        
        `;
    }

    return new Promise((resolve) => {

        const channel = pusher.subscribe('payment-channel');
        channel.bind('payment-event', function(data) {
          if (data.invoice === invoice && data.status === 'confirmed') {
            resolve({ choice: 'bought credit', credit_id: data.credit_id });
            Swal.close();
          }
        });
        Swal.fire({
            title: 'Select Payment Method',
            html: htmlContent,
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

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

document.getElementById('user-input-field')?.addEventListener('input', debounce(async (event) => {
    let inputField = event.target;
    let value = inputField.value.trim(); // Trim whitespace

    // Ensure the input starts with $ and is in correct format
    if (!value.startsWith('$')) {
        value = '$' + value.slice(1);
    }
    value = value.replace(/[^0-9.]+/g, '');
    let decimalIndex = value.indexOf('.');
    if (decimalIndex !== -1) {
        value = value.slice(0, decimalIndex) + '.' + value.slice(decimalIndex + 1).replace(/\./g, '');
    }

    // Check if the input field is empty or only contains the '$' sign, then reset it to default_invoice_value
    if (value === '$' || value === '') {
        value = `$${default_invoice_value}`; // Reset to default value
    }
    
    inputField.value = value.startsWith('$') ? value : '$' + value;

    // Convert the value to a number and check if it exceeds $2
    let numericValue = parseFloat(inputField.value.substring(1));
    let warningTextId = 'warning-text';
    let warningText = document.getElementById(warningTextId);

    if (numericValue > 2) {
        // Set the value to $2.00
        inputField.value = '$2.00';
        // Display a warning message below the input field
        if (!warningText) {
            warningText = document.createElement('div');
            warningText.id = warningTextId;
            warningText.textContent = 'Account credits over $2 are not allowed during beta.';
            warningText.style.color = 'red';
            warningText.style.marginTop = '5px'; // Adjust spacing as needed
            // Append the warning message as a sibling element below the input field
            inputField.parentNode.appendChild(warningText);
        }
    } else {
        // Remove the warning message if the value is now valid
        if (warningText) {
            warningText.remove();
        }
    }

    // Proceed with the debounced logic to update the invoice and QR code
    try {
        invoice = await retrieveLumpSumInvoice(credit_id, inputField.value.substring(1));
        qrCodeDataURL = await QRCode.toDataURL(invoice);
        document.querySelector('img[alt="QR Code"]').src = qrCodeDataURL;
    } catch (error) {
        console.error('Error updating QR code:', error);
    }
}, 750));





        

        // Button event listeners
        document.getElementById('pay-with-alby')?.addEventListener('click', async () => {
            if (!window.webln) {
                resolve('alby not detected')
            } else {
                resolve('pay with alby');
                Swal.close();
            }

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