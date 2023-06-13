<script setup>
import { defineProps } from 'vue'
defineProps(['title'])
</script>

<template>
    <div>
      <small>{{ title }}: </small><span><slot></slot></span>
    </div>
</template>

<style>
small {
  opacity: 0.75;
  text-transform: uppercase;
  font-size: 0.75rem;
  padding-right: 8px;
  line-height: 2;
}
</style>