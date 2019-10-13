import '../styles/icons.styl'
import '../styles/group.styl'

import dropdown from 'v-dropdown'
import data from '../mixins/data'
import method from '../mixins/method'
import search from '../mixins/selectorWithSearch'
import selector from '../mixins/selector'
import { PROVINCE_LEVEL, CITY_LEVEL, AREA_LEVEL, TOWN_LEVEL, LEVELS, LEVEL_LIST } from '../constants'

export default {
  name: 'RegionGroup',
  mixins: [data, method, search, selector],
  inheritAttrs: false,
  components: { dropdown },
  props: {
    search: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      list: [],
      query: '',
      level: -1
    }
  },
  watch: {
    /**
     * region search
     * search region description first, if no result, then search region key
     * @param value
     */
    query (value) {
      const list = this.getList(this.level)
      let tmp = []
      tmp = list.filter(val => val.value.toLowerCase().includes(value.toLowerCase()))
      if (tmp.length === 0) tmp = list.filter(val => val.key.includes(value))
      this.list = tmp
    },
    /**
     * current region group
     */
    level (val) {
      this.list = this.getList(val)
      this.adjust()
    }
  },
  render (h) {
    const child = []

    child.push(this.buildCaller(h))
    child.push(this.buildHeader(h))
    child.push(this.buildSearch(h))
    child.push(this.buildTabs(h))
    child.push(this.buildContent(h))

    return h('dropdown', {
      ref: 'drop',
      props: {
        border: false
      },
      on: {
        show: this.showChange
      }
    }, child)
  },
  methods: {
    buildHeader (h) {
      const child = []

      child.push(h('h3', [
        h('span', {
          class: {
            'rg-header-selected': this.selectedText
          }
        }, this.selectedText || this.lang.defaultHead)
      ]))

      child.push(h('button', {
        attrs: {
          type: 'button',
          title: this.lang.clear
        },
        class: 'rg-removeall-button',
        on: {
          click: this.clear
        }
      }, [
        h('i', { class: 'rg-iconfont rg-icon-remove' })
      ]))

      child.push(h('button', {
        attrs: {
          type: 'button',
          title: this.lang.done
        },
        class: 'rg-done-button',
        on: {
          click: this.close
        }
      }, [
        h('i', { class: 'rg-iconfont rg-icon-done' })
      ]))

      return h('div', { class: 'rg-header' }, child)
    },
    buildSearch (h) {
      if (!this.search) return
      return h('div', { class: 'rg-search' }, [
        h('input', {
          ref: 'search',
          class: 'rg-input',
          attrs: {
            type: 'text',
            autocomplete: 'off'
          },
          domProps: {
            value: this.query
          },
          on: {
            input: e => {
              this.query = e.target.value.trim()
            }
          }
        })
      ])
    },
    buildTabs (h) {
      const child = []
      LEVELS.forEach(val => {
        if (this.levelAvailable(val.index)) {
          child.push(h('li', {
            key: val.index,
            class: {
              active: val.index === this.level
            }
          }, [
            h('a', {
              attrs: {
                href: 'javascript:void(0);'
              },
              on: {
                click: () => {
                  this.level = val.index
                }
              }
            }, val.title)
          ]))
        }
      })
      return h('div', { class: 'rg-level-tabs' }, [
        h('ul', child)
      ])
    },
    buildContent (h) {
      const child = []
      if (this.list.length) {
        child.push(...this.list.map(val => {
          return h('li', {
            class: {
              'rg-item': true,
              active: this.match(val)
            },
            key: val.key,
            on: {
              mouseup: () => {
                this.pick(val)
              }
            }
          }, val.value)
        }))
      } else {
        child.push(h('li', {
          class: 'rg-message-box'
        }, this.lang.noMatch))
      }
      return h('div', { class: 'rg-results-container' }, [
        h('ul', { class: 'rg-results' }, child)
      ])
    },
    // check level available
    levelAvailable (level) {
      switch (level) {
        case PROVINCE_LEVEL: return true
        case CITY_LEVEL: return this.city
        case AREA_LEVEL: return this.city && this.area
        case TOWN_LEVEL: return this.city && this.area && this.town
      }
    },
    // load list when switch to next level
    getList (val) {
      switch (val) {
        case PROVINCE_LEVEL: return this.listProvince
        case CITY_LEVEL: return this.listCity
        case AREA_LEVEL: return this.listArea
        case TOWN_LEVEL: return this.listTown
      }
    },
    match (item) {
      if (!item || !Object.keys(item).length) return false
      const R = this.region
      const key = item.key
      switch (this.level) {
        case PROVINCE_LEVEL: return R.province && R.province.key === key
        case CITY_LEVEL: return R.city && R.city.key === key
        case AREA_LEVEL: return R.area && R.area.key === key
        case TOWN_LEVEL: return R.town && R.town.key === key
      }
    },
    nextLevel (level) {
      if (level === TOWN_LEVEL) return level
      return LEVELS[level + 1].index
    },
    pick (item) {
      const nextLevel = this.nextLevel(this.level)
      const attr = LEVEL_LIST[this.level]
      this.region[attr] = item
      this.change()

      if (this.levelAvailable(nextLevel) && this.level !== nextLevel) {
        this.level = nextLevel
      } else {
        this.close()
      }
    },
    clear () {
      this.clearRegion(PROVINCE_LEVEL)
      this.level = PROVINCE_LEVEL
      this.change()
    }
  },
  beforeMount () {
    this.level = PROVINCE_LEVEL
  }
}
