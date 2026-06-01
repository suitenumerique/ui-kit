Je vais te faire faire des nouveaux componsant ou modifier des composants en mode batch. Je vais te donner les issues github, et les équivalent figma ou tu vas pouvoir aller piocher pour faire tout ton process. Il faut évidement que tu face en sorte de lire les issue github, les commentaires si il y en a aussi etc. Tu dois crééer des stories pour les nouveaux composants, et tu dois ajouté dans les stories existante pour les composants à modifier. 

### Gauge components 
Github issue : https://github.com/suitenumerique/ui-kit/issues/220

Le but de cette feature est de modifier et d'ajouter surement des informations sur le composant (@src/components/storage-gauge/StorageGauge.tsx) déjà existant. 

1. Clickable gauge button (Implement this design from Figma. @https://www.figma.com/design/hPwxE24MEaX3mBQ0KXNTSY/UI-kit?node-id=13314-6790&m=dev)
2. Gauge content displayable in a modal alongside text and/or control components (Implement this design from Figma. @https://www.figma.com/design/hPwxE24MEaX3mBQ0KXNTSY/UI-kit?node-id=13325-4581&m=dev)
3.  An update to the bottom menu for LaSuite apps, now integrating the gauge button, is also available (configurable )


### Header Banner 
 Github Issue : https://github.com/suitenumerique/ui-kit/issues/206

Ce composant a pour but juste de crééer une header banner que l'on place dans une application en haut et qui prenne toute la largeur de l'écran. Il doit y a voir plusieurs variante je te laisse regarder. Implement this design from Figma.
@https://www.figma.com/design/hPwxE24MEaX3mBQ0KXNTSY/UI-kit?node-id=13261-5572&m=dev

Pour ce composant ajoute plusieurs stories dont une avec le layout qui est dans l'ui-kit


### Profile menu update

Github issue : https://github.com/suitenumerique/ui-kit/issues/201

C'est une mise à jours graphique du composant : UserMenu qui se trouve @src/components/users/menu/index.tsx

Implement this design from Figma.
@https://www.figma.com/design/hPwxE24MEaX3mBQ0KXNTSY/UI-kit?node-id=11944-28991&m=dev


### Upload Module

Github issue : https://github.com/suitenumerique/ui-kit/issues/186

Le but est de crééer un composant d'upload réutilisable n'importe ou avec sa liste de fichier uploadé. Il doit y avoir plusieur variante je crois (pas sur) de only one file et multiple file (pas sur de ce que je dis). Je crois que si on autorise que un fichier, ça remplace le contenu, si on autorise plusieurs, il y a la liste qui s'affiche. 

Implement this design from Figma.
@https://www.figma.com/design/hPwxE24MEaX3mBQ0KXNTSY/UI-kit?node-id=11944-22638&m=dev


### Share modal update (Ergonomic enhancement)

github issue : https://github.com/suitenumerique/ui-kit/issues/203 

Le pricniapelemtn changement c'est que actuellement quand des personnes sont sélectionné, on a un cadre sur fond gris avec les personnes selectionné dedans et l'input à l'exterieur de cadre, la ou enlève ce cadre, l'input est confondu dnas le même container, 

Tu peux prendre comme exemple ce figma, la c'est une modale avec des filtres en plus en dessous, mais ça c'est une autre chose faut pas prendre en compte cette partie. 
@https://www.figma.com/design/hPwxE24MEaX3mBQ0KXNTSY/UI-kit?node-id=11920-6169&m=dev

