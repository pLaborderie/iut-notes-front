import Home from "./pages/Home";
import Login from './pages/Login';
import NotesList from "./pages/Notes/NotesList";
import CreateNote from "./pages/Notes/CreateNote";
import Signup from "./pages/Signup";
import Logout from "./pages/Logout";
import Account from "./pages/Account";
import Administration from './pages/Administation';

export const routes = [
  { name: 'Accueil', path: '/', exact: true, component: Home, icon: 'home' },
  { name: 'Notes', path: '/notes', exact: true, component: NotesList, icon: 'file-search' },
];

export const loggedInRoutes = [
  { name: 'Nouvelle note', path: '/notes/new', component: CreateNote, icon: 'form' },
  { name: 'Mon compte', path: '/account', component: Account, icon: 'user' },
  { name: 'Se déconnecter', path: '/logout', component: Logout, icon: 'logout' },
]

export const loggedOutRoutes = [
  { name: 'Créer un compte', path: '/signup', component: Signup, icon: 'user' },
  { name: 'Se connecter', path: '/login', component: Login, icon: 'login' },
]

export const adminRoutes = [
  { name: 'Administration', path: '/admin', component: Administration, icon: 'database' },
]

export default routes.concat(loggedInRoutes, loggedOutRoutes, adminRoutes);