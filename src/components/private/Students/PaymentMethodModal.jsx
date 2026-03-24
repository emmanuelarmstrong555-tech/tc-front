import React from "react";
import Paystack from "../../Paystack";

export default function PaymentMethodModal({ 
  isOpen, 
  onClose, 
  selectedDuration, 
  amount, 
  email,
  selectedMethod, 
  setSelectedMethod, 
  onContinue, 
  loading 
}) {
  if (!isOpen) return null;

  const paymentMethods = [
    { id: "paystack", name: "Paystack" },
    { id: "paypal", name: "Paypal" },
    { id: "interswitch", name: "Inter-switch" },
  ];

  const reference = `TC-PAY-${Date.now()}`;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-[40px] p-8 md:p-10 w-[90%] max-w-md shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors font-bold text-gray-400">✕</button>
        <h2 className="text-2xl font-black text-[#0F2843] mb-2 text-center uppercase tracking-tighter italic">Payment Method</h2>
        <p className="text-gray-400 text-[10px] font-bold text-center uppercase tracking-widest mb-8">Choose your preferred gateway</p>
        
        <div className="bg-gray-50 border border-gray-100 rounded-3xl p-6 mb-8 flex justify-between items-center">
          <div className="flex flex-col">
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Selected Plan</span>
             <span className="text-sm font-black text-[#0F2843] uppercase italic">{selectedDuration || "Termwise"}</span>
          </div>
          <div className="text-right">
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Amount</span>
             <span className="text-xl font-black text-[#0F2843]">₦{amount.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex flex-col space-y-3 mb-10">
          {paymentMethods.map((method) => (
            <button 
              key={method.id} 
              onClick={() => setSelectedMethod(method.id)} 
              className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl border-2 transition-all duration-300 ${selectedMethod === method.id ? "border-[#0F2843] bg-gray-50/50 shadow-sm" : "border-gray-100 hover:border-[#0F2843]/10 bg-white"}`}
            >
              <span className={`font-black text-xs uppercase tracking-widest ${selectedMethod === method.id ? "text-[#0F2843]" : "text-gray-400"}`}>{method.name}</span>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedMethod === method.id ? "border-[#0F2843] bg-[#0F2843]" : "border-gray-100"}`}>
                {selectedMethod === method.id && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
              </div>
            </button>
          ))}
        </div>

        {selectedMethod === "paystack" ? (
          <Paystack
            amount={amount}
            email={email}
            reference={reference}
            onSuccess={onContinue}
            onClose={() => {}}
          />
        ) : (
          <button 
            onClick={onContinue} 
            disabled={loading || !selectedMethod} 
            className={`w-full py-5 px-6 rounded-2xl font-black text-white shadow-xl transition-all duration-300 transform active:scale-[0.98] ${loading || !selectedMethod ? "bg-gray-200 cursor-not-allowed shadow-none" : "bg-[#0F2843] hover:shadow-[#0F284344] hover:-translate-y-0.5"}`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing...</span>
              </div>
            ) : "Complete Payment"}
          </button>
        )}
      </div>
    </div>
  );
}
