import { AlertTriangle, Trash2 } from "lucide-react";
import Modal from "./Modal";

interface ConfirmDeleteProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  isLoading?: boolean;
}

const ConfirmDelete = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  isLoading = false,
}: ConfirmDeleteProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Konfirmasi Hapus" size="sm">
      <div className="text-center">
        <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-7 h-7 text-red-500" />
        </div>
        <p className="text-surface-700 font-body mb-1">
          Yakin ingin menghapus
        </p>
        <p className="text-surface-900 font-semibold font-display mb-2">
          "{itemName}"
        </p>
        <p className="text-sm text-surface-500 mb-6">
          Tindakan ini tidak dapat dibatalkan.
        </p>

        <div className="flex gap-3 justify-center">
          <button onClick={onClose} className="btn-secondary flex-1">
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95"
          >
            <Trash2 className="w-4 h-4" />
            {isLoading ? "Menghapus..." : "Hapus"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDelete;
