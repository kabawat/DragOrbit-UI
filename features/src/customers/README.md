# customers

Shared screen exports are available from `@dragorbit/features/customers` using the package wildcard.

- `screen/`: responsive presentation used by Store FE and Electron renderer.
- `component/`: shared presentation components; host models supply state, callbacks and service-bound component slots.
- Hosts own routing, translations, permissions, Redux, API/IPC repositories, persistence and payments.
- List headers accept an optional `syncStatus` slot for desktop controls.
- Do not copy shared presentation back into app repositories. Keep host adapters where platform behaviour differs.
