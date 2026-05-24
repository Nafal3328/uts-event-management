import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Tag,
  Mic2,
  CalendarDays,
  TrendingUp,
  ArrowRight,
  Clock,
} from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { apiClient } from "../lib/api";
import { ApiResponse, CategoryEvent, Speaker, Event } from "../types";
import { useAuthStore } from "../store/authStore";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

const DashboardPage = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({ categories: 0, speakers: 0, events: 0 });
  const [recentEvents, setRecentEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [catRes, spkRes, evtRes] = await Promise.all([
          apiClient.get<ApiResponse<CategoryEvent[]>>("/categories"),
          apiClient.get<ApiResponse<Speaker[]>>("/speakers"),
          apiClient.get<ApiResponse<Event[]>>("/events"),
        ]);

        setStats({
          categories: catRes.total ?? 0,
          speakers: spkRes.total ?? 0,
          events: evtRes.total ?? 0,
        });

        const allEvents = evtRes.data ?? [];
        setRecentEvents(allEvents.slice(0, 5));
      } catch {
        // silently ignore on dashboard
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      label: "Total Kategori",
      value: stats.categories,
      icon: Tag,
      color: "bg-violet-50 text-violet-600",
      link: "/categories",
    },
    {
      label: "Total Pembicara",
      value: stats.speakers,
      icon: Mic2,
      color: "bg-blue-50 text-blue-600",
      link: "/speakers",
    },
    {
      label: "Total Event",
      value: stats.events,
      icon: CalendarDays,
      color: "bg-emerald-50 text-emerald-600",
      link: "/events",
    },
  ];

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 11) return "Selamat pagi";
    if (h < 15) return "Selamat siang";
    if (h < 18) return "Selamat sore";
    return "Selamat malam";
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        {/* Welcome */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-5 h-5 text-brand-500" />
            <span className="text-brand-600 font-medium text-sm font-body">
              Dashboard
            </span>
          </div>
          <h1 className="font-display text-3xl font-bold text-surface-900">
            {greeting()}, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-surface-500 mt-1 font-body">
            Kelola event, kategori, dan pembicara dalam satu tempat.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {statCards.map(({ label, value, icon: Icon, color, link }) => (
            <Link
              key={label}
              to={link}
              className="card p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-surface-300 group-hover:text-brand-500 group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-surface-500 text-sm font-body mb-1">{label}</p>
              <p className="font-display text-3xl font-bold text-surface-900">
                {isLoading ? (
                  <span className="inline-block w-10 h-8 bg-surface-100 rounded animate-pulse" />
                ) : (
                  value
                )}
              </p>
            </Link>
          ))}
        </div>

        {/* Recent Events */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-surface-400" />
              <h2 className="font-display text-lg font-semibold text-surface-900">
                Event Terbaru
              </h2>
            </div>
            <Link
              to="/events"
              className="text-brand-600 hover:text-brand-700 text-sm font-medium flex items-center gap-1 transition-colors"
            >
              Lihat semua <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-16 bg-surface-100 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : recentEvents.length === 0 ? (
            <div className="text-center py-10">
              <CalendarDays className="w-10 h-10 text-surface-300 mx-auto mb-2" />
              <p className="text-surface-500 text-sm font-body">
                Belum ada event. Buat event pertama Anda!
              </p>
              <Link to="/events" className="btn-primary mt-4 inline-flex">
                Tambah Event
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-surface-100">
              {recentEvents.map((event) => (
                <div
                  key={event.id}
                  className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-surface-900 font-body truncate">
                      {event.title}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-surface-500 font-body">
                        {format(new Date(event.date), "dd MMM yyyy", {
                          locale: localeId,
                        })}
                      </span>
                      <span className="text-xs text-surface-400">·</span>
                      <span className="text-xs text-surface-500">
                        {event.location}
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="badge bg-brand-50 text-brand-700">
                      {event.category.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
