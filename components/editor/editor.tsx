"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Placeholder } from "@tiptap/extensions"

const Tiptap = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write something...",
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    autofocus: "start",
    // Don't render immediately on the server to avoid SSR issues
    immediatelyRender: false,
  })

  return (
    <EditorContent editor={editor} className="min-h-screen w-full" />
  )
}

export default Tiptap
