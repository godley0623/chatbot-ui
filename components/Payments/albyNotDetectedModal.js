import Swal from 'sweetalert2';

export async function albyNotDetected() {

    try {
        const result = await Swal.fire({
            icon: 'error',
            title: 'Alby browser extension not detected',
            text: 'Please use a modern browser with the getalby.com extension installed or pay to a generic lightning invoice.',
            showConfirmButton: true,
        });

        if (result.isConfirmed) {
            localStorage.removeItem('credit_id');
        }
    } catch (error) {
        console.error('Error handling modal:', error);
    }
};