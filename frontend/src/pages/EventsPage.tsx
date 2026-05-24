import { useState, useEffect, FormEvent } from "react";
import {
  CalendarDays,
  Plus,
  Pencil,
  Trash2,
  Search,
  MapPin,
  Tag,
  Mic2,
  Clock,
} from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import PageHeader from "../components/ui/PageHeader";
import Modal from "../components/ui/Modal";
import ConfirmDelete from "../components/ui/ConfirmDelete";
import EmptyState from "../components/ui/EmptyState";
import { apiClient } from "../lib/api";
import {
  Event,
  CategoryEvent,
  Speaker,
  ApiResponse,
  EventFormData,
} from "../types";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import toast from "react-hot-toast";

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<CategoryEvent[]>([]);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultForm: EventFormData = {
    title: "",
    description: "",
    date: "",
    location: "",
    categoryId: "",
    speakerId: "",
  };

  const [formData, setFormData] = useState<EventFormData>(defaultForm);

  const fetchAll = async () => {
    try {
      const [evtRes, catRes, spkRes] = await Promise.all([
        apiClient.get<ApiResponse<Event[]>>("/events"),
        apiClient.get<ApiResponse<CategoryEvent[]>>("/categories"),
        apiClient.get<ApiResponse<Speaker[]>>("/speakers"),
      ]);
      setEvents(evtRes.data ?? []);
      setCategories(catRes.data ?? []);
      setSpeakers(spkRes.data ?? []);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal memuat data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const openCreate = () => {
    setSelectedEvent(null);
    setFormData(defaultForm);
    setIsFormOpen(true);
  };

  const openEdit = (evt: Event) => {
    setSelectedEvent(evt);
    setFormData({
      title: evt.title,
      description: evt.description,
      date: format(new Date(evt.date), "yyyy-MM-dd'T'HH:mm"),
      location: evt.location,
      categoryId: evt.categoryId,
      speakerId: evt.speakerId,
    });
    setIsFormOpen(true);
  };

  const openDelete = (evt: Event) => {
    setSelectedEvent(evt);
    setIsDeleteOpen(true);
  };

  const handleChange = (
    field: keyof EventFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (selectedEvent) {
        await apiClient.put(`/events/${selectedEvent.id}`, formData);
        toast.success("Event berhasil diperbarui!");
      } else {
        await apiClient.post("/events", formData);
        toast.success("Event berhasil dibuat!");
      }
      setIsFormOpen(false);
      fetchAll();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedEvent) return;
    setIsSubmitting(true);

    try {
      await apiClient.delete(`/events/${selectedEvent.id}`);
      toast.success("Event berhasil dihapus.");
      setIsDeleteOpen(false);
      fetchAll();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menghapus.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = events.filter(
    (e) =>
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.category?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.speaker?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <PageHeader
          title="Event"
          description="Buat dan kelola semua event yang diselenggarakan."
          action={
            <button onClick={openCreate} className="btn-primary">
              <Plus className="w-4 h-4" />
              Tambah Event
            </button>
          }
        />

        <div className="relative mb-5">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            type="text"
            placeholder="Cari event, lokasi, kategori, atau pembicara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-11"
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-52 bg-white rounded-2xl border border-surface-200 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="card">
            <EmptyState
              icon={CalendarDays}
              title="Belum ada event"
              description="Buat event pertama dan pasangkan dengan kategori & pembicara."
              action={
                <button onClick={openCreate} className="btn-primary">
                  <Plus className="w-4 h-4" />
                  Tambah Event
                </button>
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((evt) => (
              <div
                key={evt.id}
                className="card p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="badge bg-brand-50 text-brand-700 flex-shrink-0">
                    <Tag className="w-3 h-3" />
                    {evt.category?.name}
                  </span>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => openEdit(evt)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-surface-400 hover:text-brand-600 hover:bg-brand-50 transition-all"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => openDelete(evt)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-surface-400 hover:text-red-500 hover:bg-red-50 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-display font-semibold text-surface-900 mb-2 leading-snug line-clamp-2">
                  {evt.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-surface-500 font-body line-clamp-2 mb-4 flex-1">
                  {evt.description}
                </p>

                {/* Meta */}
                <div className="space-y-2 pt-3 border-t border-surface-100">
                  <div className="flex items-center gap-2 text-sm text-surface-600">
                    <Clock className="w-3.5 h-3.5 text-surface-400 flex-shrink-0" />
                    <span className="font-body">
                      {format(new Date(evt.date), "dd MMMM yyyy, HH:mm", {
                        locale: localeId,
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-surface-600">
                    <MapPin className="w-3.5 h-3.5 text-surface-400 flex-shrink-0" />
                    <span className="font-body truncate">{evt.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-surface-600">
                    <Mic2 className="w-3.5 h-3.5 text-surface-400 flex-shrink-0" />
                    <span className="font-body">{evt.speaker?.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedEvent ? "Edit Event" : "Tambah Event Baru"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2 font-body">
              Judul Event <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Masukkan judul event..."
              required
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2 font-body">
              Deskripsi <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Deskripsi singkat tentang event ini..."
              required
              rows={3}
              className="input-field resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2 font-body">
                Tanggal & Waktu <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2 font-body">
                Lokasi <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder="Nama gedung, kota..."
                required
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Category Dropdown */}
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2 font-body">
                Kategori <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => handleChange("categoryId", e.target.value)}
                required
                className="input-field appearance-none"
              >
                <option value="" disabled>
                  — Pilih Kategori —
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {categories.length === 0 && (
                <p className="text-xs text-amber-600 mt-1.5 font-body">
                  ⚠ Belum ada kategori. Tambahkan kategori terlebih dahulu.
                </p>
              )}
            </div>

            {/* Speaker Dropdown */}
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2 font-body">
                Pembicara <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.speakerId}
                onChange={(e) => handleChange("speakerId", e.target.value)}
                required
                className="input-field appearance-none"
              >
                <option value="" disabled>
                  — Pilih Pembicara —
                </option>
                {speakers.map((spk) => (
                  <option key={spk.id} value={spk.id}>
                    {spk.name} — {spk.expertise}
                  </option>
                ))}
              </select>
              {speakers.length === 0 && (
                <p className="text-xs text-amber-600 mt-1.5 font-body">
                  ⚠ Belum ada pembicara. Tambahkan pembicara terlebih dahulu.
                </p>
              )}
            </div>
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
                : selectedEvent
                ? "Perbarui Event"
                : "Buat Event"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDelete
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        itemName={selectedEvent?.title ?? ""}
        isLoading={isSubmitting}
      />
    </DashboardLayout>
  );
};

export default EventsPage;
