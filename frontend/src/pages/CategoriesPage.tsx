import { useState, useEffect, FormEvent } from "react";
import { Tag, Plus, Pencil, Trash2, Search } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import PageHeader from "../components/ui/PageHeader";
import Modal from "../components/ui/Modal";
import ConfirmDelete from "../components/ui/ConfirmDelete";
import EmptyState from "../components/ui/EmptyState";
import { apiClient } from "../lib/api";
import { CategoryEvent, ApiResponse, CategoryFormData } from "../types";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import toast from "react-hot-toast";

const CategoriesPage = () => {
  const [categories, setCategories] = useState<CategoryEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryEvent | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState<CategoryFormData>({ name: "" });

  const fetchCategories = async () => {
    try {
      const res = await apiClient.get<ApiResponse<CategoryEvent[]>>("/categories");
      setCategories(res.data ?? []);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal memuat kategori.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreate = () => {
    setSelectedCategory(null);
    setFormData({ name: "" });
    setIsFormOpen(true);
  };

  const openEdit = (cat: CategoryEvent) => {
    setSelectedCategory(cat);
    setFormData({ name: cat.name });
    setIsFormOpen(true);
  };

  const openDelete = (cat: CategoryEvent) => {
    setSelectedCategory(cat);
    setIsDeleteOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (selectedCategory) {
        await apiClient.put(`/categories/${selectedCategory.id}`, formData);
        toast.success("Kategori berhasil diperbarui!");
      } else {
        await apiClient.post("/categories", formData);
        toast.success("Kategori berhasil ditambahkan!");
      }
      setIsFormOpen(false);
      fetchCategories();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;
    setIsSubmitting(true);

    try {
      await apiClient.delete(`/categories/${selectedCategory.id}`);
      toast.success("Kategori berhasil dihapus.");
      setIsDeleteOpen(false);
      fetchCategories();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menghapus.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <PageHeader
          title="Kategori Event"
          description="Kelola kategori untuk mengklasifikasikan event Anda."
          action={
            <button onClick={openCreate} className="btn-primary">
              <Plus className="w-4 h-4" />
              Tambah Kategori
            </button>
          }
        />

        {/* Search */}
        <div className="relative mb-5">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            type="text"
            placeholder="Cari kategori..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-11"
          />
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-14 bg-surface-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={Tag}
              title="Belum ada kategori"
              description="Tambahkan kategori pertama untuk mengklasifikasikan event."
              action={
                <button onClick={openCreate} className="btn-primary">
                  <Plus className="w-4 h-4" />
                  Tambah Kategori
                </button>
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-surface-50 border-b border-surface-200">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-surface-500 uppercase tracking-wide font-display">
                      No
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-surface-500 uppercase tracking-wide font-display">
                      Nama Kategori
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-surface-500 uppercase tracking-wide font-display">
                      Jumlah Event
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-surface-500 uppercase tracking-wide font-display">
                      Dibuat
                    </th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-surface-500 uppercase tracking-wide font-display">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100">
                  {filtered.map((cat, idx) => (
                    <tr
                      key={cat.id}
                      className="hover:bg-surface-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-surface-500 font-mono">
                        {idx + 1}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-violet-50 rounded-lg flex items-center justify-center">
                            <Tag className="w-3.5 h-3.5 text-violet-600" />
                          </div>
                          <span className="font-medium text-surface-900 font-body">
                            {cat.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="badge bg-brand-50 text-brand-700">
                          {cat._count?.events ?? 0} event
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-surface-500 font-body">
                        {format(new Date(cat.createdAt), "dd MMM yyyy", {
                          locale: localeId,
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEdit(cat)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-surface-400 hover:text-brand-600 hover:bg-brand-50 transition-all"
                            title="Edit"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => openDelete(cat)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-surface-400 hover:text-red-500 hover:bg-red-50 transition-all"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedCategory ? "Edit Kategori" : "Tambah Kategori Baru"}
        size="sm"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2 font-body">
              Nama Kategori <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ name: e.target.value })}
              placeholder="Contoh: Teknologi, Bisnis, Pendidikan..."
              required
              className="input-field"
              autoFocus
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="btn-secondary flex-1"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex-1 justify-center"
            >
              {isSubmitting
                ? "Menyimpan..."
                : selectedCategory
                ? "Perbarui"
                : "Simpan"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete */}
      <ConfirmDelete
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        itemName={selectedCategory?.name ?? ""}
        isLoading={isSubmitting}
      />
    </DashboardLayout>
  );
};

export default CategoriesPage;
