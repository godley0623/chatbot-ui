import Swal from 'sweetalert2';
import { initialPaymentModal } from './initialPaymentModal';

export const InsufficientCreditModal = async () => {
    let credit_id = localStorage.getItem('credit_id');

    try {
        const result = await Swal.fire({
            icon: 'error',
            title: 'Insufficient credit',
            text: 'Please add more credit to continue.',
            showConfirmButton: true,
        });

        if (result.isConfirmed) {
            let user_choice = await initialPaymentModal(credit_id);
            return user_choice;

        }
    } catch (error) {
        console.error('Error handling modal:', error);
    }
};