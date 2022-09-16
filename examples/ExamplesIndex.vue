<script setup>
import { ref } from 'vue'
import { Page as VPage } from '../src'

const arr = Array(108)
  .fill(0)
  .map((val, index) => index + 1)
const pageArr = ref([])
const disabled = ref(false)
const target = ref(4)
const current = ref(3)
const align = ref('left')
const page = ref(null)

function pagePhotoChange (pInfo) {
  // console.log(pInfo);
  pageArr.value = []
  let start = 0
  let end = 0
  start = pInfo.pageSize * (pInfo.pageNumber - 1)
  end = start + pInfo.pageSize - 1
  pageArr.value = arr.filter((val, idx) => idx >= start && idx <= end)
}
function go () {
  page.value.goPage(Number(target.value))
}
function displayAllPageChange (data) {
  console.log(data)
}
</script>

<template>
  <div class="p-5">
    <section>
      <h1>v-page examples</h1>
    </section>

    <hr>

    <h5>照片墙实例</h5>
    <div class="d-flex flex-wrap border px-3 pt-3 mb-3 rounded-3 shadow-sm">
      <div
        v-for="(num, index) in pageArr"
        :key="index"
        class="rounded-3 bg-light me-3 mb-3 text-black-50 h1 d-flex justify-content-center align-items-center"
        style="width: 11.2rem; height: 8rem"
      >
        {{ num }}
      </div>
    </div>
    <div>
      <v-page
        :total-row="arr.length"
        @change="pagePhotoChange"
      />
    </div>

    <h5 class="mt-5 mb-3">
      完整分页栏
    </h5>
    <div class="bg-light p-3 rounded-3">
      <v-page
        align="left"
        :total-row="101"
        v-model="current"
        ref="page"
      />

      <div class="d-flex mt-2">
        <div class="col-md-1 me-3">
          <input
            type="text"
            class="form-control"
            v-model="target"
          >
        </div>
        <button
          class="btn btn-primary me-3"
          type="button"
          @click="go"
        >
          跳转
        </button>
        <button
          class="btn btn-primary"
          type="button"
          @click="current = current + 1"
        >
          page number + 1
        </button>
      </div>
    </div>

    <h5 class="mt-5 mb-3">
      对齐方向
    </h5>
    <div class="bg-light p-3 rounded-3">
      <div class="mb-3 d-flex align-items-center">
        <div>方向：</div>
        <div>
          <select
            v-model="align"
            class="form-select"
          >
            <option value="left">
              左对齐
            </option>
            <option value="center">
              居中对齐
            </option>
            <option value="right">
              右对齐
            </option>
          </select>
        </div>
      </div>
      <div>
        <v-page
          :align="align"
          :total-row="101"
        />
      </div>
    </div>

    <h5 class="mt-5 mb-3">
      无页数选择列表
    </h5>
    <div class="bg-light p-3 rounded-3">
      <v-page
        :total-row="100"
        :page-size-menu="false"
        align="left"
      />
    </div>

    <h5 class="mt-5 mb-3">
      无分页信息栏
    </h5>
    <div class="bg-light p-3 rounded-3">
      <v-page
        :page-size-menu="false"
        :info="false"
        align="left"
        :total-row="100"
      />
    </div>

    <h5 class="mt-5 mb-3">
      无首页、尾页
    </h5>
    <div class="bg-light p-3 rounded-3">
      <v-page
        :page-size-menu="false"
        :info="false"
        :total-row="100"
        :first="false"
        :last="false"
        align="left"
      />
    </div>

    <h5 class="mt-5 mb-3">
      无分页码
    </h5>
    <div class="bg-light p-3 rounded-3">
      <v-page
        :page-size-menu="false"
        :info="false"
        :total-row="100"
        :first="false"
        :last="false"
        :page-number="false"
        align="left"
      />
    </div>

    <h5 class="mt-5 mb-3">
      禁用
    </h5>
    <div class="bg-light p-3 rounded-3">
      <v-page
        align="left"
        :total-row="100"
        :disabled="disabled"
      />

      <hr>

      <div>
        <div
          class="btn-group mt-2"
          role="group"
          aria-label="..."
        >
          <button
            type="button"
            class="btn btn-outline-dark"
            :disabled="!disabled"
            @click="disabled = false"
          >
            Enabled
          </button>
          <button
            type="button"
            class="btn btn-danger"
            :disabled="disabled"
            @click="disabled = true"
          >
            Disabled
          </button>
        </div>
      </div>
    </div>

    <h5 class="mt-5 mb-3">
      边框
    </h5>
    <div class="bg-white border p-3 rounded-3">
      <v-page
        :total-row="100"
        align="left"
        border
      />
    </div>

    <h5 class="mt-5 mb-3">
      插槽
    </h5>
    <div class="bg-light p-3 rounded-3">
      <v-page
        align="left"
        :total-row="101"
        v-slot="{ pageNumber, pageSize, totalPage, totalRow, isFirst, isLast }"
      >
        <div>
          <div>page: <span v-text="pageNumber" /></div>
          <div>pageSize: <span v-text="pageSize" /></div>
          <div>totalPage: <span v-text="totalPage" /></div>
          <div>totalRow: <span v-text="totalRow" /></div>
          <div>isFirst: <span v-text="isFirst" /></div>
          <div>isLast: <span v-text="isLast" /></div>
        </div>
      </v-page>
    </div>

    <h5 class="mt-5 mb-3">
      显示全部数据
    </h5>
    <div class="p-3 rounded-3 border">
      <v-page
        :total-row="101"
        :display-all="true"
        @change="displayAllPageChange"
      />
    </div>
  </div>
</template>
