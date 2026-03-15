function dispatchToast(message: string) {
  window.dispatchEvent(
    new CustomEvent('app:error', {
      detail: { message },
    })
  )
}

export function registerGlobalErrorHandlers() {
  window.addEventListener('unhandledrejection', (event) => {
    event.preventDefault()
    console.error('unhandledrejection')
    dispatchToast(event.reason?.message ?? '알 수 없는 에러가 발생했습니다')
  })

  window.addEventListener('error', (event) => {
    event.preventDefault()
    console.error('error')
    dispatchToast(event.message ?? '알 수 없는 에러가 발생했습니다')
  })
}
