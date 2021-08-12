import Vue from 'vue'
import ScanStudents from './views/scan-students.vue'
import AddEditGroup from './views/add-edit-group.vue'
import AddEditStudent from './views/add-edit-student.vue'
import GroupDetails from './views/group-details.vue'
import StudentDetails from './views/student-details.vue'
import Groups from './views/groups.vue'
import Students from './views/students.vue'
import Exams from './views/exams.vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);
const routes = [
    {path: '/', component: ScanStudents},
    {path: '/groups', component: Groups},
    {path: '/addGroup', component: AddEditGroup},
    {path: '/editGroup/:id', component: AddEditGroup},
    {path: '/students', component: Students},
    {path: '/addStudent', component: AddEditStudent},
    {path: '/editStudent/:id', component: AddEditStudent},
    {path: '/groupDetails/:id', component: GroupDetails},
    {path: '/studentDetails/:id', component: StudentDetails},
    {path: '/exams', component: Exams},
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

export default router;