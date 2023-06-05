<script setup>
const props = defineProps(['modelValue', 'type', 'placeholder', 'readonly'])
defineEmits(['update:modelValue'])
</script>

<template>
    <label v-if="type == 'checkbox'">
        <input
            type="checkbox"
            :checked="modelValue"
            @change="$emit('update:modelValue', $event.target.checked)"
        />
        <span>{{ placeholder }}</span>
    </label>
    <label v-else-if="type == 'textarea'" class="col">
        <span>{{ placeholder }}</span>
        <textarea
            :value="modelValue"
            @input="$emit('update:modelValue', $event.target.value)"
        />
    </label>
    <label v-else-if="type == 'select'" class="col">
        <span>{{ placeholder }}</span>
        <select
            :value="modelValue"
            @input="$emit('update:modelValue', $event.target.value)">
            <slot></slot>
        </select>
    </label>
    <label v-else class="col">
        <span>{{ placeholder }}</span>
        <input
            :readonly="readonly"
            :type="type"
            :value="modelValue"
            @input="$emit('update:modelValue', $event.target.value)"
        />
    </label>
</template>

<style scoped>
label {
    display: flex;
}
.col span {
    padding-top: 8px;
    padding-bottom: 8px;
}
span {
    padding-left: 4px;
}
.col {
    flex-direction: column;
}
input, textarea,
select {
  background: var(--dark-2);
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid var(--dark-4);
  color: #000;
}
</style>