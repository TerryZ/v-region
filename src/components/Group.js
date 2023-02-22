import '../styles/group.sass'

import { ref, watch, h } from 'vue'
import cloneDeep from 'lodash.clonedeep'

import IconTrash from '../icons/IconTrash.vue'

import { CN } from '../language'
import { regionProvinces } from '../formatted.js'
import { commonProps, useData } from '../utils/data'
import { useLanguage } from '../utils/helper'

import {
  PROVINCE_LEVEL,
  CITY_LEVEL,
  AREA_LEVEL,
  TOWN_LEVEL,
  LEVELS,
  LEVEL_LIST
} from '../constants'

export default {
  name: 'RegionGroupCore',
  props: {
    ...commonProps,
    language: { type: String, default: CN }
  },
  emits: ['adjust', 'change'],
  setup (props, { emit }) {
    const { data, regionText, reset } = useData(props, emit)
    const lang = useLanguage(props.language)
    const list = ref([])
    const level = ref(-1)
    // 当前分组
    watch(level, val => {
      list.value = this.getList(val)
      emit('adjust')
    })

    function clear () {
      reset()
      level.value = PROVINCE_LEVEL
      emit('adjust')
    }

    function generateHeader () {
      const contents = []

      const title = regionText.value || lang.defaultHead
      const titleOption = {
        class: 'rg-header-text',
        title
      }
      contents.push(h('div', titleOption, title))

      const btnOption = {
        type: 'button',
        title: lang.clear,
        onClick: clear
      }
      const btn = h('button', btnOption, h(IconTrash))
      contents.push(h('div', { class: 'rg-header-control' }, btn))

      return h('div', { class: 'rg-header' }, contents)
    }
    function generateTabs () {
      const tabs = LEVELS
        .filter(val => this.levelAvailable(val.index))
        .map(val => {
          const link = h('a', {
            href: 'javascript:void(0)',
            onClick: () => { level.value = val.index }
          }, val.title)
          const option = {
            key: val.index,
            class: { active: val.index === level.value }
          }
          return h('li', option, link)
        })
      return h('div', { class: 'rg-level-tabs' }, h('ul', tabs))
    }
    function generateContent () {
      const child = []
      if (list.value.length) {
        const items = list.value.map(val => {
          const option = {
            key: val.key,
            class: {
              'rg-item': true,
              active: this.match(val)
            },
            onMouseup: () => { this.pick(val) }
          }
          return h('li', option, val.value)
        })
        child.push(...items)
      } else {
        child.push(h('li', { class: 'rg-message-box' }, lang.noMatch))
      }
      return h('div', { class: 'rg-results-container' }, [
        h('ul', { class: 'rg-results' }, child)
      ])
    }

    return () => h('div', { class: 'rg-group' }, [
      generateHeader(),
      generateTabs(),
      generateContent()
    ])
  },
  methods: {
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
      const { province, city, area, town } = this.region
      const key = item.key
      switch (this.level) {
        case PROVINCE_LEVEL: return province && province.key === key
        case CITY_LEVEL: return city && city.key === key
        case AREA_LEVEL: return area && area.key === key
        case TOWN_LEVEL: return town && town.key === key
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
        this.$emit('complete')
      }
    },
    /**
     * region search
     * search region description first, if no result, then search region key
     * @param value
     */
    query (value) {
      const list = this.getList(this.level)
      let tmp = []
      // 首先匹配描述内容
      tmp = list.filter(val => val.value.toLowerCase().includes(value.toLowerCase()))
      if (!tmp.length) {
        // 其次使用编码进行匹配查询
        tmp = list.filter(val => val.key.includes(value))
      }
      list.value = tmp
    },
    /**
     * @override
     */
    prepareProvinceList () {
      const { value } = this
      // sort by length and code
      this.listProvince = cloneDeep(regionProvinces).sort((a, b) => {
        const gap = a.value.length - b.value.length
        return gap === 0 ? Number(a.key) - Number(b.key) : gap
      })
      if (value && Object.keys(value).length) {
        this.modelChange(value)
      }
    }
  },
  beforeMount () {
    this.level = PROVINCE_LEVEL
  }
}
