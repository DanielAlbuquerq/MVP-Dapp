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

- Architecture based on the concept of an Access Token (a quick, short-duration pass) and a Refresh Token (a long-duration pass used to renew the session without disturbing the user).

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



# Errors found and faced:

## Frontend Errors
##### Nativewind setup notes
If you encounter `Nativewind received no data`, the fix is:
- Remove `isCSSEnabled: false` from `metro.config.js`
- Keep `withNativeWind(config, { input: './global.css' })` in `metro.config.js`
- Ensure `tailwind.config.js` includes `./src/**/*.{js,jsx,ts,tsx}` in `content`
- Import `global.css` once in the app root (for example in `src/app/_layout.tsx`)
- Restart Metro with `npx expo start -c`
- `Make sure you have only one global.css file in the root`

##### ERROR: JAVA_HOME is not set and no 'java' command could be found in your PATH. 

```
RESOLUTION: 
- I had to install dependencies: Java SE Development Kit (JDK) and I needed to set up the system paths (Enviroment variable) to recognize the android emulator and expo build drivers.

```

##### Expo Erros (Expo go and Expo dev build (EAS)):

```
RESOLUTION: 
- I faced an error to sync the expo application to devices phones using wireless connection, I had to config the Expo Go to run correctly on iOs system with limited plugins. 
```

##### 📋 Expo: Overview of the Issues During a local native Android build (npx expo run:android) on Windows

```
-the build failed due to a combination of two distinct issues:Gradle 9 Compatibility Crash: An outdated Foojay toolchain resolver plugin injected by the underlying framework looked for an obsolete property (JvmVendorSpec.IBM_SEMERU) that was removed in Gradle 9+, crashing the initialization of DistributionsKt.Missing Android SDK Path: After regenerating clean native files, the local build environment on Windows could not locate the Android SDK directory (ANDROID_HOME).

-RESOLUTION: 
Step 1: Force Generation of Native Android Files - Step 2: Patching the Gradle Toolchain Compatibility
Step 3: Mapping the Android SDK Location on Windows - Step 4: Cache Purge & Rebuild

```

#### Android Bundling failed 9916ms node_modules\expo-router\entry.js (1 module)
 ERROR  Error: [BABEL] C:\Users\danie\OneDrive\Documents\MVP-Delivery\mobile\node_modules\expo-router\entry.js: .plugins is not a valid Plugin property
```
-RESOLUTION: 
Step 1: I needed to change the babel.config.js file because the pluging array came an old version by default
```

## Backend Erros:

PRISMA:
No cast exists, the column would be dropped and recreated, which cannot be done since the column is required and there is data in the table.
```
-Resolution: 
1. Add a temporary column: Create a new column with the desired data type (and allow it to be null for now).
2. Migrate the data: Run an UPDATE statement to copy data from the old column to the new one, using a manual conversion function (like CAST or TO_NUMBER) to handle the logic.
3. Drop the old column: Now that the data is safe in the temp column, remove the original.
4. Rename & Constrain: Rename the temporary column to the original name and apply the NOT NULL constraint.
```

## Web Erros:

##### Error Type Console AxiosError ## Error Message Network Error Next.js version: 16.2.6 (Turbopack)   |   node_modules/axios/lib/adapters/xhr.js (124:21)
```
RESOLUTION: 
- I resolved this error by adding 'app.enableCors();' into the 'const app = await NestFactory.create' in main file on Nest.js
```
__________________________________________________
PONTOS A SEREM OBSERVADOS:

-Interessante: O Next.js pré-carrega (faz prefetch) das páginas dos <Link> que aparecem na tela, deixando a navegação instantânea. Motores de busca (Google) também leem melhor o <Link>.

-Ponto a ser modificado: Estratégia para Imagens no MVP: Para manter o foco na simplicidade neste momento, deixei o campo de imagem como uma "URL" (link). Isso evita que precisemos configurar servidores complexos de armazenamento de arquivos (como AWS S3) logo de cara. Podemos colar qualquer link de imagem da internet para testar.

- URGENTE: 
- Criar lógica que apenas o Admin e Gerentes da empresa poderá criar os Restaurantes (Role = Restaurant não pode criar).

- Campo de preço não pode aceitar valores altos.

- pass all feature to Jira