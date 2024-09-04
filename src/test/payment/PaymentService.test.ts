import { PaymentDetails, PaymentMethod } from '../../app/payment/PaymentDetails';
import { PaymentService } from '../../app/payment/PaymentService';

describe('Payment Service', () => {
  const paymentAdapterMock = {
    processPayment: jest.fn(),
  };
  let paymentService: PaymentService;

  beforeEach(() => {
    paymentService = new PaymentService(paymentAdapterMock);
  });

  test('should successfully process a valid payment', () => {
    // Arrange
    //TODO: Create paymentDetails object initialized with fake data
    const paymentDetails: PaymentDetails = {amount: 100.50,currency: "USD",method: PaymentMethod.CreditCard,cardNumber: "1234-5678-9012-3456" };

    //TODO: Create mockProcessPaymentResponse object containing success status and a fake transactiondId
    const mockProcessPaymentResponse={ status: 'success', transactionId: 'txn_1234567890' };
    //TODO: Mock processPayment implementation
    paymentAdapterMock.processPayment.mockImplementation((paymentDetails:PaymentDetails) => mockProcessPaymentResponse);
    // Act
    const result = paymentService.makePayment(paymentDetails);
    // Assert
    // Check the returned result is equal to the success message returned by makePayment with thefake  transactionId you have defined in mockProcessPaymentResponse
    expect(result).toEqual(`Payment successful. Transaction ID: txn_1234567890`);
    // Check that processPayment inside makePayment has been called with paymentDetails
    expect(paymentAdapterMock.processPayment).toHaveBeenCalledWith(paymentDetails); 
  });

  test('should throw an error for payment failure', () => {
    // Arrange
    //TODO: Create paymentDetails object initialized with fake data
    const paymentDetails: PaymentDetails = {amount: 150.60,currency: "TND",method: PaymentMethod.CreditCard,cardNumber: "123456789012" };
    //TODO: Create mockProcessPaymentResponse object containing failure status
    const mockProcessPaymentResponse={ status: 'failure' ,error:'Payment was declined'};
    //TODO: Mock processPayment implementation
    paymentAdapterMock.processPayment.mockImplementation(() => mockProcessPaymentResponse);
    // Act & Assert
    expect(() => paymentService.makePayment(paymentDetails)).toThrow('Payment failed');
  });

  test('should throw an error for invalid payment amount', () => {
    // Arrange
    //TODO: Create paymentDetails object initialized with fake data where amount should be negative or undefined
    const paymentDetails: PaymentDetails = {amount: -100.50,currency: "USD",method: PaymentMethod.CreditCard,cardNumber: "1234-5678-9012-3456" };
    // Act & Assert
    expect(() => paymentService.makePayment(paymentDetails)).toThrow('Invalid payment amount');
  });
});
