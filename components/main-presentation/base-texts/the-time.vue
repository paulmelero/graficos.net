<template>
  <time :date-time="date">{{ dateFormatted }}</time>
</template>

<script>
export default {
  props: {
    date: {
      type: String,
    }
  },
  computed: {
    dateFormatted() {
      if (!this.date) {return ''}
      const date = new Date(this.date);
      let intlDate = date;
      try {
        // retunring US style dates:
        intlDate = new Intl.DateTimeFormat(
          'en-US',
          { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
        ).format(date)
      } finally {
        return `${intlDate}`
      }
    }
  }
}
</script>

