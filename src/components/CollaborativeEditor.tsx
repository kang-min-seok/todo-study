import { useEffect, useState } from 'react'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { useCreateBlockNote } from '@blocknote/react'
import { BlockNoteView } from '@blocknote/mantine'
import '@blocknote/mantine/style.css'

const NAMES = ['Alice', 'Bob', 'Carol', 'Dave', 'Eve', 'Frank']
const COLORS = ['#e03131', '#2f9e44', '#1971c2', '#e67700', '#9c36b5']

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

interface Props {
  docId: string
}

function CollaborativeEditor({ docId }: Props) {
  // lazy initializer: 첫 렌더 때 딱 한 번만 실행됨
  // ref.current를 렌더 중에 읽는 것과 달리 React Compiler가 허용하는 패턴
  const [{ doc, provider, userName, userColor }] = useState(() => {
    const doc = new Y.Doc()
    const provider = new WebsocketProvider(
      import.meta.env.VITE_WS_BASE_URL + '/ws/editor',
      docId,
      doc
    )
    return {
      doc,
      provider,
      userName: randomPick(NAMES),
      userColor: randomPick(COLORS),
    }
  })

  // provider.wsconnected: 렌더 시점의 연결 상태로 초기값 설정
  // StrictMode에서 effects가 cleanup → 재실행될 때 state는 보존되므로
  // 한 번 true가 된 connected는 재마운트 후에도 true를 유지함
  const [connected, setConnected] = useState(provider.wsconnected)

  // 연결 상태 감지 — setState는 반드시 콜백 안에서만 호출 (React Compiler 규칙)
  useEffect(() => {
    const handler = ({ status }: { status: string }) => {
      setConnected(status === 'connected')
    }
    provider.on('status', handler)
    return () => {
      provider.off('status', handler)
    }
    // provider.destroy()를 여기서 호출하면 StrictMode의 시뮬레이션 언마운트에서도 실행됨
    // → cleanup 후 재실행되는 effects가 죽은 provider에 등록 → connected 영원히 false
    // → 탭을 닫을 때 브라우저가 WebSocket 연결을 자동 종료함
  }, [provider])

  // useCreateBlockNote는 훅이므로 조건문 없이 최상위 레벨에서 호출
  const editor = useCreateBlockNote({
    collaboration: {
      provider,
      fragment: doc.getXmlFragment('document-store'),
      user: {
        name: userName,
        color: userColor,
      },
      showCursorLabels: 'activity',
    },
  })

  return (
    <div className="flex flex-col h-full">
      {/* 상태 바 */}
      <div className="flex items-center gap-2 px-1 mb-3">
        <span className={`w-2 h-2 rounded-full shrink-0 ${connected ? 'bg-green-500' : 'bg-red-400'}`} />
        <span className="text-sm text-(--text) opacity-70">
          {connected ? `${userName} 으로 연결됨` : '서버에 연결 중...'}
        </span>
        <span className="text-xs text-(--text) opacity-30 ml-auto">doc: {docId}</span>
      </div>

      {/* BlockNoteView — 커서 오버레이, Awareness, CRDT 동기화 모두 내장 */}
      <div className="flex-1 rounded-lg border border-(--border) overflow-auto">
        <BlockNoteView editor={editor} />
      </div>
    </div>
  )
}

export default CollaborativeEditor
