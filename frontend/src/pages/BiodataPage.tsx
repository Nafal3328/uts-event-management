import {
  User,
  GraduationCap,
  Hash,
  Building2,
  BookOpen,
  Calendar,
  Mail,
  Award,
  Code2,
  Layers,
} from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import PageHeader from "../components/ui/PageHeader";
import { useAuthStore } from "../store/authStore";

// ─── SESUAIKAN DATA INI DENGAN BIODATA ANDA ──────────────────────────────────
const STUDENT_DATA = {
  nama: "Muhammad Lutfi Syauqi Annafal",
  nim: "24090110",
  kelas: "TI-4D",
  prodi: "D-4 Teknik Informatika",
  jurusan: "Teknik Informatika",
  institusi: "Universitas Harkat Negeri",
  email: "sekretariat@harkatnegeri.ac.id",
  angkatan: "2024",
  semester: "IV (Empat)",
  mataKuliah: "Pemrograman Web",
  dosenPembimbing: "Jamal Apriadi, S.Kom.",
  teknologi: [
    "React + TypeScript",
    "Express.js",
    "Prisma ORM",
    "PostgreSQL",
    "Zustand",
    "Tailwind CSS",
    "Vite",
    "Node.js",
  ],
};

const BiodataPage = () => {
  const { user } = useAuthStore();

  const infoItems = [
    { icon: Hash, label: "NIM", value: user?.nim ?? STUDENT_DATA.nim },
    { icon: User, label: "Nama Lengkap", value: STUDENT_DATA.nama },
    { icon: Building2, label: "Kelas", value: user?.kelas ?? STUDENT_DATA.kelas },
    { icon: GraduationCap, label: "Program Studi", value: user?.prodi ?? STUDENT_DATA.prodi },
    { icon: BookOpen, label: "Jurusan", value: STUDENT_DATA.jurusan },
    { icon: Calendar, label: "Angkatan", value: STUDENT_DATA.angkatan },
    { icon: Calendar, label: "Semester", value: STUDENT_DATA.semester },
    { icon: Mail, label: "Email", value: STUDENT_DATA.email },
    { icon: Award, label: "Mata Kuliah", value: STUDENT_DATA.mataKuliah },
    { icon: User, label: "Dosen Pengampu", value: STUDENT_DATA.dosenPembimbing },
  ];

  return (
    <DashboardLayout>
      <div className="animate-fade-in max-w-3xl">
        <PageHeader
          title="Biodata Mahasiswa"
          description="Informasi data diri mahasiswa peserta Ujian Akhir Semester."
        />

        {/* Profile Card */}
        <div className="card p-8 mb-6">
          <div className="flex items-start gap-6 mb-8">
            {/* Avatar */}
            <div className="w-24 h-24 bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl shadow-brand-500/20">
              <span className="text-white font-display text-4xl font-bold">
                {STUDENT_DATA.nama.charAt(0).toUpperCase()}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="badge bg-emerald-50 text-emerald-700 text-xs">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  Aktif
                </span>
                <span className="badge bg-brand-50 text-brand-700 text-xs">
                  {STUDENT_DATA.angkatan}
                </span>
              </div>
              <h2 className="font-display text-2xl font-bold text-surface-900 mb-1">
                {STUDENT_DATA.nama}
              </h2>
              <p className="text-surface-500 font-mono text-sm">
                {user?.nim ?? STUDENT_DATA.nim}
              </p>
              <p className="text-surface-600 font-body text-sm mt-0.5">
                {user?.prodi ?? STUDENT_DATA.prodi} · {user?.kelas ?? STUDENT_DATA.kelas}
              </p>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {infoItems.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-start gap-3 p-4 bg-surface-50 rounded-xl border border-surface-100"
              >
                <div className="w-9 h-9 bg-white border border-surface-200 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Icon className="w-4 h-4 text-brand-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-surface-500 font-body mb-0.5">{label}</p>
                  <p className="text-sm font-semibold text-surface-900 font-body truncate">
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technology Stack */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-9 h-9 bg-brand-50 rounded-xl flex items-center justify-center">
              <Code2 className="w-4 h-4 text-brand-600" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-surface-900">
                Teknologi yang Digunakan
              </h3>
              <p className="text-xs text-surface-500 font-body">
                Stack teknologi pada proyek UAS ini
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {STUDENT_DATA.teknologi.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-900 text-white text-sm rounded-lg font-mono"
              >
                <Layers className="w-3 h-3 text-brand-400" />
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-6 text-center">
          <p className="text-surface-400 text-xs font-body">
            Proyek Ujian Akhir Semester · {STUDENT_DATA.mataKuliah} ·{" "}
            {STUDENT_DATA.institusi}
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BiodataPage;
