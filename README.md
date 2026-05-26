# MVP - Online Menu - D app

## Author:
Daniel Mendes de Albuquerque
- [@danielMendes](https://github.com/DanielAlbuquerq?tab=repositories)

### A brief description of what this project does and who it's for: 
```
My name is Daniel and this is my first MVP, an "Online Menu" for local markets (restaurants) in small towns.
```

## 🛠 Overview of Current Architecture

- 📂 `Backend/` (Nest.js, Prisma, to conect to Postgres)  
- 📂 `Web/` (Next.js, Tailwind, for Admin/Restaurant management panel)  
- 📂 `Mobile/` (React Native, Expo, for client app)  

## Backend:   
- I started by modeling the database, defining how all our information will flow between the backend, the web, and the mobile app.

- After modeling the database and finalizing the migration, I started creating the services and routes for our API so we could begin saving and retrieving data from the database.


#### ``Restaurants CRUD:``

COFIGURING THE CONTROLLER:
- REST configured to creat and list the Restaurants

## Web: 


## Frontend:

- structure the rest of the menu. Based on the relationship defined (Restaurant -> Categories -> Products -> Orders), the next logical step in the backend is to generate the Categories and Products services, ensuring that the products support descriptions and images.

- Build the dashboard where restaurants will register by connecting to the API we just created.
