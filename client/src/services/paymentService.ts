import { paymentsApi } from './paymentsApi';

export function usePayment() {
  const [initiatePayment] = paymentsApi.useInitiatePaymentMutation();
  const [verifyPayment] = paymentsApi.useVerifyPaymentMutation();

  const processPayment = async (orderId: string, amount: number) => {
    try {
      // Initiate the payment
      const { paymentUrl, transactionId } = await initiatePayment({
        orderId,
        amount,
      }).unwrap();

      // Open the payment gateway in a new window
      const paymentWindow = window.open(paymentUrl, '_blank');

      // Create a promise that resolves when the payment is complete
      return new Promise((resolve, reject) => {
        // Function to check payment status
        const checkPayment = async () => {
          try {
            const result = await verifyPayment({ transactionId }).unwrap();
            if (['completed', 'failed', 'cancelled'].includes(result.status)) {
              if (paymentWindow) {
                paymentWindow.close();
              }
              resolve(result);
              clearInterval(intervalId);
            }
          } catch (error) {
            reject(error);
            clearInterval(intervalId);
          }
        };

        // Check payment status every 2 seconds
        const intervalId = setInterval(checkPayment, 2000);

        // Clean up if the window is closed manually
        const windowCheckInterval = setInterval(() => {
          if (paymentWindow?.closed) {
            clearInterval(intervalId);
            clearInterval(windowCheckInterval);
            reject(new Error('Payment window closed'));
          }
        }, 500);

        // Set a timeout of 15 minutes
        setTimeout(
          () => {
            clearInterval(intervalId);
            clearInterval(windowCheckInterval);
            if (paymentWindow) {
              paymentWindow.close();
            }
            reject(new Error('Payment timeout'));
          },
          15 * 60 * 1000,
        );
      });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown error occurred');
    }
  };

  return { processPayment };
}
