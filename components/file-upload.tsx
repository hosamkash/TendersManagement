"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, File, X, Download, Eye } from "lucide-react"
import type { TenderAttachment } from "@/types/tender"
import { useLanguage } from "@/contexts/language-context"

interface FileUploadProps {
  attachments: TenderAttachment[]
  onAttachmentsChange: (attachments: TenderAttachment[]) => void
  maxFiles?: number
  maxFileSize?: number // in MB
  acceptedTypes?: string[]
}

export function FileUpload({
  attachments,
  onAttachmentsChange,
  maxFiles = 10,
  maxFileSize = 10,
  acceptedTypes = [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".jpg", ".jpeg", ".png"],
}: FileUploadProps) {
  const { language } = useLanguage()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  const isRTL = language === "ar"

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    const newAttachments: TenderAttachment[] = []

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

      // Create file URL (in real app, this would be uploaded to server)
      const fileUrl = URL.createObjectURL(file)

      const attachment: TenderAttachment = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        url: fileUrl,
        uploadedAt: new Date().toISOString(),
      }

      newAttachments.push(attachment)
    })

    // Check total files limit
    if (attachments.length + newAttachments.length > maxFiles) {
      alert(language === "ar" ? `لا يمكن إضافة أكثر من ${maxFiles} ملفات` : `Cannot add more than ${maxFiles} files`)
      return
    }

    onAttachmentsChange([...attachments, ...newAttachments])
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const removeAttachment = (id: string) => {
    const updatedAttachments = attachments.filter((att) => att.id !== id)
    onAttachmentsChange(updatedAttachments)
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

  return (
    <Card dir={isRTL ? "rtl" : "ltr"}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          {language === "ar" ? "المرفقات" : "Document Attachments"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-lg font-medium mb-2">
            {language === "ar" ? "اسحب الملفات هنا أو انقر للاختيار" : "Drag files here or click to select"}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            {language === "ar"
              ? `الحد الأقصى: ${maxFiles} ملفات، ${maxFileSize} ميجابايت لكل ملف`
              : `Maximum: ${maxFiles} files, ${maxFileSize}MB per file`}
          </p>
          <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="gap-2">
            <File className="h-4 w-4" />
            {language === "ar" ? "اختيار الملفات" : "Choose Files"}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedTypes.join(",")}
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
        </div>

        {/* Attachments List */}
        {attachments.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">
              {language === "ar" ? "الملفات المرفقة" : "Attached Files"} ({attachments.length})
            </h4>
            <div className="space-y-2">
              {attachments.map((attachment) => (
                <div key={attachment.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-2xl">{getFileIcon(attachment.name)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate" title={attachment.name}>
                        {attachment.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(attachment.size)} •{" "}
                        {new Date(attachment.uploadedAt).toLocaleDateString(language === "ar" ? "ar-SA" : "en-US")}
                      </p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(attachment.url, "_blank")}
                      className="gap-1"
                    >
                      <Eye className="h-3 w-3" />
                      {language === "ar" ? "عرض" : "View"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const link = document.createElement("a")
                        link.href = attachment.url
                        link.download = attachment.name
                        link.click()
                      }}
                      className="gap-1"
                    >
                      <Download className="h-3 w-3" />
                      {language === "ar" ? "تحميل" : "Download"}
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeAttachment(attachment.id)}
                      className="gap-1"
                    >
                      <X className="h-3 w-3" />
                      {language === "ar" ? "حذف" : "Remove"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Accepted file types */}
        <div className="text-sm text-gray-500">
          <p className="mb-1">{language === "ar" ? "أنواع الملفات المدعومة:" : "Supported file types:"}</p>
          <div className="flex flex-wrap gap-1">
            {acceptedTypes.map((type) => (
              <Badge key={type} variant="secondary" className="text-xs">
                {type}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
