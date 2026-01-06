# API Vault

Panel para catalogar, evaluar y vigilar APIs de terceros. Combina ingesta asistida por IA (Gemini 2.5 Flash) con flujos manuales, persiste en PostgreSQL vía Prisma y se sirve con Next.js 16 (App Router) + React 19 + TailwindCSS 4 + Radix UI + shadcn/ui.

![Sidebar+LandingPage](/photos/image1.png)

## Características principales
- Ingesta automática con IA: extrae metadatos técnicos desde la documentación oficial (nombre, descripción, tipo de API, auth, SDKs, pricing, confianza) con validación Zod y reintento de reparación si la IA devuelve JSON inválido.
- Flujo de creación/edición asistido: prellena y permite correcciones humanas antes de persistir proveedor + API.
- CRUD completo de APIs, proveedor y llaves; revalidación y navegación con server actions.
- Detalle por API: resumen, llave protegida/máscara, contextos (recomendado/evitar), evaluaciones (costo, rendimiento, estabilidad, soporte), flags (black/gray/warning) y memorias técnicas de incidentes.
- Buscador en vivo y tarjetas con fechas formateadas para un catálogo rápido.

![IaIngestForm](/photos/image2.png)
![FormConfirm](/photos/image3.png)
![ApiDetails](/photos/image4.png)

## Arquitectura y stack

## Nuevas funcionalidades
- Se ha añadido el componente `ApisPerProvider` para mostrar las APIs de un proveedor específico.
- Se ha implementado la página `ProviderDetailsPage` para detallar información de un proveedor.
- Se ha creado el componente `FlagsCard` para mostrar las banderas de las APIs.
- Se han actualizado los componentes `ApiComponent`, `CreateFormConfirm`, `ProviderComponent`, `SearchApis` y `SearchProviders` para mejorar la funcionalidad y la experiencia del usuario.

- Frontend: Next.js 16 (App Router), React 19, TailwindCSS 4, Radix UI, shadcn/ui, theming con next-themes.
- Backend: Server Actions de Next, Prisma Client generado en `generated/prisma`, adaptador `@prisma/adapter-pg` y `pg` para PostgreSQL.
- IA: `@google/genai` (Gemini 2.5 Flash) para ingesta factual con schema validation (Zod) y estrategia de reparación de JSON.
- Utilidades: `date-fns` para formateo, `lucide-react` iconografía, `sonner` toasts, `motion` animaciones.

## Modelado de datos (Prisma)
- Provider ↔ Api (1:1) con metadatos clave, soporte y notas.
- ApiMemory (memorias técnicas), ApiEvaluation (métricas 0-5), ApiFlag (black/gray/warning), ApiContext (recomendado/evitar) con relaciones en cascada.

## Flujos funcionales
1) Crear API (IA): nombre + URL de docs → ingesta Gemini → borrador validado → revisión humana → guardar.
2) Crear API (manual): completar proveedor + API + metadatos → guardar.
3) Conocimiento operativo: añadir memorias, contextos, flags y evaluaciones desde el detalle de la API.
4) Catálogo: buscar en vivo y navegar a detalle.
5) Seed reproducible: ruta GET `/api/seed` con ejemplos (OpenAI, Stripe).

## Experiencia de usuario
- Layout con sidebar, toggle de tema y footer fijo.
- Landing con efectos de texto (rolling, shimmering, text-generate) para hero.
- Ediciones inline: flags, contextos, memorias y evaluaciones con revalidación inmediata.
- API Key con máscara, toggle de visibilidad y copy-to-clipboard; actualización rápida de llaves.

## Puesta en marcha (local)
1. Copia de variables: renombra `.env.template` a `.env` y completa credenciales (PostgreSQL, `GOOGLE_API_KEY`, etc.).
2. Base de datos: `docker compose up -d`.
3. Dependencias: `npm install`.
4. Migraciones: `npx prisma migrate dev`.
5. Cliente Prisma: `npx prisma generate`.
6. Datos demo (opcional): visitar `http://localhost:3000/api/seed`.
7. Desarrollo: `npm run dev` (http://localhost:3000).

## Scripts NPM
- `npm run dev` → modo desarrollo.
- `npm run build` → build de producción.
- `npm start` → servir build.
- `npm run lint` → ESLint.

## Próximos pasos sugeridos
- Autenticación y roles para equipos.
- Métricas históricas y comparativas entre proveedores.
- Exportación de reportes (CSV/PDF) con flags y evaluaciones.
- Alertas proactivas por cambios detectados en documentación oficial.