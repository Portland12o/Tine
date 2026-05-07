import { createRouter, createWebHashHistory } from 'vue-router'
import Hero     from '../components/Hero.vue'
import About    from '../components/About.vue'
import Projects from '../components/Projects.vue'
import Skills   from '../components/Skills.vue'
import Contact  from '../components/Contact.vue'

const routes = [
  { path: '/',         component: Hero,     name: 'home'     },
  { path: '/about',    component: About,    name: 'about'    },
  { path: '/projects', component: Projects, name: 'projects' },
  { path: '/skills',   component: Skills,   name: 'skills'   },
  { path: '/contact',  component: Contact,  name: 'contact'  },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})
