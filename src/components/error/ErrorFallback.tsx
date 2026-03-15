function ErrorFallback() {
  return (
    <section className="flex flex-col gap-6 place-content-center place-items-center flex-1 max-lg:px-5 max-lg:py-8">
      <div className="flex flex-col items-center gap-3 py-10 px-6">
        <p className="text-xl font-semibold text-red-600 m-0">
          렌더 에러가 발생했습니다
        </p>
        <p className="text-sm m-0 opacity-70" style={{ color: "var(--text)" }}>
          컴포넌트 렌더 중 에러가 발생하여 화면을 표시할 수 없습니다.
        </p>
      </div>
    </section>
  );
}

export default ErrorFallback;
