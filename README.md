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
- REST configured routes to creat and list the Restaurants, Categories, and Products.

-

## Frontend
   ### Web:
- web page arquitecture (Nest.js + Prisma)   

- Structure the rest of the menu. Based on the relationship defined (Restaurant -> Categories -> Products -> Orders), the next logical step in the backend is to generate the Categories and Products services, ensuring that the products support descriptions and images.

- Build the dashboard where restaurants will register by connecting to the API we just created.

- Create the menu registration form. goal here is to allow the creation of Categories and, within them, Products with descriptions and images.   

### Mobile:
 - Mobile front arquitecture:  (Expo/React Native)

 - Start by configuring the visual base, the network connection, and creating the application's home screen.

 - Config Tailwind (NativeWind) and Babel
 - Config Axios on Mobile



## Errors found and faced:
- Error Type Console AxiosError ## Error Message Network Error Next.js version: 16.2.6 (Turbopack)   |   node_modules/axios/lib/adapters/xhr.js (124:21)
```
I resolved this error by adding 'app.enableCors();' into the 'const app = await NestFactory.create' in main file on Nest.js
```

-Ponto a ser modificado: Estratégia para Imagens no MVP: Para manter o foco na simplicidade neste momento, deixei o campo de imagem como uma "URL" (link). Isso evita que precisemos configurar servidores complexos de armazenamento de arquivos (como AWS S3) logo de cara. Podemos colar qualquer link de imagem da internet para testar.

