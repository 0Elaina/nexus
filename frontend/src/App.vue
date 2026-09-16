<script setup lang="ts">
import { NConfigProvider, NDialogProvider, NMessageProvider } from 'naive-ui';
import { themeOverrides } from './config/theme';

</script>

<template>
    <NConfigProvider :theme-overrides="themeOverrides">
        <NMessageProvider>
            <NDialogProvider>
                <RouterView />
            </NDialogProvider>
        </NMessageProvider>
    </NConfigProvider>
</template>
