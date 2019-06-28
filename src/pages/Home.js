import React from 'react';

function Home() {
  return (
    <div>
      <h1>Bienvenue sur IUT Notes !</h1>
      <p>
        IUT Notes est une plateforme de partage de notes de cours ou d'exercices,
        créé pour les étudiants de l'IUT de Bayonne et du Pays Basque, en filière Informatique.
      </p>
      <h3>Pourquoi IUT Notes ?</h3>
      <p>
        Je prenais les notes de cours en amphithéâtre sur mon ordinateur,
        en Markdown. Cela me permettait de formatter rapidement le texte
        et d'avoir du syntax highlighting sur les bouts de code. Des amis
        m'ont demandé de leur partager mes notes, et j'ai donc décidé de
        mettre en ligne une plateforme de partage pour tous les étudiants.
      </p>
      <h3>Comment contribuer ?</h3>
      <p>
        J'aimerais continuer à développer cette plateforme, pour qu'elle
        continue à être utilisée à l'IUT même après mon départ. Voilà les
        diverses façons de contribuer :
        <ul>
          <li>Créez un compte et partagez vos notes !</li>
          <li>
            Contribuez au projet sur Github (pour l'instant privé,
            deviendra public quand il sera plus développé).
          </li>
          <li>
            M'aider à mettre en place un système de modération, qui
            deviendra nécessaire quand la plateforme sera utilisée par
            plus d'étudiants.
          </li>
        </ul>
      </p>
    </div>
  )
}

export default Home;