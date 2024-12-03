

import { ref } from 'vue';
import { upload_api } from '@/api_factory/core/upload';

export const useUploadFile = () => {
  const loading = ref(false);
  const uploadResponse = ref({} as any);
  
  const { $_upload_file } = upload_api;

  const uploadFile = async (file: File) => {
    loading.value = true;
    try {
      // Create FormData and append the file directly
      const formData = new FormData();
      formData.append('file', file);  // Append the file, no conversion to Base64

      // Make the API call with FormData
      const res = await $_upload_file(formData) as any;

      if (res.type !== 'ERROR') {
        uploadResponse.value = res.data.data ?? {};
      }
    } catch (error) {
      // console.error('Error uploading file:', error);
    } finally {
      loading.value = false;
    }
  };

  return { uploadFile, loading, uploadResponse };
};
