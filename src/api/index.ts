import axios from 'axios'
import type { GenericAbortSignal } from 'axios'
import { post } from '@/utils/request'

export function fetchChatAPI<T = any>(
  prompt: string,
  options?: { conversationId?: string; parentMessageId?: string },
  signal?: GenericAbortSignal,
) {
  return post<T>({
    url: '/chat',
    data: { prompt, options },
    signal,
  })
}

export function fetchChatConfig<T = any>() {
  return post<T>({
    url: '/config',
  })
}

// export function fetchChatAPIProcess<T = any>(
//   params: {
//     prompt: string
//     options?: { conversationId?: string; parentMessageId?: string }
//     signal?: GenericAbortSignal
//     onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void },
// ) {
//   return post<T>({
//     url: '/chat-process',
//     data: { prompt: params.prompt, options: params.options },
//     signal: params.signal,
//     onDownloadProgress: params.onDownloadProgress,
//   })
// }

const URL: string = 'https://api.openai.com/v1/chat/completions'
const instance = axios.create({
	timeout: 10000,
	headers: {
		'Content': 'application/json',
		'Authorization': 'Bearer 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'
	}
});

export function fetchChat () {
	return new Promise((resolve) => {
		axios({
			timeout: 100000,
			url: 'http://121.89.167.190:3002/chat',
			method: 'post',
			data: {
				prompt: '苹果公司'
			}
		}).then(res => {
			console.log('--->>', res)
		})
	})
}
export function fetchChatAPIProcess (params: any) {
	 const data = {
		 "model": "gpt-3.5-turbo",
		 "messages": [{"role": "user",
			 "content": params.prompt
		 }]
	 }
		return new Promise((resolve) => {
			instance({
				url: URL,
				method: 'post',
				data: data,
			}).then(res => {
				let choice = res.data.choices[0]
				resolve(choice.message.content)
				// resolve(res)
			})
		})
}
