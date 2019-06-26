import React from 'react';
import { Link } from 'react-router-dom';

function Error404() {
  return (
    <>
      <h1>Erreur 404 : Cette page n'existe pas.</h1>
      <p>Vous êtes perdu ? <Link to="/">Retournez à l'accueil</Link>.</p>
    </>
  )
}

export default Error404;