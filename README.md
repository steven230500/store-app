# StoreApp - E-commerce Mobile App

Aplicación móvil de e-commerce con React Native, TypeScript y Redux Toolkit. Incluye pagos con Wompi y actualizaciones en tiempo real.

## Características Principales

- Catálogo de productos con categorías dinámicas
- Carrito de compras con gestión de cantidades
- Pagos integrados con Wompi (sandbox)
- Actualizaciones en tiempo real vía SSE
- UI moderna con tema consistente
- Responsive para iOS y Android
- Estado persistente con Redux Persist

## 🏗️ Arquitectura

```
src/
├── app/                 # Pantallas principales
├── core/               # Servicios base (API, SSE, theme)
├── modules/            # Módulos funcionales
│   ├── cart/          # Gestión del carrito
│   ├── payment/       # Integración de pagos
│   ├── products/      # Catálogo de productos
│   └── ui/            # Componentes reutilizables
└── store/             # Estado global (Redux)
```

## Tecnologías

- React Native - Framework móvil
- TypeScript - Tipado estático
- Redux Toolkit - Gestión de estado
- React Navigation - Navegación
- Axios - Cliente HTTP
- React Native SSE - Eventos del servidor
- React Native Vector Icons - Iconografía

## Prerrequisitos

- Node.js >= 16
- npm o pnpm
- React Native CLI
- Android Studio (para Android)
- Xcode (para iOS)

## Instalación y Ejecución

### 1. Instalar dependencias

```sh
# Usando pnpm (recomendado)
pnpm install

# O usando npm
npm install
```

### 2. Instalar dependencias nativas (iOS)

```sh
# Solo primera vez o después de actualizar dependencias nativas
bundle install
bundle exec pod install
```

### 3. Iniciar Metro

```sh
# Usando pnpm
pnpm start

# O usando npm
npm start
```

### 4. Ejecutar la aplicación

#### Android
```sh
# Usando pnpm
pnpm run android

# O usando npm
npm run android
```

#### iOS
```sh
# Usando pnpm
pnpm run ios

# O usando npm
npm run ios
```

## Configuración del Backend

La aplicación requiere un backend que proporcione:

### API Endpoints
- `GET /products` - Lista de productos
- `GET /categories` - Lista de categorías
- `POST /transactions` - Crear transacción de pago
- `GET /transactions/{reference}/events` - SSE para estado de pagos

### Variables de Entorno
```env
WOMPI_PUBLIC_KEY=tu_clave_publica_de_wompi
WOMPI_PRIVATE_KEY=tu_clave_privada_de_wompi
DATABASE_URL=tu_url_de_base_de_datos
```

## Características de la App

### Pantalla Principal
- Header personalizado con título y botón del carrito
- Badge del carrito mostrando cantidad total de items
- Campo de búsqueda moderno con diseño circular
- Categorías dinámicas con productos destacados

### Detalle de Producto
- Imágenes del producto con placeholder
- Controles de cantidad modernos con iconos + y -
- Información de stock con colores indicadores
- Cálculo automático del total
- Botón de agregar al carrito con debounce

### Carrito de Compras
- Lista de productos con controles de cantidad
- Total dinámico del pedido
- Botón de checkout directo al pago

### Proceso de Pago
- Integración Wompi (sandbox)
- Formulario de tarjeta seguro
- Estados de pago en tiempo real vía SSE
- Feedback visual durante el proceso

### Server-Sent Events (SSE)
- Conexión persistente para actualizaciones en tiempo real
- Estados del pago: PENDING → APPROVED/DECLINED
- Heartbeats cada 30 segundos para mantener conexión
- Desconexión automática cuando finaliza el pago

## Tema y Diseño

### Colores Principales
- Primary: Azul (#007bff)
- Background: Blanco (#ffffff)
- Surface: Gris claro (#f8f9fa)
- Text: Negro (#212529)
- Success: Verde (#28a745)
- Error: Rojo (#dc3545)

### Componentes Reutilizables
- Button: Variantes (primary, secondary, outline)
- Card: Con sombras y bordes redondeados
- Toast: Notificaciones temporales
- Badge: Indicadores numéricos

## Estado Global (Redux)

### Slices
- productsSlice: Gestión de productos y categorías
- cartSlice: Carrito de compras
- paymentSlice: Estado del formulario de pago
- transactionsSlice: Historial de transacciones

### Persistencia
- Redux Persist: Estado guardado localmente
- AsyncStorage: Almacenamiento en dispositivo

## Build de Producción

### Android
```sh
# Generar APK
cd android && ./gradlew assembleRelease
```

### iOS
```sh
# Archivar app
xcodebuild -workspace ios/StoreApp.xcworkspace -scheme StoreApp -configuration Release archive
```
