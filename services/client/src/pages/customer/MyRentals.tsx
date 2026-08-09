import React, { useState } from "react";
import {
  Package,
  Clock,
  ShieldCheck,
  Download,
  ExternalLink,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import Modal from "../../components/Modal";
import { useRentals } from "../../hooks/useRentals";
import { useAuth } from "../../hooks/useAuth";
import { formatCurrency } from "../../utils/formatters";
import { formatDate } from "../../utils/dateHelpers";
import { api } from "../../utils/api";

interface MyRentalsProps {
  setActiveView?: (view: string) => void;
}

export default function MyRentals({ setActiveView }: MyRentalsProps) {
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);
  const [selectedRental, setSelectedRental] = useState<any>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const { rentals, isLoading, error, refetch } = useRentals({ view: "user" });
  const { user } = useAuth();

  const handleExtendRental = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const newEndDate = formData.get("newEndDate") as string;

    try {
      if (selectedRental) {
        await api.rentals.extend?.(selectedRental.id, { end_date: newEndDate });
      }
      setIsExtendModalOpen(false);
      refetch();
      alert("Rental extended successfully!");
    } catch (err: any) {
      alert("Failed to extend rental: " + (err.message || "Unknown error"));
    }
  };

  const handleDownloadInvoice = async (rentalId: string) => {
    try {
      setIsDownloading(true);
      const invoice = await api.rentals.getInvoice(rentalId);

      const blob = new Blob([JSON.stringify(invoice, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${rentalId}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert("Failed to download invoice: " + (err.message || "Unknown error"));
    } finally {
      setIsDownloading(false);
    }
  };

  const handleReturnInstructions = (rentalId: string) => {
    alert(
      `Return instructions for order #${rentalId}: Please return the item to our store by 5:00 PM on the final day.`
    );
  };

  const handleRentAgain = async (productId: string) => {
    try {
      await api.rentals.create({
        product_id: productId,
        user_id: user?.id || "",
        start_date: new Date().toISOString().split("T")[0],
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        total_amount: 0,
        deposit_amount: 0,
      });
      refetch();
      alert("Rental created successfully!");
    } catch (err: any) {
      alert("Failed to rent again: " + (err.message || "Unknown error"));
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-margin-desktop py-8">
        <div className="flex justify-center items-center py-20">
          <div className="animate-pulse text-on-surface-variant">
            Loading rentals...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto px-margin-desktop py-8">
        <div className="text-center py-20">
          <p className="text-danger-red font-bold">{error.message}</p>
          <button
            onClick={refetch}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-margin-desktop py-8">
      {/* Back Button */}
      {setActiveView && (
        <button
          onClick={() => setActiveView("home")}
          className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>
      )}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">
            My Rentals
          </h1>
          <p className="text-on-surface-variant text-sm font-medium mt-1">
            Manage your active rentals and view past orders.
          </p>
        </div>
        <button
          onClick={() => {
            const activeRental = rentals.find((r) => r.status === "active");
            if (activeRental) {
              setSelectedRental(activeRental);
              setIsExtendModalOpen(true);
            } else {
              alert("No active rentals to extend.");
            }
          }}
          className="bg-surface-muted text-primary px-4 py-2 rounded-lg font-bold text-sm hover:bg-primary/10 transition-colors border border-border-standard flex items-center gap-2 shadow-sm"
        >
          <Calendar className="w-4 h-4" /> Extend a Rental
        </button>
      </div>

      {rentals.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-border-standard">
          <p className="text-on-surface-variant font-medium">
            No rentals found. Start renting today!
          </p>
          <button
            onClick={() => (window.location.href = "/catalog")}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90"
          >
            Browse Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            {rentals.map((rental) => {
              const isActive = rental.status === "active";
              const isOverdue = rental.status === "overdue";
              const isReturned = rental.status === "returned";
              const isCancelled = rental.status === "cancelled";

              const endDate = rental.end_date
                ? new Date(rental.end_date)
                : new Date();

              const daysLeft = isActive
                ? Math.max(
                    0,
                    Math.ceil(
                      (endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                    )
                  )
                : 0;

              return (
                <div
                  key={rental.id}
                  className="bg-white rounded-xl border border-border-standard p-6 shadow-sm"
                >
                  <div className="flex justify-between items-center border-b border-border-standard pb-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                          isActive
                            ? "bg-success-teal/10 text-success-teal"
                            : isOverdue
                            ? "bg-danger-red/10 text-danger-red"
                            : isReturned
                            ? "bg-primary/10 text-primary"
                            : isCancelled
                            ? "bg-surface-muted text-on-surface-variant"
                            : "bg-surface-muted text-on-surface-variant"
                        }`}
                      >
                        {isActive
                          ? "Active"
                          : isOverdue
                          ? "Overdue"
                          : isReturned
                          ? "Returned"
                          : isCancelled
                          ? "Cancelled"
                          : "Completed"}
                      </div>
                      <div className="font-mono text-sm text-outline font-medium">
                        Order #{rental.rental_number}
                      </div>
                    </div>
                    {isActive && (
                      <div
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                          daysLeft <= 1
                            ? "bg-danger-red/10 text-danger-red"
                            : daysLeft <= 3
                            ? "bg-warning-amber/10 text-warning-amber"
                            : "bg-success-teal/10 text-success-teal"
                        }`}
                      >
                        <Clock className="w-4 h-4" /> {daysLeft} days remaining
                      </div>
                    )}
                  </div>

                  <div className="flex gap-6">
                    <div className="w-24 h-24 bg-surface-container-low rounded-lg p-2 border border-border-standard shrink-0">
                      <img
                        src={
                          rental.product_image ||
                          "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=200"
                        }
                        alt={rental.product_name}
                        className="w-full h-full object-contain mix-blend-multiply"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-on-surface mb-2">
                        {rental.product_name}
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-outline font-medium mb-1">
                            Rental Period
                          </div>
                          <div className="font-bold text-sm text-on-surface">
                            {formatDate(rental.start_date || "")} -{" "}
                            {formatDate(rental.end_date || "")}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-outline font-medium mb-1">
                            Total Paid
                          </div>
                          <div className="font-bold text-sm text-primary">
                            {formatCurrency(rental.total_amount || 0)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border-standard">
                    <button
                      onClick={() => handleDownloadInvoice(rental.id)}
                      disabled={isDownloading}
                      className="flex items-center gap-2 text-sm font-bold text-on-surface hover:text-primary transition-colors disabled:opacity-50"
                    >
                      <Download className="w-4 h-4" />
                      {isDownloading ? "Downloading..." : "Download Invoice"}
                    </button>
                    <div className="flex-1"></div>
                    {isActive && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedRental(rental);
                            setIsExtendModalOpen(true);
                          }}
                          className="px-4 py-2 border border-border-standard rounded-lg text-sm font-bold text-on-surface hover:bg-surface-muted transition-colors"
                        >
                          Extend
                        </button>
                        <button
                          onClick={() => handleReturnInstructions(rental.id)}
                          className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-opacity-90 transition-opacity"
                        >
                          Return Instructions
                        </button>
                      </>
                    )}
                    {(isReturned || isOverdue) && (
                      <button
                        onClick={() =>
                          rental.product_id && handleRentAgain(rental.product_id)
                        }
                        className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-opacity-90 transition-opacity"
                      >
                        Rent Again
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-6">
            <div className="bg-surface-muted p-6 rounded-xl border border-border-standard">
              <h3 className="font-bold text-lg text-on-surface mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" /> Rental
                Protection
              </h3>
              <p className="text-sm text-on-surface-variant font-medium leading-relaxed mb-4">
                All active rentals are covered by our standard damage waiver. In
                case of accidental damage, your liability is limited.
              </p>
              <a
                href="#"
                className="text-primary font-bold text-sm flex items-center gap-1 hover:underline"
              >
                View coverage details <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <div className="bg-white p-6 rounded-xl border border-border-standard shadow-sm">
              <h3 className="font-bold text-lg text-on-surface mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" /> Return Drop-off
              </h3>
              <p className="text-sm text-on-surface-variant font-medium leading-relaxed mb-4">
                Returns are due by 5:00 PM on the final day of your rental
                period.
              </p>
              <div className="p-3 bg-surface-container rounded-lg border border-border-standard text-sm">
                <div className="font-bold text-on-surface">
                  Odoo Headquarters
                </div>
                <div className="text-on-surface-variant font-medium">
                  123 Business Avenue, Suite 100
                  <br />
                  San Francisco, CA 94107
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={isExtendModalOpen}
        onClose={() => setIsExtendModalOpen(false)}
        title="Extend Rental"
      >
        <form onSubmit={handleExtendRental} className="space-y-4">
          {selectedRental && (
            <div className="bg-surface-muted p-4 rounded-xl border border-border-standard mb-4 flex gap-4 items-center">
              <img
                src={
                  selectedRental.product_image ||
                  "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=200"
                }
                alt={selectedRental.product_name}
                className="w-12 h-12 object-contain mix-blend-multiply"
                referrerPolicy="no-referrer"
              />
              <div>
                <h4 className="font-bold text-sm text-on-surface">
                  {selectedRental.product_name}
                </h4>
                <p className="text-xs text-outline font-medium">
                  Current end date: {formatDate(selectedRental.end_date)}
                </p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-on-surface mb-1">
              New End Date
            </label>
            <input
              required
              type="date"
              name="newEndDate"
              className="w-full px-4 py-2 border border-border-standard rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            />
          </div>

          <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
            <div className="flex justify-between items-center text-sm font-medium mb-2">
              <span className="text-on-surface-variant">
                Extension Cost (Estimated)
              </span>
              <span className="font-bold text-primary">₹150.00</span>
            </div>
            <p className="text-xs text-outline">
              You will be charged when the extension is approved.
            </p>
          </div>

          <div className="pt-4 border-t border-border-standard flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsExtendModalOpen(false)}
              className="px-4 py-2 font-bold text-on-surface-variant hover:bg-surface-muted rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-opacity-90 transition-opacity"
            >
              Request Extension
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}