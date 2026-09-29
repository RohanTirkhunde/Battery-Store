import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Wrench, Phone, MapPin, Car, AlertCircle, CheckCircle2 } from 'lucide-react';

export const EmergencyBreakdownModal: React.FC = () => {
  const { isBreakdownModalOpen, setIsBreakdownModalOpen, requestBreakdownService } = useStore();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [location, setLocation] = useState('');
  const [issueDescription, setIssueDescription] = useState('Car clicked/battery dead, engine will not crank');
  const [submittedRequest, setSubmittedRequest] = useState<any | null>(null);

  if (!isBreakdownModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone || !location) {
      alert('Please provide your name, phone number, and Wagholi location.');
      return;
    }

    const req = requestBreakdownService({
      customerName,
      phone,
      vehicleModel: vehicleModel || 'Automobile / Inverter',
      vehicleNumber,
      location,
      issueDescription,
      urgency: 'immediate'
    });

    setSubmittedRequest(req);
  };

  const handleClose = () => {
    setSubmittedRequest(null);
    setIsBreakdownModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-red-200 overflow-hidden my-8">
        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {submittedRequest ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-xl font-black font-display text-neutral-900">
              Assistance Dispatched!
            </h3>

            <p className="text-sm text-neutral-600">
              Request Ref: <strong className="font-mono text-red-600">{submittedRequest.requestNumber}</strong>
            </p>

            <div className="bg-neutral-50 rounded-xl p-4 text-left text-xs space-y-2 border border-neutral-200">
              <div className="flex justify-between">
                <span className="text-neutral-500">Location:</span>
                <span className="font-semibold text-neutral-900">{submittedRequest.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Vehicle / Unit:</span>
                <span className="font-semibold text-neutral-900">{submittedRequest.vehicleModel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Estimated Arrival:</span>
                <span className="font-bold text-emerald-600">15 - 25 Minutes</span>
              </div>
            </div>

            <div className="bg-red-50 text-red-900 p-3.5 rounded-xl text-xs font-semibold space-y-2">
              <p>Our mobile battery jumpstart technician is en route with booster packs & test meters. Direct emergency line:{' '}
                <a href="tel:+918329838314" className="underline font-bold text-red-700">+91 83298 38314</a>
              </p>
              <a
                href={`https://wa.me/918329838314?text=${encodeURIComponent(`🚨 *EMERGENCY BATTERY BREAKDOWN / JUMPSTART* 🚨\nRequest: ${submittedRequest.requestNumber}\nName: ${submittedRequest.customerName}\nPhone: ${submittedRequest.phone}\nLocation: ${submittedRequest.location}\nVehicle: ${submittedRequest.vehicleModel}\nIssue: ${submittedRequest.issueDescription}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Notify Technician on WhatsApp (+91 83298 38314)</span>
              </a>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
            {/* Header */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-red-600 uppercase tracking-wider">
                <AlertCircle className="w-4 h-4" />
                <span>Wagholi Emergency Mobile Unit</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-display text-neutral-900 mt-1">
                Dead Battery? Request Jumpstart or Replacement
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Stuck on Pune-Nagar Road, Bakori, or anywhere in Wagholi? We bring booster cables, testing kit, or a fresh replacement battery immediately.
              </p>
            </div>

            {/* Inputs */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Rahul Patil"
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-hidden focus:border-red-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Contact Mobile Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 83298 38314"
                    className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-hidden focus:border-red-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Exact Location / Landmark in Wagholi *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Pune-Nagar Road opposite Decathlon / Near Wagheshwar Temple"
                    className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-hidden focus:border-red-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Car / Bike Model
                  </label>
                  <input
                    type="text"
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                    placeholder="e.g. Maruti Swift / Creta"
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-hidden focus:border-red-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Vehicle Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                    placeholder="MH 12 XX 1234"
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-hidden focus:border-red-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Issue Details
                </label>
                <select
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-hidden focus:border-red-500 font-medium"
                >
                  <option value="Car clicked/battery dead, engine will not crank">Car clicked/battery dead, engine will not crank</option>
                  <option value="Battery completely drained overnight (lights left on)">Battery completely drained overnight (lights left on)</option>
                  <option value="Inverter beeping continuously / zero backup">Inverter beeping continuously / zero backup</option>
                  <option value="Need urgent doorstep new battery replacement">Need urgent doorstep new battery replacement</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl transition-colors shadow-md shadow-red-600/20 cursor-pointer text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Wrench className="w-4 h-4" />
                <span>Dispatch Technician Immediately</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
