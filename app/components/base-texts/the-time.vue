<template>
  <time :date-time="date">{{ dateFormatted }}</time>
</template>

<script>
export default {
  props: {
    date: {
      type: String,
      default: '',
    },
  },
  computed: {
    dateFormatted() {
      if (!this.date) {
        return ''
      }
      const date = new Date(this.date)
      let intlDate = date
      try {
        // retunring US style dates:
        intlDate = new Intl.DateTimeFormat('en-GB', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }).format(date)

        return `${intlDate}`
      } catch (error) {
        console.error('Error formatting date', error)
        return ''
      }
    },
  },
}
</script>
