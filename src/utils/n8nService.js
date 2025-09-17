// n8n API Service for Email Verification
import axios from "axios";

class N8nService {
  constructor() {
    this.webhookUrl = import.meta.env?.VITE_N8N_WEBHOOK_URL;
    if (!this.webhookUrl) {
      console.error(
        "⚠️ N8N webhook URL is not configured. Please check VITE_N8N_WEBHOOK_URL in your .env file."
      );
    }

    this.axiosInstance = axios.create({
      timeout: 30000, // 30 seconds timeout
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  }

  /**
   * Verify a single email
   * @param {string} email
   * @returns {Promise<Object>}
   */
  verifySingleEmail(email) {
    return this.axiosInstance.post(this.webhookUrl, {
      method: "single",
      email: email.trim(),
    });
  }

  /**
   * Verify multiple emails in bulk
   * @param {Array<string>} emails
   * @returns {Promise<Object>}
   */
  verifyBulkEmails(emails) {
    return this.axiosInstance.post(this.webhookUrl, {
      method: "bulk",
      emails: emails,
      batchId: `batch_${Date.now()}`,
    });
  }

  /**
   * Verify emails from uploaded file (CSV/TXT)
   * Encodes the file to base64 so n8n receives JSON, not binary
   * @param {File} file
   * @returns {Promise<Object>}
   */

  /**
 * Verify emails from uploaded file (CSV/TXT)
 * Sends as multipart/form-data so n8n webhook (raw body off) can parse it
 * @param {File} file
 * @returns {Promise<Object>}
 * 
 */

async verifyFile(file) {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = async (e) => {
        try {
          const base64Data = e.target.result.split(",")[1];
          const response = await this.axiosInstance.post(this.webhookUrl, {
            method: "file",
            fileName: file.name,
            fileData: base64Data,
          });
          resolve(response);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }


  /**
   * General verifyEmails method (kept for backwards compatibility)
   * Decides whether to treat input as single, bulk, or file
   * @param {Array|string|File} input
   */
  async verifyEmails(input) {
    if (input instanceof File) {
      return this.verifyFile(input);
    }

    if (Array.isArray(input)) {
      return this.verifyBulkEmails(input);
    }

    if (typeof input === "string") {
      return this.verifySingleEmail(input);
    }

    throw new Error("Unsupported input type for email verification");
  }
}

export default new N8nService();
