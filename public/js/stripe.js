import axios from 'axios';
import { showAlert } from './alert';

export const bookTour = async (tourId) => {
  try {
    const stripe = Stripe(
      'pk_test_51NYXcOEPKPDPborLMtBiYqMdo0OTZ9oHdD7wMPGRnxVIGCV5LQ1qlvvxyVjRrjyH5YIm1AEF1GS6hn2pQ7lQcxgW00v6JReszV'
    );
    // 1) Get checkout session from API endpoint
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);

    // 2) Create checkout form + charge the credit card
    await stripe.redirectToCheckout({ sessionId: session.data.session.id });
  } catch (err) {
    // console.log(err);
    showAlert('error', err);
  }
};
