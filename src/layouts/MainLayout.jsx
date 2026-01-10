import Navbar from "../components/Navbar";
import { collegeInfo } from "../data/dummyData";
import { Heart } from "lucide-react";

const MainLayout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1">{children}</main>

            <footer className="mt-20 bg-neutral-50 border-t border-neutral-200">
                <div className="container py-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div>
                            <h4 className="text-sm font-semibold uppercase tracking-wide text-neutral-800 mb-4">
                                {collegeInfo.departmentShortName} DeptHub
                            </h4>
                            <p className="text-xs text-neutral-600 leading-relaxed mb-2">
                                {collegeInfo.departmentName}
                            </p>
                            <p className="text-xs text-neutral-500 leading-relaxed">
                                {collegeInfo.collegeName}
                            </p>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold uppercase tracking-wide text-neutral-800 mb-4">
                                Quick Links
                            </h4>
                            <ul className="space-y-2 text-xs text-neutral-600">
                                <li>
                                    <a
                                        href="/resources"
                                        className="hover:text-primary-600 transition-colors"
                                    >
                                        Browse Resources
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/login"
                                        className="hover:text-primary-600 transition-colors"
                                    >
                                        Student Login
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/signup"
                                        className="hover:text-primary-600 transition-colors"
                                    >
                                        Faculty Registration
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold uppercase tracking-wide text-neutral-800 mb-4">
                                Contact
                            </h4>
                            <p className="text-xs text-neutral-600 leading-relaxed mb-3">
                                {collegeInfo.address}
                            </p>
                            <a
                                href={collegeInfo.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary-600 hover:text-primary-700 transition-colors"
                            >
                                {collegeInfo.website}
                            </a>
                        </div>
                    </div>

                    <div className="mt-10 pt-4 border-t border-neutral-200">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-neutral-500">
                            <span>
                                © {new Date().getFullYear()} DeptHub. All rights reserved.
                            </span>
                            <span className="flex items-center gap-1">
                                Made with{" "}
                                <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for
                                students
                            </span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;
