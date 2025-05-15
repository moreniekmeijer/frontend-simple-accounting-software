# Frontend Simple Accounting Software

De frontend voor de Simple Accounting Software, gebouwd met React en Vite. Deze interface maakt verbinding met de backend API.

## Vereisten

Zorg dat je het volgende hebt geïnstalleerd:

- Node.js (versie 18 of hoger aanbevolen)
- npm (of yarn)

## Installatie

### 1. Repository clonen

```bash
git clone https://github.com/moreniekmeijer/frontend-simple-accounting-software.git
cd frontend-simple-accounting-software
```

### 2. Afhankelijkheden installeren

```bash
npm install
```

### 3. `.env` bestand aanmaken

Maak een `.env` bestand aan in de root van het project met de volgende inhoud:

```env
VITE_API_URL=http://localhost:8080
```

> Pas `VITE_API_URL` aan indien je backend op een andere poort of host draait.

### 4. Start de ontwikkelserver

```bash
npm run dev
```

De frontend is nu bereikbaar op `http://localhost:5173` (tenzij anders aangegeven in de terminal).

## Backend nodig

Zorg dat de backend draait op de opgegeven `VITE_API_URL` voor correcte werking. 
Zie:  
👉 [backend-simple-accounting-software](https://github.com/moreniekmeijer/backend-simple-accounting-software)