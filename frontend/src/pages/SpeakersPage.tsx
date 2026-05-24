import { useState, useEffect, FormEvent } from "react";
import { Mic2, Plus, Pencil, Trash2, Search, Mail, Cpu } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import PageHeader from "../components/ui/PageHeader";
import Modal from "../components/ui/Modal";
import ConfirmDelete from "../components/ui/ConfirmDelete";
import EmptyState from "../components/ui/EmptyState";
import { apiClient } from "../lib/api";
import { Speaker, ApiResponse, SpeakerFormData } from "../types";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import toast from "react-hot-toast";

const SpeakersPage = () => {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<SpeakerFormData>({
    name: "",
    expertise: "",
    email: "",
  });

  const fetchSpeakers = async () => {
    try {
      const res = await apiClient.get<ApiResponse<Speaker[]>>("/speakers");
      setSpeakers(res.data ?? []);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal memuat data pembicara.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSpeakers();
  }, []);

  const openCreate = () => {
    setSelectedSpeaker(null);
    setFormData({ name: "", expertise: "", email: "" });
    setIsFormOpen(true);
  };

  const openEdit = (spk: Speaker) => {
    setSelectedSpeaker(spk);
    setFormData({ name: spk.name, expertise: spk.expertise, email: spk.email });
    setIsFormOpen(true);
  };

  const openDelete = (spk: Speaker) => {
    setSelectedSpeaker(spk);
    setIsDeleteOpen(true);
  };

  const handleChange = (field: keyof SpeakerFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (selectedSpeaker) {
        await apiClient.put(`/speakers/${selectedSpeaker.id}`, formData);
        toast.success("Data pembicara berhasil diperbarui!");
      } else {
        await apiClient.post("/speakers", formData);
        toast.success("Pembicara berhasil ditambahkan!");
      }
      setIsFormOpen(false);
      fetchSpeakers();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedSpeaker) return;
    setIsSubmitting(true);

    try {
      await apiClient.delete(`/speakers/${selectedSpeaker.id}`);
      toast.success("Pembicara berhasil dihapus.");
      setIsDeleteOpen(false);
      fetchSpeakers();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menghapus.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = speakers.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.expertise.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <PageHeader
          title="Pembicara"
          description="Kelola data pembicara yang akan mengisi event Anda."
          action={
            <button onClick={openCreate} className="btn-primary">
              <Plus className="w-4 h-4" />
              Tambah Pembicara
            </button>
          }
        />

        <div className="relative mb-5">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            type="text"
            placeholder="Cari nama, keahlian, atau email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-11"
          />
        </div>

        <div className="card overflow-hidden">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-surface-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={Mic2}
              title="Belum ada pembicara"
              description="Tambahkan pembicara yang akan mengisi acara event."
              action={
                <button onClick={openCreate} className="btn-primary">
                  <Plus className="w-4 h-4" />
                  Tambah Pembicara
                </button>
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-surface-50 border-b border-surface-200">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-surface-500 uppercase tracking-wide font-display">No</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-surface-500 uppercase tracking-wide font-display">Nama</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-surface-500 uppercase tracking-wide font-display">Keahlian</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-surface-500 uppercase tracking-wide font-display">Email</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-surface-500 uppercase tracking-wide font-display">Event</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-surface-500 uppercase tracking-wide font-display">Dibuat</th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-surface-500 uppercase tracking-wide font-display">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100">
                  {filtered.map((spk, idx) => (
                    <tr key={spk.id} className="hover:bg-surface-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm text-surface-500 font-mono">{idx + 1}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-blue-700 font-semibold text-sm font-display">
                              {spk.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="font-medium text-surface-900 font-body">{spk.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <Cpu className="w-3.5 h-3.5 text-surface-400 flex-shrink-0" />
                          <span className="text-sm text-surface-700 font-body">{spk.expertise}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-surface-400 flex-shrink-0" />
                          <span className="text-sm text-surface-600 font-mono">{spk.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="badge bg-blue-50 text-blue-700">
                          {spk._count?.events ?? 0} event
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-surface-500 font-body">
                        {format(new Date(spk.createdAt), "dd MMM yyyy", { locale: localeId })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEdit(spk)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-surface-400 hover:text-brand-600 hover:bg-brand-50 transition-all"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => openDelete(spk)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-surface-400 hover:text-red-500 hover:bg-red-50 transition-all"
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
        title={selectedSpeaker ? "Edit Pembicara" : "Tambah Pembicara Baru"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2 font-body">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Masukkan nama lengkap..."
              required
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2 font-body">
              Keahlian / Bidang <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.expertise}
              onChange={(e) => handleChange("expertise", e.target.value)}
              placeholder="Contoh: Software Engineering, Data Science..."
              required
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2 font-body">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="nama@email.com"
              required
              className="input-field"
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
                : selectedSpeaker
                ? "Perbarui"
                : "Simpan"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDelete
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        itemName={selectedSpeaker?.name ?? ""}
        isLoading={isSubmitting}
      />
    </DashboardLayout>
  );
};

export default SpeakersPage;
