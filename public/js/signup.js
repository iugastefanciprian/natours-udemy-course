import axios from 'axios';
import { showAlert } from './alert';

export const createAccount = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data,
    });

    if (res.data.status === 201) {
      showAlert('success', 'Your profile has been created successfully');
      window.setTimeout(() => {
        location.assign('/me');
      }, 200);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};
