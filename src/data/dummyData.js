// Dummy data with actual KHIT course codes
export const regulations = [
    { id: 'R20', name: 'R20', description: 'Regulation 2020' },
    { id: 'R20A', name: 'R20A', description: 'Regulation 2020 (Autonomous)' },
    { id: 'R23', name: 'R23', description: 'Regulation 2023' },
];

export const semesters = [
    { id: '1-1', name: '1-1', year: 1, sem: 1 },
    { id: '1-2', name: '1-2', year: 1, sem: 2 },
    { id: '2-1', name: '2-1', year: 2, sem: 1 },
    { id: '2-2', name: '2-2', year: 2, sem: 2 },
    { id: '3-1', name: '3-1', year: 3, sem: 1 },
    { id: '3-2', name: '3-2', year: 3, sem: 2 },
    { id: '4-1', name: '4-1', year: 4, sem: 1 },
    { id: '4-2', name: '4-2', year: 4, sem: 2 },
];

// ============= R20/R20A COURSE CODES =============
export const subjects = [
    // R20/R20A - Semester 1-1
    { id: '20BSC1101', name: 'Calculus & Ordinary Differential Equations', code: '20BSC1101', regulation: 'R20', semester: '1-1' },
    { id: '20BSC1107', name: 'Applied Chemistry', code: '20BSC1107', regulation: 'R20', semester: '1-1' },
    { id: '20HSMC1101', name: 'English', code: '20HSMC1101', regulation: 'R20', semester: '1-1' },
    { id: '20ESC1101', name: 'Programming for Problem Solving Using C', code: '20ESC1101', regulation: 'R20', semester: '1-1' },
    { id: '20MC1103', name: 'Constitution of India', code: '20MC1103', regulation: 'R20', semester: '1-1' },
    { id: '20MC1102', name: 'Soft Skills', code: '20MC1102', regulation: 'R20', semester: '1-1' },
    { id: '20HSMC1102', name: 'English Lab', code: '20HSMC1102', regulation: 'R20', semester: '1-1' },
    { id: '20BSC1108', name: 'Applied Chemistry Lab', code: '20BSC1108', regulation: 'R20', semester: '1-1' },
    { id: '20ESC1103', name: 'Programming for Problem Solving Using C Lab', code: '20ESC1103', regulation: 'R20', semester: '1-1' },
    { id: '20ESC1107', name: 'Computer Engineering Workshop', code: '20ESC1107', regulation: 'R20', semester: '1-1' },

    // R20/R20A - Semester 1-2
    { id: '20BSC1203', name: 'Linear Algebra & Numerical Methods', code: '20BSC1203', regulation: 'R20', semester: '1-2' },
    { id: '20ESC1213', name: 'Applied Physics', code: '20ESC1213', regulation: 'R20', semester: '1-2' },
    { id: '20ESC1207', name: 'Python Programming', code: '20ESC1207', regulation: 'R20', semester: '1-2' },
    { id: '20ESC1214', name: 'Basic Electrical Engineering', code: '20ESC1214', regulation: 'R20', semester: '1-2' },
    { id: '20MC1203', name: 'Environmental Science', code: '20MC1203', regulation: 'R20', semester: '1-2' },
    { id: '20MC1202', name: 'Soft Skills Course-II', code: '20MC1202', regulation: 'R20', semester: '1-2' },
    { id: '20ESC1208', name: 'Python Programming Lab', code: '20ESC1208', regulation: 'R20', semester: '1-2' },
    { id: '20BSC1207', name: 'Applied Physics Lab', code: '20BSC1207', regulation: 'R20', semester: '1-2' },
    { id: '20ESC1215', name: 'Basic Electrical Engineering Lab', code: '20ESC1215', regulation: 'R20', semester: '1-2' },

    // R20/R20A - Semester 2-1
    { id: '20ESC2103', name: 'Mathematical Foundations for Computer Science', code: '20ESC2103', regulation: 'R20', semester: '2-1' },
    { id: '20PCC2128', name: 'Object Oriented Programming Using C++', code: '20PCC2128', regulation: 'R20', semester: '2-1' },
    { id: '20PCC2129', name: 'Software Engineering', code: '20PCC2129', regulation: 'R20', semester: '2-1' },
    { id: '20PCC2130', name: 'Data Structures', code: '20PCC2130', regulation: 'R20', semester: '2-1' },
    { id: '20HSMC2101', name: 'Managerial Economics & Financial Accounting', code: '20HSMC2101', regulation: 'R20', semester: '2-1' },
    { id: '20MC21XX', name: 'Essence of Indian Traditional Knowledge', code: '20MC21XX', regulation: 'R20', semester: '2-1' },
    { id: '20PCC2131', name: 'OOPS Through C++ Lab', code: '20PCC2131', regulation: 'R20', semester: '2-1' },
    { id: '20PCC2132', name: 'Data Structures Lab', code: '20PCC2132', regulation: 'R20', semester: '2-1' },
    { id: '20PCC2133', name: 'Software Engineering Lab (Virtual Lab)', code: '20PCC2133', regulation: 'R20', semester: '2-1' },
    { id: '20SOC2101', name: 'Skill Oriented Course-I', code: '20SOC2101', regulation: 'R20', semester: '2-1' },

    // R20/R20A - Semester 2-2
    { id: '20BSC2201', name: 'Probability & Statistics', code: '20BSC2201', regulation: 'R20', semester: '2-2' },
    { id: '20PCC2220', name: 'Data Base Management Systems', code: '20PCC2220', regulation: 'R20', semester: '2-2' },
    { id: '20PCC2223', name: 'Artificial Intelligence', code: '20PCC2223', regulation: 'R20', semester: '2-2' },
    { id: '20PCC2224', name: 'Java Programming', code: '20PCC2224', regulation: 'R20', semester: '2-2' },
    { id: '20PCC2225', name: 'Formal Language and Automata Theory', code: '20PCC2225', regulation: 'R20', semester: '2-2' },
    { id: '20PCC2226', name: 'Database Management Systems Lab', code: '20PCC2226', regulation: 'R20', semester: '2-2' },
    { id: '20PCC2227', name: 'Java Programming Lab', code: '20PCC2227', regulation: 'R20', semester: '2-2' },
    { id: '20PCC2228', name: 'AI Tools & Techniques Lab', code: '20PCC2228', regulation: 'R20', semester: '2-2' },
    { id: '20SOC2201', name: 'Skill Oriented Course-II', code: '20SOC2201', regulation: 'R20', semester: '2-2' },

    // R20/R20A - Semester 3-1
    { id: '20PCC3121', name: 'Design & Analysis of Algorithms', code: '20PCC3121', regulation: 'R20', semester: '3-1' },
    { id: '20PCC3123', name: 'Computer Networks', code: '20PCC3123', regulation: 'R20', semester: '3-1' },
    { id: '20MC3107', name: 'Ethics & Human Values and Universal Human Values', code: '20MC3107', regulation: 'R20', semester: '3-1' },
    { id: '20PCC3125', name: 'Operating Systems Lab', code: '20PCC3125', regulation: 'R20', semester: '3-1' },
    { id: '20PCC3124', name: 'Computer Networks Lab', code: '20PCC3124', regulation: 'R20', semester: '3-1' },
    { id: '20PCC3126', name: 'Design & Analysis of Algorithms Lab', code: '20PCC3126', regulation: 'R20', semester: '3-1' },
    { id: '20PROJ3101', name: 'Community Service Project', code: '20PROJ3101', regulation: 'R20', semester: '3-1' },
    { id: '20PROJ3102', name: 'Summer Internship-I', code: '20PROJ3102', regulation: 'R20', semester: '3-1' },

    // R20/R20A - Semester 3-2
    { id: '20PCC3210', name: 'Compiler Design', code: '20PCC3210', regulation: 'R20', semester: '3-2' },
    { id: '20PEC3215', name: 'MOOCS (NPTEL/AICTE/SWAYAM)', code: '20PEC3215', regulation: 'R20', semester: '3-2' },
    { id: '20PEC3205B', name: 'Data warehousing and Data Mining', code: '20PEC3205B', regulation: 'R20', semester: '3-2' },
    { id: '20PCC3204B', name: 'Fundamentals of Microprocessors and Microcontrollers', code: '20PCC3204B', regulation: 'R20', semester: '3-2' },
    { id: '20PCC3226', name: 'Compiler Design Lab', code: '20PCC3226', regulation: 'R20', semester: '3-2' },
    { id: '20PCC3227', name: 'Cryptography And Network Security Lab', code: '20PCC3227', regulation: 'R20', semester: '3-2' },
    { id: '20SOC3264', name: 'Skill Oriented Course-IV', code: '20SOC3264', regulation: 'R20', semester: '3-2' },

    // R20/R20A - Semester 4-1
    { id: '20PEC4113B', name: 'Cloud Computing', code: '20PEC4113B', regulation: 'R20', semester: '4-1' },
    { id: '20PEC4114A', name: 'Web Technologies', code: '20PEC4114A', regulation: 'R20', semester: '4-1' },
    { id: '20PEC4115B', name: 'Cyber Security and privacy', code: '20PEC4115B', regulation: 'R20', semester: '4-1' },
    { id: '20OEC4107B', name: 'Embedded Systems', code: '20OEC4107B', regulation: 'R20', semester: '4-1' },
    { id: '20OEC4106C', name: 'Entrepreneurship Management And Organizational Behavior', code: '20OEC4106C', regulation: 'R20', semester: '4-1' },
    { id: '20HSMC4101', name: 'Management and Organizational Behavior', code: '20HSMC4101', regulation: 'R20', semester: '4-1' },
    { id: '20SOC4103', name: 'Skill Oriented Course', code: '20SOC4103', regulation: 'R20', semester: '4-1' },
    { id: '20PROJ4101', name: 'Summer Internship - II', code: '20PROJ4101', regulation: 'R20', semester: '4-1' },

    // R20/R20A - Semester 4-2
    { id: '20PROJ4201', name: 'Project Work / Internship (6 MONTHS)', code: '20PROJ4201', regulation: 'R20', semester: '4-2' },

    // ============= R23 COURSE CODES =============
    // R23 - Semester 1-1
    { id: 'R231101', name: 'Linear Algebra & Calculus', code: 'R231101', regulation: 'R23', semester: '1-1' },
    { id: 'R231102', name: 'Engineering Physics', code: 'R231102', regulation: 'R23', semester: '1-1' },
    { id: 'R231104', name: 'Basic Civil & Mechanical Engineering', code: 'R231104', regulation: 'R23', semester: '1-1' },
    { id: 'R231105', name: 'Basic Electrical and Electronics Engineering', code: 'R231105', regulation: 'R23', semester: '1-1' },
    { id: 'R231111', name: 'Introduction to Programming', code: 'R231111', regulation: 'R23', semester: '1-1' },
    { id: 'R231106L', name: 'Engineering Physics Lab', code: 'R231106L', regulation: 'R23', semester: '1-1' },
    { id: 'R231108L', name: 'Electrical & Electronics Engineering Workshop', code: 'R231108L', regulation: 'R23', semester: '1-1' },
    { id: 'R231109L', name: 'Engineering Workshop', code: 'R231109L', regulation: 'R23', semester: '1-1' },
    { id: 'R231110L', name: 'Health and Wellness, Yoga and Sports', code: 'R231110L', regulation: 'R23', semester: '1-1' },
    { id: 'R231112L', name: 'Computer Programming Lab', code: 'R231112L', regulation: 'R23', semester: '1-1' },

    // R23 - Semester 1-2
    { id: 'R231201', name: 'Differential Equations & Vector Calculus', code: 'R231201', regulation: 'R23', semester: '1-2' },
    { id: 'R231211', name: 'Chemistry', code: 'R231211', regulation: 'R23', semester: '1-2' },
    { id: 'R231218', name: 'Communicative English', code: 'R231218', regulation: 'R23', semester: '1-2' },
    { id: 'R231219', name: 'Data Structures', code: 'R231219', regulation: 'R23', semester: '1-2' },
    { id: 'R231209L', name: 'IT Workshop', code: 'R231209L', regulation: 'R23', semester: '1-2' },
    { id: 'R231213L', name: 'Chemistry Lab', code: 'R231213L', regulation: 'R23', semester: '1-2' },
    { id: 'R231220L', name: 'Communicative English Lab', code: 'R231220L', regulation: 'R23', semester: '1-2' },
    { id: 'R231221L', name: 'Data Structures Lab', code: 'R231221L', regulation: 'R23', semester: '1-2' },
    { id: 'R231205', name: 'Engineering Graphics', code: 'R231205', regulation: 'R23', semester: '1-2' },
    { id: 'R231210L', name: 'NSS/NCC/SCOUTS & GUIDES', code: 'R231210L', regulation: 'R23', semester: '1-2' },

    // R23 - Semester 2-1
    { id: 'R232130', name: 'Discrete Mathematics & Graph Theory', code: 'R232130', regulation: 'R23', semester: '2-1' },
    { id: 'R232131', name: 'Universal Human Values - Understanding Harmony and Ethical', code: 'R232131', regulation: 'R23', semester: '2-1' },
    { id: 'R232132', name: 'Digital Logic & Computer Organization', code: 'R232132', regulation: 'R23', semester: '2-1' },
    { id: 'R232133', name: 'Advanced Data Structures and Algorithm Analysis', code: 'R232133', regulation: 'R23', semester: '2-1' },
    { id: 'R232134', name: 'Object Oriented Programming Through Java', code: 'R232134', regulation: 'R23', semester: '2-1' },
    { id: 'R232109', name: 'Environmental Science', code: 'R232109', regulation: 'R23', semester: '2-1' },
    { id: 'R232135L', name: 'Advanced Data Structures and Algorithm Analysis Lab', code: 'R232135L', regulation: 'R23', semester: '2-1' },
    { id: 'R232136L', name: 'Object Oriented Programming Through Java Lab', code: 'R232136L', regulation: 'R23', semester: '2-1' },
    { id: 'R232108', name: 'Skill Enhancement Course-I', code: 'R232108', regulation: 'R23', semester: '2-1' },

    // R23 - Semester 2-2
    { id: 'R232232', name: 'Probability & Statistics', code: 'R232232', regulation: 'R23', semester: '2-2' },
    { id: 'R232233', name: 'Managerial Economics and Financial Analysis', code: 'R232233', regulation: 'R23', semester: '2-2' },
    { id: 'R232234', name: 'Operating Systems', code: 'R232234', regulation: 'R23', semester: '2-2' },
    { id: 'R232235', name: 'Database Management Systems', code: 'R232235', regulation: 'R23', semester: '2-2' },
    { id: 'R232236', name: 'Software Engineering', code: 'R232236', regulation: 'R23', semester: '2-2' },
    { id: 'R232209', name: 'Design Thinking & Innovation', code: 'R232209', regulation: 'R23', semester: '2-2' },
    { id: 'R232237L', name: 'Operating Systems Lab', code: 'R232237L', regulation: 'R23', semester: '2-2' },
    { id: 'R232238L', name: 'Database Management Systems Lab', code: 'R232238L', regulation: 'R23', semester: '2-2' },
    { id: 'R232239', name: 'Skill Enhancement Course-II', code: 'R232239', regulation: 'R23', semester: '2-2' },

    // R23 - Semester 3-1
    { id: 'R233136', name: 'Data Warehousing and Data Mining (DWDM)', code: 'R233136', regulation: 'R23', semester: '3-1' },
    { id: 'R233137', name: 'Computer Networks', code: 'R233137', regulation: 'R23', semester: '3-1' },
    { id: 'R233138', name: 'Formal Languages and Automata Theory (FLAT)', code: 'R233138', regulation: 'R23', semester: '3-1' },
    { id: 'R233139B', name: 'Artificial Intelligence (AI)', code: 'R233139B', regulation: 'R23', semester: '3-1' },
    { id: 'R233140A', name: 'Entrepreneurship and Venture Creation (ED)', code: 'R233140A', regulation: 'R23', semester: '3-1' },
    { id: 'R233141L', name: 'Data Mining Lab', code: 'R233141L', regulation: 'R23', semester: '3-1' },
    { id: 'R233142L', name: 'Computer Networks Lab', code: 'R233142L', regulation: 'R23', semester: '3-1' },
    { id: 'R233143', name: 'SEC-III Full Stack Development-2', code: 'R233143', regulation: 'R23', semester: '3-1' },
    { id: 'R233144', name: 'User Interface Design Using Flutter/SWAYAM Plus-Flutter Fundamentals', code: 'R233144', regulation: 'R23', semester: '3-1' },
    { id: 'R233110', name: 'Community Service Internship (Summer Internship-I)', code: 'R233110', regulation: 'R23', semester: '3-1' },

    // Copy R20 subjects to R20A
    { id: 'R20A-20BSC1101', name: 'Calculus & Ordinary Differential Equations', code: '20BSC1101', regulation: 'R20A', semester: '1-1' },
    { id: 'R20A-20BSC1107', name: 'Applied Chemistry', code: '20BSC1107', regulation: 'R20A', semester: '1-1' },
    { id: 'R20A-20HSMC1101', name: 'English', code: '20HSMC1101', regulation: 'R20A', semester: '1-1' },
    { id: 'R20A-20ESC1101', name: 'Programming for Problem Solving Using C', code: '20ESC1101', regulation: 'R20A', semester: '1-1' },
    { id: 'R20A-20MC1103', name: 'Constitution of India', code: '20MC1103', regulation: 'R20A', semester: '1-1' },
    { id: 'R20A-20ESC1103', name: 'Programming for Problem Solving Using C Lab', code: '20ESC1103', regulation: 'R20A', semester: '1-1' },

    { id: 'R20A-20BSC1203', name: 'Linear Algebra & Numerical Methods', code: '20BSC1203', regulation: 'R20A', semester: '1-2' },
    { id: 'R20A-20ESC1213', name: 'Applied Physics', code: '20ESC1213', regulation: 'R20A', semester: '1-2' },
    { id: 'R20A-20ESC1207', name: 'Python Programming', code: '20ESC1207', regulation: 'R20A', semester: '1-2' },
    { id: 'R20A-20ESC1214', name: 'Basic Electrical Engineering', code: '20ESC1214', regulation: 'R20A', semester: '1-2' },
    { id: 'R20A-20ESC1208', name: 'Python Programming Lab', code: '20ESC1208', regulation: 'R20A', semester: '1-2' },

    { id: 'R20A-20ESC2103', name: 'Mathematical Foundations for Computer Science', code: '20ESC2103', regulation: 'R20A', semester: '2-1' },
    { id: 'R20A-20PCC2128', name: 'Object Oriented Programming Using C++', code: '20PCC2128', regulation: 'R20A', semester: '2-1' },
    { id: 'R20A-20PCC2129', name: 'Software Engineering', code: '20PCC2129', regulation: 'R20A', semester: '2-1' },
    { id: 'R20A-20PCC2130', name: 'Data Structures', code: '20PCC2130', regulation: 'R20A', semester: '2-1' },
    { id: 'R20A-20HSMC2101', name: 'Managerial Economics & Financial Accounting', code: '20HSMC2101', regulation: 'R20A', semester: '2-1' },
    { id: 'R20A-20PCC2131', name: 'OOPS Through C++ Lab', code: '20PCC2131', regulation: 'R20A', semester: '2-1' },
    { id: 'R20A-20PCC2132', name: 'Data Structures Lab', code: '20PCC2132', regulation: 'R20A', semester: '2-1' },

    { id: 'R20A-20BSC2201', name: 'Probability & Statistics', code: '20BSC2201', regulation: 'R20A', semester: '2-2' },
    { id: 'R20A-20PCC2220', name: 'Data Base Management Systems', code: '20PCC2220', regulation: 'R20A', semester: '2-2' },
    { id: 'R20A-20PCC2223', name: 'Artificial Intelligence', code: '20PCC2223', regulation: 'R20A', semester: '2-2' },
    { id: 'R20A-20PCC2224', name: 'Java Programming', code: '20PCC2224', regulation: 'R20A', semester: '2-2' },
    { id: 'R20A-20PCC2225', name: 'Formal Language and Automata Theory', code: '20PCC2225', regulation: 'R20A', semester: '2-2' },
    { id: 'R20A-20PCC2226', name: 'Database Management Systems Lab', code: '20PCC2226', regulation: 'R20A', semester: '2-2' },
    { id: 'R20A-20PCC2227', name: 'Java Programming Lab', code: '20PCC2227', regulation: 'R20A', semester: '2-2' },

    { id: 'R20A-20PCC3121', name: 'Design & Analysis of Algorithms', code: '20PCC3121', regulation: 'R20A', semester: '3-1' },
    { id: 'R20A-20PCC3123', name: 'Computer Networks', code: '20PCC3123', regulation: 'R20A', semester: '3-1' },
    { id: 'R20A-20PCC3125', name: 'Operating Systems Lab', code: '20PCC3125', regulation: 'R20A', semester: '3-1' },
    { id: 'R20A-20PCC3124', name: 'Computer Networks Lab', code: '20PCC3124', regulation: 'R20A', semester: '3-1' },
    { id: 'R20A-20PCC3126', name: 'Design & Analysis of Algorithms Lab', code: '20PCC3126', regulation: 'R20A', semester: '3-1' },

    { id: 'R20A-20PCC3210', name: 'Compiler Design', code: '20PCC3210', regulation: 'R20A', semester: '3-2' },
    { id: 'R20A-20PEC3205B', name: 'Data warehousing and Data Mining', code: '20PEC3205B', regulation: 'R20A', semester: '3-2' },
    { id: 'R20A-20PCC3226', name: 'Compiler Design Lab', code: '20PCC3226', regulation: 'R20A', semester: '3-2' },

    { id: 'R20A-20PEC4113B', name: 'Cloud Computing', code: '20PEC4113B', regulation: 'R20A', semester: '4-1' },
    { id: 'R20A-20PEC4114A', name: 'Web Technologies', code: '20PEC4114A', regulation: 'R20A', semester: '4-1' },
    { id: 'R20A-20PEC4115B', name: 'Cyber Security and privacy', code: '20PEC4115B', regulation: 'R20A', semester: '4-1' },

    { id: 'R20A-20PROJ4201', name: 'Project Work / Internship (6 MONTHS)', code: '20PROJ4201', regulation: 'R20A', semester: '4-2' },
];

// Resource types
export const resourceTypes = [
    { id: 'notes', name: 'Notes', icon: 'FileText' },
    { id: 'pyq', name: 'Previous Year Questions', icon: 'FileQuestion' },
];

// Dummy resources (will be replaced with real data from Supabase)
export const resources = [];

// Dummy users (not used anymore - using Supabase)
export const dummyUsers = [];

// College/Department info for branding
export const collegeInfo = {
    collegeName: 'Kallam Haranadhareddy Institute of Technology',
    collegeShortName: 'KHIT',
    departmentName: 'Department of Computer Science & Engineering',
    departmentShortName: 'CSE',
    logo: '/depthub-icon.png',
    tagline: 'Committed to Quality',
    address: 'Behind Kallam Spinning Mills Limited, N.H.5, Chowdavaram, Guntur, Andhra Pradesh, India - 522019',
    district: 'Guntur District',
    pincode: '522019',
    website: 'https://khitguntur.ac.in/',
};

// Helper functions to filter data
export const getSubjectsByRegulationAndSemester = (regulation, semester) => {
    return subjects.filter(
        (subject) => {
            // Filter by regulation and semester
            if (subject.regulation !== regulation || subject.semester !== semester) {
                return false;
            }
            // Exclude lab subjects
            const name = subject.name.toLowerCase();
            if (name.includes('lab') || name.includes('workshop')) {
                return false;
            }
            // Exclude subjects with code ending in 'L' (lab codes)
            if (subject.code && subject.code.endsWith('L')) {
                return false;
            }
            return true;
        }
    );
};

export const getResourcesByFilters = (regulation, semester, subjectId, type) => {
    return resources.filter((resource) => {
        if (regulation && resource.regulation !== regulation) return false;
        if (semester && resource.semester !== semester) return false;
        if (subjectId && resource.subjectId !== subjectId) return false;
        if (type && resource.type !== type) return false;
        return true;
    });
};

export const getFacultyByStatus = (status) => {
    return dummyUsers.filter(
        (user) => user.role === 'faculty' && user.status === status
    );
};
