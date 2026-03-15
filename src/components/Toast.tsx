import { useEffect, useState } from "react";

interface ToastItem {
  id: number;
  message: string;
}

let nextId = 0;

function Toast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handler = (event: Event) => {
      const { message } = (event as CustomEvent<{ message: string }>).detail;
      const id = nextId++;

      setToasts((prev) => [...prev, { id, message }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    };

    window.addEventListener("app:error", handler);
    return () => window.removeEventListener("app:error", handler);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-9999">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="bg-[#1a1a1a] text-white py-3 px-4.5 rounded-lg text-sm shadow-[0_4px_12px_rgba(0,0,0,0.3)] border-l-4 border-red-600 max-w-xs animate-[toast-in_0.2s_ease]"
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}

export default Toast;
