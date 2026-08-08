import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit2,
  Trash2,
} from "lucide-react";
import Modal from "../../components/Modal";
import { api } from "../../utils/api";
import { Product } from "../../types";

export default function Inventory() {
  const [inventory, setInventory] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sku: "",
    category: "Electronics",
    pricePerDay: 0,
    depositAmount: 0,
    stockQuantity: 0,
  });

  // Fetch inventory on mount
  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.products.getAll();
      setInventory(response.data || []);
    } catch (err) {
      console.error("Failed to fetch inventory:", err);
      setError("Failed to load inventory. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter inventory by search term
  const filteredInventory = inventory.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.products.create({
        name: formData.name,
        description: formData.description || "",
        sku: formData.sku,
        category: formData.category,
        pricePerDay: formData.pricePerDay,
        depositAmount: formData.depositAmount,
        stockQuantity: formData.stockQuantity,
      });
      setIsAddModalOpen(false);
      await fetchInventory();
      setFormData({
        name: "",
        description: "",
        sku: "",
        category: "Electronics",
        pricePerDay: 0,
        depositAmount: 0,
        stockQuantity: 0,
      });
    } catch (err) {
      alert(
        "Failed to add item: " +
          (err instanceof Error ? err.message : "Unknown error"),
      );
    }
  };

  const handleEditItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    try {
      await api.products.update(selectedItem.id, {
        name: formData.name,
        description: formData.description || "",
        pricePerDay: formData.pricePerDay,
        depositAmount: formData.depositAmount,
      });
      setIsEditModalOpen(false);
      await fetchInventory();
      setSelectedItem(null);
    } catch (err) {
      alert(
        "Failed to update item: " +
          (err instanceof Error ? err.message : "Unknown error"),
      );
    }
  };

  const handleDeleteItem = async () => {
    if (!selectedItem) return;
    try {
      await api.products.delete(selectedItem.id);
      setIsDeleteModalOpen(false);
      await fetchInventory();
      setSelectedItem(null);
    } catch (err) {
      alert(
        "Failed to delete item: " +
          (err instanceof Error ? err.message : "Unknown error"),
      );
    }
  };

  const openEditModal = (item: Product) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      description: item.description || "",
      sku: item.sku || "",
      category: item.category || "Electronics",
      pricePerDay: item.pricePerDay,
      depositAmount: item.depositAmount ?? 0,
      stockQuantity: item.stockQuantity ?? 0,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (item: Product) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-margin-desktop py-8">
        <div className="flex justify-center items-center py-20">
          <div className="animate-pulse text-on-surface-variant">
            Loading inventory...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto px-margin-desktop py-8">
        <div className="text-center py-20">
          <p className="text-danger-red font-bold">{error}</p>
          <button
            onClick={fetchInventory}
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">
            Inventory Management
          </h1>
          <p className="text-on-surface-variant font-medium text-sm mt-1">
            Manage your rental equipment and stock levels.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-primary text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm active:scale-95"
        >
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border-standard overflow-hidden">
        <div className="p-4 border-b border-border-standard flex flex-col sm:flex-row justify-between items-center gap-4 bg-surface-muted/50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
            <input
              className="w-full pl-9 pr-4 py-2 bg-white border border-border-standard rounded-lg font-medium text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-outline shadow-sm"
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="w-full sm:w-auto px-4 py-2 border border-border-standard rounded-lg font-bold text-sm text-on-surface hover:bg-surface-muted transition-colors flex items-center justify-center gap-2 bg-white shadow-sm">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-muted/50 border-b border-border-standard">
              <tr>
                <th className="px-6 py-3 font-semibold text-on-surface-variant text-xs uppercase tracking-wider">
                  Item Name
                </th>
                <th className="px-6 py-3 font-semibold text-on-surface-variant text-xs uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 font-semibold text-on-surface-variant text-xs uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 font-semibold text-on-surface-variant text-xs uppercase tracking-wider">
                  Price/Day
                </th>
                <th className="px-6 py-3 font-semibold text-on-surface-variant text-xs uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 font-semibold text-on-surface-variant text-xs uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-standard">
              {filteredInventory.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-on-surface-variant"
                  >
                    No items found
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => {
                  const stockQuantity = item.stockQuantity ?? 0;
                  const isAvailable = stockQuantity > 0;
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-primary/5 transition-colors group"
                    >
                      <td className="px-6 py-4 font-bold text-on-surface text-sm">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 text-on-surface-variant font-medium text-sm">
                        {item.category}
                      </td>
                      <td className="px-6 py-4 font-mono text-sm">
                        {stockQuantity}
                      </td>
                      <td className="px-6 py-4 font-bold text-on-surface text-sm">
                        ₹{item.pricePerDay}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1.5 rounded-md text-xs font-bold ${isAvailable ? "bg-success-teal/10 text-success-teal" : "bg-danger-red/10 text-danger-red"}`}
                        >
                          {isAvailable ? "Available" : "Out of Stock"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                            title="Edit Item"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(item)}
                            className="p-1.5 text-on-surface-variant hover:text-danger-red hover:bg-danger-red/10 rounded-md transition-colors"
                            title="Delete Item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Equipment"
      >
        <form onSubmit={handleAddItem} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-bold text-on-surface mb-1">
                Equipment Name
              </label>
              <input
                required
                type="text"
                className="w-full px-4 py-2 border border-border-standard rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="e.g. Sony Alpha a7 IV"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-bold text-on-surface mb-1">
                Description
              </label>
              <textarea
                rows={2}
                className="w-full px-4 py-2 border border-border-standard rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="Brief description..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-on-surface mb-1">
                SKU
              </label>
              <input
                required
                type="text"
                className="w-full px-4 py-2 border border-border-standard rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="e.g. SONY-001"
                value={formData.sku}
                onChange={(e) =>
                  setFormData({ ...formData, sku: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-on-surface mb-1">
                Category
              </label>
              <select
                className="w-full px-4 py-2 border border-border-standard rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option>Electronics</option>
                <option>Construction</option>
                <option>Audio/Visual</option>
                <option>Lighting</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-on-surface mb-1">
                Daily Rate (₹)
              </label>
              <input
                required
                type="number"
                min="0"
                className="w-full px-4 py-2 border border-border-standard rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="0"
                value={formData.pricePerDay}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    pricePerDay: Number(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-on-surface mb-1">
                Deposit Amount (₹)
              </label>
              <input
                required
                type="number"
                min="0"
                className="w-full px-4 py-2 border border-border-standard rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="0"
                value={formData.depositAmount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    depositAmount: Number(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-on-surface mb-1">
                Initial Stock
              </label>
              <input
                required
                type="number"
                min="0"
                className="w-full px-4 py-2 border border-border-standard rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="0"
                value={formData.stockQuantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stockQuantity: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>
          <div className="pt-4 border-t border-border-standard flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 font-bold text-on-surface-variant hover:bg-surface-muted rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-opacity-90 transition-opacity"
            >
              Add Item
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Equipment"
      >
        <form onSubmit={handleEditItem} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-bold text-on-surface mb-1">
                Equipment Name
              </label>
              <input
                required
                type="text"
                className="w-full px-4 py-2 border border-border-standard rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-bold text-on-surface mb-1">
                Description
              </label>
              <textarea
                rows={2}
                className="w-full px-4 py-2 border border-border-standard rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-on-surface mb-1">
                Daily Rate (₹)
              </label>
              <input
                required
                type="number"
                min="0"
                className="w-full px-4 py-2 border border-border-standard rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                value={formData.pricePerDay}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    pricePerDay: Number(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-on-surface mb-1">
                Deposit Amount (₹)
              </label>
              <input
                required
                type="number"
                min="0"
                className="w-full px-4 py-2 border border-border-standard rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                value={formData.depositAmount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    depositAmount: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>
          <div className="pt-4 border-t border-border-standard flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 font-bold text-on-surface-variant hover:bg-surface-muted rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-opacity-90 transition-opacity"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
      >
        <div className="space-y-4">
          <p className="text-on-surface-variant font-medium">
            Are you sure you want to delete{" "}
            <span className="font-bold text-on-surface">
              {selectedItem?.name}
            </span>
            ? This action cannot be undone.
          </p>
          <div className="pt-4 border-t border-border-standard flex justify-end gap-3">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 font-bold text-on-surface-variant hover:bg-surface-muted rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteItem}
              className="px-6 py-2 bg-danger-red text-white font-bold rounded-lg hover:bg-opacity-90 transition-opacity"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
