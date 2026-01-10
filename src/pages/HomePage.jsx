import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  FileText,
  Download,
  Users,
  Shield,
  Search,
  ArrowRight,
  Clock,
  Loader2,
} from "lucide-react";
import { useAuth } from "../context/FirebaseAuthContext";
import { collegeInfo } from "../data/dummyData";
import { fetchResources } from "../supabase/resourceService";

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const [recentResources, setRecentResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalResources: 45,
    totalDownloads: 1250,
  });

  useEffect(() => {
    const loadRecentResources = async () => {
      try {
        setLoading(true);
        const data = await fetchResources({ status: 'approved' });
        setRecentResources(data.slice(0, 6));

        if (data.length > 0) {
          const totalDownloads = data.reduce((acc, r) => acc + (r.downloads || 0), 0);
          setStats({
            totalResources: data.length > 45 ? data.length : 45,
            totalDownloads: totalDownloads > 1250 ? totalDownloads : 1250,
          });
        }
      } catch (error) {
        console.error('Error loading recent resources:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRecentResources();
  }, []);

  const features = [
    {
      icon: FileText,
      title: "Organized Notes",
      description:
        "Access well-structured notes organized by regulation, semester, and subject.",
    },
    {
      icon: BookOpen,
      title: "Previous Year Papers",
      description:
        "Prepare better with previous year question papers and solutions.",
    },
    {
      icon: Search,
      title: "Easy Search",
      description:
        "Filter resources by regulation, semester, and subject to find what you need.",
    },
    {
      icon: Download,
      title: "Quick Downloads",
      description: "Download PDFs instantly. No waiting, no hassle.",
    },
  ];

  const statsData = [
    { label: "Resources Available", value: `${stats.totalResources}+`, icon: FileText },
    { label: "Total Downloads", value: `${stats.totalDownloads}+`, icon: Download },
    { label: "Active Students", value: "500+", icon: Users },
    { label: "Faculty Contributors", value: "15+", icon: Shield },
  ];

  return (
    <div>
      <section className="section-lg">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 leading-tight mb-8">
              <span className="block">Your Academic Resources,</span>
              <span className="gradient-text block mt-2">
                All in One Place
              </span>
            </h1>

            <div className="space-y-5 mb-10">
              <p className="text-neutral-600 text-base md:text-lg leading-relaxed">
                Access notes, previous year papers, and study materials for CSE.
              </p>

              <p className="text-neutral-600 text-base md:text-lg leading-relaxed">
                No more searching through WhatsApp groups or scattered Google Drive folders.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/resources" className="btn btn-primary px-8 py-3">
                <BookOpen className="w-5 h-5" />
                Browse Resources
                <ArrowRight className="w-5 h-5" />
              </Link>

              {!isAuthenticated && (
                <Link to="/student-signup" className="btn btn-outline px-8 py-3">
                  Create Student Account
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-white/50">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {statsData.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="card text-center">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-primary-100 flex items-center justify-center mb-3">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <p className="text-2xl font-bold gradient-text mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-neutral-600">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Everything You Need to Excel
            </h2>
            <p className="text-neutral-600 max-w-xl mx-auto">
              DeptHub brings all your academic resources together, making study
              simple and efficient.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6  ">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="card-outline text-center">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-primary-100 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-neutral-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section bg-white/50">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              How It Works
            </h2>
            <p className="text-neutral-600">
              Get started in just a few simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Select Filters",
                description:
                  "Choose regulation, semester, and subject",
                icon: Search,
              },
              {
                step: "02",
                title: "Browse Resources",
                description:
                  "View notes and previous year question papers",
                icon: BookOpen,
              },
              {
                step: "03",
                title: "Download & Study",
                description: "Download PDFs and start learning",
                icon: Download,
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 mx-auto rounded-xl gradient-primary flex items-center justify-center mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-neutral-600">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Recently Added</h2>
            <Link
              to="/resources"
              className="text-primary-600 flex items-center gap-1 text-sm"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
            </div>
          ) : recentResources.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {recentResources.slice(0, 3).map((resource) => (
                <div key={resource.id} className="card-outline hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center ${resource.type === 'notes'
                      ? 'bg-primary-100'
                      : 'bg-secondary-100'
                      }`}>
                      <FileText className={`w-5 h-5 ${resource.type === 'notes'
                        ? 'text-primary-600'
                        : 'text-secondary-600'
                        }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium mb-1 truncate">
                        {resource.title}
                      </h3>
                      <p className="text-xs text-neutral-600 mb-2 truncate">
                        {resource.subject || resource.file_name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <span className="badge badge-primary">
                          {resource.regulation}
                        </span>
                        <span className="badge badge-secondary">
                          Sem {resource.semester}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(resource.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-neutral-50 rounded-xl">
              <FileText className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
              <p className="text-neutral-500">No resources added yet.</p>
              <Link to="/resources" className="text-primary-600 text-sm mt-2 inline-block">
                Browse available resources
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
