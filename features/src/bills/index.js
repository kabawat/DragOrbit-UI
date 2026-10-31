// Screens
export { BillsScreen, default } from "./screen/BillsScreen.jsx";
export { BillFormView } from "./screen/BillFormView.jsx";

// Components - Form & Create
export { BillItemsSection } from "./component/BillItemsSection.jsx";
export { BillSidebar } from "./component/BillSidebar.jsx";
export { AddedBillItemsList } from "./component/AddedBillItemsList.jsx";
export { BillStickyActionsBar } from "./component/BillStickyActionsBar.jsx";
export { BillTopHeader } from "./component/BillTopHeader.jsx";

// Components - List & Detail
export { BillListHeaderView } from "./component/BillListHeaderView.jsx";
export { BillListContentView } from "./component/BillListContentView.jsx";
export { BillTableView } from "./component/BillTableView.jsx";
export { BillCardView } from "./component/BillCardView.jsx";
export { BillDeleteConfirmModalPresentation } from "./component/BillDeleteConfirmModalView.jsx";
export { BillGridPresentation } from "./component/BillGridView.jsx";

// Backward-compatibility aliases
export { BillItemsSection as CreateBillItemsSectionPresentation, BillItemsSection as BillItemsSectionView } from "./component/BillItemsSection.jsx";
export { BillSidebar as CreateBillSidebarPresentation, BillSidebar as BillSidebarView } from "./component/BillSidebar.jsx";

// Hooks
export * from "./hooks/index.js";

// Utils
export * from "./utils/index.js";
