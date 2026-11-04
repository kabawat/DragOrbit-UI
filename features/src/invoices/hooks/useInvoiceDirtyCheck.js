import { useCallback, useMemo, useRef, useState } from "react";
import { getFormSnapshot } from "../utils/getFormSnapshot.js";

export function useInvoiceDirtyCheck(formData) {
  const [snapshot, setSnapshot] = useState(null);
  const initialSnapshotRef = useRef(null);

  const setInitialSnapshot = useCallback((data) => {
    const snap = getFormSnapshot(data);
    initialSnapshotRef.current = snap;
    setSnapshot(snap);
  }, []);

  const markPristine = useCallback(() => {
    const snap = getFormSnapshot(formData);
    initialSnapshotRef.current = snap;
    setSnapshot(snap);
  }, [formData]);

  const isDirty = useMemo(() => {
    const targetSnapshot = snapshot ?? initialSnapshotRef.current;
    if (!targetSnapshot) return false;
    return getFormSnapshot(formData) !== targetSnapshot;
  }, [formData, snapshot]);

  return {
    isDirty,
    setInitialSnapshot,
    markPristine,
    initialSnapshotRef,
  };
}

export default useInvoiceDirtyCheck;
