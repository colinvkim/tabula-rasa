"use client"

import { type Editor, useEditorState } from "@tiptap/react"

import { Button } from "@/components/ui/button"

type BlockTypeValue =
  | "paragraph"
  | "heading-1"
  | "heading-2"
  | "heading-3"
  | "heading-4"
  | "heading-5"
  | "heading-6"
  | "blockquote"
  | "bullet-list"
  | "ordered-list"
  | "code-block"

type ToolbarState = {
  activeBlock: BlockTypeValue
  isBold: boolean
  isItalic: boolean
  isUnderline: boolean
  isStrike: boolean
  isCode: boolean
  isLink: boolean
  canLink: boolean
  canUnlink: boolean
  canUndo: boolean
  canRedo: boolean
  canInsertHorizontalRule: boolean
  canInsertHardBreak: boolean
  currentLink: string
}

const blockTypeOptions: Array<{ label: string; value: BlockTypeValue }> = [
  { label: "Paragraph", value: "paragraph" },
  { label: "Heading 1", value: "heading-1" },
  { label: "Heading 2", value: "heading-2" },
  { label: "Heading 3", value: "heading-3" },
  { label: "Heading 4", value: "heading-4" },
  { label: "Heading 5", value: "heading-5" },
  { label: "Heading 6", value: "heading-6" },
  { label: "Blockquote", value: "blockquote" },
  { label: "Bulleted list", value: "bullet-list" },
  { label: "Numbered list", value: "ordered-list" },
  { label: "Code block", value: "code-block" },
]

function getActiveBlockType(editor: Editor): BlockTypeValue {
  if (editor.isActive("codeBlock")) {
    return "code-block"
  }

  if (editor.isActive("blockquote")) {
    return "blockquote"
  }

  if (editor.isActive("bulletList")) {
    return "bullet-list"
  }

  if (editor.isActive("orderedList")) {
    return "ordered-list"
  }

  for (let level = 1; level <= 6; level += 1) {
    if (editor.isActive("heading", { level })) {
      return `heading-${level}` as BlockTypeValue
    }
  }

  return "paragraph"
}

function setBlockType(editor: Editor, value: BlockTypeValue) {
  const chain = editor.chain().focus()

  switch (value) {
    case "paragraph":
      chain.setParagraph().run()
      return
    case "heading-1":
      chain.toggleHeading({ level: 1 }).run()
      return
    case "heading-2":
      chain.toggleHeading({ level: 2 }).run()
      return
    case "heading-3":
      chain.toggleHeading({ level: 3 }).run()
      return
    case "heading-4":
      chain.toggleHeading({ level: 4 }).run()
      return
    case "heading-5":
      chain.toggleHeading({ level: 5 }).run()
      return
    case "heading-6":
      chain.toggleHeading({ level: 6 }).run()
      return
    case "blockquote":
      chain.toggleBlockquote().run()
      return
    case "bullet-list":
      chain.toggleBulletList().run()
      return
    case "ordered-list":
      chain.toggleOrderedList().run()
      return
    case "code-block":
      chain.toggleCodeBlock().run()
      return
  }
}

function normalizeUrl(value: string) {
  const trimmedValue = value.trim()

  if (!trimmedValue) {
    return ""
  }

  if (/^[a-zA-Z][a-zA-Z\d+.-]*:/.test(trimmedValue)) {
    return trimmedValue
  }

  return `https://${trimmedValue}`
}

function ToolbarButton({
  label,
  active = false,
  disabled = false,
  onClick,
}: {
  label: string
  active?: boolean
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <Button
      type="button"
      size="sm"
      variant={active ? "secondary" : "ghost"}
      aria-pressed={active}
      aria-label={label}
      disabled={disabled}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className="rounded-xl"
    >
      {label}
    </Button>
  )
}

export function EditorToolbar({ editor }: { editor: Editor }) {
  const editorState = useEditorState({
    editor,
    selector: ({ editor: currentEditor }): ToolbarState => {
      if (!currentEditor) {
        return {
          activeBlock: "paragraph",
          isBold: false,
          isItalic: false,
          isUnderline: false,
          isStrike: false,
          isCode: false,
          isLink: false,
          canLink: false,
          canUnlink: false,
          canUndo: false,
          canRedo: false,
          canInsertHorizontalRule: false,
          canInsertHardBreak: false,
          currentLink: "",
        }
      }

      const currentHref = currentEditor.getAttributes("link").href

      return {
        activeBlock: getActiveBlockType(currentEditor),
        isBold: currentEditor.isActive("bold"),
        isItalic: currentEditor.isActive("italic"),
        isUnderline: currentEditor.isActive("underline"),
        isStrike: currentEditor.isActive("strike"),
        isCode: currentEditor.isActive("code"),
        isLink: currentEditor.isActive("link"),
        canLink:
          !currentEditor.state.selection.empty || currentEditor.isActive("link"),
        canUnlink: currentEditor.isActive("link"),
        canUndo: currentEditor.can().chain().focus().undo().run(),
        canRedo: currentEditor.can().chain().focus().redo().run(),
        canInsertHorizontalRule: currentEditor
          .can()
          .chain()
          .focus()
          .setHorizontalRule()
          .run(),
        canInsertHardBreak: currentEditor
          .can()
          .chain()
          .focus()
          .setHardBreak()
          .run(),
        currentLink: typeof currentHref === "string" ? currentHref : "",
      }
    },
  })

  const applyLink = () => {
    const nextValue = window.prompt(
      "Enter a URL",
      editorState.currentLink || "https://"
    )

    if (nextValue === null) {
      return
    }

    const normalizedUrl = normalizeUrl(nextValue)

    if (!normalizedUrl) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: normalizedUrl })
      .run()
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center rounded-2xl border border-border/70 bg-background/90 p-1 shadow-sm">
        <label htmlFor="editor-block-type" className="sr-only">
          Turn current block into
        </label>
        <select
          id="editor-block-type"
          value={editorState.activeBlock}
          onChange={(event) => setBlockType(editor, event.target.value as BlockTypeValue)}
          className="h-8 rounded-xl border-none bg-transparent px-3 text-sm font-medium text-foreground outline-none"
        >
          {blockTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap items-center gap-1 rounded-2xl border border-border/70 bg-background/90 p-1 shadow-sm">
        <ToolbarButton
          label="Bold"
          active={editorState.isBold}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
        <ToolbarButton
          label="Italic"
          active={editorState.isItalic}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />
        <ToolbarButton
          label="Underline"
          active={editorState.isUnderline}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        />
        <ToolbarButton
          label="Strike"
          active={editorState.isStrike}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        />
        <ToolbarButton
          label="Code"
          active={editorState.isCode}
          onClick={() => editor.chain().focus().toggleCode().run()}
        />
        <ToolbarButton
          label={editorState.isLink ? "Edit link" : "Link"}
          active={editorState.isLink}
          disabled={!editorState.canLink}
          onClick={applyLink}
        />
        <ToolbarButton
          label="Unlink"
          disabled={!editorState.canUnlink}
          onClick={() => editor.chain().focus().extendMarkRange("link").unsetLink().run()}
        />
      </div>

      <div className="flex flex-wrap items-center gap-1 rounded-2xl border border-border/70 bg-background/90 p-1 shadow-sm">
        <ToolbarButton
          label="Rule"
          disabled={!editorState.canInsertHorizontalRule}
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        />
        <ToolbarButton
          label="Break"
          disabled={!editorState.canInsertHardBreak}
          onClick={() => editor.chain().focus().setHardBreak().run()}
        />
      </div>

      <div className="flex flex-wrap items-center gap-1 rounded-2xl border border-border/70 bg-background/90 p-1 shadow-sm">
        <ToolbarButton
          label="Undo"
          disabled={!editorState.canUndo}
          onClick={() => editor.chain().focus().undo().run()}
        />
        <ToolbarButton
          label="Redo"
          disabled={!editorState.canRedo}
          onClick={() => editor.chain().focus().redo().run()}
        />
      </div>
    </div>
  )
}
