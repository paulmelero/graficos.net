<template>
  <form
    :action="endpoint"
    method="POST"
    class="rounded-md border border-gray-light bg-fwhite p-5 text-left dark:border-gray dark:bg-gray-dark sm:p-6"
    :aria-busy="status === 'loading' ? 'true' : undefined"
    @submit.prevent="subscribe"
  >
    <div class="grid gap-4 sm:grid-cols-2">
      <div>
        <label :for="nameId" class="font-ibm text-sm font-bold text-gray-dark dark:text-gray-lightest">
          Name <span class="font-normal text-gray dark:text-gray-light">(optional)</span>
        </label>
        <input
          :id="nameId"
          v-model="name"
          type="text"
          name="name"
          autocomplete="name"
          maxlength="100"
          enterkeyhint="next"
          placeholder="Your name"
          class="mt-1 w-full border-b border-gray-light bg-transparent py-2 font-ibm text-base text-gray-darkest outline-hidden placeholder:text-gray focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent dark:border-gray dark:text-fwhite dark:placeholder:text-gray-light dark:focus-visible:border-actionDark dark:focus-visible:outline-actionDark"
        />
      </div>
      <div>
        <label :for="emailId" class="font-ibm text-sm font-bold text-gray-dark dark:text-gray-lightest">Email</label>
        <input
          :id="emailId"
          v-model="email"
          type="email"
          name="email"
          autocomplete="email"
          spellcheck="false"
          enterkeyhint="send"
          :aria-invalid="invalid ? 'true' : undefined"
          :aria-describedby="describedBy"
          placeholder="you@example.com"
          required
          class="mt-1 w-full border-b border-gray-light bg-transparent py-2 font-ibm text-base text-gray-darkest outline-hidden placeholder:text-gray focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent dark:border-gray dark:text-fwhite dark:placeholder:text-gray-light dark:focus-visible:border-actionDark dark:focus-visible:outline-actionDark"
          @input="clearError"
        />
      </div>
    </div>

    <button
      type="submit"
      class="pill-button mt-4 w-full disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      :disabled="status === 'loading'"
    >
      {{ status === 'loading' ? 'Subscribing…' : 'Subscribe' }}
    </button>

    <div :id="noteId" class="mt-3 text-xs text-gray-dark dark:text-gray-lightest">
      No spam. Unsubscribe anytime. <NuxtLink to="/privacy" class="underline">Privacy</NuxtLink>.
    </div>
    <div
      v-if="message"
      :id="messageId"
      :role="status === 'error' ? 'alert' : 'status'"
      class="mt-3 text-sm font-bold"
      :class="status === 'error' ? 'text-accent dark:text-actionDark' : 'text-gray-darkest dark:text-fwhite'"
    >
      {{ message }}
    </div>
  </form>
</template>

<script lang="ts" setup>
import { useId } from 'vue'

const { NEWSLETTER_URL } = useRuntimeConfig().public
const endpoint = `${NEWSLETTER_URL}/api/subscribe`

const name = ref('')
const email = ref('')
const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
const message = ref('')
const invalid = ref(false)
const nameId = useId()
const emailId = useId()
const noteId = useId()
const messageId = useId()

const describedBy = computed(() => (status.value === 'error' ? `${noteId} ${messageId}` : noteId))

const clearError = () => {
  if (status.value !== 'error') return

  status.value = 'idle'
  message.value = ''
  invalid.value = false
}

const subscribe = async () => {
  if (status.value === 'loading') return

  status.value = 'loading'
  message.value = ''
  invalid.value = false

  try {
    const result = await $fetch<{ ok: boolean; pending?: boolean }>(endpoint, {
      method: 'POST',
      body: { email: email.value, name: name.value.trim() || undefined },
    })

    if (!result.ok) throw new Error('subscribe failed')

    name.value = ''
    email.value = ''
    status.value = 'success'
    message.value = result.pending ? 'Check your inbox to confirm.' : "You're on the list."
  } catch (error) {
    const data = (error as { data?: { error?: string } }).data

    invalid.value = data?.error === 'invalid_email'
    status.value = 'error'
    message.value = invalid.value ? 'Enter a valid email address.' : 'Something went wrong. Try again in a minute.'
  }
}
</script>
