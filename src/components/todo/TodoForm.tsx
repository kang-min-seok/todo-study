import { useState } from "react";

interface Props {
  onAdd: (title: string) => void;
}

function TodoForm({ onAdd }: Props) {
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-lg">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="할일을 입력하세요"
        className="flex-1 px-4 py-2 rounded-lg border border-(--border) bg-(--bg) text-(--text-h) text-sm placeholder:text-(--text) focus:outline-none focus:border-(--accent) transition-colors"
      />
      <button
        type="submit"
        className="px-4 py-2 rounded-lg bg-(--accent) text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 cursor-pointer"
        disabled={!title.trim()}
      >
        추가
      </button>
    </form>
  );
}

export default TodoForm;
