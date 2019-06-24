import Home from "./pages/Home";
import Login from './pages/Login';
import NotesList from "./pages/Notes/NotesList";
import CreateNote from "./pages/Notes/CreateNote";

export const routes = [
  { name: 'Accueil', path: '/', exact: true, component: Home, icon: 'home' },
  { name: 'Se connecter', path: '/login', component: Login, icon: 'login' },
  { name: 'Notes', path: '/notes', exact: true, component: NotesList, icon: 'file-search' },
  { name: 'Nouvelle note', path: '/notes/new', component: CreateNote, icon: 'form' }
];
