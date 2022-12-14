import { ref } from "vue"
import axios from "axios"
import { cloneDeep } from 'lodash'

class FormData {
  #data;
  #original;
  #errors;
  #dirty;
  #processing;

  constructor(data) {
    this.#data = ref({ ...data })
    this.#original = ref({ ...data })
    this.#errors = ref({})
    this.#dirty = ref(false)
    this.#processing = ref(false)

    for (let key in this.#data.value) {
      Object.defineProperty(this, key, {
        get: () => this.#data.value[key],
        set: (value) => {
          this.clearError(key)
          
          this.#dirty.value = true
          this.#data.value[key] = value
        },
      })

      this.#errors.value[key] = ''
    }
  }

  set(key, value) {
    this.#data.value[key] = value
  }

  toString() {
    return JSON.stringify(this.#data.value)
  }

  get errors() {
    return cloneDeep(this.#errors.value)
  }

  get processing() {
    return this.#processing.value
  }

  reset(key) {
    if (key) {
      this.#data.value[key] = this.#original.value.hasOwnProperty(key) ? this.#original.value[key] : null
    } else {
      this.#data.value = cloneDeep(this.#original.value)
    }
  }

  data() {
    return cloneDeep(this.#data.value)
  }

  clearError(key) {
    if (key && this.#errors.value.hasOwnProperty(key)) {
      this.#errors.value[key] = ''
    } else {
      for (let k in this.#errors.value) {
        this.#errors.value[k] = ''
      }
    }
  }

  async get(url, config) {
    return await this.process('GET', url, config || {})
  }

  async post(url, config) {
    return await this.process('POST', url, config || {})
  }

  async put(url, config) {
    return await this.process('PUT', url, config || {})
  }

  async patch(url, config) {
    return await this.process('PATCH', url, config || {})
  }

  async delete(url, config) {
    return await this.process('DELETE', url, config || {})
  }

  async process(method, url, config) {
    try {
      this.#processing.value = true
      let response

      if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
        response = await axios[method.toLowerCase()](url, config)
      } else {
        const data = cloneDeep(this.#data.value)
        response = await axios[method.toLowerCase()](url, data, {
          headers: {
            'Content-Type': axios.defaults.headers.common['Content-Type'] || 'multipart/form-data',
          },
          ...config,
        })
      }

      this.#processing.value = false

      return response
    } catch (e) {
      const { response } = e
      const { status, data } = response

      if (status === 422) {
        data.errors.forEach(error => this.#errors.value[error.field] = error.message)

        return response
      } else {
        throw e
      }
    } finally {
      this.#processing.value = false
    }
  }
}

export const useForm = data => new FormData(data)
export default FormData