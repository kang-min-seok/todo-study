import CollaborativeEditor from '../components/CollaborativeEditor'

// key={docId} — docId가 바뀌면 컴포넌트를 언마운트 후 재마운트
// Y.Doc / WebsocketProvider가 완전히 새로 만들어져야 하기 때문
const DOC_ID = 'todo-note'

function EditorPage() {
  return (
    <section className="flex flex-col flex-1 px-5 py-8" style={{ minHeight: 0 }}>
      <h1 className="text-2xl font-medium text-(--text-h) mb-6">실시간 협업 에디터</h1>
      <div className="flex-1" style={{ minHeight: 0 }}>
        <CollaborativeEditor key={DOC_ID} docId={DOC_ID} />
      </div>
    </section>
  )
}

export default EditorPage
