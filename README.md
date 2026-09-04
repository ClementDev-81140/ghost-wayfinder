# Protocol Whiteout

2.1 Architecture Technique Générale

Protocol Offline-First : L'intégralité des éléments (fichiers audio, cartographies vectorielles de la Grésigne, arborescences d'énigmes) est stockée localement dans la mémoire interne du téléphone durci. L'application ne requiert aucun accès au réseau internet civil.

Mode Kiosque Métier : L'application s'exécute au premier plan et verrouille l'accès au système Android natif. Les boutons physiques "Accueil" et "Retour" sont désactivés par surcouche logicielle pour empêcher les joueurs de tricher ou d'accéder au système.

Optimisation Énergétique Extrême : Les requêtes de la puce GPS intégrée sont configurées en mode intermittent (interrogation cyclique toutes les 30 secondes et non en continu) pour garantir une autonomie supérieure à 24 heures en forêt.

2.2 Spécifications de l'Interface Visuelle (Gaming HUD)

Noir Tactique (#121212) : Fond d'écran ultra-majoritaire pour minimiser la fatigue oculaire lors des phases nocturnes et éviter de projeter de la lumière sur le visage des joueurs (préservant leur discrétion).

Vert Militaire Kaki (#4B5320) : Structure, textes standards, lignes de visée fines et grille de coordonnées géographiques affichées en permanence sous un réticule de boussole circulaire central.

Orange de Secours Fluorescent (#FF5F1F) : Teinte exclusive des alertes critiques, du chronomètre de la Tempête et du bouton SOS.

Typographie : Polices à espacement fixe de style technique et militaire (Monospace ou Stencil).

2.3 Module : La Tempête (Contraction Dynamique de Zone)

Contraction en 4 Phases : Le terrain de jeu autorisé se contracte de manière automatisée sur des créneaux temporels stricts (0h-6h, 6h-12h, 12h-18h, 18h-24h).

Verrouillage du Contenu : Dès qu'un secteur passe au statut "Hors-Zone" (matérialisé par des hachures rouges transparentes sur l'écran de la carte), toutes les énigmes secondaires s'y trouvant sont définitivement désactivées dans l'application et s'effacent du Journal de quêtes.

Alerte et Pénalité : Si l'équipe franchit physiquement la limite de la zone active, l'écran clignote en orange fluo et une alerte sonore retentit. Rester plus de 5 minutes consécutives en dehors de la zone légitime applique un malus automatique de -5 Pts.

2.4 Module : Protocole Réseau Radio LoRa 868 MHz

Liaison Hybride : Le smartphone durci communique en Bluetooth Low Energy (BLE) avec un petit boîtier émetteur radio autonome (TTGO T-Beam ESP32) placé dans le rabat supérieur du sac à dos du joueur.

Uplinks (Téléphone ➔ QG) : Toutes les 5 minutes, l'application compresse les données de géolocalisation (Latitude, Longitude) et l'état de la batterie dans un paquet binaire ultraléger de 8 octets envoyé par ondes radio 868 MHz à destination des passerelles du Quartier Général de Vaour.

Downlinks (QG ➔ Téléphone) : Les ordres de réduction de zone (La Tempête) ou l'injection de l'Alerte PNJ sont envoyés depuis la console de supervision sous forme de messages radio descendants légers de 4 octets.

Bouton SOS Intégral : Placé en haut à droite de l'interface. Un appui long de 3 secondes suivi d'une double confirmation fige l'application, coupe le chronomètre de jeu, propulse un paquet radio LoRa chiffré à puissance maximale de transmission (22 dBm) et affiche en plein écran les coordonnées GPS exactes en temps réel ainsi que les consignes de sécurité réelles.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://ghost-wayfinder.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6fc57b62-dfa8-4dec-acf9-ee9647d8a810).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
