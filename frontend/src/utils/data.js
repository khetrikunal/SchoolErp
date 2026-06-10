// All application data — replace with real API calls in production
export const students = [
  {id:1,rollNo:'STU-001',name:'Aarav Mehta',     email:'aarav@school.edu',  class:'10-A',gender:'Male',  dob:'2008-03-15',phone:'9876543210',parentName:'Sunil Mehta',    parentPhone:'9876543200',address:'123 MG Road, Pune',     admissionYear:2021,status:'Active'},
  {id:2,rollNo:'STU-002',name:'Diya Singh',      email:'diya@school.edu',   class:'10-A',gender:'Female',dob:'2008-07-22',phone:'9765432109',parentName:'Ramesh Singh',   parentPhone:'9765432100',address:'45 Shivaji Nagar, Pune', admissionYear:2021,status:'Active'},
  {id:3,rollNo:'STU-003',name:'Rohan Patil',     email:'rohan@school.edu',  class:'10-B',gender:'Male',  dob:'2008-01-10',phone:'9654321098',parentName:'Vijay Patil',    parentPhone:'9654321000',address:'78 Kothrud, Pune',       admissionYear:2022,status:'Active'},
  {id:4,rollNo:'STU-004',name:'Ananya Desai',    email:'ananya@school.edu', class:'9-A', gender:'Female',dob:'2009-05-30',phone:'9543210987',parentName:'Ashok Desai',    parentPhone:'9543210900',address:'12 Aundh, Pune',          admissionYear:2022,status:'Active'},
  {id:5,rollNo:'STU-005',name:'Kabir Joshi',     email:'kabir@school.edu',  class:'9-B', gender:'Male',  dob:'2009-11-18',phone:'9432109876',parentName:'Manoj Joshi',    parentPhone:'9432109800',address:'56 Viman Nagar, Pune',   admissionYear:2023,status:'Active'},
  {id:6,rollNo:'STU-006',name:'Ishaan Kulkarni', email:'ishaan@school.edu', class:'8-A', gender:'Male',  dob:'2010-08-05',phone:'9321098765',parentName:'Suresh Kulkarni',parentPhone:'9321098700',address:'89 Baner, Pune',          admissionYear:2023,status:'Active'},
  {id:7,rollNo:'STU-007',name:'Nisha Bhat',      email:'nisha@school.edu',  class:'8-B', gender:'Female',dob:'2010-04-12',phone:'9210987654',parentName:'Ganesh Bhat',    parentPhone:'9210987600',address:'34 Wakad, Pune',          admissionYear:2023,status:'Inactive'},
  {id:8,rollNo:'STU-008',name:'Pooja Iyer',      email:'pooja@school.edu',  class:'9-A', gender:'Female',dob:'2009-02-28',phone:'9109876543',parentName:'Rajan Iyer',     parentPhone:'9109876500',address:'67 Koregaon Park, Pune', admissionYear:2022,status:'Active'},
  {id:9,rollNo:'STU-009',name:'Arjun Sharma',    email:'arjun@school.edu',  class:'10-B',gender:'Male',  dob:'2008-09-14',phone:'9098765432',parentName:'Deepak Sharma',  parentPhone:'9098765400',address:'90 Camp, Pune',           admissionYear:2021,status:'Active'},
  {id:10,rollNo:'STU-010',name:'Meera Nair',     email:'meera@school.edu',  class:'8-A', gender:'Female',dob:'2010-06-03',phone:'8987654321',parentName:'Suresh Nair',    parentPhone:'8987654300',address:'11 Deccan, Pune',         admissionYear:2023,status:'Active'},
]
export const teachers = [
  {id:1,empId:'TCH-001',name:'Mrs. Priya Sharma',email:'teacher@school.edu',phone:'8765432109',subjects:['Mathematics','Physics'],  classes:['10-A','10-B','9-A'],      qualification:'M.Sc Mathematics', experience:'8 years', joinDate:'2016-06-01',gender:'Female',address:'67 Koregaon Park, Pune',status:'Active',assignedEventIds:[1,3]},
  {id:2,empId:'TCH-002',name:'Mr. Amit Verma',   email:'amit@school.edu',   phone:'8654321098',subjects:['Chemistry','Biology'],   classes:['10-A','10-B'],            qualification:'M.Sc Chemistry',   experience:'5 years', joinDate:'2019-07-15',gender:'Male',  address:'23 Hadapsar, Pune',    status:'Active',assignedEventIds:[2]},
  {id:3,empId:'TCH-003',name:'Ms. Sunita Rao',   email:'sunita@school.edu', phone:'8543210987',subjects:['English','History'],     classes:['9-A','9-B','8-A'],        qualification:'M.A English',      experience:'12 years',joinDate:'2012-04-01',gender:'Female',address:'90 Camp, Pune',        status:'Active',assignedEventIds:[1,2,4]},
  {id:4,empId:'TCH-004',name:'Mr. Deepak Nair',  email:'deepak@school.edu', phone:'8432109876',subjects:['Computer Science'],      classes:['10-A','10-B','9-A','9-B'],qualification:'B.Tech CS',        experience:'6 years', joinDate:'2018-08-10',gender:'Male',  address:'11 Deccan, Pune',      status:'Active',assignedEventIds:[3]},
  {id:5,empId:'TCH-005',name:'Mrs. Kavita Iyer', email:'kavita@school.edu', phone:'8321098765',subjects:['Hindi','Sanskrit'],      classes:['8-A','8-B'],              qualification:'M.A Hindi',        experience:'10 years',joinDate:'2014-06-20',gender:'Female',address:'45 Pimpri, Pune',      status:'Active',assignedEventIds:[]},
]
export const classes = [
  {id:1,name:'10-A',grade:10,section:'A',classTeacher:'Mrs. Priya Sharma',totalStudents:32,room:'Room 101'},
  {id:2,name:'10-B',grade:10,section:'B',classTeacher:'Mr. Amit Verma',   totalStudents:30,room:'Room 102'},
  {id:3,name:'9-A', grade:9, section:'A',classTeacher:'Ms. Sunita Rao',   totalStudents:35,room:'Room 201'},
  {id:4,name:'9-B', grade:9, section:'B',classTeacher:'Mr. Deepak Nair',  totalStudents:33,room:'Room 202'},
  {id:5,name:'8-A', grade:8, section:'A',classTeacher:'Mrs. Kavita Iyer', totalStudents:28,room:'Room 301'},
  {id:6,name:'8-B', grade:8, section:'B',classTeacher:'Mrs. Priya Sharma',totalStudents:30,room:'Room 302'},
]
export const subjects = [
  {id:1,name:'Mathematics',    code:'MATH10',grade:10,teacherName:'Mrs. Priya Sharma',periodsPerWeek:6},
  {id:2,name:'Physics',        code:'PHY10', grade:10,teacherName:'Mrs. Priya Sharma',periodsPerWeek:5},
  {id:3,name:'Chemistry',      code:'CHEM10',grade:10,teacherName:'Mr. Amit Verma',   periodsPerWeek:5},
  {id:4,name:'Biology',        code:'BIO10', grade:10,teacherName:'Mr. Amit Verma',   periodsPerWeek:5},
  {id:5,name:'English',        code:'ENG09', grade:9, teacherName:'Ms. Sunita Rao',   periodsPerWeek:5},
  {id:6,name:'Computer Science',code:'CS10', grade:10,teacherName:'Mr. Deepak Nair',  periodsPerWeek:4},
  {id:7,name:'Hindi',          code:'HIN08', grade:8, teacherName:'Mrs. Kavita Iyer', periodsPerWeek:5},
]
export const notices = [
  {id:1,title:'Annual Sports Day 2024',     content:'Annual Sports Day on Feb 20, 2024. All students must participate. Practice sessions from Jan 25.',             date:'2024-01-20',priority:'High',  audience:'All',     category:'Event',   postedBy:'Admin'},
  {id:2,title:'Parent-Teacher Meeting',    content:'PTM scheduled for Feb 3 from 9 AM to 1 PM. Parents must meet respective class teachers.',                       date:'2024-01-18',priority:'High',  audience:'All',     category:'Meeting', postedBy:'Admin'},
  {id:3,title:'Revised Exam Schedule',     content:'Mid-term exam schedule has been revised. Please check the updated timetable on the notice board.',              date:'2024-01-15',priority:'Medium',audience:'Students',category:'Exam',    postedBy:'Admin'},
  {id:4,title:'Staff Development Workshop',content:'Mandatory teacher training workshop on Jan 27. All teaching staff must attend.',                                  date:'2024-01-14',priority:'Medium',audience:'Teachers',category:'Training',postedBy:'Admin'},
  {id:5,title:'New Library Books',         content:'New NCERT reference books for Class 10 board exam preparation arrived. Students can issue from the library.',   date:'2024-01-12',priority:'Low',   audience:'Students',category:'General', postedBy:'Mrs. Priya Sharma'},
]
export const events = [
  {id:1,name:'Annual Sports Day',          type:'Sports',  date:'2024-02-20',time:'09:00',venue:'School Ground',    description:'Annual sports competition with track events, field games and team sports.',         budget:85000, status:'Upcoming', assignedTeacherIds:[1,3]},
  {id:2,name:'Science Exhibition',         type:'Academic',date:'2024-03-05',time:'10:00',venue:'School Hall',      description:'Students showcase innovative science projects. Open for public viewing.',           budget:45000, status:'Planning', assignedTeacherIds:[2,3]},
  {id:3,name:'Annual Cultural Function',   type:'Cultural',date:'2024-04-15',time:'18:00',venue:'Auditorium',       description:'Annual cultural night with dance, music, drama and art performances.',              budget:150000,status:'Planning', assignedTeacherIds:[1,4]},
  {id:4,name:'Teacher Development Seminar',type:'Seminar', date:'2024-01-27',time:'09:00',venue:'Conference Room',  description:'Professional development seminar for all teaching staff.',                           budget:20000, status:'Completed',assignedTeacherIds:[3]},
]
export const quotations = [
  {id:1,eventId:1,eventName:'Annual Sports Day',      teacherId:1,teacherName:'Mrs. Priya Sharma',title:'Sports Equipment & Setup',        status:'Pending', totalAmount:42500,createdAt:'2024-01-10',notes:'Please approve at the earliest.',              vendorDetails:'Sports World Pune — 9876543210',    adminRemarks:'',
   items:[{id:1,material:'Cricket Set',quantity:5, unit:'Set', unitCost:3500,total:17500,vendor:'Sports World Pune'},{id:2,material:'Relay Batons',     quantity:20,unit:'Pcs', unitCost:150, total:3000, vendor:'Athletics Store'  },{id:3,material:'Starting Blocks',      quantity:8, unit:'Pcs', unitCost:1200,total:9600, vendor:'Athletics Store'  },{id:4,material:'Finish Line Tape',    quantity:10,unit:'Roll',unitCost:200, total:2000, vendor:'Local Market'     },{id:5,material:'Trophies & Medals',   quantity:30,unit:'Pcs', unitCost:350, total:10500,vendor:'Trophy Shop'      }]},
  {id:2,eventId:2,eventName:'Science Exhibition',     teacherId:2,teacherName:'Mr. Amit Verma',   title:'Lab Equipment & Display Materials',status:'Approved',totalAmount:28000,createdAt:'2024-01-05',notes:'Urgent requirement for student projects.',      vendorDetails:'Multiple vendors — details attached',adminRemarks:'Approved. Please proceed with procurement.',
   items:[{id:1,material:'Display Boards (Tri-fold)', quantity:30,unit:'Pcs', unitCost:350, total:10500,vendor:'Stationery Hub'     },{id:2,material:'Lab Chemicals Kit',    quantity:5, unit:'Kit', unitCost:2500,total:12500,vendor:'Scientific Supplies'},{id:3,material:'Electrical Components',quantity:10,unit:'Set', unitCost:500, total:5000, vendor:'Electronics World'  }]},
  {id:3,eventId:3,eventName:'Annual Cultural Function',teacherId:1,teacherName:'Mrs. Priya Sharma',title:'Stage & Decoration Setup',        status:'Rejected',totalAmount:75000,createdAt:'2024-01-08',notes:'Quotation for cultural function stage setup.',  vendorDetails:'Print Masters — 9865432107',        adminRemarks:'Budget exceeded. Please revise.',
   items:[{id:1,material:'Stage Backdrop Printing',   quantity:2, unit:'Pcs', unitCost:15000,total:30000,vendor:'Print Masters'     },{id:2,material:'LED Lights & Decor',   quantity:1, unit:'Set', unitCost:35000,total:35000,vendor:'Events Pro'         },{id:3,material:'Sound System Rental',  quantity:1, unit:'Event',unitCost:10000,total:10000,vendor:'Audio Solutions'    }]},
]
export const exams = [
  {id:1,name:'First Term Examination',type:'Term Exam',class:'10-A',subject:'Mathematics',date:'2024-02-15',maxMarks:100,passingMarks:35,duration:'3 hours',status:'Completed'},
  {id:2,name:'Unit Test 1',           type:'Unit Test',class:'10-A',subject:'Physics',    date:'2024-02-10',maxMarks:50, passingMarks:18,duration:'2 hours',status:'Completed'},
  {id:3,name:'Mid Term Examination',  type:'Mid Term', class:'10-B',subject:'Chemistry',  date:'2024-03-20',maxMarks:100,passingMarks:35,duration:'3 hours',status:'Upcoming'},
  {id:4,name:'Practical Exam',        type:'Practical',class:'9-A', subject:'Biology',    date:'2024-03-25',maxMarks:30, passingMarks:12,duration:'2 hours',status:'Upcoming'},
]
export const results = [
  {id:1,studentId:1,studentName:'Aarav Mehta', class:'10-A',examName:'First Term',subject:'Mathematics',marksObtained:87,maxMarks:100,grade:'A', remarks:'Excellent'},
  {id:2,studentId:2,studentName:'Diya Singh',  class:'10-A',examName:'First Term',subject:'Mathematics',marksObtained:92,maxMarks:100,grade:'A+',remarks:'Outstanding'},
  {id:3,studentId:1,studentName:'Aarav Mehta', class:'10-A',examName:'Unit Test 1',subject:'Physics',   marksObtained:43,maxMarks:50, grade:'A', remarks:'Very Good'},
  {id:4,studentId:3,studentName:'Rohan Patil', class:'10-B',examName:'First Term',subject:'Mathematics',marksObtained:62,maxMarks:100,grade:'B', remarks:'Good'},
  {id:5,studentId:4,studentName:'Ananya Desai',class:'9-A', examName:'Unit Test 1',subject:'English',   marksObtained:46,maxMarks:50, grade:'A+',remarks:'Outstanding'},
]
export const homework = [
  {id:1,title:'Quadratic Equations Practice',subject:'Mathematics',    class:'10-A',dueDate:'2024-01-22',description:'Solve exercises 5.1–5.4 from NCERT. Show complete steps.',                              createdBy:'Mrs. Priya Sharma',createdAt:'2024-01-18',submissions:28,totalStudents:32},
  {id:2,title:"Newton's Laws Essay",         subject:'Physics',        class:'10-A',dueDate:'2024-01-25',description:"Write a 500-word essay on real-world applications of Newton's three laws.",              createdBy:'Mrs. Priya Sharma',createdAt:'2024-01-19',submissions:20,totalStudents:32},
  {id:3,title:'Organic Chemistry Lab Report',subject:'Chemistry',      class:'10-B',dueDate:'2024-01-24',description:'Submit detailed lab report for the organic compound identification experiment.',         createdBy:'Mr. Amit Verma',   createdAt:'2024-01-18',submissions:15,totalStudents:30},
  {id:4,title:'Python Program Assignment',   subject:'Computer Science',class:'10-A',dueDate:'2024-01-28',description:'Write a Python program to implement a simple library management system.',               createdBy:'Mr. Deepak Nair',  createdAt:'2024-01-20',submissions:10,totalStudents:32},
]
// Daily attendance log — used by student Attendance page (attendance.filter by studentId)
export const attendance = [
  // Aarav Mehta (studentId: 1) — 10-A
  {id:1, studentId:1,  date:'2024-01-22',status:'Present',markedBy:'Mrs. Priya Sharma'},
  {id:2, studentId:1,  date:'2024-01-21',status:'Present',markedBy:'Mrs. Priya Sharma'},
  {id:3, studentId:1,  date:'2024-01-20',status:'Late',   markedBy:'Mrs. Priya Sharma'},
  {id:4, studentId:1,  date:'2024-01-19',status:'Present',markedBy:'Mrs. Priya Sharma'},
  {id:5, studentId:1,  date:'2024-01-18',status:'Absent', markedBy:'Mrs. Priya Sharma'},
  {id:6, studentId:1,  date:'2024-01-17',status:'Present',markedBy:'Mrs. Priya Sharma'},
  {id:7, studentId:1,  date:'2024-01-16',status:'Present',markedBy:'Mrs. Priya Sharma'},
  {id:8, studentId:1,  date:'2024-01-15',status:'Present',markedBy:'Mrs. Priya Sharma'},
  {id:9, studentId:1,  date:'2024-01-13',status:'Late',   markedBy:'Mrs. Priya Sharma'},
  {id:10,studentId:1,  date:'2024-01-12',status:'Present',markedBy:'Mrs. Priya Sharma'},
  // Diya Singh (studentId: 2) — 10-A
  {id:11,studentId:2,  date:'2024-01-22',status:'Present',markedBy:'Mrs. Priya Sharma'},
  {id:12,studentId:2,  date:'2024-01-21',status:'Absent', markedBy:'Mrs. Priya Sharma'},
  {id:13,studentId:2,  date:'2024-01-20',status:'Present',markedBy:'Mrs. Priya Sharma'},
  {id:14,studentId:2,  date:'2024-01-19',status:'Present',markedBy:'Mrs. Priya Sharma'},
  {id:15,studentId:2,  date:'2024-01-18',status:'Late',   markedBy:'Mrs. Priya Sharma'},
  {id:16,studentId:2,  date:'2024-01-17',status:'Present',markedBy:'Mrs. Priya Sharma'},
  {id:17,studentId:2,  date:'2024-01-16',status:'Absent', markedBy:'Mrs. Priya Sharma'},
  {id:18,studentId:2,  date:'2024-01-15',status:'Present',markedBy:'Mrs. Priya Sharma'},
  {id:19,studentId:2,  date:'2024-01-13',status:'Present',markedBy:'Mrs. Priya Sharma'},
  {id:20,studentId:2,  date:'2024-01-12',status:'Present',markedBy:'Mrs. Priya Sharma'},
  // Rohan Patil (studentId: 3) — 10-B
  {id:21,studentId:3,  date:'2024-01-22',status:'Absent', markedBy:'Mr. Amit Verma'},
  {id:22,studentId:3,  date:'2024-01-21',status:'Present',markedBy:'Mr. Amit Verma'},
  {id:23,studentId:3,  date:'2024-01-20',status:'Present',markedBy:'Mr. Amit Verma'},
  {id:24,studentId:3,  date:'2024-01-19',status:'Absent', markedBy:'Mr. Amit Verma'},
  {id:25,studentId:3,  date:'2024-01-18',status:'Present',markedBy:'Mr. Amit Verma'},
  {id:26,studentId:3,  date:'2024-01-17',status:'Late',   markedBy:'Mr. Amit Verma'},
  {id:27,studentId:3,  date:'2024-01-16',status:'Present',markedBy:'Mr. Amit Verma'},
  {id:28,studentId:3,  date:'2024-01-15',status:'Absent', markedBy:'Mr. Amit Verma'},
  {id:29,studentId:3,  date:'2024-01-13',status:'Present',markedBy:'Mr. Amit Verma'},
  {id:30,studentId:3,  date:'2024-01-12',status:'Present',markedBy:'Mr. Amit Verma'},
  // Ananya Desai (studentId: 4) — 9-A
  {id:31,studentId:4,  date:'2024-01-22',status:'Present',markedBy:'Ms. Sunita Rao'},
  {id:32,studentId:4,  date:'2024-01-21',status:'Present',markedBy:'Ms. Sunita Rao'},
  {id:33,studentId:4,  date:'2024-01-20',status:'Present',markedBy:'Ms. Sunita Rao'},
  {id:34,studentId:4,  date:'2024-01-19',status:'Late',   markedBy:'Ms. Sunita Rao'},
  {id:35,studentId:4,  date:'2024-01-18',status:'Present',markedBy:'Ms. Sunita Rao'},
  {id:36,studentId:4,  date:'2024-01-17',status:'Present',markedBy:'Ms. Sunita Rao'},
  {id:37,studentId:4,  date:'2024-01-16',status:'Present',markedBy:'Ms. Sunita Rao'},
  {id:38,studentId:4,  date:'2024-01-15',status:'Present',markedBy:'Ms. Sunita Rao'},
  {id:39,studentId:4,  date:'2024-01-13',status:'Present',markedBy:'Ms. Sunita Rao'},
  {id:40,studentId:4,  date:'2024-01-12',status:'Absent', markedBy:'Ms. Sunita Rao'},
  // Kabir Joshi (studentId: 5) — 9-B
  {id:41,studentId:5,  date:'2024-01-22',status:'Absent', markedBy:'Mr. Deepak Nair'},
  {id:42,studentId:5,  date:'2024-01-21',status:'Present',markedBy:'Mr. Deepak Nair'},
  {id:43,studentId:5,  date:'2024-01-20',status:'Absent', markedBy:'Mr. Deepak Nair'},
  {id:44,studentId:5,  date:'2024-01-19',status:'Present',markedBy:'Mr. Deepak Nair'},
  {id:45,studentId:5,  date:'2024-01-18',status:'Late',   markedBy:'Mr. Deepak Nair'},
  {id:46,studentId:5,  date:'2024-01-17',status:'Present',markedBy:'Mr. Deepak Nair'},
  {id:47,studentId:5,  date:'2024-01-16',status:'Absent', markedBy:'Mr. Deepak Nair'},
  {id:48,studentId:5,  date:'2024-01-15',status:'Present',markedBy:'Mr. Deepak Nair'},
  {id:49,studentId:5,  date:'2024-01-13',status:'Present',markedBy:'Mr. Deepak Nair'},
  {id:50,studentId:5,  date:'2024-01-12',status:'Late',   markedBy:'Mr. Deepak Nair'},
  // Ishaan Kulkarni (studentId: 6) — 8-A
  {id:51,studentId:6,  date:'2024-01-22',status:'Present',markedBy:'Mrs. Kavita Iyer'},
  {id:52,studentId:6,  date:'2024-01-21',status:'Present',markedBy:'Mrs. Kavita Iyer'},
  {id:53,studentId:6,  date:'2024-01-20',status:'Present',markedBy:'Mrs. Kavita Iyer'},
  {id:54,studentId:6,  date:'2024-01-19',status:'Present',markedBy:'Mrs. Kavita Iyer'},
  {id:55,studentId:6,  date:'2024-01-18',status:'Late',   markedBy:'Mrs. Kavita Iyer'},
  {id:56,studentId:6,  date:'2024-01-17',status:'Present',markedBy:'Mrs. Kavita Iyer'},
  {id:57,studentId:6,  date:'2024-01-16',status:'Present',markedBy:'Mrs. Kavita Iyer'},
  {id:58,studentId:6,  date:'2024-01-15',status:'Present',markedBy:'Mrs. Kavita Iyer'},
  {id:59,studentId:6,  date:'2024-01-13',status:'Present',markedBy:'Mrs. Kavita Iyer'},
  {id:60,studentId:6,  date:'2024-01-12',status:'Present',markedBy:'Mrs. Kavita Iyer'},
]

export const attendanceSummary = [
  {studentId:1,name:'Aarav Mehta',   class:'10-A',totalDays:120,present:112,absent:5, late:3,percentage:93.3},
  {studentId:2,name:'Diya Singh',    class:'10-A',totalDays:120,present:108,absent:8, late:4,percentage:90.0},
  {studentId:3,name:'Rohan Patil',   class:'10-B',totalDays:120,present:100,absent:15,late:5,percentage:83.3},
  {studentId:4,name:'Ananya Desai',  class:'9-A', totalDays:120,present:115,absent:4, late:1,percentage:95.8},
  {studentId:5,name:'Kabir Joshi',   class:'9-B', totalDays:120,present:98, absent:18,late:4,percentage:81.7},
  {studentId:6,name:'Ishaan Kulkarni',class:'8-A',totalDays:120,present:116,absent:3, late:1,percentage:96.7},
]
export const timetable = {
  '10-A':[
    {day:'Monday',   periods:['Mathematics','English','Physics','Chemistry','Comp Sci','Hindi']},
    {day:'Tuesday',  periods:['Physics','Mathematics','English','Biology','Hindi','Comp Sci']},
    {day:'Wednesday',periods:['Chemistry','Physics','Mathematics','English','Comp Sci','Biology']},
    {day:'Thursday', periods:['English','Chemistry','Hindi','Mathematics','Biology','Physics']},
    {day:'Friday',   periods:['Comp Sci','Hindi','Chemistry','Physics','Mathematics','English']},
  ],
  '10-B':[
    {day:'Monday',   periods:['Chemistry','Mathematics','English','Physics','Hindi','Comp Sci']},
    {day:'Tuesday',  periods:['Mathematics','Chemistry','Physics','English','Comp Sci','Biology']},
    {day:'Wednesday',periods:['English','Physics','Mathematics','Chemistry','Biology','Hindi']},
    {day:'Thursday', periods:['Physics','English','Comp Sci','Mathematics','Hindi','Chemistry']},
    {day:'Friday',   periods:['Hindi','Comp Sci','Biology','English','Chemistry','Mathematics']},
  ],
  '9-A':[
    {day:'Monday',   periods:['English','Mathematics','History','Biology','Hindi','Comp Sci']},
    {day:'Tuesday',  periods:['Mathematics','English','Comp Sci','History','Biology','Hindi']},
    {day:'Wednesday',periods:['Hindi','Biology','English','Mathematics','Comp Sci','History']},
    {day:'Thursday', periods:['History','Comp Sci','Mathematics','Hindi','English','Biology']},
    {day:'Friday',   periods:['Biology','Hindi','History','Comp Sci','Mathematics','English']},
  ],
}
export const chartAttendance = [
  {month:'Aug',present:92,absent:8},{month:'Sep',present:88,absent:12},
  {month:'Oct',present:95,absent:5},{month:'Nov',present:91,absent:9},
  {month:'Dec',present:85,absent:15},{month:'Jan',present:93,absent:7},
]
export const chartPerformance = [
  {subject:'Math',avg:74,highest:98,lowest:42},{subject:'Physics',avg:68,highest:95,lowest:38},
  {subject:'Chem',avg:71,highest:96,lowest:40},{subject:'English',avg:79,highest:99,lowest:55},
  {subject:'CS',avg:82,highest:100,lowest:60},
]
export const chartEnrollment = [
  {grade:'Grade 8',students:58},{grade:'Grade 9',students:68},{grade:'Grade 10',students:62},
]
