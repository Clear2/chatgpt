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
const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1UaEVOVUpHTkVNMVFURTRNMEZCTWpkQ05UZzVNRFUxUlRVd1FVSkRNRU13UmtGRVFrRXpSZyJ9.eyJodHRwczovL2FwaS5vcGVuYWkuY29tL3Byb2ZpbGUiOnsiZW1haWwiOiIxMjExMDMzMUBxcS5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZ2VvaXBfY291bnRyeSI6IlVTIn0sImh0dHBzOi8vYXBpLm9wZW5haS5jb20vYXV0aCI6eyJ1c2VyX2lkIjoidXNlci1lTTlHdzNrWTN0TkNzNnA1WnBlNWFBMWgifSwiaXNzIjoiaHR0cHM6Ly9hdXRoMC5vcGVuYWkuY29tLyIsInN1YiI6ImF1dGgwfDYzZWY0YzQ3Y2QyMmFmMzk2ZDM5YjEzMSIsImF1ZCI6WyJodHRwczovL2FwaS5vcGVuYWkuY29tL3YxIiwiaHR0cHM6Ly9vcGVuYWkub3BlbmFpLmF1dGgwYXBwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE2NzcwMjgyNDQsImV4cCI6MTY3ODIzNzg0NCwiYXpwIjoiVGRKSWNiZTE2V29USHROOTVueXl3aDVFNHlPbzZJdEciLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIG1vZGVsLnJlYWQgbW9kZWwucmVxdWVzdCBvcmdhbml6YXRpb24ucmVhZCBvZmZsaW5lX2FjY2VzcyJ9.V-fnIdy99fXSdltDMzfjM1_h3AjWiklNZHC1ikKgkvQqFpcA_jnJ0hJVFcKt9V91xPBcpYAhM9F4lL2EhAxegvMeV7pH-mm_vAOVbIwGrEuIS1N4uBl6swwYr3mXvx7TBwg2z2FemA690dSHLSqvE2Fl1tzbRhbu47t695O8pqcHDZnuCd_Q7BBlFI4E95co4bM-GNlj5CDeA6YiL3-ykyM88G_31a1LbM15UqQ6AEo2E2CkyT2oHNBB0ICd2Yar_CLX0zZyxkpaI9VU9lHaK6wwFbtZILas3QbEaJsgPvF6CCAArK0k0HjdQb8dlSqH1rMatzLPb2HGK6Bzm_996Q'
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
