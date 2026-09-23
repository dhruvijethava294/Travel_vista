// =========================================================================
// TravelVista - Tourism Package Portal (MCA Academic Project)
// Component: PaymentModal.jsx
// Description: Interactive Demo Payment Gateway Simulator supporting
// Credit/Debit Cards, UPI / QR Code, Net Banking, and Pay on Arrival.
// =========================================================================

import { useState } from "react";
import {
  CreditCard,
  QrCode,
  Building,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Sparkles,
  Smartphone,
  X,
} from "lucide-react";

function PaymentModal({ isOpen, onClose, amount, itemTitle, onPaymentSuccess }) {
  const [paymentMethod, setPaymentMethod] = useState("card"); // 'card' | 'upi' | 'netbanking' | 'arrival'
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState("");

  // Card Form State
  const [cardNumber, setCardNumber] = useState("4532 8921 4321 9820");
  const [cardHolder, setCardHolder] = useState("DHRUVI PATEL");
  const [expiry, setExpiry] = useState("12/28");
  const [cvv, setCvv] = useState("888");

  // UPI State
  const [upiId, setUpiId] = useState("traveler@okhdfcbank");

  // Net Banking State
  const [selectedBank, setSelectedBank] = useState("HDFC Bank");

  if (!isOpen) return null;

  // 1-Click Demo Fill Helpers
  const handleAutoFillCard = () => {
    setCardNumber("4111 2222 3333 4444");
    setCardHolder("DHRUVI PATEL");
    setExpiry("08/29");
    setCvv("123");
  };

  const handleAutoFillUpi = () => {
    setUpiId("travelvista.pay@okhdfcbank");
  };

  // Process Demo Payment
  const handleProcessPayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setProcessingStep("Connecting to 256-Bit SSL Payment Gateway...");

    setTimeout(() => {
      setProcessingStep("Authorizing transaction with issuing bank...");
    }, 1000);

    setTimeout(() => {
      setProcessingStep("Payment Verified & Approved!");
    }, 2000);

    setTimeout(() => {
      const generatedTxnId = "TXN" + Math.floor(10000000 + Math.random() * 90000000);
      let methodLabel = "Credit/Debit Card";
      if (paymentMethod === "upi") methodLabel = "UPI / QR Code";
      else if (paymentMethod === "netbanking") methodLabel = `Net Banking (${selectedBank})`;
      else if (paymentMethod === "arrival") methodLabel = "Cash on Arrival";

      setIsProcessing(false);
      onPaymentSuccess({
        paymentMethod: methodLabel,
        transactionId: generatedTxnId,
        paymentStatus: "paid",
      });
    }, 2600);
  };

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(15, 23, 42, 0.85)", zIndex: 1070 }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          {/* Header */}
          <div className="modal-header bg-dark text-white py-3 px-4">
            <div className="d-flex align-items-center gap-2">
              <ShieldCheck className="text-success" size={24} />
              <div>
                <h5 className="modal-title brand-font text-white mb-0">
                  TravelVista Secure Payment Gateway
                </h5>
                <small className="text-secondary">Demo Payment Simulator (MCA Project)</small>
              </div>
            </div>
            {!isProcessing && (
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
                aria-label="Close"
              ></button>
            )}
          </div>

          <div className="modal-body p-4">
            {isProcessing ? (
              /* Processing Screen */
              <div className="text-center py-5">
                <div className="spinner-border text-primary mb-3" style={{ width: "3.5rem", height: "3.5rem" }} role="status"></div>
                <h4 className="fw-bold text-dark mb-2">Processing Payment...</h4>
                <p className="text-primary fw-semibold">{processingStep}</p>
                <span className="small text-muted d-block mt-3">
                  🔒 Please do not refresh or close this window
                </span>
              </div>
            ) : (
              <div>
                {/* Amount Banner */}
                <div className="bg-light p-3 rounded-4 mb-4 d-flex justify-content-between align-items-center border">
                  <div>
                    <span className="text-muted small d-block">Booking Reservation:</span>
                    <strong className="text-dark">{itemTitle}</strong>
                  </div>
                  <div className="text-end">
                    <span className="text-muted small d-block">Amount to Pay:</span>
                    <span className="fs-4 fw-bold text-primary brand-font">
                      ₹{amount?.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Payment Method Selector Tabs */}
                <div className="row g-2 mb-4">
                  <div className="col-3">
                    <button
                      type="button"
                      className={`btn w-100 py-3 d-flex flex-column align-items-center gap-1 rounded-3 ${
                        paymentMethod === "card"
                          ? "btn-primary text-white shadow-sm fw-bold"
                          : "btn-outline-secondary"
                      }`}
                      onClick={() => setPaymentMethod("card")}
                    >
                      <CreditCard size={20} />
                      <span className="small">Card</span>
                    </button>
                  </div>

                  <div className="col-3">
                    <button
                      type="button"
                      className={`btn w-100 py-3 d-flex flex-column align-items-center gap-1 rounded-3 ${
                        paymentMethod === "upi"
                          ? "btn-primary text-white shadow-sm fw-bold"
                          : "btn-outline-secondary"
                      }`}
                      onClick={() => setPaymentMethod("upi")}
                    >
                      <QrCode size={20} />
                      <span className="small">UPI / QR</span>
                    </button>
                  </div>

                  <div className="col-3">
                    <button
                      type="button"
                      className={`btn w-100 py-3 d-flex flex-column align-items-center gap-1 rounded-3 ${
                        paymentMethod === "netbanking"
                          ? "btn-primary text-white shadow-sm fw-bold"
                          : "btn-outline-secondary"
                      }`}
                      onClick={() => setPaymentMethod("netbanking")}
                    >
                      <Building size={20} />
                      <span className="small">Net Banking</span>
                    </button>
                  </div>

                  <div className="col-3">
                    <button
                      type="button"
                      className={`btn w-100 py-3 d-flex flex-column align-items-center gap-1 rounded-3 ${
                        paymentMethod === "arrival"
                          ? "btn-primary text-white shadow-sm fw-bold"
                          : "btn-outline-secondary"
                      }`}
                      onClick={() => setPaymentMethod("arrival")}
                    >
                      <DollarSign size={20} />
                      <span className="small">Pay on Arrival</span>
                    </button>
                  </div>
                </div>

                <form onSubmit={handleProcessPayment}>
                  {/* Tab 1: Card Payment */}
                  {paymentMethod === "card" && (
                    <div className="card border-0 bg-light p-3 rounded-4 mb-4">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="fw-bold small text-muted">Enter Card Details</span>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary py-0 px-2 small d-flex align-items-center gap-1"
                          onClick={handleAutoFillCard}
                        >
                          <Sparkles size={12} /> Auto-Fill Demo Card
                        </button>
                      </div>

                      <div className="mb-3">
                        <label className="form-label small text-muted">Card Number</label>
                        <div className="input-group">
                          <span className="input-group-text bg-white border-end-0">
                            <CreditCard size={16} className="text-primary" />
                          </span>
                          <input
                            type="text"
                            className="form-control border-start-0 font-monospace"
                            placeholder="4532 8921 4321 9820"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="row g-3 mb-2">
                        <div className="col-md-6">
                          <label className="form-label small text-muted">Cardholder Name</label>
                          <input
                            type="text"
                            className="form-control text-uppercase"
                            placeholder="e.g. DHRUVI PATEL"
                            value={cardHolder}
                            onChange={(e) => setCardHolder(e.target.value)}
                            required
                          />
                        </div>
                        <div className="col-md-3 col-6">
                          <label className="form-label small text-muted">Expiry (MM/YY)</label>
                          <input
                            type="text"
                            className="form-control text-center font-monospace"
                            placeholder="12/28"
                            value={expiry}
                            onChange={(e) => setExpiry(e.target.value)}
                            required
                          />
                        </div>
                        <div className="col-md-3 col-6">
                          <label className="form-label small text-muted">CVV / CVC</label>
                          <input
                            type="password"
                            maxLength="4"
                            className="form-control text-center font-monospace"
                            placeholder="•••"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab 2: UPI / QR Code */}
                  {paymentMethod === "upi" && (
                    <div className="card border-0 bg-light p-4 rounded-4 mb-4 text-center">
                      <div className="row align-items-center g-4">
                        <div className="col-md-5 text-center border-end">
                          <div className="p-3 bg-white d-inline-block rounded-3 shadow-sm border mb-2">
                            {/* QR Code generator via API */}
                            <img
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=travelvista@upi&pn=TravelVista&am=${amount}&cu=INR`}
                              alt="UPI QR Code"
                              className="img-fluid rounded"
                              style={{ width: "140px", height: "140px" }}
                            />
                          </div>
                          <span className="small text-muted d-block fw-bold">
                            Scan with GPay / PhonePe / Paytm
                          </span>
                        </div>

                        <div className="col-md-7 text-start">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="fw-bold small text-muted">Or Pay using UPI ID:</span>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary py-0 px-2 small d-flex align-items-center gap-1"
                              onClick={handleAutoFillUpi}
                            >
                              <Sparkles size={12} /> Auto-Fill
                            </button>
                          </div>
                          <div className="input-group mb-3">
                            <span className="input-group-text bg-white border-end-0">
                              <Smartphone size={16} className="text-primary" />
                            </span>
                            <input
                              type="text"
                              className="form-control border-start-0"
                              placeholder="username@okhdfcbank"
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                              required
                            />
                          </div>
                          <p className="small text-muted mb-0">
                            A demo payment request will be simulated and verified instantly.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab 3: Net Banking */}
                  {paymentMethod === "netbanking" && (
                    <div className="card border-0 bg-light p-4 rounded-4 mb-4">
                      <h6 className="fw-bold small text-muted mb-3">Select Popular Bank:</h6>
                      <div className="row g-2 mb-3">
                        {["HDFC Bank", "State Bank of India (SBI)", "ICICI Bank", "Axis Bank", "Kotak Mahindra"].map(
                          (bank) => (
                            <div className="col-md-6" key={bank}>
                              <div
                                className={`card p-3 rounded-3 cursor-pointer border ${
                                  selectedBank === bank
                                    ? "border-primary border-2 bg-white shadow-sm"
                                    : "bg-white"
                                }`}
                                style={{ cursor: "pointer" }}
                                onClick={() => setSelectedBank(bank)}
                              >
                                <span className="fw-semibold text-dark small">{bank}</span>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tab 4: Pay on Arrival */}
                  {paymentMethod === "arrival" && (
                    <div className="card border-0 bg-light p-4 rounded-4 mb-4">
                      <div className="d-flex align-items-start gap-3">
                        <div className="p-3 bg-success bg-opacity-10 text-success rounded-circle">
                          <DollarSign size={24} />
                        </div>
                        <div>
                          <h6 className="fw-bold text-dark mb-1">Pay on Tour Departure / Arrival</h6>
                          <p className="text-muted small mb-2">
                            You can confirm this reservation today with zero advance payment. You will pay the total amount directly at the hotel reception or tour guide upon arrival.
                          </p>
                          <span className="badge bg-success">Guaranteed Spot Reservation</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-primary-custom w-100 py-3 fw-bold fs-6 d-flex align-items-center justify-content-center gap-2"
                  >
                    <Lock size={18} />
                    <span>Pay ₹{amount?.toLocaleString()} & Confirm Booking</span>
                  </button>

                  <div className="text-center mt-3">
                    <span className="text-muted small d-flex align-items-center justify-content-center gap-1">
                      <ShieldCheck size={14} className="text-success" />
                      256-Bit SSL Encrypted Demo Payment Gateway
                    </span>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentModal;
