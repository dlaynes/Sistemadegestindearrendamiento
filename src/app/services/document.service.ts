import { apiGet, apiDelete, apiFetch, apiPostMultipart } from './api-client';

export interface DocumentItem {
  id: string | number;
  name: string;
  size: number;
  contentType: string;
  uploadedByName?: string;
  createdAt?: string;
}

export interface DocumentService {
  uploadDocument(type: 'CONTRACT' | 'PROPERTY', entityId: string | number, file: File): Promise<DocumentItem>;
  getDocuments(type: 'CONTRACT' | 'PROPERTY', entityId: string | number): Promise<DocumentItem[]>;
  downloadDocument(documentId: string | number): Promise<void>;
  deleteDocument(documentId: string | number): Promise<void>;
}

export class ApiDocumentService implements DocumentService {
  async uploadDocument(type: 'CONTRACT' | 'PROPERTY', entityId: string | number, file: File): Promise<DocumentItem> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    formData.append('entityId', String(entityId));

    const data = await apiPostMultipart<{
      id: number;
      originalName: string;
      fileSize: number;
      contentType: string;
      uploadedByName?: string;
      createdAt?: string;
    }>('/documents/upload', formData);

    return {
      id: data.id,
      name: data.originalName,
      size: data.fileSize,
      contentType: data.contentType,
      uploadedByName: data.uploadedByName,
      createdAt: data.createdAt,
    };
  }

  async getDocuments(type: 'CONTRACT' | 'PROPERTY', entityId: string | number): Promise<DocumentItem[]> {
    const data = await apiGet<Array<{
      id: number;
      originalName: string;
      fileSize: number;
      contentType: string;
      uploadedByName?: string;
      createdAt?: string;
    }>>(`/documents?type=${type}&entityId=${entityId}`);

    return data.map((d) => ({
      id: d.id,
      name: d.originalName,
      size: d.fileSize,
      contentType: d.contentType,
      uploadedByName: d.uploadedByName,
      createdAt: d.createdAt,
    }));
  }

  async downloadDocument(documentId: string | number): Promise<void> {
    const res = await apiFetch(`/documents/${documentId}/download`, { method: 'GET' });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  async deleteDocument(documentId: string | number): Promise<void> {
    await apiDelete(`/documents/${documentId}`);
  }
}
