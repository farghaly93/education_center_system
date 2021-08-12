import axios from 'axios';

  const state = {
    students: [],
    groups: [],
    todayGroups: [],
    exams: [],
    subjects: [
      "فيزياء",
      "كيمياء",
      "لغة عربية",
      "لغة أنجليزية",
      "لغة ألمانية",
      "أحياء",
      "فلسفة",
      "علم النفس والاجتماع",
    ]
  };



  const mutations = {
    getStudents() {
    },
  };



  const actions = {
    getStudents() {
      axios.get("/fetchStudents").then((res) => {
        state.students = res.data.students;
      });
      // commit('getStudents', );
    },
    
    getGroups() {
      axios.get("/fetchGroups").then((res) => {
        state.groups = res.data.groups;
      });
    },

    getTodayGroups() {
      axios.get("/getTodayGroups").then((res) => {
        state.todayGroups = res.data.todayGroups;
      });
    },

    getExams() {
      axios.get("/getExams").then((res) => {
        state.exams = res.data.exams;
      });
    },
  };



  const getters = {
    students() {
      return state.students; 
    },

    groups() {
      return state.groups; 
    },
    subjects() {
      return state.subjects; 
    },
    todayGroups() {
      return state.todayGroups; 
    },
    exams() {
      return state.exams; 
    },
  }



  export default {
    state,
    mutations,
    actions,
    getters
  }
