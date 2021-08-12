import Vue from 'vue'
import App from './App.vue'
import router from './router.js'
import store from './store/index.js'
import axios from 'axios'
import vuetify from './plugins/vuetify'
import vuelidate from 'vuelidate'
import './assets/styles.scss'

// axios.defaults.baseURL = "http://localhost:5000/";
axios.defaults.baseURL = window.location.origin;


Vue.config.productionTip = false
Vue.use(vuelidate);

Vue.filter("stage", (val) => {
  if(!val) return;
  let stage = '';
  switch(val) {
    case 1: stage = 'الصف الاول الثانوي';
    break;
    case 2: stage = 'الصف الثاني الثانوي';
    break;
    case 3: stage = 'الصف الثالث الثانوي';
    break;
  }
  return stage;
});

Vue.filter("student", (val, reVal) => {
  const student = store.getters.students.find(s => s._id === val);
  return student[reVal];
});

Vue.filter("group", (val, reVal) => {
  const group = store.getters.groups.find(g => g._id === val);
  return group[reVal];
});

Vue.filter('arabicDay', val => {
  const daysA = ['الأحد', 'الأثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const daysE = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return daysA[daysE.findIndex(de=>de===val)];
});

Vue.filter('arabicMonth', val => {
  const months = [
      'يناير',
      'فبراير',
      'مارس', 
      'ابريل', 
      'مايو', 
      'يونيو', 
      'يوليو',
      'أغسطس',
      'سبتمبر',
      'أكتوبر',
      'نوفمبر',
      'ديسيمبر',
    ];
    return months[val];
})

Vue.filter("date", (val) => { 
  return new Date(val).toString().split('GMT')[0];
});


new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
