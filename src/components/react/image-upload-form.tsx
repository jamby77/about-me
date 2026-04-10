import { useEffect, useMemo, useRef, useState, type ChangeEvent, type DragEvent, type FormEventHandler } from "react"
import { IconPhoto, IconUpload, IconLoader2 } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const MAX_BYTES = 5 * 1024 * 1024

interface Props {
  action: string
  inputName: string
  inputId?: string
  accept?: string
  hidden?: Record<string, string | number>
  submitLabel?: string
  title?: string
  hint?: string
  formClassName?: string
}

export function ImageUploadForm({
  action,
  inputName,
  inputId,
  accept = "image/*",
  hidden = {},
  submitLabel = "Upload",
  title = "Upload image",
  hint = "Max 5MB. PNG/JPEG/WebP recommended.",
  formClassName,
}: Props) {
  const resolvedId = inputId ?? inputName
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [sizeError, setSizeError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("Waiting")
  const [uploading, setUploading] = useState(false)
  const previewUrl = useMemo(() => (file && file.type.startsWith("image/") ? URL.createObjectURL(file) : null), [file])

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  function acceptFile(candidate: File | null | undefined) {
    setProgress(0)
    setStatus("Waiting")
    if (!candidate) {
      setFile(null)
      setSizeError(null)
      return false
    }
    if (candidate.size > MAX_BYTES) {
      setFile(null)
      setSizeError(
        `File is ${(candidate.size / 1024 / 1024).toFixed(1)} MB — the 5 MB limit is enforced on the server.`,
      )
      if (inputRef.current) inputRef.current.value = ""
      return false
    }
    setFile(candidate)
    setSizeError(null)
    return true
  }

  function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    acceptFile(event.target.files?.[0] ?? null)
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    const droppedFile = event.dataTransfer.files?.[0]
    if (!droppedFile || !inputRef.current) return

    if (!acceptFile(droppedFile)) return

    const dataTransfer = new DataTransfer()
    dataTransfer.items.add(droppedFile)
    inputRef.current.files = dataTransfer.files
  }

  const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    if (!file) return

    const formData = new FormData(event.currentTarget)
    setUploading(true)
    setStatus("Uploading")

    const request = new XMLHttpRequest()
    request.open("POST", window.location.href, true)
    request.withCredentials = true

    request.upload.onprogress = (uploadEvent) => {
      if (!uploadEvent.lengthComputable) return
      const nextProgress = Math.round((uploadEvent.loaded / uploadEvent.total) * 100)
      setProgress(nextProgress)
    }

    request.onload = () => {
      setUploading(false)
      if (request.status >= 200 && request.status < 400) {
        setStatus("Done")
        if (request.responseURL && request.responseURL !== window.location.href) {
          window.location.assign(request.responseURL)
          return
        }
        window.location.reload()
        return
      }

      setStatus("Upload failed")
    }

    request.onerror = () => {
      setUploading(false)
      setStatus("Upload failed")
    }

    request.send(formData)
  }

  return (
    <form
      method="post"
      encType="multipart/form-data"
      className={cn("grid grid-cols-1 gap-4", formClassName)}
      onSubmit={onSubmit}
    >
      <input type="hidden" name="_action" value={action} />
      {Object.entries(hidden).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={String(value)} />
      ))}

      <div>
        {title ? (
          <div className="mb-4">
            <h3 className="text-center text-2xl font-semibold capitalize">{title}</h3>
          </div>
        ) : null}

        <div
          className="cursor-pointer rounded-lg border border-dashed border-fg-muted/30 bg-bg-muted/20 p-8 text-center transition-colors hover:border-fg-muted/60 focus:outline-none focus:ring-1 focus:ring-hue/40"
          tabIndex={0}
          onDragEnter={(event) => event.preventDefault()}
          onDragOver={(event) => event.preventDefault()}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
        >
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-bg-muted/50">
            <IconPhoto className="size-7 text-fg-muted" />
          </div>
          <p className="text-center text-base text-fg-muted">
            Drag and drop or <span className="ml-1 text-fg-link underline">browse</span> your files
          </p>
          {hint ? <p className="mt-2 text-center text-xs text-fg-muted">{hint}</p> : null}
          <input
            ref={inputRef}
            id={resolvedId}
            name={inputName}
            type="file"
            accept={accept}
            className="sr-only"
            onChange={onFileChange}
          />
        </div>

        {sizeError ? (
          <p
            className="mt-2 text-center text-xs text-destructive"
            role="alert"
          >
            {sizeError}
          </p>
        ) : null}

        {file ? (
          <div className="mt-4">
            <div className="flex items-center gap-3">
              <div className="relative flex h-20 w-20 items-center justify-center rounded border bg-bg-muted/40">
                {previewUrl ? (
                  <img src={previewUrl} alt="Selected image preview" className="h-20 w-20 rounded border object-cover" />
                ) : (
                  <IconPhoto className="size-7 text-fg-muted" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium">{file.name}</p>
                  <span className="text-xs text-fg-muted">{status}</span>
                </div>
                <div className="mt-1 h-1.5 w-full rounded bg-fg-muted/20">
                  <div className="h-1.5 rounded bg-hue" style={{ width: `${progress}%` }} />
                </div>
                <p className="mt-1 text-xs text-fg-muted">
                  {(file.size / 1024 / 1024).toFixed(1)} MB
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex items-center justify-center gap-3">
        <Button type="submit" disabled={!file || !!sizeError || uploading}>
          {uploading ? <IconLoader2 className="size-4 animate-spin" /> : <IconUpload className="size-4" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
