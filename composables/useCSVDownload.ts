import { ref, computed } from 'vue'
import { useToast } from '@/composables/useToast'
import { GATEWAY_ENDPOINT } from "@/api_factory/axios.config";
import { useCustomToast } from "@/composables/core/useCustomToast";
const { showToast } = useCustomToast();

interface PaginationResponse<T> {
  data: T[] | Record<string, T[]>
  meta?: {
    totalPages?: number
    currentPage?: number
    totalItems?: number
  }
}

interface CSVDownloadOptions {
  title: string
  filename?: string
  delimiter?: string
  includeHeaders?: boolean
  transformHeaders?: (headers: string[]) => string[]
  dataPath?: string | ((response: any) => any[])
  // New options for handling nested objects
  flattenObjects?: boolean
  nestedDelimiter?: string
}

export const useCSVDownload = () => {
  const isDownloading = ref(false)
  const progress = ref(0)
  const toast = useToast()

  /**
   * Flattens a nested object into a single-level object with concatenated keys
   * Now handles arrays by flattening them with index notation
   */
  const flattenObject = (
    obj: any, 
    parentKey = '', 
    delimiter = '_'
  ): Record<string, any> => {
    return Object.keys(obj).reduce((acc: Record<string, any>, key: string) => {
      const propName = parentKey ? `${parentKey}${delimiter}${key}` : key
      const value = obj[key]
      
      if (value === null || value === undefined) {
        acc[propName] = ''
        return acc
      }

      // Handle arrays
      if (Array.isArray(value)) {
        // If array is empty, create at least one column
        if (value.length === 0) {
          acc[propName] = ''
          return acc
        }

        // For arrays of primitive values, join them
        if (value.every(item => typeof item !== 'object')) {
          acc[propName] = value.join(', ')
          return acc
        }

        // For arrays of objects, flatten each item with index
        value.forEach((item, index) => {
          if (typeof item === 'object' && item !== null) {
            const flatObject = flattenObject(
              item, 
              `${propName}${delimiter}${index}`,
              delimiter
            )
            Object.assign(acc, flatObject)
          } else {
            acc[`${propName}${delimiter}${index}`] = item
          }
        })
        return acc
      }

      // Handle objects (but not Dates)
      if (value && typeof value === 'object' && !(value instanceof Date)) {
        Object.assign(acc, flattenObject(value, propName, delimiter))
        return acc
      }

      // Handle primitive values and Dates
      acc[propName] = value
      return acc
    }, {})
  }

  /**
   * Processes an array of objects to handle nested structures
   */
  const processData = <T extends Record<string, any>>(
    data: T[],
    options: CSVDownloadOptions
  ): Record<string, any>[] => {
    if (!data.length) return []

    const delimiter = options.nestedDelimiter || '_'
    
    // Always flatten objects now, but handle arrays differently based on options
    return data.map(item => flattenObject(item, '', delimiter))
  }

  /**
   * Extract data from response based on dataPath or selector function
   */
  const extractData = <T>(response: any, options: CSVDownloadOptions): T[] => {
    if (!response.data) return []

    // If a custom selector function is provided, use it
    if (typeof options.dataPath === 'function') {
      return options.dataPath(response)
    }

    // If a string path is provided (e.g., 'data.user')
    if (typeof options.dataPath === 'string' && options.dataPath) {
      return options.dataPath.split('.').reduce((obj, path) => {
        return obj && obj[path] ? obj[path] : []
      }, response.data)
    }

    // Default behavior: try to find an array in data.data
    // If data.data is an array, return it directly
    if (Array.isArray(response.data.data)) {
      return response.data.data
    }

    // If data.data is an object, find the first property that is an array
    if (response.data.data && typeof response.data.data === 'object') {
      for (const key in response.data.data) {
        if (Array.isArray(response.data.data[key])) {
          return response.data.data[key]
        }
      }
    }

    // Fallback: return empty array if we couldn't find data
    return []
  }

  /**
   * Format object keys to be more readable
   */
  const formatHeader = (header: string): string => {
    // Convert camelCase and snake_case to spaces
    const withSpaces = header
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
    // Capitalize first letter and trim
    return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1).trim()
  }

  /**
   * Convert array of objects to CSV string
   */
  const objectsToCSV = <T extends Record<string, any>>(
    data: T[],
    options: CSVDownloadOptions
  ): string => {
    if (!data.length) return ''

    const delimiter = options.delimiter || ','
    
    // Process data to handle nested objects
    const processedData = processData(data, options)
    
    // Extract headers from the processed data
    const headers = Array.from(
      new Set(
        processedData.reduce((acc: string[], item) => {
          return [...acc, ...Object.keys(item)]
        }, [])
      )
    )
    
    // Transform headers if needed
    const formattedHeaders = options.transformHeaders 
      ? options.transformHeaders(headers) 
      : headers.map(formatHeader)
    
    // Create CSV content
    let csvContent = options.includeHeaders !== false 
      ? formattedHeaders.join(delimiter) + '\n'
      : ''
    
    // Add data rows
    processedData.forEach(item => {
      const row = headers.map(header => {
        const value = item[header]
        // Handle values that might contain commas or quotes
        if (value === null || value === undefined) return ''
        if (typeof value === 'string' && (value.includes(delimiter) || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`
        }
        if (value instanceof Date) {
          return value.toISOString()
        }
        return String(value)
      })
      csvContent += row.join(delimiter) + '\n'
    })
    
    return csvContent
  }

  /**
   * Download data directly as CSV
   */
  const downloadCSV = <T extends Record<string, any>>(
    data: T[],
    options: CSVDownloadOptions
  ): void => {
    try {
      if (!data.length) {
        toast.error('No data to download')
        return
      }

      const csvContent = objectsToCSV(data, options)
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      
      // Set filename with default fallback
      const filename = options.filename || `${options.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`
      
      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.style.display = 'none'
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
    //   toast.success(`${options.title} downloaded successfully`)
    showToast({
        title: "Success",
        message: `${options.title} downloaded successfully`,
        toastType: "success",
        duration: 3000,
      });
    } catch (error: any) { // Added error type handling
      console.error('Error downloading CSV:', error)
    //   toast.error(`Failed to download ${options.title}`)
    showToast({
        title: "Error",
        message: `Failed to download ${options.title}`,
        toastType: "error",
        duration: 3000,
      });
    }
  }

  /**
   * Download paginated data from an API endpoint
   */
  const downloadPaginatedCSV = async <T extends Record<string, any>>(
    endpoint: string,
    options: CSVDownloadOptions,
    queryParams: Record<string, any> = {}
  ): Promise<void> => {
    isDownloading.value = true
    progress.value = 0
    
    try {
      let currentPage = 1
      let totalPages = 1
      let allData: T[] = []
      
      // First request to get total pages
      const initialResponse = await GATEWAY_ENDPOINT.get(endpoint, {
        params: {
          ...queryParams,
          page: currentPage,
          limit: 100 // Adjust based on your API
        }
      })

      console.log(initialResponse, 'initial response')
      
      // Extract data using the new helper function
      const initialData = extractData<T>(initialResponse, options)
      
      if (!initialData || initialData.length === 0) {
        throw new Error('No data found in API response')
      }
      
      allData = [...initialData]
      totalPages = initialResponse.data.meta?.totalPages || 1
      
      // Update progress
      progress.value = Math.round((1 / totalPages) * 100)
      
      // Fetch remaining pages
      const remainingRequests = []
      for (let page = 2; page <= totalPages; page++) {
        remainingRequests.push(
          GATEWAY_ENDPOINT.get(endpoint, {
            params: {
              ...queryParams,
              page,
              limit: 100
            }
          })
        )
      }
      
      if (remainingRequests.length > 0) {
        const responses = await Promise.all(remainingRequests)
        
        responses.forEach((response, index) => {
          const pageData = extractData<T>(response, options)
          if (pageData && pageData.length > 0) {
            allData = [...allData, ...pageData]
          }
          // Update progress
          progress.value = Math.round(((index + 2) / totalPages) * 100)
        })
      }
      
      // Download the combined data
      downloadCSV(allData, options)
      progress.value = 100
    //   toast.success(`${options.title} downloaded successfully`)
      showToast({
        title: "Success",
        message: `${options.title} downloaded successfully`,
        toastType: "success",
        duration: 3000,
      });
    } catch (error: any) { // Added error type handling
      console.error('Error downloading paginated CSV:', error)
    //   toast.error(`Failed to download ${options.title}`)
    showToast({
        title: "Error",
        message: `Failed to download ${options.title}`,
        toastType: "error",
        duration: 3000,
      });
    } finally {
      isDownloading.value = false
    }
  }

  return {
    isDownloading,
    progress,
    downloadCSV,
    downloadPaginatedCSV,
    objectsToCSV
  }
}