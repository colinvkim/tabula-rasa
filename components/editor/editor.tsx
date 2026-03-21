"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Placeholder } from "@tiptap/extensions"

import { EditorToolbar } from "@/components/editor/editor-toolbar"

const Tiptap = () => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: {
          openOnClick: false,
        },
      }),
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
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-20 border-b border-border/70 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto w-full max-w-6xl px-3 py-3 sm:px-5">
          {editor ? <EditorToolbar editor={editor} /> : null}
        </div>
      </div>

      <div className="mx-auto w-full max-w-5xl">
        <EditorContent editor={editor} className="w-full" />
      </div>
    </div>
  )
}

export default Tiptap
