"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, File, X, Eye, FileText, DollarSign } from "lucide-react"
import type { BidDocument } from "@/types/bid"
import { useLanguage } from "@/contexts/language-context"

interface BidDocumentsUploadProps {
  technicalDocuments: BidDocument[]
  commercialDocuments: BidDocument[]
  onTechnicalDocumentsChange: (documents: BidDocument[]) => void
  onCommercialDocumentsChange: (documents: BidDocument[]) => void
  maxFiles?: number
  maxFileSize?: number
}

export function BidDocumentsUpload({
  technicalDocuments,
  commercialDocuments,
  onTechnicalDocumentsChange,
  onCommercialDocumentsChange,
  maxFiles = 10,
  maxFileSize = 10,
}: BidDocumentsUploadProps) {
  const { language } = useLanguage()
  const technicalInputRef = useRef<HTMLInputElement>(null)
  const commercialInputRef = useRef<HTMLInputElement>(null)
  const [dragOverTechnical, setDragOverTechnical] = useState(false)
  const [dragOverCommercial, setDragOverCommercial] = useState(false)

  const isRTL = language === "ar"
  const acceptedTypes = [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".jpg", ".jpeg", ".png"]

  const handleFileSelect = (files: FileList | null, type: "technical" | "commercial") => {
    if (!files) return

    const currentDocuments = type === "technical" ? technicalDocuments : commercialDocuments
    const newDocuments: BidDocument[] = []

    Array.from(files).forEach((file) => {
      // Check file size
      if (file.size > maxFileSize * 1024 * 1024) {
        alert(
          language === "ar"
            ? `حجم الملف ${file.name} كبير جداً. الحد الأقصى ${maxFileSize} ميجابايت`
            : `File ${file.name} is too large. Maximum size is ${maxFileSize}MB`,
        )
        return
      }

      // Check file type
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase()
      if (!acceptedTypes.includes(fileExtension || "")) {
        alert(language === "ar" ? `نوع الملف ${file.name} غير مدعوم` : `File type of ${file.name} is not supported`)
        return
      }

      const fileUrl = URL.createObjectURL(file)

      const document: BidDocument = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        url: fileUrl,
        uploadedAt: new Date().toISOString(),
      }

      newDocuments.push(document)
    })

    // Check total files limit
    if (currentDocuments.length + newDocuments.length > maxFiles) {
      alert(language === "ar" ? `لا يمكن إضافة أكثر من ${maxFiles} ملفات` : `Cannot add more than ${maxFiles} files`)
      return
    }

    if (type === "technical") {
      onTechnicalDocumentsChange([...currentDocuments, ...newDocuments])
    } else {
      onCommercialDocumentsChange([...currentDocuments, ...newDocuments])
    }
  }

  const handleDrop = (e: React.DragEvent, type: "technical" | "commercial") => {
    e.preventDefault()
    if (type === "technical") {
      setDragOverTechnical(false)
    } else {
      setDragOverCommercial(false)
    }
    handleFileSelect(e.dataTransfer.files, type)
  }

  const removeDocument = (id: string, type: "technical" | "commercial") => {
    if (type === "technical") {
      const updated = technicalDocuments.filter((doc) => doc.id !== id)
      onTechnicalDocumentsChange(updated)
    } else {
      const updated = commercialDocuments.filter((doc) => doc.id !== id)
      onCommercialDocumentsChange(updated)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase()
    switch (extension) {
      case "pdf":
        return "📄"
      case "doc":
      case "docx":
        return "📝"
      case "xls":
      case "xlsx":
        return "📊"
      case "jpg":
      case "jpeg":
      case "png":
        return "🖼️"
      default:
        return "📎"
    }
  }

  const DocumentSection = ({
    title,
    icon,
    documents,
    onFileSelect,
    inputRef,
    dragOver,
    setDragOver,
    type,
  }: {
    title: string
    icon: React.ReactNode
    documents: BidDocument[]
    onFileSelect: () => void
    inputRef: React.RefObject<HTMLInputElement>
    dragOver: boolean
    setDragOver: (value: boolean) => void
    type: "technical" | "commercial"
  }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
            dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
          onDrop={(e) => handleDrop(e, type)}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={(e) => {
            e.preventDefault()
            setDragOver(false)
          }}
        >
          <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
          <p className="text-sm font-medium mb-2">
            {language === "ar" ? "اسحب الملفات هنا أو انقر للاختيار" : "Drag files here or click to select"}
          </p>
          <Button type="button" variant="outline" size="sm" onClick={onFileSelect} className="gap-2 bg-transparent">
            <File className="h-3 w-3" />
            {language === "ar" ? "اختيار الملفات" : "Choose Files"}
          </Button>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept={acceptedTypes.join(",")}
            onChange={(e) => handleFileSelect(e.target.files, type)}
            className="hidden"
          />
        </div>

        {/* Documents List */}
        {documents.length > 0 && (
          <div className="space-y-2">
            <h5 className="font-medium text-sm">
              {language === "ar" ? "الملفات المرفقة" : "Attached Files"} ({documents.length})
            </h5>
            <div className="space-y-2">
              {documents.map((document) => (
                <div key={document.id} className="flex items-center justify-between p-2 border rounded bg-gray-50">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-lg">{getFileIcon(document.name)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate" title={document.name}>
                        {document.name}
                      </p>
                      <p className="text-xs text-gray-500">{formatFileSize(document.size)}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(document.url, "_blank")}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeDocument(document.id, type)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6" dir={isRTL ? "rtl" : "ltr"}>
      <DocumentSection
        title={language === "ar" ? "المستندات الفنية" : "Technical Documents"}
        icon={<FileText className="h-5 w-5" />}
        documents={technicalDocuments}
        onFileSelect={() => technicalInputRef.current?.click()}
        inputRef={technicalInputRef}
        dragOver={dragOverTechnical}
        setDragOver={setDragOverTechnical}
        type="technical"
      />

      <DocumentSection
        title={language === "ar" ? "المستندات التجارية" : "Commercial Documents"}
        icon={<DollarSign className="h-5 w-5" />}
        documents={commercialDocuments}
        onFileSelect={() => commercialInputRef.current?.click()}
        inputRef={commercialInputRef}
        dragOver={dragOverCommercial}
        setDragOver={setDragOverCommercial}
        type="commercial"
      />
    </div>
  )
}
