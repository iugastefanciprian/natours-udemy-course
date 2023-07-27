// updateData and call from index
import axios from 'axios';
import { showAlert } from './alert';

//type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? '/api/v1/users/updatePassword'
        : '/api/v1/users/updateProfile';
    const res = await axios({
      method: 'PATCH',
      url: url,
      data,
    });

    if (res.data.status === 200) {
      showAlert('success', 'Profile has been updated successfully');
      window.setTimeout(() => {
        location.assign('/me');
      }, 200);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};
