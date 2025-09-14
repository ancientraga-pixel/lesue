import QRCode from 'qrcode';

class RealQRService {
  constructor() {
    this.qrOptions = {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#2d5016',
        light: '#FFFFFF'
      },
      width: 256
    };
  }

  async generateQR(data) {
    try {
      // Create structured QR data
      const qrData = {
        id: this.generateQRId(),
        type: data.type || 'unknown',
        batchId: data.batchId || data.eventId || data.id,
        timestamp: new Date().toISOString(),
        network: 'herbionyx',
        version: '1.0'
      };

      // Generate actual QR code
      const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), this.qrOptions);
      
      return {
        id: qrData.id,
        qrCodeUrl: qrCodeDataURL,
        data: JSON.stringify(qrData),
        timestamp: qrData.timestamp,
        type: qrData.type,
        batchId: qrData.batchId
      };
    } catch (error) {
      console.error('QR generation error:', error);
      throw error;
    }
  }

  generateQRId() {
    return 'QR_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  async parseQR(qrDataString) {
    try {
      const data = JSON.parse(qrDataString);
      
      // Validate QR structure
      if (!data.id || !data.type || !data.network) {
        throw new Error('Invalid QR code structure');
      }
      
      if (data.network !== 'herbionyx') {
        throw new Error('QR code is not from HERBIONYX network');
      }
      
      return {
        valid: true,
        data: data
      };
    } catch (error) {
      return {
        valid: false,
        error: error.message
      };
    }
  }
}

export default new RealQRService();