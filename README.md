# Projekt Forum

## Spuštění

**V rootu projektu je nutné provést následující**

Vytvořit soubor `.env` a v něm definovat:
```
NODE_ENV = *developement* nebo *production*
PORT = libovolný port
DATABASE_URI = mongodb://localhost/<název databáze> 
JWT_CODE = <libovolný kód pro zahešování JSON web tokenu>
```
Poté v terminálu:
`npm install` - pro nainstalování npm modulů nutných ke spuštění

Dále se proces mírně liší

### Vývoj
Je třeba otevřít dva terminály v rootu.

V prvním spustit příkaz `npm run dev`

V druhém spustit příkaz `npm run start` a poté stisknout Y

### Produkce
Zde stačí jeden terminál, kde:

Nejprve spustit příkaz `npm run build` a poté `npm run server`

## Technologie

### Backend
- Node.js
- MongoDB
- Mongoose

### Frontend
- React
- React query
- JavaScript

## Live verze

Projekt je dostupný také na https://forumapp.onrender.com