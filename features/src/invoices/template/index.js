// Export all invoice templates (sorted alphabetically)

export { default as AeroTemplate } from "./standard/aero";
export { default as AetherTemplate } from "./standard/aether";
export { default as ApexTemplate } from "./standard/apex";
export { default as AuraTemplate } from "./standard/aura";
export { default as AuroraTemplate } from "./standard/aurora";
export { default as AurumTemplate } from "./standard/aurum";
export { default as CelesteTemplate } from "./standard/celeste";
export { default as ClassicTemplate } from "./standard/classic";
export { default as CleanDataSheet } from "./standard/clean-datasheet";
export { default as CosmicReceiptTemplate } from "./standard/cosmic-receipt";
export { default as CrystalTemplate } from "./standard/crystal";
export { default as EclipseTemplate } from "./standard/eclipse";
export { default as ElegantTemplate } from "./standard/elegant";
export { default as ElitePaperTemplate } from "./standard/elitepaper";
export { default as FlexviewTemplate } from "./standard/flexview";
export { default as FusionTemplate } from "./standard/fusion";
export { default as GeometricEdgeTemplate } from "./standard/geometric-edge";
export { default as InvoiceContainer } from "./InvoiceContainer";
export { default as LuminousLedgerTemplate } from "./standard/luminous-ledger";
export { default as LumosTemplate } from "./standard/lumos";
export { default as MatrixLedgerTemplate } from "./standard/matrix-ledger";
export { default as MinimalTemplate } from "./standard/minimal";
export { default as MinimalistMonochromeTemplate } from "./standard/minimalist-monochrome";
export { default as ModernStackedTemplate } from "./standard/modern-stacked";
export { default as ModernTemplate } from "./standard/modern";
export { default as NeoEdgeTemplate } from "./standard/neo-edge";
export { default as NeoGeometricTemplate } from "./standard/neo-geometric";
export { default as OrionTemplate } from "./standard/orion";
export { default as PillarProTemplate } from "./standard/pillar-pro";
export { default as PrismTemplate } from "./standard/prism";
export { default as ProfessionalBlueTemplate } from "./standard/professional-blue";
export { default as ProfessionalTemplate } from "./standard/professional";
export { default as RoyalEdgeTemplate } from "./standard/royal-edge";
export { default as RusticEleganceTemplate } from "./standard/rustic-elegance";
export { default as SleekStreamTemplate } from "./standard/sleek-stream";
export { default as SpectrumTemplate } from "./standard/spectrum";
export { default as StructedTemplate } from "./standard/structed";
export { default as TerraTemplate } from "./standard/terra";
export { default as VelocityLedgerTemplate } from "./standard/velocity-ledger";
export { default as VintageTemplate } from "./standard/vintage";
export { default as ZenithTemplate } from "./standard/zenith";

// Thermal Printer Templates
export { default as ThermalClassicTemplate } from "./mini/thermal-classic";
export { default as ThermalModernTemplate } from "./mini/thermal-modern";
export { default as ThermalCompactTemplate } from "./mini/thermal-compact";
export { default as ThermalMinimalTemplate } from "./mini/thermal-minimal";
export { default as ThermalBoldTemplate } from "./mini/thermal-bold";

// Template selector options (sorted alphabetically by label)
export const TEMPLATE_OPTIONS = [
  {
    value: "aero",
    label: "Aero",
    description: "Light and airy design",
    preview: "/images/templates/aero-preview.png",
  },
  {
    value: "aether",
    label: "Aether",
    description: "Ethereal and modern feel",
    preview: "/images/templates/aether-preview.png",
  },
  {
    value: "apex",
    label: "Apex",
    description: "Bold and striking design",
    preview: "/images/templates/apex-preview.png",
  },
  {
    value: "aura",
    label: "Aura",
    description: "Soft and calming aesthetics",
    preview: "/images/templates/aura-preview.png",
  },
  {
    value: "aurora",
    label: "Aurora",
    description: "Vibrant and dynamic design",
    preview: "/images/templates/aurora-preview.png",
  },
  {
    value: "aurum",
    label: "Aurum",
    description: "Luxurious gold-themed design",
    preview: "/images/templates/aurum-preview.png",
  },
  {
    value: "celeste",
    label: "Celeste",
    description: "Light and elegant design",
    preview: "/images/templates/celeste-preview.png",
  },
  {
    value: "classic",
    label: "Classic",
    description: "Traditional formal style",
    preview: "/images/templates/classic-preview.png",
  },
  {
    value: "CleanDataSheet",
    label: "Clean Data Sheet",
    description: "Structured and data-focused design",
    preview: "/images/templates/clean-datasheet-preview.png",
  },
  {
    value: "cosmicreceipt",
    label: "Cosmic Receipt",
    description: "Futuristic dark mode receipt style",
    preview: "/images/templates/cosmic-receipt-preview.png",
  },
  {
    value: "crystal",
    label: "Crystal",
    description: "Clear and polished style",
    preview: "/images/templates/crystal-preview.png",
  },
  {
    value: "eclipse",
    label: "Eclipse",
    description: "Dark mode with modern aesthetics",
    preview: "/images/templates/eclipse-preview.png",
  },
  {
    value: "elegant",
    label: "Elegant",
    description: "Sophisticated and stylish",
    preview: "/images/templates/elegant-preview.png",
  },
  {
    value: "elitepaper",
    label: "Elite Paper",
    description: "Premium and sophisticated design",
    preview: "/images/templates/elite-paper-preview.png",
  },
  {
    value: "flexview",
    label: "Flexview",
    description: "Versatile and modern design",
    preview: "/images/templates/flex-view-preview.png",
  },
  {
    value: "fusion",
    label: "Fusion",
    description: "Dynamic and vibrant design",
    preview: "/images/templates/fusion-preview.png",
  },
  {
    value: "geometricedge",
    label: "Geometric Edge",
    description: "Bold geometric shapes with sharp edges",
    preview: "/images/templates/geometric-edge-preview.png",
  },
  {
    value: "luminousledger",
    label: "Luminous Ledger",
    description: "Bright and clear design with emphasis on readability",
    preview: "/images/templates/luminous-ledger-preview.png",
  },
  {
    value: "lumos",
    label: "Lumos",
    description: "Bright and clear design",
    preview: "/images/templates/lumos-preview.png",
  },
  {
    value: "matrix-ledger",
    label: "Matrix Ledger",
    description: "Structured design with emphasis on clarity",
    preview: "/images/templates/matrix-ledger-preview.png",
  },
  {
    value: "minimal",
    label: "Minimal",
    description: "Simple and elegant",
    preview: "/images/templates/minimal-preview.png",
  },
  {
    value: "minimalistmonochrome",
    label: "Minimalist Monochrome",
    description: "Clean and simple monochrome design",
    preview: "/images/templates/minimalist-monochrome-preview.png",
  },
  {
    value: "modern",
    label: "Modern",
    description: "Contemporary clean design",
    preview: "/images/templates/modern-preview.png",
  },
  {
    value: "modernstacked",
    label: "Modern Stacked",
    description: "Contemporary stacked layout with bold accents",
    preview: "/images/templates/modern-stacked-preview.png",
  },
  {
    value: "neo-geometric",
    label: "Neo Geometric",
    description: "Sleek design with geometric elements",
    preview: "/images/templates/neo-geometric-preview.png",
  },
  {
    value: "neo-edge",
    label: "Neo Edge",
    description: "Sleek and modern design with sharp edges",
    preview: "/images/templates/neo-edge-preview.png",
  },
  {
    value: "orion",
    label: "Orion",
    description: "Stellar and modern look",
    preview: "/images/templates/orion-preview.png",
  },
  {
    value: "pillar-pro",
    label: "Pillar Pro",
    description: "Professional design with brand colors",
    preview: "/images/templates/pillar-pro-preview.png",
  },
  {
    value: "prism",
    label: "Prism",
    description: "Clear and polished style",
    preview: "/images/templates/prism-preview.png",
  },
  {
    value: "professional",
    label: "Professional",
    description: "Business with signatures",
    preview: "/images/templates/professional-preview.png",
  },
  {
    value: "professional-blue",
    label: "Professional Blue",
    description: "Professional design with blue accents",
    preview: "/images/templates/professional-blue-preview.png",
  },
  {
    value: "royal-edge",
    label: "Royal Edge",
    description: "Elegant design with regal accents",
    preview: "/images/templates/royal-edge-preview.png",
  },
  {
    value: "rustic-elegance",
    label: "Rustic Elegance",
    description: "Warm and charming rustic design",
    preview: "/images/templates/rustic-elegance-preview.png",
  },
  {
    value: "sleek-stream",
    label: "Sleek Stream",
    description: "Modern design with fluid elements",
    preview: "/images/templates/sleek-stream-preview.png",
  },
  {
    value: "spectrum",
    label: "Spectrum",
    description: "Vibrant and colorful design",
    preview: "/images/templates/spectrum-preview.png",
  },
  {
    value: "structed",
    label: "Structured",
    description: "Organized and neat layout",
    preview: "/images/templates/structed-preview.png",
  },
  {
    value: "terra",
    label: "Terra",
    description: "Earthy and natural tones",
    preview: "/images/templates/terra-preview.png",
  },
  {
    value: "velocity-ledger",
    label: "Velocity Ledger",
    description: "Dynamic and fast-paced design",
    preview: "/images/templates/velocity-ledger-preview.png",
  },
  {
    value: "vintage",
    label: "Vintage",
    description: "Retro and classic look",
    preview: "/images/templates/vintage-preview.png",
  },
  {
    value: "zenith",
    label: "Zenith",
    description: "Peak professional style",
    preview: "/images/templates/zentith-preview.png",
  },
  {
    value: "thermal-classic",
    label: "Thermal Classic",
    description: "Classic 80mm thermal receipt",
    preview: "/images/templates/thermal-classic-preview.png",
  },
  {
    value: "thermal-modern",
    label: "Thermal Modern",
    description: "Modern 80mm thermal receipt",
    preview: "/images/templates/thermal-modern-preview.png",
  },
  {
    value: "thermal-compact",
    label: "Thermal Compact",
    description: "Compact 58mm thermal receipt",
    preview: "/images/templates/thermal-compact-preview.png",
  },
  {
    value: "thermal-minimal",
    label: "Thermal Minimal",
    description: "Minimal 80mm thermal receipt",
    preview: "/images/templates/thermal-minimal-preview.png",
  },
  {
    value: "thermal-bold",
    label: "Thermal Bold",
    description: "Bold 80mm thermal receipt",
    preview: "/images/templates/thermal-bold-preview.png",
  },
];
