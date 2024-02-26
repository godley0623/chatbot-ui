import Swal from 'sweetalert2';

const injectCustomStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
        .swal2-bottom-end-custom {
            bottom: 15vh !important; // Adjust vertical position using vh units
        }
    `;
    document.head.appendChild(style);
};

export const lostCreditWarningModal = async () => {
    injectCustomStyles();  // Call this function to inject the above custom styles

    try {
        const result = await Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Warning',
            html: '<p>Your account credit ID has been placed in your browser history (local storage).</p>' + '<br>' +
                  '<p>Deleting it will result in loss of your balance.</p>',
            confirmButtonText: 'Got it',
            toast: true, // Use a toast for less intrusive notifications
            customClass: {
                container: 'swal2-bottom-end-custom', // Use custom class for the container
                popup: 'swal2-horizontal-custom' // Use custom class for the popup itself
            }
        });

        return result.isConfirmed;
    } catch (error) {
        console.error('Error handling modal:', error);
    }
};