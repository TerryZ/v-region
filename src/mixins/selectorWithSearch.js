export default {
  methods: {
    inputFocus () {
      if (!this.show) return
      this.$nextTick(() => {
        /**
         * fixed the page will scroll to top when open drop down list and set input focus
         * that.$refs.search.focus({preventScroll:true}); only work on Chrome and EDGE
         */
        if (this.isChrome() || this.isEdge()) this.$refs.search.focus({ preventScroll: true })
        else {
          const x = window.pageXOffset
          const y = window.pageYOffset
          this.$refs.search.focus()
          if (window.pageYOffset !== y) setTimeout(() => { window.scrollTo(x, y) }, 0)
        }
      })
    },
    isChrome () {
      return navigator.vendor !== undefined && navigator.vendor.indexOf('Google') !== -1
    },
    isEdge () {
      return navigator.userAgent.indexOf('Edge') >= 0
    }
  },
  watch: {
    show (val) {
      if (val) this.inputFocus()
    }
  }
}
