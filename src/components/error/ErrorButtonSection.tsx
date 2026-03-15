import { useState } from "react";
import { cn } from "../../utils/cn";

const btnBase =
  "inline-flex rounded px-2.5 py-1.5 text-sm border-2 border-transparent";

const btnDanger =
  "text-red-600 bg-red-50 hover:border-red-600 dark:text-red-400 dark:bg-[#2d1b1b]";

const btnWarning =
  "text-amber-600 bg-amber-50 hover:border-amber-600 dark:text-amber-400 dark:bg-[#2d2310]";

function ErrorButtonSection() {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error("의도적인 렌더링 에러가 발생했습니다!");
  }

  const handleError = () => {
    throw new Error("의도적 동기 에러");
  };

  const handleAsyncError = async () => {
    throw new Error("의도적 비동기 에러");
  };

  return (
    <section className="flex flex-col gap-6 place-content-center place-items-center flex-1 max-lg:px-5 max-lg:py-8 max-lg:gap-4.5">
      <div className="flex flex-wrap justify-center gap-2.5 mb-6">
        <button
          className={cn(btnBase, btnDanger)}
          onClick={() => setShouldThrow(true)}
        >
          렌더 에러 발생
        </button>
        <button className={cn(btnBase, btnWarning)} onClick={handleError}>
          일반 에러 발생
        </button>
        <button className={cn(btnBase, btnWarning)} onClick={handleAsyncError}>
          비동기 에러 발생
        </button>
      </div>
    </section>
  );
}

export default ErrorButtonSection;
