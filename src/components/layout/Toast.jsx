import { Toast } from 'native-base';
export const toastr = {
    showToast: (message, duration = 2500) => {
      Toast.show({
        text: message,
        duration,
        position: 'bottom',
        textStyle: { textAlign: 'center' },
        buttonText: 'Okay',
      });
    },
  };