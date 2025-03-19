import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  private apiUrl = 'http://localhost:8080/convert';

  constructor() {}

  async convertPdfToImage(file: File): Promise<Blob | null> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(this.apiUrl, formData, {
        responseType: 'arraybuffer',
      });

      return new Blob([response.data], { type: 'image/png' });
    } catch (error) {
      console.error('Failed to convert PDF to image:', error);
      return null;
    }
  }
}
