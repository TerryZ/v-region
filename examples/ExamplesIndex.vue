<template>
  <div class="p-5">
    <h1>
      v-region
      <button
        type="button"
        class="btn btn-outline-secondary btn-sm"
        @click="$router.push({path: '/demo'})"
      >
        Back to List
      </button>
    </h1>

    <hr>

    <div class="alert alert-warning">
      北京、天津、上海、重庆等直辖市与省同级，若选择的省是直辖市，则下级行政级别为 <strong>区/县</strong>，不是 <strong>市</strong>，在数据处理上注意区分！
    </div>

    <router-view />
  </div>
</template>
